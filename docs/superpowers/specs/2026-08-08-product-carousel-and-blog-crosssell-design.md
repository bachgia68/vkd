# Product Carousel (trang chủ) + Cross-sell trong Blog — Design

Ngày: 2026-08-08
Trạng thái: Đã duyệt bởi Joe, chờ viết plan.

## 0. Bối cảnh / lý do

Joe phàn nàn phần Products trang chủ hiện tại (`Products.tsx`) — grid 4 thẻ với
hiệu ứng fade-in-up so le khi cuộn (thêm ở Sub-project D, xem
`HANDOFF_NEXT_SESSION.md` mục -4) — "chạy từ từ, trông cũ và quê". Yêu cầu cụ
thể: làm theo kiểu Shopee/KGC, để khách "gạt ngang" xem sản phẩm.

Đã deep-crawl 2 trang Learn thật của KGC (`jungkwanjang.us/blogs/ginseng-101`
và `/blogs/press-room`) để tìm thêm việc cần phát triển cho Blog. Phát hiện
quan trọng: khối "Featured Products" trên các trang này **giống hệt nhau giữa
mọi bài viết** — không phải gợi ý theo nội dung bài, mà là 1 widget cross-sell
chung. Điều này đơn giản hoá thiết kế rất nhiều: không cần gán sản phẩm liên
quan theo từng bài trong CMS.

## 1. Kiến trúc

### 1.1 `src/data/featuredProducts.ts` (mới)

```ts
export function getFeaturedProducts(products: Product[], max = 12): Product[]
```

- Input: danh sách sản phẩm đã qua `useLiveProducts()` (đã lọc SKU admin tắt,
  đã áp giá override nếu có).
- Chọn sản phẩm có `badge` khác rỗng (dữ liệu thật đã có sẵn trong
  `products.ts`, không bịa "bestseller" mới — đúng nguyên tắc đã ghi trong
  `docs/reports/2026-08-07-premium-positioning-brand-guidelines.md` §1.5 và
  §5).
- Thuật toán phủ đều danh mục: duyệt 1 lượt lấy tối đa 1 sản phẩm/mỗi
  `productType` trong 7 loại (`productTypes.ts`), sau đó lấp đầy các slot còn
  lại (tới `max`) bằng các sản phẩm có badge còn lại theo thứ tự xuất hiện
  trong `products.ts`.
- Nếu tổng số sản phẩm có badge ít hơn `max`, trả về toàn bộ (không lặp/độn).
- Không truy cập network — hàm thuần, nhận input đã fetch sẵn.

### 1.2 `src/components/ProductCarousel.tsx` (mới)

Component dùng chung cho cả 2 nơi dùng.

Props:
```ts
interface ProductCarouselProps {
  products: Product[];
  lang: Language;
  onNavigate?: (page: string, slug?: string) => void;
}
```

Hành vi:
- Container `overflow-x-auto` + `scroll-snap-type: x mandatory` (Tailwind:
  `snap-x snap-mandatory`), mỗi thẻ `snap-start` — cuộn/vuốt native bằng
  chuột trackpad/touch, không cần thư viện carousel mới, không cần JS drag.
- 2 nút mũi tên trái/phải chồng lên rìa trái/phải khối carousel
  (`scrollBy({left: ±cardWidth, behavior: 'smooth'})`), CHỈ hiện trên màn
  hình có hover chuột thật (`@media (hover: hover)` / class
  `hidden md:group-hover:flex` tương tự) — mobile không có nút, chỉ vuốt tay.
  Disable/ẩn nút khi đã cuộn hết đầu hoặc hết cuối (dùng `scrollLeft` +
  `scrollWidth` đo trong `onScroll`).
- Thẻ sản phẩm (width cố định, vd. `w-64 md:w-72 flex-shrink-0`): ảnh
  (`aspect-square` hoặc `aspect-ginseng` sẵn có), badge góc trên nếu có, tên,
  giá qua `formatPrice` (copy pattern từ `ProductCatalog.tsx`/`ProductDetail.tsx`
  — `null` → "Liên hệ"/"Contact us"), bấm cả thẻ →
  `onNavigate?.('product-detail', product.slug)`.
- Không có state hiệu ứng "chạy từ từ" nào cả — thẻ hiện đầy đủ ngay khi
  section vào viewport, không còn `IntersectionObserver`/stagger delay.
- Rỗng (`products.length === 0`) → return `null` (không hiện khung trống),
  đúng nguyên tắc "publish gate mặc định OFF" đã áp dụng nơi khác trong repo.

### 1.3 `src/components/Products.tsx` (sửa)

- Bỏ `productCategories`/`productImages` tĩnh, bỏ toàn bộ logic
  `gridRef`/`inView`/`IntersectionObserver`/`animate-fade-in-up` so le.
- Lấy `products` qua `useLiveProducts(staticProducts)`, tính
  `getFeaturedProducts(liveProducts)`, render `<ProductCarousel products={...} lang={lang} onNavigate={onNavigate} />` thay cho grid cũ.
  Giữ nguyên phần header section (label/title/subtitle) và nút "Xem tất cả"
  → `onNavigate('catalog')` ở cuối, không đổi.
- i18n: 4 chuỗi `t.products.categories.*` (tên/mô tả 4 danh mục cũ) không
  còn dùng ở đây nữa — để nguyên trong `translations.ts` (không xoá, tránh
  đứt chỗ khác nếu có tham chiếu; nếu qua audit không còn ai dùng thì dọn ở
  lần khác, ngoài phạm vi spec này).

### 1.4 `src/components/BlogPostDetail.tsx` (sửa)

- Sau khối `<article>` (dưới cùng nội dung bài, trước khi đóng section), thêm
  block "Sản Phẩm Nổi Bật" / "Featured Products" (tiêu đề theo `lang`):
  `<ProductCarousel products={getFeaturedProducts(useLiveProducts(staticProducts))} lang={lang} onNavigate={onNavigate} />`.
- Cùng data/logic với trang chủ — generic, không tailor theo nội dung bài
  (khớp với hành vi thật của KGC đã verify bằng crawl, không phải suy đoán).
- Nếu `getFeaturedProducts` trả về mảng rỗng (hiếm, chỉ khi không sản phẩm
  nào có badge), `ProductCarousel` tự ẩn — trang bài viết vẫn hiển thị bình
  thường không có khối trống.

## 2. Data flow

```
products.ts (static, 90 SKU thật)
   → useLiveProducts() [lọc SKU admin tắt + áp giá override]
   → getFeaturedProducts() [lọc badge thật + phủ đều productType, cap 12]
   → ProductCarousel [hiển thị, cuộn ngang, click → product-detail]
```

Không có bảng Supabase mới, không có migration, không có thay đổi CMS admin.

## 3. Error handling

- `useLiveProducts` đã fail-open sẵn (lỗi fetch override → dùng static
  products) — không cần xử lý thêm ở carousel.
- `getFeaturedProducts` là hàm thuần, không throw trên input hợp lệ.
- Carousel với 0 sản phẩm → ẩn hoàn toàn (không crash, không khung rỗng).

## 4. Testing / verify

- `npm run check:brand && npx tsc -b && npm run build` trước khi commit
  (theo skill `deploy-vkd-site`).
- Verify bằng browser preview thật (không chỉ tsc sạch — bài học từ
  Sub-project D trước đó không verify được UI):
  1. Trang chủ: cuộn tới "Sản phẩm", xác nhận vuốt ngang được trên mobile
     viewport, nút mũi tên hoạt động đúng trên desktop, ẩn đúng lúc ở 2 đầu.
  2. Bấm 1 thẻ sản phẩm → tới đúng trang chi tiết sản phẩm đó (không phải
     trang catalog lọc).
  3. Mở 1 bài blog thật (`/blog/44379659-9839-45c4-a543-cb283a46338a`),
     xác nhận khối "Sản Phẩm Nổi Bật" hiện đúng, cuộn ngang được, bấm vào
     đúng sản phẩm.
  4. Test responsive: resize mobile — không có nút mũi tên, chỉ vuốt tay.

## 5. Non-goals (ghi rõ để không lan phạm vi)

- KHÔNG tách Blog thành 2 luồng Ginseng-101/Press-Room, KHÔNG thêm
  category/tác giả/pagination cho Blog — TA mới có 1 bài thật, xây hạ tầng
  phân loại lúc này là sớm. Ghi nhận làm backlog (xem §6 report brand
  guidelines, cập nhật thêm mục 7.7 bên dưới).
- KHÔNG đổi 4 chuỗi danh mục cũ trong `translations.ts` (giữ nguyên, dọn sau
  nếu cần).
- KHÔNG thêm thư viện carousel bên ngoài (embla/swiper) — CSS scroll-snap
  native đã đủ cho yêu cầu "vuốt ngang", giữ bundle nhỏ.
