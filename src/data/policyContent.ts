// Nội dung Chính sách/Điều khoản thật cho 4 trang pháp lý (Sub-project B).
// Chỉ có bản Việt (đầy đủ) và Anh (đầy đủ) — zh/fr/ar dùng tạm bản Anh vì đây
// là nội dung pháp lý cần độ chính xác cao, không nên dịch máy không kiểm chứng.
// Sự thật nghiệp vụ dùng trong nội dung (đã xác nhận với Joe ngày 2026-08-07,
// viết lại chi tiết hơn ngày 2026-09-07 — KHÔNG thêm sự kiện/số liệu mới nào
// chưa được xác nhận, chỉ diễn đạt lại chuyên nghiệp + đầy đủ điều khoản hơn):
//   - Đổi/trả: 7 ngày kể từ ngày nhận hàng, chỉ khi lỗi sản xuất/vận chuyển.
//   - Vận chuyển: tự giao khu vực gần vùng trồng, đối tác vận chuyển cho tỉnh/thành khác.
//   - Thanh toán: PayOS (VietQR), TA không lưu thông tin thẻ/tài khoản khách hàng.
//   - Thông tin đăng ký kinh doanh (MST/GPKD): CHƯA CÓ — để placeholder rõ ràng,
//     KHÔNG bịa số. Cần Joe cập nhật khi có giấy phép chính thức.
//   - Lưu trữ trình duyệt: site dùng localStorage cho giỏ hàng/email khách hàng
//     gần nhất (xem CartContext.tsx, Checkout.tsx) — không phải cookie quảng cáo.

export type PolicyKey = 'privacy' | 'terms' | 'shipping' | 'refund';

export interface PolicySection {
  heading: string;
  body: string[];
}

export interface PolicyContent {
  title: string;
  updated: string;
  sections: PolicySection[];
}

const vi: Record<PolicyKey, PolicyContent> = {
  privacy: {
    title: 'Chính Sách Bảo Mật',
    updated: 'Cập nhật lần cuối: 07/09/2026',
    sections: [
      {
        heading: '1. Phạm vi áp dụng',
        body: [
          'Chính sách này áp dụng cho mọi thông tin cá nhân mà TA (tasamngoclinh.com, sau đây gọi là "TA", "chúng tôi") thu thập khi Quý khách truy cập website, đặt hàng, đăng ký hợp tác, hoặc liên hệ qua các kênh chính thức của TA (website, Zalo, WhatsApp, email).',
          'Bằng việc sử dụng website hoặc cung cấp thông tin cho TA, Quý khách đồng ý với các nội dung trong chính sách này.',
        ],
      },
      {
        heading: '2. Thông tin chúng tôi thu thập',
        body: [
          'Thông tin Quý khách chủ động cung cấp: họ tên, số điện thoại, địa chỉ giao hàng, email, và (nếu có) số Zalo khi đặt hàng, đăng ký nhận cẩm nang, hoặc đăng ký hợp tác kinh doanh (nhà phân phối/nhà đầu tư/OEM-ODM).',
          'Thông tin kỹ thuật lưu tạm trên trình duyệt: TA sử dụng bộ nhớ trình duyệt (localStorage) để ghi nhớ giỏ hàng đang chọn và email của lần đặt hàng gần nhất, giúp Quý khách không phải nhập lại khi quay lại site. Dữ liệu này nằm trên thiết bị của Quý khách, TA không truy cập được trừ khi Quý khách chủ động gửi qua form đặt hàng.',
          'TA KHÔNG thu thập và KHÔNG lưu trữ số thẻ ngân hàng, mã CVV, hay thông tin tài khoản thanh toán dưới bất kỳ hình thức nào — toàn bộ giao dịch thanh toán được xử lý trực tiếp bởi cổng thanh toán PayOS (chuyển khoản VietQR); TA chỉ nhận lại kết quả giao dịch (thành công/thất bại/mã đơn hàng).',
        ],
      },
      {
        heading: '3. Mục đích sử dụng thông tin',
        body: [
          'Xử lý, xác nhận và giao đơn hàng; liên hệ hỗ trợ khi có vấn đề về đơn hàng, đổi trả, hoặc khiếu nại.',
          'Phản hồi yêu cầu hợp tác kinh doanh (nhà phân phối, nhà đầu tư, OEM/ODM) mà Quý khách chủ động gửi qua form "Đăng Ký Hợp Tác".',
          'Gửi cẩm nang/tài liệu Quý khách chủ động yêu cầu (ví dụ: "Cẩm Nang Phân Biệt Sâm Ngọc Linh").',
          'TA chỉ gửi thông tin khuyến mãi qua Zalo/email khi Quý khách đã để lại thông tin liên hệ qua các form trên website và không phản đối việc nhận thông tin — Quý khách có thể yêu cầu ngừng nhận bất kỳ lúc nào theo Mục 6 dưới đây.',
        ],
      },
      {
        heading: '4. Chia sẻ thông tin với bên thứ ba',
        body: [
          'TA chỉ chia sẻ thông tin cần thiết ở mức tối thiểu, cho đúng mục đích thực hiện đơn hàng:',
          '— Với đơn vị vận chuyển: họ tên, số điện thoại, địa chỉ giao hàng, để hoàn tất việc giao hàng.',
          '— Với PayOS: thông tin cần thiết để khởi tạo và xác nhận giao dịch thanh toán VietQR.',
          'TA không bán, cho thuê, trao đổi, hoặc chia sẻ dữ liệu khách hàng cho bất kỳ bên thứ ba nào vì mục đích quảng cáo, tiếp thị của bên khác. TA chỉ tiết lộ thông tin cho cơ quan nhà nước có thẩm quyền khi được yêu cầu theo đúng quy định pháp luật hiện hành.',
        ],
      },
      {
        heading: '5. Bảo mật dữ liệu',
        body: [
          'Thông tin khách hàng được lưu trữ trên hệ thống có kiểm soát truy cập — chỉ nhân sự trực tiếp phụ trách xử lý đơn hàng, chăm sóc khách hàng mới được xem và thao tác trên dữ liệu này.',
          'TA áp dụng các biện pháp bảo mật hợp lý về mặt kỹ thuật và quản lý để hạn chế rủi ro truy cập trái phép, mất mát hoặc sử dụng sai mục đích, tuy nhiên không có hệ thống nào an toàn tuyệt đối 100% — Quý khách vui lòng thông báo ngay cho TA nếu phát hiện dấu hiệu bất thường liên quan đến thông tin của mình.',
        ],
      },
      {
        heading: '6. Quyền của khách hàng',
        body: [
          'Quý khách có quyền: (a) yêu cầu xem lại thông tin cá nhân TA đang lưu giữ; (b) yêu cầu chỉnh sửa thông tin không chính xác; (c) yêu cầu xoá thông tin cá nhân khi không còn nhu cầu sử dụng dịch vụ (trừ trường hợp pháp luật yêu cầu lưu giữ, ví dụ hoá đơn/chứng từ kế toán); (d) rút lại sự đồng ý nhận thông tin khuyến mãi bất kỳ lúc nào.',
          'Để thực hiện các quyền trên, Quý khách liên hệ trực tiếp qua email duyenmoc08@gmail.com. TA phản hồi trong vòng hợp lý, thường không quá 7 ngày làm việc.',
        ],
      },
      {
        heading: '7. Thời gian lưu trữ',
        body: [
          'Thông tin liên quan tới đơn hàng được lưu trữ trong thời gian cần thiết để hoàn tất giao dịch, xử lý đổi trả/bảo hành (nếu có), và đáp ứng nghĩa vụ lưu trữ chứng từ theo quy định kế toán, thuế hiện hành. Sau thời gian đó, thông tin sẽ được xoá hoặc ẩn danh hoá nếu không còn cơ sở pháp lý để lưu giữ.',
        ],
      },
      {
        heading: '8. Thay đổi chính sách',
        body: [
          'Chính sách này có thể được cập nhật để phản ánh đúng thực tế vận hành hoặc quy định pháp luật mới. Ngày cập nhật gần nhất luôn hiển thị ở đầu trang. TA khuyến khích Quý khách xem lại trang này định kỳ.',
        ],
      },
      {
        heading: '9. Liên hệ',
        body: [
          'Mọi thắc mắc về Chính Sách Bảo Mật, vui lòng liên hệ email duyenmoc08@gmail.com hoặc số Zalo/WhatsApp tại chân trang website.',
        ],
      },
    ],
  },
  terms: {
    title: 'Điều Khoản Dịch Vụ',
    updated: 'Cập nhật lần cuối: 07/09/2026',
    sections: [
      {
        heading: '1. Phạm vi áp dụng',
        body: [
          'Điều khoản này áp dụng cho mọi giao dịch mua hàng, đăng ký hợp tác, và hoạt động sử dụng website tasamngoclinh.com ("TA"). Khi truy cập website, đặt hàng, hoặc đăng ký hợp tác, Quý khách xác nhận đã đọc, hiểu và đồng ý với toàn bộ điều khoản dưới đây.',
        ],
      },
      {
        heading: '2. Thông tin đơn vị vận hành',
        body: [
          'TA — Vườn Sâm Ngọc Linh nhà Khánh, vùng trồng chuẩn GACP-WHO tại Trà Linh, Nam Trà My, Quảng Nam, Việt Nam.',
          'Thông tin đăng ký hộ kinh doanh/giấy phép kinh doanh chính thức: đang trong quá trình hoàn tất thủ tục, sẽ được bổ sung công khai tại đây ngay khi có. Trong thời gian chờ cập nhật, mọi thắc mắc về tư cách pháp lý của đơn vị bán hàng xin liên hệ trực tiếp duyenmoc08@gmail.com để được cung cấp thông tin xác thực.',
        ],
      },
      {
        heading: '3. Tài khoản và thông tin cung cấp',
        body: [
          'Quý khách cam kết cung cấp thông tin chính xác, đầy đủ khi đặt hàng hoặc đăng ký hợp tác (họ tên, số điện thoại, địa chỉ giao hàng). TA không chịu trách nhiệm về sự chậm trễ hoặc giao hàng sai địa chỉ phát sinh do thông tin Quý khách cung cấp không chính xác.',
        ],
      },
      {
        heading: '4. Đặt hàng và xác nhận',
        body: [
          'Đơn hàng được xem là hoàn tất sau khi Quý khách hoàn thành bước thanh toán qua PayOS (hoặc hình thức thanh toán khác nếu TA hỗ trợ tại thời điểm đặt hàng) và nhận được xác nhận đơn hàng từ TA.',
          'Giá sản phẩm hiển thị tại thời điểm đặt hàng là giá áp dụng cho đơn hàng đó, không bị ảnh hưởng bởi thay đổi giá sau đó. TA có quyền điều chỉnh giá bán, chương trình khuyến mãi mà không cần báo trước, nhưng thay đổi này không áp dụng hồi tố cho đơn hàng đã xác nhận.',
          'Trong trường hợp sản phẩm hết hàng sau khi Quý khách đã đặt và thanh toán, TA sẽ liên hệ để hoàn tiền hoặc đề xuất sản phẩm thay thế tương đương, theo lựa chọn của Quý khách.',
        ],
      },
      {
        heading: '5. Thanh toán',
        body: [
          'TA hỗ trợ thanh toán qua PayOS (chuyển khoản VietQR). Giao dịch thanh toán được xử lý hoàn toàn bởi PayOS theo quy trình bảo mật riêng của đơn vị này; TA không lưu trữ thông tin tài khoản/thẻ ngân hàng của khách hàng dưới bất kỳ hình thức nào.',
        ],
      },
      {
        heading: '6. Vận chuyển & Đổi trả',
        body: [
          'Chi tiết về khu vực giao hàng, thời gian, phí vận chuyển được quy định tại Chính Sách Vận Chuyển. Điều kiện, quy trình đổi trả và hoàn tiền được quy định tại Chính Sách Đổi Trả & Hoàn Tiền (xem liên kết ở chân trang website) — hai chính sách này là một phần không tách rời của Điều Khoản Dịch Vụ này.',
        ],
      },
      {
        heading: '7. Sở hữu trí tuệ',
        body: [
          'Toàn bộ nội dung văn bản, hình ảnh sản phẩm, logo, nhận diện thương hiệu "TA" hiển thị trên website thuộc quyền sở hữu hoặc quyền sử dụng hợp pháp của TA. Nghiêm cấm sao chép, tái sử dụng cho mục đích thương mại của bên khác khi chưa có sự đồng ý bằng văn bản từ TA.',
        ],
      },
      {
        heading: '8. Giới hạn trách nhiệm',
        body: [
          'TA nỗ lực đảm bảo thông tin sản phẩm (mô tả, thành phần, công dụng, hình ảnh) chính xác và cập nhật tại thời điểm đăng tải. Tuy nhiên, sản phẩm sâm Ngọc Linh và các dược liệu liên quan là thực phẩm bồi bổ sức khoẻ, KHÔNG phải thuốc chữa bệnh — TA không chịu trách nhiệm đối với thiệt hại phát sinh từ việc sử dụng sản phẩm sai hướng dẫn, sai liều lượng khuyến nghị, hoặc thay thế điều trị y tế cần thiết mà không có tư vấn của bác sĩ.',
          'Trong phạm vi pháp luật cho phép, trách nhiệm bồi thường tối đa của TA đối với một giao dịch bất kỳ không vượt quá giá trị đơn hàng liên quan.',
        ],
      },
      {
        heading: '9. Bất khả kháng',
        body: [
          'TA được miễn trừ trách nhiệm đối với việc chậm trễ hoặc không thể thực hiện nghĩa vụ khi nguyên nhân đến từ sự kiện bất khả kháng (thiên tai, dịch bệnh, thay đổi chính sách nhà nước, sự cố hạ tầng vận chuyển/thanh toán do bên thứ ba kiểm soát...) nằm ngoài khả năng kiểm soát hợp lý của TA.',
        ],
      },
      {
        heading: '10. Giải quyết tranh chấp',
        body: [
          'Mọi tranh chấp phát sinh trước tiên được giải quyết thông qua thương lượng, hoà giải trực tiếp giữa TA và khách hàng. Trường hợp không đạt được thoả thuận, tranh chấp sẽ được giải quyết tại cơ quan tài phán có thẩm quyền theo quy định pháp luật Việt Nam.',
        ],
      },
      {
        heading: '11. Luật áp dụng',
        body: [
          'Điều khoản này được điều chỉnh và giải thích theo pháp luật Việt Nam, bao gồm Luật Bảo vệ quyền lợi người tiêu dùng, Luật Giao dịch điện tử, và các quy định thương mại điện tử hiện hành.',
        ],
      },
    ],
  },
  shipping: {
    title: 'Chính Sách Vận Chuyển',
    updated: 'Cập nhật lần cuối: 07/09/2026',
    sections: [
      {
        heading: '1. Khu vực giao hàng',
        body: [
          'TA giao hàng toàn quốc. Khu vực gần vùng trồng (Quảng Nam, Đà Nẵng, Kon Tum và các khu vực lân cận) được TA tự tổ chức giao hàng trực tiếp; các tỉnh/thành khác được giao qua đối tác vận chuyển hợp tác với TA.',
        ],
      },
      {
        heading: '2. Thời gian giao hàng dự kiến',
        body: [
          'Khu vực tự giao: thường 1–2 ngày làm việc kể từ khi đơn hàng được xác nhận.',
          'Khu vực qua đối tác vận chuyển: thường 2–5 ngày làm việc tuỳ khoảng cách địa lý, có thể kéo dài hơn đối với khu vực vùng sâu, vùng xa, hải đảo, hoặc trong các giai đoạn cao điểm (lễ, Tết) do khối lượng vận chuyển toàn ngành tăng cao.',
          'Thời gian trên là ước tính dựa trên điều kiện vận hành thông thường, không bao gồm các trường hợp bất khả kháng (thời tiết xấu, thiên tai, gián đoạn hạ tầng giao thông...).',
        ],
      },
      {
        heading: '3. Phí vận chuyển',
        body: [
          'Phí vận chuyển được tính cụ thể theo địa chỉ nhận hàng và trọng lượng/kích thước đơn hàng, hiển thị đầy đủ, minh bạch ở bước thanh toán trước khi Quý khách xác nhận đặt hàng — không phát sinh phí ẩn sau khi đơn hàng đã được xác nhận.',
        ],
      },
      {
        heading: '4. Đóng gói',
        body: [
          'Sản phẩm được đóng gói cẩn thận, phù hợp với đặc tính từng loại (sâm tươi, sâm khô, rượu ngâm, thực phẩm chế biến sâu...) nhằm hạn chế tối đa hư hỏng, va đập trong quá trình vận chuyển. Với sản phẩm dễ vỡ (chai/hũ thuỷ tinh), TA sử dụng vật liệu chèn lót chuyên dụng.',
        ],
      },
      {
        heading: '5. Theo dõi đơn hàng',
        body: [
          'Đơn hàng giao qua đối tác vận chuyển sẽ được cung cấp mã vận đơn để Quý khách chủ động tra cứu trạng thái. Đơn hàng tự giao, Quý khách sẽ được liên hệ trực tiếp qua điện thoại hoặc Zalo trước khi giao để xác nhận thời gian nhận hàng phù hợp.',
        ],
      },
      {
        heading: '6. Kiểm tra hàng khi nhận',
        body: [
          'TA khuyến khích Quý khách kiểm tra tình trạng bên ngoài của kiện hàng ngay khi nhận, trước khi ký xác nhận với đơn vị vận chuyển. Nếu phát hiện kiện hàng có dấu hiệu bị mở, móp méo, hoặc hư hỏng rõ ràng, Quý khách nên quay video/chụp ảnh hiện trạng làm bằng chứng trước khi mở hàng.',
        ],
      },
      {
        heading: '7. Sự cố khi giao hàng',
        body: [
          'Nếu hàng bị thất lạc, giao nhầm, hoặc hư hỏng trong quá trình vận chuyển, Quý khách vui lòng liên hệ duyenmoc08@gmail.com hoặc số Zalo/WhatsApp ở chân trang website trong vòng 48 giờ kể từ khi phát hiện, kèm hình ảnh/video minh chứng, để được hỗ trợ xử lý theo Chính Sách Đổi Trả & Hoàn Tiền.',
        ],
      },
    ],
  },
  refund: {
    title: 'Chính Sách Đổi Trả & Hoàn Tiền',
    updated: 'Cập nhật lần cuối: 07/09/2026',
    sections: [
      {
        heading: '1. Điều kiện áp dụng',
        body: [
          'TA nhận đổi/trả trong vòng 7 ngày kể từ ngày khách hàng nhận hàng, CHỈ áp dụng khi sản phẩm bị lỗi do sản xuất (ví dụ: sai thành phần so với mô tả, bao bì hư hỏng từ nhà sản xuất) hoặc hư hỏng phát sinh trong quá trình vận chuyển.',
          'Sản phẩm yêu cầu đổi trả phải còn nguyên tem, nhãn, bao bì gốc và chưa qua sử dụng, trừ trường hợp lỗi khiến sản phẩm không thể sử dụng ngay từ đầu.',
        ],
      },
      {
        heading: '2. Trường hợp không áp dụng',
        body: [
          'TA không nhận đổi/trả trong các trường hợp: đổi ý sau khi mua mà sản phẩm không có lỗi; sản phẩm đã bóc tem, đã sử dụng một phần (trừ khi lỗi chỉ phát hiện được sau khi mở/sử dụng); yêu cầu gửi sau 7 ngày kể từ ngày nhận hàng; hoặc hư hỏng do bảo quản sai cách sau khi đã nhận hàng thành công (ví dụ: để nơi ẩm ướt, nhiệt độ cao không đúng hướng dẫn bảo quản trên bao bì).',
        ],
      },
      {
        heading: '3. Quy trình yêu cầu đổi trả',
        body: [
          'Bước 1 — Liên hệ: gửi yêu cầu qua email duyenmoc08@gmail.com hoặc Zalo/WhatsApp (thông tin ở chân trang website) trong vòng 7 ngày kể từ ngày nhận hàng, kèm theo: mã đơn hàng, mô tả lỗi, và ảnh/video hiện trạng sản phẩm làm bằng chứng.',
          'Bước 2 — Xác nhận: TA xem xét và phản hồi tình trạng lỗi trong vòng 2 ngày làm việc kể từ khi nhận đủ thông tin.',
          'Bước 3 — Xử lý: nếu đủ điều kiện, TA hướng dẫn Quý khách gửi trả sản phẩm (chi phí gửi trả do lỗi từ phía TA sẽ được TA chi trả hoặc hoàn lại) và tiến hành đổi sản phẩm mới hoặc hoàn tiền theo lựa chọn của Quý khách.',
        ],
      },
      {
        heading: '4. Hoàn tiền',
        body: [
          'Sau khi TA nhận và xác nhận hàng trả lại đáp ứng đủ điều kiện tại Mục 1, tiền được hoàn trong vòng 5 ngày làm việc, chuyển khoản về tài khoản ngân hàng do khách hàng cung cấp (thường là tài khoản đã dùng thanh toán qua PayOS, hoặc theo thoả thuận khác giữa hai bên).',
          'TA không thu thêm bất kỳ khoản phí xử lý nào đối với các trường hợp đổi trả do lỗi thuộc về TA (lỗi sản xuất hoặc hư hỏng vận chuyển).',
        ],
      },
      {
        heading: '5. Liên hệ hỗ trợ',
        body: [
          'Mọi thắc mắc liên quan đến đổi trả/hoàn tiền, Quý khách vui lòng liên hệ email duyenmoc08@gmail.com hoặc số Zalo/WhatsApp tại chân trang website để được hỗ trợ nhanh nhất.',
        ],
      },
    ],
  },
};

const en: Record<PolicyKey, PolicyContent> = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: Sep 7, 2026',
    sections: [
      {
        heading: '1. Scope',
        body: [
          'This policy applies to all personal information TA (tasamngoclinh.com, "TA", "we") collects when you browse our website, place an order, apply for a business partnership, or contact us through our official channels (website, Zalo, WhatsApp, email).',
          'By using this website or providing information to TA, you agree to the terms described in this policy.',
        ],
      },
      {
        heading: '2. Information We Collect',
        body: [
          'Information you provide directly: full name, phone number, delivery address, email, and (where applicable) Zalo number when placing an order, requesting our free guide, or applying for a business partnership (distributor / investor / OEM-ODM).',
          'Browser-stored technical data: TA uses browser storage (localStorage) to remember your current cart and the email used for your most recent order, so you do not need to re-enter it on return visits. This data stays on your device and TA cannot access it unless you actively submit it through an order form.',
          'TA does NOT collect or store bank card numbers, CVV codes, or any payment account details in any form — all payment transactions are processed directly by our payment provider PayOS (VietQR bank transfer); TA only receives the transaction result (success/failure/order code).',
        ],
      },
      {
        heading: '3. How We Use Your Information',
        body: [
          'To process, confirm, and deliver orders; to contact you for support regarding an order, a return, or a complaint.',
          'To respond to business partnership inquiries (distributor, investor, OEM/ODM) that you voluntarily submit via our "Partner Registration" form.',
          'To send you materials you have explicitly requested (e.g. the "Ngoc Linh Ginseng Authentication Guide").',
          'TA only sends promotional messages via Zalo/email when you have left contact details through a form on this website and have not opted out — you may request to stop receiving such messages at any time, per Section 6 below.',
        ],
      },
      {
        heading: '4. Sharing With Third Parties',
        body: [
          'TA shares only the minimum information necessary, strictly for order fulfillment:',
          '— With shipping partners: name, phone number, and delivery address, to complete delivery.',
          '— With PayOS: the information required to initiate and confirm a VietQR payment transaction.',
          'TA does not sell, rent, trade, or share customer data with any third party for their own advertising or marketing purposes. TA only discloses information to competent state authorities when legally required to do so.',
        ],
      },
      {
        heading: '5. Data Security',
        body: [
          'Customer information is stored on access-controlled systems — only staff directly responsible for order processing and customer support can view or act on this data.',
          'TA applies reasonable technical and organizational measures to reduce the risk of unauthorized access, loss, or misuse. No system is ever 100% secure; please notify TA immediately if you notice any suspicious activity related to your information.',
        ],
      },
      {
        heading: '6. Your Rights',
        body: [
          'You have the right to: (a) request access to the personal data TA holds about you; (b) request correction of inaccurate data; (c) request deletion of your personal data once it is no longer needed for the purpose collected (except where retention is legally required, e.g. accounting records); (d) withdraw consent to receive promotional messages at any time.',
          'To exercise these rights, please contact duyenmoc08@gmail.com. TA will respond within a reasonable time, typically within 7 business days.',
        ],
      },
      {
        heading: '7. Data Retention',
        body: [
          'Order-related information is retained for as long as necessary to complete the transaction, process any return/warranty claim, and comply with applicable accounting and tax record-keeping obligations. After that period, data is deleted or anonymized once there is no remaining legal basis to retain it.',
        ],
      },
      {
        heading: '8. Changes to This Policy',
        body: [
          'This policy may be updated to reflect our actual practices or new legal requirements. The latest update date is always shown at the top of this page. We encourage you to review it periodically.',
        ],
      },
      {
        heading: '9. Contact',
        body: [
          'For any questions about this Privacy Policy, please contact duyenmoc08@gmail.com or the Zalo/WhatsApp number listed in the website footer.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    updated: 'Last updated: Sep 7, 2026',
    sections: [
      {
        heading: '1. Scope',
        body: [
          'These Terms apply to all purchases, partnership registrations, and use of the tasamngoclinh.com website ("TA"). By accessing this website, placing an order, or registering as a partner, you confirm that you have read, understood, and agree to be bound by the terms below.',
        ],
      },
      {
        heading: '2. Business Information',
        body: [
          'TA — Vườn Sâm Ngọc Linh nhà Khánh, a GACP-WHO certified cultivation region in Tra Linh, Nam Tra My, Quang Nam, Vietnam.',
          'Formal business registration details are currently being finalized and will be published here as soon as they are available. In the meantime, for any question regarding the legal status of the seller, please contact duyenmoc08@gmail.com directly for verified information.',
        ],
      },
      {
        heading: '3. Information You Provide',
        body: [
          'You agree to provide accurate and complete information when placing an order or registering as a partner (name, phone number, delivery address). TA is not liable for delays or misdelivery caused by inaccurate information you have provided.',
        ],
      },
      {
        heading: '4. Orders and Confirmation',
        body: [
          'An order is considered complete once you have finished payment via PayOS (or any other payment method TA supports at the time) and received an order confirmation from TA.',
          'The price shown at the time of ordering applies to that order and is not affected by any later price change. TA reserves the right to adjust prices or promotions at any time without prior notice; such changes do not apply retroactively to already-confirmed orders.',
          'If an item becomes unavailable after you have ordered and paid, TA will contact you to arrange a refund or offer an equivalent replacement, at your choice.',
        ],
      },
      {
        heading: '5. Payment',
        body: [
          'TA supports payment via PayOS (VietQR bank transfer). Transactions are processed entirely by PayOS under its own security procedures; TA does not store your bank account or card information in any form.',
        ],
      },
      {
        heading: '6. Shipping & Returns',
        body: [
          'Delivery areas, timelines, and fees are described in our Shipping Policy. Conditions and procedures for returns and refunds are described in our Refund & Return Policy (linked in the website footer) — both policies form an integral part of these Terms.',
        ],
      },
      {
        heading: '7. Intellectual Property',
        body: [
          'All text content, product images, logos, and the "TA" brand identity displayed on this website are owned by, or used under license by, TA. Copying or reusing this content for another party\'s commercial purposes without prior written consent is strictly prohibited.',
        ],
      },
      {
        heading: '8. Limitation of Liability',
        body: [
          'TA makes reasonable efforts to keep product information (description, ingredients, intended use, images) accurate and up to date at the time of publishing. However, Ngoc Linh ginseng products and related herbal items are health-supporting food products, NOT medicines — TA is not liable for harm arising from use inconsistent with the provided instructions, use outside the recommended dosage, or use as a substitute for necessary medical treatment without professional advice.',
          'To the extent permitted by law, TA\'s maximum liability for any given transaction shall not exceed the value of the relevant order.',
        ],
      },
      {
        heading: '9. Force Majeure',
        body: [
          'TA shall not be held liable for delay or failure to perform its obligations where the cause is a force majeure event (natural disaster, epidemic, change in government policy, disruption of third-party shipping or payment infrastructure, etc.) reasonably beyond TA\'s control.',
        ],
      },
      {
        heading: '10. Dispute Resolution',
        body: [
          'Any dispute shall first be resolved through direct negotiation and good-faith discussion between TA and the customer. If no agreement is reached, the dispute shall be resolved by the competent authority in accordance with Vietnamese law.',
        ],
      },
      {
        heading: '11. Governing Law',
        body: [
          'These Terms are governed by and construed in accordance with the laws of Vietnam, including the Law on Protection of Consumers\' Rights, the Law on Electronic Transactions, and applicable e-commerce regulations.',
        ],
      },
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    updated: 'Last updated: Sep 7, 2026',
    sections: [
      {
        heading: '1. Delivery Areas',
        body: [
          'TA ships nationwide across Vietnam. Areas near the cultivation region (Quang Nam, Da Nang, Kon Tum, and nearby areas) are delivered directly by TA\'s own team; all other provinces and cities are delivered through TA\'s shipping partners.',
        ],
      },
      {
        heading: '2. Estimated Delivery Time',
        body: [
          'Direct-delivery areas: typically 1–2 business days from order confirmation.',
          'Partner-delivered areas: typically 2–5 business days depending on distance, and may take longer for remote or island areas, or during peak periods (holidays, Tet) due to industry-wide shipping volume.',
          'These timeframes are estimates under normal operating conditions and do not account for force majeure events (severe weather, natural disasters, transport infrastructure disruption, etc.).',
        ],
      },
      {
        heading: '3. Shipping Fees',
        body: [
          'Shipping fees are calculated based on the delivery address and the weight/size of the order, and are shown in full and transparently at checkout before you confirm your order — no hidden fees are added after order confirmation.',
        ],
      },
      {
        heading: '4. Packaging',
        body: [
          'Products are carefully packaged according to their nature (fresh ginseng, dried ginseng, infused liquor, processed products, etc.) to minimize the risk of damage during transit. Fragile items (glass bottles/jars) are packed with dedicated protective cushioning.',
        ],
      },
      {
        heading: '5. Order Tracking',
        body: [
          'Orders shipped via a delivery partner include a tracking code for you to check status directly. For directly-delivered orders, you will be contacted by phone or Zalo before delivery to confirm a convenient time.',
        ],
      },
      {
        heading: '6. Inspecting Your Order on Arrival',
        body: [
          'We encourage you to inspect the outer condition of your package upon arrival, before signing acceptance with the delivery person. If the package appears opened, crushed, or clearly damaged, please record a video or photo of its condition before opening it, as supporting evidence.',
        ],
      },
      {
        heading: '7. Delivery Issues',
        body: [
          'If your order is lost, misdelivered, or damaged in transit, please contact duyenmoc08@gmail.com or the Zalo/WhatsApp number in the website footer within 48 hours of discovery, together with supporting photos or video, so we can assist you under our Refund & Return Policy.',
        ],
      },
    ],
  },
  refund: {
    title: 'Refund & Return Policy',
    updated: 'Last updated: Sep 7, 2026',
    sections: [
      {
        heading: '1. Eligibility',
        body: [
          'TA accepts returns/exchanges within 7 days of delivery, ONLY for manufacturing defects (e.g. contents not matching the description, packaging damaged by the manufacturer) or damage caused during shipping.',
          'The returned product must have its original seal, label, and packaging intact and be unused, except where the defect itself made the product unusable from the start.',
        ],
      },
      {
        heading: '2. Not Eligible',
        body: [
          'We do not accept returns for: change of mind on a product with no defect; products with a broken seal or partially used (unless the defect could only be discovered after opening/use); requests submitted after 7 days from delivery; or damage caused by improper storage after successful delivery (e.g. exposure to damp conditions or heat contrary to the storage instructions on the packaging).',
        ],
      },
      {
        heading: '3. Return Process',
        body: [
          'Step 1 — Contact us: submit your request via duyenmoc08@gmail.com or Zalo/WhatsApp (footer of this website) within 7 days of delivery, including your order code, a description of the issue, and photos/video of the product\'s condition as evidence.',
          'Step 2 — Confirmation: TA reviews and responds regarding the defect within 2 business days of receiving complete information.',
          'Step 3 — Resolution: if eligible, TA will guide you through returning the product (return shipping costs for defects attributable to TA are covered or reimbursed by TA) and proceed with a replacement or refund, at your choice.',
        ],
      },
      {
        heading: '4. Refunds',
        body: [
          'Once TA receives and confirms the returned item meets the conditions in Section 1, the refund is issued within 5 business days to the bank account provided by the customer (typically the account used for the original PayOS payment, or as otherwise agreed between the parties).',
          'TA does not charge any processing fee for returns caused by a fault attributable to TA (manufacturing defect or shipping damage).',
        ],
      },
      {
        heading: '5. Support Contact',
        body: [
          'For any question regarding returns or refunds, please contact duyenmoc08@gmail.com or the Zalo/WhatsApp number in the website footer for prompt assistance.',
        ],
      },
    ],
  },
};

export function getPolicyContent(policyKey: PolicyKey, lang: string): PolicyContent {
  return lang === 'vi' ? vi[policyKey] : en[policyKey];
}
