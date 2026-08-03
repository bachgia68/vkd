# Hợp nhất Catalog Sản Phẩm (VKD + TRIMICO → TA) — Design

Ngày: 2026-08-02
Trạng thái: Đã duyệt qua brainstorm (bao gồm bổ sung Set Quà Tặng 2 luồng +
module Admin xuất Excel/catalog), chờ viết implementation plan.

## 1. Bối cảnh & vấn đề

Site hiện có 2 nguồn dữ liệu sản phẩm tách biệt (`src/data/vkdProducts.ts` — 43 SKU,
`src/data/trimicoProducts.ts` — 50 SKU), 2 trang catalog (`VKDProductCatalog.tsx`,
`TrimicoProductCatalog.tsx`), 2 trang chi tiết (`VKDProductDetail.tsx`,
`TrimicoProductDetail.tsx`), 2 route (`catalog` / `trimico-catalog`,
`product-detail` / `trimico-product-detail`), và 2 taxonomy phân loại khác nhau:

- VKD `category`: `ginseng` | `supplements` | `tea_wine` | `cosmetics`
- Trimico `category`: `sam-ngoc-linh` | `nam-lim-xanh` | `ruou` | `khac` | `qua-tang`

Đây là gốc rễ khiến tên NCC (VKD/TRIMICO) liên tục lộ ra UI dù đã vá nhiều lần thủ
công (xem `docs/reports/2026-08-02-brand-guidelines-ncc-draft.md`) — vì kiến trúc
code vẫn coi 2 NCC là 2 hệ thống song song, không phải 1 catalog "TA" duy nhất.

Mục tiêu: hợp nhất thành 1 catalog TA duy nhất, điều hướng theo **Dạng Sản Phẩm**
(học theo Jung Kwan Jang / KGC), giữ AI Advisor điều hướng theo **Nhu Cầu/Đối
Tượng** như hiện có, và bổ sung khả năng xuất Excel giá + catalog ảnh cho khách
mua sỉ/lớn.

## 2. Data model hợp nhất

File mới `src/data/products.ts` thay thế `vkdProducts.ts` + `trimicoProducts.ts`
(2 file cũ giữ lại tạm thời dưới dạng nguồn tham chiếu khi migrate dữ liệu, xoá
sau khi xác nhận `products.ts` đã đủ 93 SKU đúng).

```ts
export type ProductTypeId =
  | 'sam-cu-tuoi-kho'      // Sâm Củ Tươi & Sâm Khô
  | 'sam-ngam-mat-ong'     // Sâm Ngâm Mật Ong
  | 'tra-nuoc-uong-sam'    // Trà & Nước Uống Sâm
  | 'ruou-sam'             // Rượu Sâm
  | 'nam-lim-duoc-lieu'    // Nấm Lim Xanh & Dược Liệu
  | 'my-pham-sam'          // Mỹ Phẩm Sâm
  | 'set-qua-tang';        // Set Quà Tặng (giftEligible cắt ngang các loại trên)

export type SupplierId = 'vkd' | 'trimico'; // BACKEND ONLY — không render ra UI khách hàng

export interface Product {
  sku: string;
  supplierId: SupplierId;        // dùng cho admin/kho/vận đơn, KHÔNG dùng hiển thị
  slug: string;
  name: string;
  price: number | null;          // null = "Liên hệ"
  image: string;
  productType: ProductTypeId;    // điều hướng CHÍNH (menu)
  healthGoal: HealthGoal;        // dùng cho AI Advisor + filter phụ
  audiences: TargetAudience[];
  familySafe: boolean;
  displayOnly18Plus?: boolean;   // giữ hành vi hiện có (badge cảnh báo, ẩn nút đặt hàng)
  giftEligible?: boolean;        // true → xuất hiện thêm ở mục "Set Quà Tặng"
  badge?: string;                // VD: 'Quốc Bảo', 'Bán Chạy'
  activeIngredient?: string;
  description: string;
  ingredients?: string;
  usage?: string;
  targetUsers?: string;
  warnings?: string;
  volume?: string;
  sourceUrl: string;             // đối chiếu nội bộ, không dùng điều hướng/thanh toán
}
```

Migrate: viết script một lần (`scripts/migrate-to-unified-products.mjs`) đọc 2
file cũ, gán `productType` theo bảng mapping ở mục 3, gán `supplierId` theo
nguồn gốc file, xuất `products.ts`. Migrate xong review tay danh sách.

**`vkdProducts.ts` và `trimicoProducts.ts` KHÔNG bị xoá** — giữ vĩnh viễn làm
nguồn tham chiếu gốc theo từng NCC. `products.ts` là nguồn vận hành (UI khách
hàng, giỏ hàng, thanh toán) sinh ra từ 2 file gốc, nhưng 2 file gốc vẫn được
trang admin gọi tới để **đối chiếu khi giao hàng** (kiểm tra lô hàng nhận từ
NCC có đúng loại/đúng SKU như trong catalog gốc của NCC đó hay không) — đây là
mục đích chính giữ lại, không phải chỉ để backup.

## 2b. AI Advisor — không đổi trục, chỉ sửa câu hỏi

`ProductAdvisor.tsx` giữ nguyên hoàn toàn trục điều hướng theo `healthGoal` +
`audiences` như hiện có — không đổi sang `productType`. Câu hỏi 1 đã sửa từ
"Bạn là ai?" → "Ai sẽ dùng sản phẩm?" (áp dụng ngay trong phiên brainstorm này).

## 3. Taxonomy "Dạng Sản Phẩm" — mapping từ 2 taxonomy cũ

| `productType` mới | Nhãn menu | Gộp từ |
|---|---|---|
| `sam-cu-tuoi-kho` | Sâm Củ Tươi & Sâm Khô | VKD `ginseng` + Trimico `sam-ngoc-linh` (phần củ/lá/hoa) |
| `sam-ngam-mat-ong` | Sâm Ngâm Mật Ong | Trimico `sam-ngoc-linh` (phần hũ ngâm mật ong) |
| `tra-nuoc-uong-sam` | Trà & Nước Uống Sâm | VKD `tea_wine` (phần trà) + `supplements` (PanaxX nước/tinh chất) |
| `ruou-sam` | Rượu Sâm | VKD `tea_wine` (phần rượu) + Trimico `ruou` |
| `nam-lim-duoc-lieu` | Nấm Lim Xanh & Dược Liệu | Trimico `nam-lim-xanh` + `khac` |
| `my-pham-sam` | Mỹ Phẩm Sâm | VKD `cosmetics` |
| `set-qua-tang` | Set Quà Tặng | Trimico `qua-tang` + bất kỳ SKU nào đánh dấu `giftEligible: true` |

`displayOnly18Plus` giữ nguyên hành vi hiện có theo từng SKU (không đổi theo
nhóm `ruou-sam` toàn bộ — chỉ SKU nào gốc đã bị flag mới giữ flag).

## 3b. Set Quà Tặng — 2 luồng riêng (admin tạo sẵn + khách tự tạo)

Đây không chỉ là 1 category lọc theo `giftEligible` như bản nháp trước — có
**2 luồng**:

**(a) Admin tạo set quà theo mùa/dịp** — module mới trong admin (`GiftSetsPage`,
theo đúng pattern mock hiện có của `src/admin`, xem `manage-admin-mockdata`):
admin chọn nhiều SKU có sẵn + đặt tên/ảnh/giá set → lưu vào state chung của
phiên làm việc (KHÔNG lưu database thật, mất khi tải lại trang — đúng pattern
toàn bộ admin hiện tại). Set này phải **xuất hiện ngay trên trang khách hàng
như 1 sản phẩm bình thường** trong cùng phiên trình duyệt đó (không cần đợi
reload) — nghĩa là `ProductCatalog`/trang chủ phải đọc từ 1 nguồn "runtime
products" gộp `products.ts` (tĩnh) + set do admin vừa tạo (state), không phải
2 nguồn tách biệt như `adminMockData.ts` hiện nay đang tách khỏi dữ liệu
khách hàng thấy.

**(b) Khách tự tạo set quà tặng của riêng mình** — trên trang catalog/giỏ
hàng, khách chọn nhiều sản phẩm bất kỳ → "Đóng thành set quà tặng" → hệ thống
tạo 1 dòng giỏ hàng mới kiểu `CustomGiftSetCartItem` (khác `CartItem` sản phẩm
thường): gồm danh sách SKU con + số lượng từng SKU + tổng giá tính tự động.
Khách có thể tăng số lượng cả set (x2, x3...) như 1 sản phẩm — không phải tăng
từng SKU con riêng lẻ. Sống trong `CartContext` hiện có (localStorage), không
cần backend thật vì đây là giỏ hàng của riêng khách, đúng như cách giỏ hàng
hiện tại đã hoạt động.

## 4. Routing & component

- Xoá `Page` type: `trimico-catalog`, `trimico-product-detail`. Còn `catalog`,
  `product-detail` dùng chung cho cả 93 sản phẩm, filter qua query
  param `?type=<ProductTypeId>`.
- Gộp `VKDProductCatalog.tsx` + `TrimicoProductCatalog.tsx` → `ProductCatalog.tsx`.
- Gộp `VKDProductDetail.tsx` + `TrimicoProductDetail.tsx` → `ProductDetail.tsx`
  (badge 18+/"Liên hệ" render theo field `displayOnly18Plus`/`price === null`,
  không theo component riêng).
- Xoá `TrimicoTeaser.tsx` — không cần khối "giới thiệu NCC" riêng trên trang chủ,
  sản phẩm nằm lẫn trong catalog chung theo `productType`.
- `Header.tsx`: menu "Sản Phẩm" thành mega-menu 7 mục theo bảng mục 3, "Set Quà
  Tặng" là mục ngang hàng riêng (không nằm trong dropdown "Sản Phẩm") — đúng
  pattern JKJ/KGC và phù hợp hành vi mua quà dịp Tết/lễ tại VN.
- CTA "Tìm Sản Phẩm Phù Hợp" (AI Advisor) giữ vị trí nổi bật riêng trên header,
  không phải 1 mục trong dropdown.

## 5. Ô tìm kiếm — gợi ý khi chưa gõ

Khi focus vào ô search (chưa có input), hiện overlay tĩnh (không cần tracking
analytics thật ở bản đầu):

- **Đang Thịnh Hành**: danh sách chip từ khoá cấu hình tay trong code (VD: "sâm
  ngâm mật ong", "nước hồng sâm", "quà tết", "mỹ phẩm sâm").
- **Sản Phẩm Phổ Biến**: 3-4 sản phẩm có `badge` chứa "Bán Chạy" trong
  `products.ts`, hiện ảnh + tên + giá.

## 6. Module Admin mới: "Catalog & Xuất File" — ẩn hoàn toàn với khách hàng

Không phải script CLI — là 1 trang mới trong admin (`src/admin/pages/CatalogExportPage.tsx`
+ mục menu trong `AdminLayout.tsx`), chỉ đăng nhập admin mới thấy, không có
route/link nào lộ ra phía khách hàng (kiểm tra bằng `npm run check:brand` +
review route công khai).

- **Xuất Excel giá bán sỉ**: admin bấm 1 nút, sinh file `.xlsx` ngay trong trình
  duyệt (dùng thư viện client-side, VD SheetJS — không cần server) — sheet
  "VKD" (đọc từ `vkdProducts.ts` gốc, mục 2), sheet "Trimico" (đọc từ
  `trimicoProducts.ts` gốc), sheet "Tổng Hợp" (từ `products.ts`). Cột: SKU,
  Tên, Dạng Sản Phẩm, Giá (VND), Ghi chú. Tải về máy admin — không lưu trên
  server, không có link công khai.
- **Tạo catalog ảnh chọn lọc cho khách sỉ**: admin tick chọn từng sản phẩm
  muốn đưa vào (không bắt buộc lấy hết 93 SKU — đúng nhu cầu "khách không cần
  loãng thông tin"), xem trước danh sách đã chọn, rồi xuất PDF gồm mỗi sản
  phẩm 1 khối: ảnh + tên + giá + mô tả ngắn + thành phần + đối tượng dùng +
  lợi ích (lấy đúng field có sẵn trong `Product`). Sinh PDF client-side (VD
  `jspdf`/`pdf-lib`), tải về máy admin.
- **Bắt buộc trên mọi trang catalog PDF xuất ra**: header có logo TA + bảng
  màu chuyên nghiệp đồng bộ brand site (Forest Green/Gold/Ivory — xem bảng màu
  ở `anthropic-skills:vkd-web-design` skill), và footer/trang bìa có thông tin
  liên hệ TA: số điện thoại + Zalo `0984999309`. Không xuất bản PDF nào thiếu
  logo/liên hệ này — đây là tài liệu gửi khách mua sỉ, phải chuyên nghiệp và
  có đường liên hệ ngược lại TA.
- Không cần backend/API riêng cho việc xuất file — chỉ cần đọc dữ liệu tĩnh
  sẵn có trong bundle và sinh file ngay trên trình duyệt admin.

## 7. Ngoài phạm vi spec này (giai đoạn sau)

- Trang "Collection" theo chủ đề kiểu `jungkwanjang.us/collections/hong-sam-jung`
  (bộ sưu tập theo mùa/dịp, kể chuyện thương hiệu).
- Nâng cấp trang Rewards/Loyalty theo tham khảo
  `jungkwanjang.us/pages/rewards-program` — site đã có `LoyaltyDashboard.tsx`
  làm nền, cần thiết kế riêng (tính điểm, hạng thành viên, ưu đãi).
- Tên gọi mô hình TA chính thức trong copy marketing (đã tư vấn dùng "nền tảng",
  không dùng "sàn giao dịch"/"siêu thị"/"trung tâm") — áp dụng dần khi rà lại
  toàn bộ copy, không phải việc của spec kỹ thuật này.

## 8. Rủi ro & việc cần cẩn thận khi implement

- Migrate 93 SKU thủ công cần review kỹ mapping `productType` — sai category
  sẽ khiến sản phẩm "biến mất" khỏi menu tương ứng dù dữ liệu vẫn còn.
- `displayOnly18Plus` là thông tin pháp lý thật (theo thông báo Bộ Công Thương
  trên trang gốc Trimico) — giữ nguyên per-SKU, không suy luận lại theo nhóm.
- Ảnh sản phẩm Trimico vẫn còn logo NCC in trực tiếp trên bao bì (xem báo cáo
  crop ảnh cùng ngày) — hợp nhất catalog không giải quyết vấn đề này, cần ảnh
  chụp lại riêng.
- Sau khi gộp, chạy lại `npm run check:brand` (brand-ta-guard) để đảm bảo không
  phát sinh chỗ lộ tên NCC mới trong quá trình refactor.
- Set quà tặng admin tạo (mục 3b-a) cần trang khách hàng đọc từ 1 "runtime
  products store" dùng chung với admin trong cùng phiên trình duyệt — đây là
  thay đổi kiến trúc so với hiện tại (`adminMockData.ts` hoàn toàn tách biệt
  khỏi dữ liệu khách hàng thấy). Cần 1 Context/store mới bọc cả 2 phía, không
  chỉ thêm state cục bộ trong admin.
- Set quà tặng KHÔNG lưu database thật — mất khi tải lại trang (đúng cảnh báo
  đã có sẵn trong admin hiện tại). Phải nói rõ giới hạn này khi demo cho chủ
  shop, không để hiểu nhầm là đã lưu vĩnh viễn.
- Set quà tặng khách tự tạo (mục 3b-b) là 1 loại dòng giỏ hàng mới
  (`CustomGiftSetCartItem`) khác cấu trúc `CartItem` hiện có — cần sửa
  `CartContext.tsx` để hỗ trợ 2 loại dòng song song, không thay thế loại cũ.
