// Nội dung Chính sách/Điều khoản thật cho 4 trang pháp lý (Sub-project B).
// Chỉ có bản Việt (đầy đủ) và Anh (đầy đủ) — zh/fr/ar dùng tạm bản Anh vì đây
// là nội dung pháp lý cần độ chính xác cao, không nên dịch máy không kiểm chứng.
//
// Viết lại đầy đủ ngày 2026-09-07 theo yêu cầu "tối thiểu 2500 từ/trang" —
// độ dài đạt được bằng cách: (1) thêm các mục định nghĩa/điều khoản chuẩn mà
// mọi chính sách thương mại điện tử nghiêm túc đều có (định nghĩa thuật ngữ,
// cơ sở pháp lý, bất khả kháng, hiệu lực từng phần...), và (2) diễn giải chi
// tiết hơn các sự thật nghiệp vụ ĐÃ xác nhận — KHÔNG bịa thêm số liệu, tên
// pháp nhân, giấy phép, hay cam kết mới nào chưa được Joe xác nhận.
//
// Sự thật nghiệp vụ dùng trong nội dung (đã xác nhận với Joe ngày 2026-08-07):
//   - Đổi/trả: 7 ngày kể từ ngày nhận hàng, chỉ khi lỗi sản xuất/vận chuyển.
//   - Vận chuyển: tự giao khu vực gần vùng trồng, đối tác vận chuyển cho tỉnh/thành khác.
//   - Thanh toán: PayOS (VietQR), TA không lưu thông tin thẻ/tài khoản khách hàng.
//   - Thông tin đăng ký kinh doanh (MST/GPKD): CHƯA CÓ — để placeholder rõ ràng,
//     KHÔNG bịa số. Cần Joe cập nhật khi có giấy phép chính thức.
//   - Lưu trữ trình duyệt: site dùng localStorage cho giỏ hàng/email khách hàng
//     gần nhất (xem CartContext.tsx, Checkout.tsx) — không phải cookie quảng cáo.
//   - Vận chuyển quốc tế/xuất khẩu: chỉ qua kênh B2B/OEM-ODM (liên hệ riêng),
//     KHÔNG có sẵn cho đơn lẻ khách hàng cá nhân — ghi rõ để không hứa nhầm.
//   - Các điều khoản pháp lý chung (bất khả kháng, hiệu lực từng phần, luật áp
//     dụng, độ tuổi sử dụng...) tham chiếu tới luật Việt Nam hiện hành ở mức
//     khái quát, không trích dẫn điều khoản cụ thể để tránh sai sót nếu luật
//     thay đổi — khuyến nghị Joe nhờ luật sư rà soát trước khi công bố chính
//     thức nếu cần độ chính xác pháp lý tuyệt đối.

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
        heading: 'Lời mở đầu',
        body: [
          'TA (vận hành website tasamngoclinh.com, sau đây gọi là "TA", "chúng tôi", "bên bán") hiểu rằng thông tin cá nhân là tài sản riêng tư của mỗi khách hàng. Chính Sách Bảo Mật này giải thích rõ ràng: chúng tôi thu thập những gì, vì sao thu thập, dùng vào việc gì, chia sẻ với ai, bảo vệ ra sao, và Quý khách có những quyền gì đối với dữ liệu của chính mình.',
          'Chúng tôi viết chính sách này bằng ngôn ngữ dễ hiểu nhất có thể, tránh thuật ngữ pháp lý tối nghĩa, để bất kỳ khách hàng nào — kể cả không rành công nghệ hay pháp luật — cũng nắm rõ quyền lợi của mình khi giao dịch với TA.',
        ],
      },
      {
        heading: '1. Phạm vi áp dụng và định nghĩa thuật ngữ',
        body: [
          'Chính sách này áp dụng cho mọi thông tin cá nhân mà TA thu thập khi Quý khách truy cập website, đặt hàng, đăng ký hợp tác kinh doanh, đăng ký nhận tài liệu/cẩm nang, hoặc liên hệ qua các kênh chính thức của TA (website, Zalo, WhatsApp, email, điện thoại).',
          'Trong chính sách này, các thuật ngữ được hiểu như sau: "Website" là tasamngoclinh.com và mọi trang con thuộc tên miền này; "Quý khách"/"Bạn" là bất kỳ cá nhân nào truy cập Website hoặc giao dịch với TA; "Thông tin cá nhân" là mọi thông tin giúp nhận diện trực tiếp hoặc gián tiếp một cá nhân cụ thể (họ tên, số điện thoại, địa chỉ, email...); "Xử lý dữ liệu" bao gồm mọi thao tác như thu thập, lưu trữ, sử dụng, chia sẻ, hoặc xóa thông tin cá nhân; "Bên thứ ba" là các đối tác TA hợp tác để hoàn tất giao dịch (đơn vị vận chuyển, cổng thanh toán).',
          'Bằng việc sử dụng Website, đặt hàng, hoặc chủ động cung cấp thông tin cho TA qua bất kỳ kênh nào, Quý khách xác nhận đã đọc, hiểu, và đồng ý với toàn bộ nội dung chính sách này. Nếu Quý khách không đồng ý, vui lòng ngừng cung cấp thông tin và không tiếp tục sử dụng các dịch vụ có thu thập dữ liệu cá nhân của TA.',
        ],
      },
      {
        heading: '2. Thông tin chúng tôi thu thập',
        body: [
          'a) Thông tin nhận dạng và liên hệ: họ tên, số điện thoại, địa chỉ email, địa chỉ giao hàng, và (nếu có) số Zalo — được thu thập khi Quý khách đặt hàng, đăng ký nhận cẩm nang miễn phí, hoặc điền form liên hệ/hợp tác trên Website.',
          'b) Thông tin giao dịch: sản phẩm đã đặt, số lượng, giá trị đơn hàng, thời điểm đặt hàng, trạng thái thanh toán (thành công/thất bại) và mã đơn hàng liên quan. Đây là thông tin cần thiết để TA xử lý và theo dõi đơn hàng của Quý khách.',
          'c) Thông tin hợp tác kinh doanh: khi Quý khách đăng ký trở thành nhà phân phối, nhà đầu tư, hoặc đối tác OEM/ODM, TA thu thập thêm thông tin Quý khách chủ động cung cấp trong form đăng ký (tên công ty/cá nhân, lĩnh vực quan tâm, quy mô dự kiến — tùy nội dung Quý khách điền).',
          'd) Thông tin kỹ thuật lưu tạm trên trình duyệt: TA sử dụng bộ nhớ cục bộ của trình duyệt (localStorage) để ghi nhớ giỏ hàng Quý khách đang chọn và email dùng ở lần đặt hàng gần nhất, giúp Quý khách không phải nhập lại các thông tin này mỗi lần quay lại Website. Dữ liệu này được lưu ngay trên thiết bị của Quý khách (máy tính, điện thoại) — TA hoàn toàn không có quyền truy cập vào dữ liệu này trừ khi Quý khách chủ động gửi lại qua một form trên Website (ví dụ: khi đặt hàng).',
          'e) TA KHÔNG thu thập và KHÔNG lưu trữ số thẻ ngân hàng, mã CVV, mật khẩu ngân hàng điện tử, hay bất kỳ thông tin tài khoản thanh toán nào dưới bất kỳ hình thức nào. Toàn bộ giao dịch thanh toán được xử lý trực tiếp và độc lập bởi cổng thanh toán PayOS (hình thức chuyển khoản VietQR) — TA chỉ nhận lại một kết quả giao dịch tổng quát (thành công/thất bại, mã đơn hàng), không bao giờ tiếp cận chi tiết tài khoản ngân hàng của Quý khách.',
        ],
      },
      {
        heading: '3. Cách thức thu thập thông tin',
        body: [
          'TA thu thập thông tin theo hai cách: trực tiếp và gián tiếp.',
          'Thu thập trực tiếp: khi Quý khách tự nguyện điền thông tin vào một biểu mẫu trên Website (đặt hàng, đăng ký nhận cẩm nang, đăng ký hợp tác, form liên hệ), hoặc khi Quý khách nhắn tin trực tiếp qua Zalo/WhatsApp/email cho TA.',
          'Thu thập gián tiếp/tự động: một số thông tin kỹ thuật tối thiểu được trình duyệt của Quý khách tự động lưu trên chính thiết bị của Quý khách (mục 2.d ở trên) để cải thiện trải nghiệm sử dụng — TA không dùng công cụ theo dõi hành vi duyệt web phức tạp (như quảng cáo nhắm mục tiêu chéo nhiều website) trên Website hiện tại.',
        ],
      },
      {
        heading: '4. Mục đích sử dụng thông tin',
        body: [
          'a) Xử lý đơn hàng: xác nhận, đóng gói, giao hàng, và hỗ trợ Quý khách trong suốt vòng đời đơn hàng (bao gồm cả đổi trả, hoàn tiền nếu phát sinh).',
          'b) Chăm sóc khách hàng: trả lời câu hỏi, xử lý khiếu nại, hỗ trợ kỹ thuật liên quan tới việc sử dụng Website hoặc sản phẩm đã mua.',
          'c) Phản hồi yêu cầu hợp tác kinh doanh: liên hệ lại với Quý khách đã đăng ký làm nhà phân phối, nhà đầu tư, hoặc đối tác OEM/ODM qua form "Đăng Ký Hợp Tác".',
          'd) Gửi tài liệu Quý khách chủ động yêu cầu: ví dụ "Cẩm Nang Phân Biệt Sâm Ngọc Linh" khi Quý khách để lại email/Zalo qua widget đăng ký nhận cẩm nang.',
          'e) Thông tin khuyến mãi: TA chỉ gửi thông tin khuyến mãi, chương trình ưu đãi qua Zalo/email khi Quý khách đã chủ động để lại thông tin liên hệ qua một trong các form trên Website và chưa từ chối nhận thông tin loại này. Quý khách có thể yêu cầu ngừng nhận bất kỳ lúc nào (xem Mục 9).',
          'f) Cải thiện dịch vụ: TA có thể phân tích dữ liệu đơn hàng ở mức tổng hợp, ẩn danh (ví dụ: sản phẩm nào bán chạy theo mùa) để lên kế hoạch kinh doanh — quá trình này KHÔNG gắn thông tin trở lại danh tính cá nhân cụ thể khi báo cáo nội bộ.',
        ],
      },
      {
        heading: '5. Cơ sở pháp lý của việc xử lý dữ liệu',
        body: [
          'TA xử lý thông tin cá nhân của Quý khách dựa trên một hoặc nhiều cơ sở sau: (i) sự đồng ý của Quý khách khi chủ động cung cấp thông tin qua các form trên Website; (ii) sự cần thiết để thực hiện hợp đồng mua bán giữa hai bên (ví dụ: cần địa chỉ để giao hàng); (iii) nghĩa vụ tuân thủ pháp luật (ví dụ: lưu chứng từ kế toán, thuế theo thời hạn luật định); và (iv) lợi ích hợp pháp của TA trong việc vận hành, bảo vệ, và cải thiện dịch vụ, miễn là không xâm phạm quyền lợi hợp pháp của Quý khách.',
        ],
      },
      {
        heading: '6. Chia sẻ thông tin với bên thứ ba',
        body: [
          'TA chỉ chia sẻ thông tin ở mức tối thiểu cần thiết, đúng mục đích hoàn tất giao dịch — không có ngoại lệ nào khác ngoài các trường hợp liệt kê dưới đây:',
          '— Với đơn vị vận chuyển: TA cung cấp họ tên, số điện thoại, và địa chỉ giao hàng của Quý khách để đơn vị vận chuyển có thể hoàn tất việc giao hàng. Các đơn vị vận chuyển đối tác của TA có trách nhiệm bảo mật thông tin này theo chính sách riêng của họ và chỉ được sử dụng thông tin cho mục đích giao hàng.',
          '— Với PayOS (cổng thanh toán): TA gửi các thông tin kỹ thuật cần thiết (mã đơn hàng, số tiền) để khởi tạo giao dịch VietQR — PayOS xử lý phần thanh toán độc lập theo tiêu chuẩn bảo mật riêng của họ, TA không kiểm soát và không chịu trách nhiệm về chính sách bảo mật nội bộ của PayOS (Quý khách có thể tham khảo chính sách bảo mật riêng của PayOS nếu quan tâm).',
          '— Với cơ quan nhà nước có thẩm quyền: TA chỉ cung cấp thông tin khi có yêu cầu hợp pháp bằng văn bản từ cơ quan có thẩm quyền, theo đúng trình tự pháp luật quy định (ví dụ: phục vụ điều tra, thanh tra thuế).',
          'TA cam kết KHÔNG bán, KHÔNG cho thuê, KHÔNG trao đổi dữ liệu khách hàng cho bất kỳ bên thứ ba nào vì mục đích quảng cáo hoặc tiếp thị của bên đó. Đây là cam kết cốt lõi trong chính sách bảo mật của TA.',
        ],
      },
      {
        heading: '7. Bảo mật dữ liệu',
        body: [
          'Về mặt quản lý: thông tin khách hàng được lưu trữ trên hệ thống có phân quyền truy cập — chỉ nhân sự trực tiếp phụ trách xử lý đơn hàng, chăm sóc khách hàng, hoặc kế toán mới được xem và thao tác trên dữ liệu liên quan tới nhiệm vụ của mình. TA không cho phép truy cập tràn lan dữ liệu khách hàng trong nội bộ.',
          'Về mặt kỹ thuật: hệ thống lưu trữ dữ liệu của TA sử dụng hạ tầng của nhà cung cấp dịch vụ đám mây có uy tín, áp dụng các biện pháp bảo mật tiêu chuẩn ngành (mã hóa kết nối HTTPS khi truyền dữ liệu, kiểm soát truy cập theo tài khoản).',
          'Ứng phó sự cố: trong trường hợp không mong muốn xảy ra sự cố rò rỉ dữ liệu ảnh hưởng tới thông tin cá nhân của Quý khách, TA cam kết thông báo cho Quý khách và cơ quan có thẩm quyền (nếu luật yêu cầu) trong thời gian sớm nhất có thể, đồng thời tiến hành các biện pháp khắc phục cần thiết.',
          'Chúng tôi lưu ý rằng không một hệ thống công nghệ thông tin nào có thể đảm bảo an toàn tuyệt đối 100% trước mọi hình thức tấn công mạng. TA nỗ lực hết sức trong khả năng hợp lý để bảo vệ dữ liệu, và mong Quý khách cũng chủ động bảo vệ thông tin cá nhân của mình (ví dụ: không chia sẻ mã đơn hàng, thông tin xác thực cho người lạ) và thông báo ngay cho TA nếu phát hiện dấu hiệu bất thường.',
        ],
      },
      {
        heading: '8. Thời gian lưu trữ dữ liệu',
        body: [
          'Thông tin liên quan tới đơn hàng (họ tên, địa chỉ, sản phẩm đã mua, giá trị giao dịch) được lưu trữ trong suốt thời gian cần thiết để: hoàn tất giao dịch hiện tại; xử lý các yêu cầu đổi trả/bảo hành phát sinh sau đó trong thời hạn chính sách cho phép; và đáp ứng nghĩa vụ lưu trữ chứng từ kế toán, hóa đơn theo quy định pháp luật về kế toán và thuế hiện hành (thường là nhiều năm theo luật định, không phải do TA tự quyết định rút ngắn hay kéo dài tùy ý).',
          'Thông tin liên hệ thu thập qua form đăng ký nhận cẩm nang hoặc form hợp tác được lưu giữ cho tới khi Quý khách yêu cầu xóa (Mục 9) hoặc cho tới khi TA xác định thông tin không còn phục vụ mục đích ban đầu và không có cơ sở pháp lý khác để tiếp tục lưu giữ.',
          'Sau khi hết thời hạn lưu trữ cần thiết, thông tin sẽ được xóa hoặc ẩn danh hóa (loại bỏ khả năng nhận diện cá nhân) khỏi hệ thống hoạt động của TA.',
        ],
      },
      {
        heading: '9. Quyền của khách hàng đối với dữ liệu cá nhân',
        body: [
          'Quý khách có các quyền sau đối với thông tin cá nhân của mình mà TA đang xử lý:',
          '(a) Quyền được biết: yêu cầu TA cho biết TA đang lưu giữ những loại thông tin nào về Quý khách.',
          '(b) Quyền truy cập: yêu cầu xem lại nội dung cụ thể của thông tin cá nhân TA đang lưu giữ về mình.',
          '(c) Quyền chỉnh sửa: yêu cầu cập nhật, sửa lại thông tin không chính xác hoặc đã lỗi thời (ví dụ: đổi địa chỉ, số điện thoại mới).',
          '(d) Quyền xóa dữ liệu: yêu cầu TA xóa thông tin cá nhân khi không còn nhu cầu sử dụng dịch vụ, trừ trường hợp pháp luật yêu cầu TA phải tiếp tục lưu giữ (ví dụ chứng từ kế toán đang trong thời hạn lưu trữ bắt buộc).',
          '(e) Quyền rút lại sự đồng ý: rút lại sự đồng ý nhận thông tin khuyến mãi/tiếp thị bất kỳ lúc nào mà không ảnh hưởng tới các giao dịch đã hoàn tất trước đó.',
          '(f) Quyền phản đối xử lý: phản đối việc TA sử dụng thông tin của mình cho một mục đích cụ thể nếu Quý khách cho rằng việc đó không cần thiết hoặc không phù hợp.',
          'Để thực hiện bất kỳ quyền nào ở trên, Quý khách vui lòng liên hệ trực tiếp qua email duyenmoc08@gmail.com, nêu rõ yêu cầu cụ thể. TA sẽ xác minh danh tính hợp lý trước khi xử lý yêu cầu (để tránh người khác giả mạo yêu cầu xóa/xem dữ liệu của Quý khách), và phản hồi trong thời gian hợp lý, thông thường không quá 7 ngày làm việc kể từ khi nhận đủ thông tin xác minh.',
        ],
      },
      {
        heading: '10. Bảo vệ quyền riêng tư trẻ em',
        body: [
          'Dịch vụ và sản phẩm của TA không hướng tới và không được thiết kế dành cho trẻ em dưới 16 tuổi. TA không chủ động thu thập thông tin cá nhân của trẻ em dưới 16 tuổi. Nếu phụ huynh/người giám hộ phát hiện con em mình đã cung cấp thông tin cá nhân cho TA mà chưa có sự đồng ý của người giám hộ, vui lòng liên hệ ngay để TA xóa thông tin đó khỏi hệ thống.',
        ],
      },
      {
        heading: '11. Liên kết tới website bên thứ ba',
        body: [
          'Website có thể chứa liên kết dẫn tới các nền tảng bên ngoài (ví dụ: Zalo, WhatsApp, mạng xã hội, cổng thanh toán PayOS). Khi Quý khách nhấp vào các liên kết này và rời khỏi Website của TA, chính sách bảo mật này không còn áp dụng — mỗi nền tảng bên ngoài có chính sách bảo mật riêng mà Quý khách nên tự tìm hiểu trước khi cung cấp thông tin cho họ. TA không chịu trách nhiệm về nội dung hay hoạt động bảo mật của các website/nền tảng bên thứ ba đó.',
        ],
      },
      {
        heading: '12. Thay đổi chính sách này',
        body: [
          'TA có thể cập nhật Chính Sách Bảo Mật này theo thời gian để phản ánh đúng thực tế vận hành, thay đổi trong hoạt động kinh doanh, hoặc quy định pháp luật mới ban hành. Mọi thay đổi sẽ được đăng công khai ngay tại trang này, kèm ngày cập nhật lần cuối hiển thị ở đầu trang. TA khuyến khích Quý khách xem lại trang này định kỳ, đặc biệt trước khi cung cấp thêm thông tin cá nhân mới cho TA. Việc Quý khách tiếp tục sử dụng Website sau khi chính sách được cập nhật đồng nghĩa với việc chấp nhận nội dung đã cập nhật.',
        ],
      },
      {
        heading: '13. Liên hệ',
        body: [
          'Mọi thắc mắc, yêu cầu, hoặc khiếu nại liên quan đến Chính Sách Bảo Mật này hoặc cách TA xử lý thông tin cá nhân của Quý khách, vui lòng liên hệ: Email: duyenmoc08@gmail.com, hoặc số Zalo/WhatsApp được hiển thị tại chân trang website. TA cam kết tiếp nhận và phản hồi mọi yêu cầu hợp lệ một cách nghiêm túc, kịp thời.',
        ],
      },
    ],
  },
  terms: {
    title: 'Điều Khoản Dịch Vụ',
    updated: 'Cập nhật lần cuối: 07/09/2026',
    sections: [
      {
        heading: 'Lời mở đầu',
        body: [
          'Điều Khoản Dịch Vụ này ("Điều Khoản") là thỏa thuận pháp lý giữa Quý khách và TA (vận hành website tasamngoclinh.com), quy định các quyền và nghĩa vụ của cả hai bên khi Quý khách truy cập Website, mua sản phẩm, hoặc đăng ký hợp tác kinh doanh với TA. Vui lòng đọc kỹ toàn bộ nội dung trước khi sử dụng dịch vụ.',
        ],
      },
      {
        heading: '1. Phạm vi áp dụng và chấp nhận điều khoản',
        body: [
          'Điều Khoản này áp dụng cho mọi lượt truy cập Website, mọi giao dịch mua hàng, và mọi hoạt động đăng ký hợp tác (nhà phân phối, nhà đầu tư, OEM/ODM) thực hiện qua tasamngoclinh.com.',
          'Bằng việc truy cập Website, đặt hàng, hoặc đăng ký hợp tác, Quý khách xác nhận: (a) đã đọc, hiểu, và đồng ý bị ràng buộc bởi toàn bộ Điều Khoản này; (b) có đủ năng lực hành vi dân sự theo pháp luật Việt Nam để tham gia giao dịch (nếu Quý khách dưới 18 tuổi, cần có sự đồng ý và giám sát của cha mẹ/người giám hộ hợp pháp khi thực hiện giao dịch mua hàng); và (c) mọi thông tin cung cấp cho TA là chính xác và trung thực.',
          'Nếu Quý khách không đồng ý với bất kỳ điều khoản nào trong tài liệu này, vui lòng ngừng sử dụng Website và không thực hiện giao dịch với TA.',
        ],
      },
      {
        heading: '2. Định nghĩa thuật ngữ',
        body: [
          '"TA", "chúng tôi", "bên bán": chỉ đơn vị vận hành website tasamngoclinh.com. "Website": tasamngoclinh.com và các trang con thuộc tên miền này. "Sản phẩm": mọi hàng hóa được TA giới thiệu và chào bán trên Website, bao gồm nhưng không giới hạn ở sâm Ngọc Linh tươi/khô, sản phẩm chế biến sâu, đặc sản vùng miền liên quan. "Đơn hàng": yêu cầu mua Sản phẩm mà Quý khách gửi qua Website và đã được TA xác nhận. "Nội dung": mọi văn bản, hình ảnh, video, thiết kế, logo hiển thị trên Website.',
        ],
      },
      {
        heading: '3. Thông tin đơn vị vận hành',
        body: [
          'TA — Vườn Sâm Ngọc Linh nhà Khánh, vùng trồng đạt chuẩn GACP-WHO tại Trà Linh, Nam Trà My, tỉnh Quảng Nam, Việt Nam.',
          'Thông tin đăng ký hộ kinh doanh/giấy phép kinh doanh chính thức: hiện đang trong quá trình hoàn tất thủ tục đăng ký và sẽ được công bố công khai, minh bạch tại đây ngay khi hoàn tất. Trong thời gian chờ cập nhật, Quý khách có bất kỳ thắc mắc nào về tư cách pháp lý của bên bán xin vui lòng liên hệ trực tiếp qua email duyenmoc08@gmail.com để được cung cấp thông tin xác thực, minh bạch.',
        ],
      },
      {
        heading: '4. Điều kiện sử dụng Website',
        body: [
          'Quý khách cam kết sử dụng Website đúng mục đích (tìm hiểu thông tin sản phẩm, đặt hàng, liên hệ hợp tác) và không thực hiện các hành vi sau: (a) can thiệp, phá hoại, hoặc cố gắng truy cập trái phép vào hệ thống kỹ thuật của Website; (b) sử dụng công cụ tự động (bot, script) để thu thập dữ liệu, đặt hàng hàng loạt nhằm mục đích không chính đáng; (c) đăng tải, gửi thông tin sai sự thật, xúc phạm, hoặc vi phạm pháp luật qua các kênh liên hệ của TA; (d) sao chép, sử dụng lại Nội dung của Website cho mục đích thương mại của bên khác khi chưa được TA đồng ý bằng văn bản (xem thêm Mục 9).',
          'TA có quyền từ chối phục vụ, tạm ngừng, hoặc chấm dứt quyền truy cập của bất kỳ người dùng nào vi phạm các điều kiện trên mà không cần báo trước.',
        ],
      },
      {
        heading: '5. Sản phẩm và mô tả sản phẩm',
        body: [
          'TA nỗ lực mô tả sản phẩm (tên gọi, thành phần, công dụng, hình ảnh, xuất xứ) một cách chính xác nhất có thể tại thời điểm đăng tải. Tuy nhiên, do đặc thù sản phẩm nông nghiệp/dược liệu tự nhiên (sâm Ngọc Linh, mật ong rừng, nấm dược liệu...), hình ảnh và mô tả chỉ mang tính minh họa/tham khảo — màu sắc, kích thước, hình dáng thực tế của sản phẩm (đặc biệt với củ sâm tươi nguyên củ) có thể có sai lệch nhỏ tự nhiên so với hình ảnh trên Website, đây là đặc tính vốn có của nông sản tự nhiên, không phải lỗi sản phẩm.',
          'Các sản phẩm của TA là thực phẩm bồi bổ sức khỏe / dược liệu, KHÔNG phải là thuốc và KHÔNG có tác dụng thay thế thuốc chữa bệnh. Mọi thông tin về công dụng trên Website chỉ mang tính tham khảo dựa trên đặc tính dược liệu truyền thống hoặc tài liệu khoa học công khai — không phải cam kết y khoa cho từng cá nhân cụ thể. Quý khách có bệnh lý nền hoặc đang điều trị y tế nên tham khảo ý kiến bác sĩ trước khi sử dụng.',
        ],
      },
      {
        heading: '6. Giá cả và chương trình khuyến mãi',
        body: [
          'Giá sản phẩm hiển thị trên Website là giá niêm yết tại thời điểm Quý khách xem trang sản phẩm, đã được TA cập nhật cẩn thận nhưng có thể thay đổi theo thời gian mà không cần báo trước (ví dụ theo biến động thị trường nông sản, chi phí vận hành). Giá áp dụng chính thức cho một Đơn hàng cụ thể là giá được hiển thị tại thời điểm Quý khách hoàn tất đặt hàng — thay đổi giá sau đó không ảnh hưởng ngược lại tới Đơn hàng đã xác nhận.',
          'Các chương trình khuyến mãi, giảm giá, combo quà tặng theo mùa (nếu có) được TA công bố rõ thời gian áp dụng, điều kiện, và số lượng có hạn (nếu có) ngay tại trang sản phẩm hoặc banner liên quan. TA có quyền thay đổi, tạm dừng, hoặc kết thúc sớm một chương trình khuyến mãi nếu cần thiết, nhưng cam kết vẫn tôn trọng các Đơn hàng đã được xác nhận thành công trong thời gian chương trình còn hiệu lực.',
        ],
      },
      {
        heading: '7. Quy trình đặt hàng và xác nhận',
        body: [
          'Bước 1 — Chọn sản phẩm: Quý khách chọn sản phẩm, số lượng mong muốn và thêm vào giỏ hàng.',
          'Bước 2 — Điền thông tin giao hàng: Quý khách cung cấp họ tên, số điện thoại, địa chỉ nhận hàng chính xác.',
          'Bước 3 — Thanh toán: Quý khách hoàn tất thanh toán qua PayOS (VietQR) hoặc phương thức khác TA hỗ trợ tại thời điểm đặt hàng.',
          'Bước 4 — Xác nhận: Đơn hàng được xem là hoàn tất và có hiệu lực ràng buộc khi Quý khách nhận được xác nhận đơn hàng từ TA (qua Website, email, hoặc tin nhắn Zalo).',
          'Trong trường hợp một sản phẩm hết hàng ngay sau khi Quý khách đã đặt và thanh toán thành công (do trùng thời điểm với khách khác, hoặc sự cố cập nhật tồn kho), TA sẽ chủ động liên hệ Quý khách trong thời gian sớm nhất để thống nhất phương án: hoàn tiền toàn bộ, hoặc thay thế bằng sản phẩm tương đương theo sự đồng ý của Quý khách. TA không tự ý thay thế sản phẩm khi chưa có sự đồng ý.',
          'Quý khách có trách nhiệm cung cấp thông tin giao hàng chính xác, đầy đủ. TA không chịu trách nhiệm về việc giao hàng chậm trễ, thất lạc, hoặc giao sai địa chỉ phát sinh trực tiếp từ thông tin không chính xác do Quý khách cung cấp.',
        ],
      },
      {
        heading: '8. Thanh toán',
        body: [
          'TA hỗ trợ thanh toán qua PayOS (chuyển khoản VietQR) — một cổng thanh toán trung gian độc lập với TA. Toàn bộ giao dịch được PayOS xử lý theo quy trình bảo mật riêng của họ; TA không lưu trữ, không có quyền truy cập vào thông tin tài khoản/thẻ ngân hàng của Quý khách dưới bất kỳ hình thức nào (xem thêm Chính Sách Bảo Mật).',
          'Nếu phát sinh lỗi kỹ thuật trong quá trình thanh toán (tiền đã trừ nhưng đơn hàng chưa được xác nhận), Quý khách vui lòng liên hệ ngay TA kèm theo bằng chứng giao dịch (ảnh chụp màn hình, mã giao dịch) để được đối soát và xử lý kịp thời.',
        ],
      },
      {
        heading: '9. Vận chuyển và đổi trả',
        body: [
          'Khu vực giao hàng, thời gian dự kiến, phí vận chuyển, và quy trình đóng gói được quy định chi tiết tại Chính Sách Vận Chuyển. Điều kiện và quy trình đổi trả, hoàn tiền được quy định chi tiết tại Chính Sách Đổi Trả & Hoàn Tiền (xem liên kết ở chân trang Website). Cả hai chính sách này là một phần không tách rời của Điều Khoản Dịch Vụ này — mọi giao dịch đều chịu sự điều chỉnh đồng thời của cả ba tài liệu.',
        ],
      },
      {
        heading: '10. Sở hữu trí tuệ',
        body: [
          'Toàn bộ Nội dung hiển thị trên Website — bao gồm văn bản mô tả, hình ảnh sản phẩm, hình ảnh vùng trồng, logo, tên thương hiệu "TA", giao diện thiết kế — thuộc quyền sở hữu hợp pháp hoặc quyền sử dụng hợp pháp của TA, được bảo hộ theo pháp luật về sở hữu trí tuệ hiện hành.',
          'Quý khách được phép xem, tải về, in ấn Nội dung cho mục đích cá nhân, phi thương mại (ví dụ: lưu thông tin sản phẩm để tham khảo). Mọi hình thức sao chép, sửa đổi, phân phối lại, hoặc sử dụng Nội dung cho mục đích thương mại của bên thứ ba mà không có sự đồng ý bằng văn bản trước của TA đều bị nghiêm cấm và có thể bị xử lý theo quy định pháp luật.',
        ],
      },
      {
        heading: '11. Bảo hành và giới hạn trách nhiệm',
        body: [
          'TA cam kết sản phẩm được bán ra đúng như mô tả về nguồn gốc, xuất xứ tại thời điểm giao hàng, tuân thủ tiêu chuẩn GACP-WHO đối với vùng trồng. Trách nhiệm bảo hành/đổi trả đối với lỗi sản xuất hoặc hư hỏng vận chuyển được thực hiện theo Chính Sách Đổi Trả & Hoàn Tiền.',
          'Trong phạm vi pháp luật cho phép, TA không chịu trách nhiệm đối với: (a) thiệt hại phát sinh từ việc sử dụng sản phẩm sai hướng dẫn, sai liều lượng khuyến nghị, hoặc dùng thay thế cho điều trị y tế cần thiết mà không có tư vấn chuyên môn; (b) thiệt hại gián tiếp, ngẫu nhiên, hoặc mang tính hệ quả phát sinh từ việc sử dụng hoặc không thể sử dụng Website/sản phẩm; (c) sự chậm trễ hoặc gián đoạn dịch vụ do nguyên nhân bất khả kháng (Mục 13).',
          'Trong mọi trường hợp, trách nhiệm bồi thường tối đa của TA đối với bất kỳ khiếu nại nào liên quan đến một Đơn hàng cụ thể không vượt quá giá trị của chính Đơn hàng đó.',
        ],
      },
      {
        heading: '12. Bồi thường',
        body: [
          'Quý khách đồng ý bồi thường và giữ cho TA không bị thiệt hại phát sinh từ bất kỳ khiếu nại, tổn thất, hoặc chi phí nào (bao gồm phí pháp lý hợp lý) mà TA phải gánh chịu do Quý khách vi phạm Điều Khoản này, sử dụng Website sai mục đích, hoặc vi phạm quyền của bên thứ ba.',
        ],
      },
      {
        heading: '13. Sự kiện bất khả kháng',
        body: [
          'TA được miễn trừ trách nhiệm đối với việc chậm trễ hoặc không thể thực hiện nghĩa vụ theo Điều Khoản này khi nguyên nhân trực tiếp đến từ sự kiện bất khả kháng nằm ngoài khả năng kiểm soát hợp lý của TA, bao gồm nhưng không giới hạn ở: thiên tai, dịch bệnh, hỏa hoạn, chiến tranh, bạo động, thay đổi đột ngột trong chính sách của cơ quan nhà nước, hoặc sự cố hạ tầng vận chuyển/viễn thông/thanh toán thuộc quyền kiểm soát của bên thứ ba. Trong trường hợp này, TA sẽ thông báo cho Quý khách trong thời gian sớm nhất có thể và cùng thống nhất phương án xử lý hợp lý (hoãn giao hàng, hoàn tiền một phần hoặc toàn bộ).',
        ],
      },
      {
        heading: '14. Chấm dứt và từ chối phục vụ',
        body: [
          'TA có quyền từ chối xử lý, hủy Đơn hàng, hoặc từ chối phục vụ đối với bất kỳ khách hàng nào có dấu hiệu gian lận, cung cấp thông tin sai sự thật, có hành vi lạm dụng chương trình khuyến mãi, hoặc vi phạm nghiêm trọng Điều Khoản này. Trong trường hợp hủy Đơn hàng đã thanh toán vì lý do thuộc về TA hoặc lý do khách quan (Mục 7, Mục 13), TA cam kết hoàn tiền đầy đủ cho Quý khách.',
        ],
      },
      {
        heading: '15. Giải quyết tranh chấp',
        body: [
          'Khi phát sinh bất kỳ tranh chấp, khiếu nại nào liên quan đến giao dịch hoặc Điều Khoản này, hai bên cam kết ưu tiên giải quyết thông qua thương lượng, hòa giải trực tiếp trên tinh thần thiện chí, tôn trọng lẫn nhau. Trường hợp không đạt được thỏa thuận sau khi đã nỗ lực thương lượng hợp lý, tranh chấp sẽ được đưa ra giải quyết tại cơ quan tài phán có thẩm quyền theo quy định của pháp luật Việt Nam.',
        ],
      },
      {
        heading: '16. Điều khoản chung',
        body: [
          'Hiệu lực từng phần: nếu bất kỳ điều khoản nào trong tài liệu này bị tuyên bố vô hiệu hoặc không thể thực thi bởi cơ quan có thẩm quyền, các điều khoản còn lại vẫn giữ nguyên hiệu lực đầy đủ.',
          'Toàn bộ thỏa thuận: Điều Khoản này, cùng với Chính Sách Bảo Mật, Chính Sách Vận Chuyển, và Chính Sách Đổi Trả & Hoàn Tiền, cấu thành toàn bộ thỏa thuận giữa Quý khách và TA liên quan tới việc sử dụng Website và mua hàng, thay thế mọi thỏa thuận bằng lời nói hoặc văn bản trước đó về cùng nội dung (nếu có).',
          'Ngôn ngữ: Điều Khoản này được lập bằng tiếng Việt là ngôn ngữ gốc có giá trị pháp lý cao nhất; các bản dịch sang ngôn ngữ khác (Anh, Trung, Pháp) trên Website chỉ nhằm mục đích tham khảo, thuận tiện cho khách hàng quốc tế.',
          'Luật áp dụng: Điều Khoản này được điều chỉnh và giải thích theo pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.',
        ],
      },
      {
        heading: '17. Thông báo và phương thức liên lạc chính thức',
        body: [
          'Mọi thông báo chính thức từ TA tới Quý khách liên quan tới Đơn hàng (xác nhận đơn, cập nhật vận chuyển, thông báo về đổi trả) sẽ được gửi qua một hoặc nhiều kênh sau: tin nhắn/cuộc gọi tới số điện thoại Quý khách đã cung cấp, email, hoặc tin nhắn Zalo — tùy kênh liên lạc Quý khách đã để lại khi đặt hàng. Quý khách có trách nhiệm giữ thông tin liên lạc chính xác, cập nhật để không bỏ lỡ các thông báo quan trọng về Đơn hàng của mình.',
          'Mọi thông báo, khiếu nại, hoặc yêu cầu chính thức từ Quý khách gửi tới TA nên thực hiện qua email duyenmoc08@gmail.com hoặc số Zalo/WhatsApp công bố tại chân trang Website, để đảm bảo được ghi nhận và xử lý theo đúng quy trình, tránh trường hợp thất lạc thông tin qua các kênh không chính thức.',
        ],
      },
      {
        heading: '18. Liên hệ',
        body: [
          'Mọi thắc mắc về Điều Khoản Dịch Vụ này, vui lòng liên hệ email duyenmoc08@gmail.com hoặc số Zalo/WhatsApp tại chân trang Website.',
        ],
      },
    ],
  },
  shipping: {
    title: 'Chính Sách Vận Chuyển',
    updated: 'Cập nhật lần cuối: 07/09/2026',
    sections: [
      {
        heading: 'Lời mở đầu',
        body: [
          'Sâm Ngọc Linh và các sản phẩm liên quan là dược liệu/nông sản có giá trị cao, đòi hỏi quy trình vận chuyển cẩn trọng để giữ nguyên chất lượng từ vùng trồng tới tay khách hàng. Chính Sách Vận Chuyển này giải thích chi tiết cách TA tổ chức giao hàng, đóng gói, và xử lý các tình huống phát sinh trong quá trình vận chuyển.',
        ],
      },
      {
        heading: '1. Khu vực giao hàng',
        body: [
          'TA giao hàng trên phạm vi toàn quốc Việt Nam. Khu vực gần vùng trồng (tỉnh Quảng Nam, thành phố Đà Nẵng, tỉnh Kon Tum và các khu vực lân cận) được đội ngũ TA tự tổ chức giao hàng trực tiếp, giúp rút ngắn thời gian và kiểm soát chất lượng sát sao hơn trong chặng cuối.',
          'Các tỉnh/thành phố khác trên cả nước được giao thông qua đối tác vận chuyển hợp tác với TA — các đơn vị vận chuyển uy tín, có mạng lưới phủ khắp toàn quốc.',
          'Đối với vận chuyển quốc tế/xuất khẩu: hiện tại TA CHƯA hỗ trợ đặt hàng lẻ giao ra nước ngoài qua kênh bán lẻ trên Website. Nhu cầu xuất khẩu, phân phối quốc tế xin vui lòng liên hệ qua kênh Hợp Tác B2B (Nhà Phân Phối/OEM-ODM) để được tư vấn phương án riêng phù hợp với khối lượng và quy định hải quan của từng thị trường. Việc xuất khẩu sâm Ngọc Linh và dược liệu liên quan ra nước ngoài thường liên quan tới các quy định kiểm dịch thực vật, hải quan, và giấy phép chuyên ngành khác nhau tùy quốc gia nhập khẩu — đây là lý do TA xử lý các yêu cầu này riêng biệt, theo từng trường hợp cụ thể, thay vì tự động hóa qua kênh bán lẻ trực tuyến thông thường.',
        ],
      },
      {
        heading: '2. Quy trình xử lý đơn hàng trước khi giao',
        body: [
          'Sau khi Đơn hàng được xác nhận thanh toán thành công, đội ngũ TA thực hiện các bước: (1) kiểm tra tồn kho và xác nhận sản phẩm sẵn có; (2) chuẩn bị và kiểm tra chất lượng sản phẩm lần cuối trước khi đóng gói; (3) đóng gói theo tiêu chuẩn phù hợp với từng loại sản phẩm (xem Mục 4); (4) bàn giao cho đội giao hàng trực tiếp hoặc đơn vị vận chuyển đối tác.',
          'Thời gian xử lý nội bộ (từ lúc xác nhận đơn tới lúc hàng rời kho) thường trong vòng 24 giờ làm việc đối với ngày thường, có thể kéo dài hơn vào các dịp cao điểm hoặc đối với sản phẩm cần chuẩn bị đặc biệt (ví dụ: củ sâm tươi cần chọn lựa cẩn thận theo yêu cầu).',
        ],
      },
      {
        heading: '3. Thời gian giao hàng dự kiến',
        body: [
          'Khu vực tự giao (Quảng Nam, Đà Nẵng, Kon Tum và lân cận): thường 1–2 ngày làm việc kể từ khi Đơn hàng được xác nhận.',
          'Khu vực qua đối tác vận chuyển — các thành phố lớn (Hà Nội, TP. Hồ Chí Minh và các đô thị trung tâm khác): thường 2–4 ngày làm việc.',
          'Khu vực qua đối tác vận chuyển — các tỉnh, khu vực xa trung tâm hơn: thường 3–5 ngày làm việc.',
          'Khu vực vùng sâu, vùng xa, hải đảo: có thể kéo dài hơn 5 ngày làm việc tùy điều kiện hạ tầng giao thông tại địa phương.',
          'Trong các giai đoạn cao điểm (lễ, Tết Nguyên Đán, các đợt khuyến mãi lớn toàn ngành thương mại điện tử), thời gian giao hàng có thể kéo dài hơn bình thường do khối lượng vận chuyển tăng cao trên toàn hệ thống của đối tác vận chuyển, không riêng gì đơn hàng của TA. Các mốc thời gian nêu trên là ước tính dựa trên điều kiện vận hành thông thường, không bao gồm các trường hợp bất khả kháng như thời tiết cực đoan, thiên tai, hoặc gián đoạn hạ tầng giao thông.',
        ],
      },
      {
        heading: '4. Đóng gói theo từng loại sản phẩm',
        body: [
          'Sâm tươi nguyên củ: được làm sạch, bọc giữ ẩm phù hợp và đặt trong hộp cứng chống va đập, có lớp lót bảo vệ để hạn chế tối đa tổn thương cơ học trong quá trình vận chuyển.',
          'Sâm khô, các loại thảo dược khô (nấm Lim Xanh, trà...): đóng gói kín khí, chống ẩm, đặt trong hộp/túi có lớp đệm bảo vệ hình dáng sản phẩm.',
          'Rượu ngâm, sản phẩm đóng chai/hũ thủy tinh: đây là nhóm sản phẩm dễ vỡ nhất, được TA đặc biệt chú trọng — sử dụng vật liệu chèn lót chuyên dụng (mút xốp định hình, giấy chèn) bao quanh từng chai/hũ, đặt trong thùng carton có cảnh báo "Hàng dễ vỡ" bên ngoài.',
          'Thực phẩm chế biến sâu (bánh, collagen, các sản phẩm đóng gói sẵn khác): đóng gói theo tiêu chuẩn bao bì gốc của nhà sản xuất, có thêm lớp bảo vệ ngoài nếu cần thiết tùy kích thước đơn hàng.',
          'Đơn hàng combo/set quà tặng: được sắp xếp gọn gàng trong hộp quà chuyên dụng (nếu sản phẩm thuộc dòng quà tặng), đảm bảo tính thẩm mỹ khi khách hàng nhận được, đồng thời vẫn tuân thủ nguyên tắc bảo vệ từng thành phần bên trong như mô tả ở trên.',
        ],
      },
      {
        heading: '5. Phí vận chuyển',
        body: [
          'Phí vận chuyển được tính toán cụ thể dựa trên: địa chỉ nhận hàng (khoảng cách từ kho TA), tổng trọng lượng và kích thước của Đơn hàng. Phí này được hệ thống hiển thị đầy đủ, minh bạch ngay tại bước thanh toán, trước khi Quý khách xác nhận đặt hàng — không phát sinh thêm bất kỳ khoản phí ẩn nào sau khi Đơn hàng đã được xác nhận, trừ trường hợp Quý khách chủ động thay đổi địa chỉ giao hàng sang khu vực có mức phí cao hơn sau khi đặt hàng.',
        ],
      },
      {
        heading: '6. Bảo quản trong quá trình vận chuyển',
        body: [
          'TA khuyến nghị và phối hợp với đối tác vận chuyển để đảm bảo sản phẩm không bị phơi nắng trực tiếp kéo dài hoặc để ở nơi có nhiệt độ quá cao trong quá trình trung chuyển, đặc biệt với sâm tươi và các sản phẩm cần giữ độ ẩm/nhiệt độ ổn định. Tuy nhiên, đối với các chặng vận chuyển liên tỉnh qua đối tác thứ ba, TA không thể kiểm soát tuyệt đối 100% điều kiện bảo quản trong suốt hành trình — nếu phát hiện sản phẩm có dấu hiệu bất thường do điều kiện vận chuyển khi nhận hàng, Quý khách vui lòng thực hiện theo hướng dẫn tại Mục 8 và Mục 9 dưới đây.',
        ],
      },
      {
        heading: '7. Theo dõi đơn hàng',
        body: [
          'Đối với đơn hàng giao qua đối tác vận chuyển, Quý khách sẽ nhận được mã vận đơn để tự tra cứu trạng thái giao hàng qua hệ thống của đơn vị vận chuyển tương ứng. Đối với đơn hàng tự giao (khu vực gần vùng trồng), Quý khách sẽ được đội ngũ TA liên hệ trực tiếp qua điện thoại hoặc Zalo trước khi giao để xác nhận thời gian nhận hàng thuận tiện nhất, tránh trường hợp giao hàng khi không có người nhận.',
        ],
      },
      {
        heading: '8. Kiểm tra hàng khi nhận (mở hàng)',
        body: [
          'TA khuyến khích mạnh mẽ Quý khách thực hiện các bước sau khi nhận hàng: (1) kiểm tra tình trạng bên ngoài của kiện hàng trước khi ký xác nhận với nhân viên giao hàng — nếu thấy kiện hàng có dấu hiệu bị mở, móp méo nghiêm trọng, ướt, hoặc rách; (2) nếu nghi ngờ có vấn đề, nên quay video liên tục quá trình mở kiện hàng từ ngoài vào trong (không cắt ghép), đây sẽ là bằng chứng quan trọng nếu cần yêu cầu hỗ trợ đổi trả sau này; (3) đối chiếu số lượng, loại sản phẩm nhận được với Đơn hàng đã đặt.',
          'Việc quay video mở hàng không bắt buộc nhưng được khuyến nghị mạnh mẽ, đặc biệt với đơn hàng giá trị cao hoặc sản phẩm dễ vỡ, vì đây là bằng chứng khách quan giúp quá trình xử lý khiếu nại (nếu có) diễn ra nhanh chóng, công bằng cho cả hai bên.',
        ],
      },
      {
        heading: '9. Sự cố khi giao hàng',
        body: [
          'Nếu Đơn hàng bị thất lạc hoàn toàn, giao nhầm địa chỉ, hoặc phát hiện hư hỏng khi mở hàng, Quý khách vui lòng liên hệ TA trong vòng 48 giờ kể từ khi phát hiện sự việc (hoặc kể từ thời điểm dự kiến nhận hàng nếu hàng bị thất lạc), qua email duyenmoc08@gmail.com hoặc Zalo/WhatsApp tại chân trang Website, kèm theo: mã đơn hàng, mô tả sự cố, và hình ảnh/video minh chứng (nếu có). TA cam kết tiếp nhận, xác minh, và hỗ trợ xử lý theo đúng quy định tại Chính Sách Đổi Trả & Hoàn Tiền.',
          'Việc báo cáo sự cố càng sớm càng giúp TA phối hợp với đơn vị vận chuyển xử lý nhanh và hiệu quả hơn — Quý khách không nên trì hoãn việc thông báo nếu phát hiện vấn đề.',
        ],
      },
      {
        heading: '10. Trách nhiệm giữa các bên trong chuỗi vận chuyển',
        body: [
          'Để Quý khách hiểu rõ ai chịu trách nhiệm ở từng giai đoạn: TA chịu trách nhiệm về chất lượng sản phẩm và việc đóng gói đúng chuẩn TRƯỚC khi bàn giao cho đơn vị vận chuyển (dù tự giao hay qua đối tác). Kể từ thời điểm đơn vị vận chuyển đối tác tiếp nhận kiện hàng, đơn vị đó chịu trách nhiệm bảo quản, vận chuyển đúng thời gian cam kết, và bàn giao đúng người nhận. Tuy nhiên, với Quý khách là người mua hàng của TA, TA vẫn đứng ra làm đầu mối duy nhất tiếp nhận và xử lý mọi khiếu nại phát sinh trong toàn bộ hành trình — Quý khách không cần tự liên hệ trực tiếp với đơn vị vận chuyển để đòi quyền lợi, mọi việc đó TA sẽ thay mặt Quý khách làm việc với đối tác vận chuyển.',
          'Cách phân chia trách nhiệm nội bộ này không làm giảm bất kỳ quyền lợi nào của Quý khách theo Chính Sách Đổi Trả & Hoàn Tiền — dù lỗi phát sinh từ khâu đóng gói của TA hay từ quá trình vận chuyển của đối tác, Quý khách vẫn được hỗ trợ theo đúng chính sách đã công bố.',
        ],
      },
      {
        heading: '11. Chuẩn bị trước khi nhận hàng',
        body: [
          'Để việc nhận hàng diễn ra thuận lợi, TA khuyến nghị Quý khách: (a) cung cấp số điện thoại chính xác, luôn liên lạc được trong khung giờ dự kiến giao hàng; (b) ghi chú rõ địa chỉ chi tiết (số nhà, ngõ/hẻm, tên tòa nhà/căn hộ nếu ở chung cư) để nhân viên giao hàng dễ dàng xác định vị trí, đặc biệt tại các khu đô thị lớn có cấu trúc phức tạp; (c) nếu không thể tự nhận hàng, nên chủ động thông báo trước và ủy quyền cho người khác (người thân, bảo vệ tòa nhà) nhận thay, đồng thời báo trước với TA/đơn vị vận chuyển thông tin người nhận thay; (d) chuẩn bị sẵn không gian bảo quản phù hợp (nơi khô ráo, thoáng mát) để cất giữ sản phẩm ngay sau khi nhận, đặc biệt với sâm tươi cần bảo quản đúng cách càng sớm càng tốt sau khi nhận hàng.',
        ],
      },
      {
        heading: '12. Ảnh hưởng của thời tiết và mùa vụ',
        body: [
          'Việt Nam có sự khác biệt khí hậu rõ rệt giữa các vùng miền và các mùa trong năm. Vào mùa mưa bão (thường từ tháng 9 đến tháng 12 tại khu vực miền Trung, nơi đặt vùng trồng của TA), thời gian giao hàng có thể bị ảnh hưởng do điều kiện giao thông tại địa phương hoặc tại các điểm trung chuyển của đối tác vận chuyển. TA sẽ chủ động thông báo cho Quý khách nếu biết trước đơn hàng có khả năng bị chậm trễ do nguyên nhân thời tiết, và ưu tiên các biện pháp bảo vệ sản phẩm phù hợp (ví dụ tăng cường lớp chống ẩm) trong giai đoạn này.',
          'Vào các dịp lễ, Tết Nguyên Đán — thời điểm nhu cầu quà tặng tăng cao trên toàn thị trường — Quý khách nên đặt hàng sớm hơn bình thường (khuyến nghị trước ít nhất 5–7 ngày so với ngày cần nhận hàng) để tránh tình trạng chậm trễ ngoài ý muốn do khối lượng vận chuyển toàn ngành tăng đột biến.',
        ],
      },
      {
        heading: '13. Đơn hàng số lượng lớn / doanh nghiệp',
        body: [
          'Đối với nhu cầu đặt hàng số lượng lớn (quà tặng doanh nghiệp, sự kiện, đại lý phân phối), TA có thể sắp xếp phương án vận chuyển và đóng gói riêng phù hợp với quy mô đơn hàng — bao gồm đóng gói theo lô, sắp xếp lịch giao hàng theo đợt, hoặc phối hợp vận chuyển bằng xe tải riêng đối với đơn hàng cực lớn thay vì qua đơn vị chuyển phát thông thường. Vui lòng liên hệ qua mục "Hợp Tác" hoặc số Zalo/WhatsApp tại chân trang Website để được tư vấn phương án vận chuyển tối ưu và báo giá cước phù hợp cho đơn hàng lớn.',
        ],
      },
      {
        heading: '14. Câu hỏi thường gặp',
        body: [
          'Tôi có thể đổi địa chỉ giao hàng sau khi đặt không? Có thể, nếu Đơn hàng chưa được bàn giao cho đơn vị vận chuyển — vui lòng liên hệ TA càng sớm càng tốt qua Zalo/WhatsApp.',
          'Tôi không có nhà khi shipper giao hàng thì sao? Với đơn tự giao, TA sẽ liên hệ trước để hẹn giờ phù hợp. Với đơn qua đối tác vận chuyển, đơn vị vận chuyển thường sẽ liên hệ trước hoặc thử giao lại — Quý khách nên giữ liên lạc qua số điện thoại đã cung cấp khi đặt hàng để phối hợp nhận hàng thuận lợi.',
          'Sản phẩm có được bảo hiểm trong quá trình vận chuyển không? Chi phí phát sinh do lỗi/hư hỏng trong quá trình vận chuyển thuộc trách nhiệm xử lý của TA theo Chính Sách Đổi Trả & Hoàn Tiền — Quý khách không cần mua thêm bảo hiểm vận chuyển riêng.',
          'Tôi có thể yêu cầu giao hàng vào một khung giờ cụ thể trong ngày không? Với đơn tự giao, TA cố gắng sắp xếp theo khung giờ Quý khách mong muốn khi liên hệ xác nhận trước giờ giao. Với đơn qua đối tác vận chuyển, khung giờ cụ thể phụ thuộc vào lịch trình của đơn vị đó tại khu vực Quý khách — TA sẽ truyền đạt nguyện vọng của Quý khách nhưng không thể cam kết tuyệt đối trong mọi trường hợp.',
          'Đơn hàng của tôi có thể được chia làm nhiều lần giao không? Thông thường TA gộp toàn bộ sản phẩm trong một Đơn hàng vào một lần giao duy nhất để tối ưu chi phí và thời gian. Trong trường hợp đặc biệt (một số sản phẩm cần chuẩn bị lâu hơn, hoặc đơn hàng số lượng lớn), TA có thể chủ động đề xuất giao thành nhiều đợt và sẽ trao đổi rõ với Quý khách trước, không tự ý chia đơn mà không thông báo.',
        ],
      },
    ],
  },
  refund: {
    title: 'Chính Sách Đổi Trả & Hoàn Tiền',
    updated: 'Cập nhật lần cuối: 07/09/2026',
    sections: [
      {
        heading: 'Lời mở đầu',
        body: [
          'TA cam kết mang tới sản phẩm sâm Ngọc Linh và đặc sản đi kèm đúng chất lượng, đúng nguồn gốc như đã công bố. Chính Sách Đổi Trả & Hoàn Tiền này quy định rõ ràng, minh bạch các trường hợp Quý khách được hỗ trợ đổi/trả hàng, quy trình thực hiện, và cách thức hoàn tiền — để Quý khách an tâm khi mua sắm trên Website.',
        ],
      },
      {
        heading: '1. Điều kiện áp dụng đổi/trả',
        body: [
          'TA nhận đổi/trả trong vòng 7 ngày kể từ ngày Quý khách nhận hàng (căn cứ theo thời điểm ghi nhận trên hệ thống vận chuyển hoặc xác nhận nhận hàng của đơn vị giao tự vận hành), áp dụng CHỈ trong các trường hợp sau:',
          '(a) Lỗi do sản xuất: sản phẩm có thành phần/khối lượng/quy cách không đúng như mô tả trên Website; bao bì bị lỗi từ nhà sản xuất (rách, hở, thiếu nhãn) ngay từ khi xuất xưởng; sản phẩm bị hỏng, biến chất bất thường mà không do tác động từ bên ngoài sau khi rời khỏi TA.',
          '(b) Hư hỏng do vận chuyển: sản phẩm bị vỡ, móp, biến dạng, rò rỉ do va đập hoặc điều kiện vận chuyển không đảm bảo trong quá trình giao hàng.',
          '(c) Giao sai/thiếu hàng: TA giao nhầm sản phẩm khác với Đơn hàng đã xác nhận, hoặc giao thiếu số lượng so với Đơn hàng.',
          'Sản phẩm yêu cầu đổi/trả cần còn nguyên tem, nhãn, bao bì gốc và chưa qua sử dụng, TRỪ trường hợp chính lỗi đó (ví dụ: lỗi bao bì, lỗi bên trong) khiến sản phẩm không thể sử dụng bình thường ngay từ khi mở ra — trong trường hợp này, Quý khách chỉ cần giữ nguyên hiện trạng sản phẩm và cung cấp bằng chứng (ảnh/video) đúng theo quy trình tại Mục 3.',
        ],
      },
      {
        heading: '2. Các trường hợp không áp dụng đổi/trả',
        body: [
          'Để đảm bảo công bằng cho cả người mua và người bán, TA không áp dụng chính sách đổi/trả trong các trường hợp sau:',
          '(a) Đổi ý sau khi mua: Quý khách không còn muốn sản phẩm nữa dù sản phẩm hoàn toàn không có lỗi (ví dụ: mua nhầm loại, không hợp khẩu vị cá nhân với các sản phẩm như rượu ngâm, trà — đây là yếu tố cảm quan chủ quan, không phải lỗi sản phẩm).',
          '(b) Sản phẩm đã bóc tem, đã sử dụng một phần mà không có lỗi rõ ràng do sản xuất/vận chuyển — ví dụ đã uống thử rượu ngâm, đã dùng một phần sâm mà không phát hiện bất thường trong lần dùng đầu, sau đó mới yêu cầu trả hàng.',
          '(c) Yêu cầu gửi sau 7 ngày kể từ ngày nhận hàng, kể cả khi sản phẩm thực sự có lỗi — Quý khách cần thông báo cho TA trong khung thời gian quy định để được hỗ trợ.',
          '(d) Hư hỏng phát sinh do bảo quản sai cách SAU KHI đã nhận hàng thành công trong tình trạng tốt — ví dụ: để sản phẩm nơi ẩm ướt, nhiệt độ cao, ánh nắng trực tiếp trái với hướng dẫn bảo quản in trên bao bì, khiến sản phẩm hư hỏng sau một thời gian sử dụng/lưu trữ tại nhà khách hàng.',
          '(e) Sản phẩm thuộc danh mục hàng đặc biệt không áp dụng đổi trả vì lý do vệ sinh/an toàn thực phẩm sau khi đã mở niêm phong (ví dụ một số sản phẩm dạng lỏng/thực phẩm ăn liền đã khui dùng), trừ khi có lỗi rõ ràng từ nhà sản xuất.',
        ],
      },
      {
        heading: '3. Quy trình yêu cầu đổi/trả — từng bước chi tiết',
        body: [
          'Bước 1 — Liên hệ trong thời hạn: gửi yêu cầu qua email duyenmoc08@gmail.com hoặc Zalo/WhatsApp (thông tin tại chân trang Website) trong vòng 7 ngày kể từ ngày nhận hàng. Yêu cầu cần bao gồm: mã Đơn hàng, mô tả cụ thể vấn đề gặp phải, và hình ảnh/video rõ ràng thể hiện tình trạng thực tế của sản phẩm (và bao bì/kiện hàng nếu liên quan tới vận chuyển).',
          'Bước 2 — Xác nhận từ TA: đội ngũ TA xem xét thông tin, hình ảnh/video được cung cấp và phản hồi kết quả đánh giá (đủ điều kiện/không đủ điều kiện đổi trả theo Mục 1–2) trong vòng 2 ngày làm việc kể từ khi nhận đủ thông tin cần thiết. Nếu cần thêm thông tin/hình ảnh để đánh giá chính xác, TA sẽ chủ động liên hệ lại Quý khách.',
          'Bước 3 — Hướng dẫn gửi trả (nếu đủ điều kiện): TA hướng dẫn Quý khách cách đóng gói và gửi trả sản phẩm về địa chỉ TA cung cấp. Đối với các trường hợp lỗi thuộc về TA (lỗi sản xuất hoặc hư hỏng vận chuyển), TA chi trả hoặc hoàn lại chi phí vận chuyển gửi trả hàng cho Quý khách.',
          'Bước 4 — Xử lý kết quả cuối cùng: sau khi TA nhận và xác nhận sản phẩm trả về đáp ứng đúng điều kiện đã thống nhất, TA tiến hành theo lựa chọn của Quý khách: đổi sản phẩm mới (cùng loại hoặc tương đương nếu hết hàng, có sự đồng ý của Quý khách), hoặc hoàn tiền theo Mục 4 dưới đây.',
        ],
      },
      {
        heading: '4. Chi phí phát sinh trong quá trình đổi/trả',
        body: [
          'Nếu nguyên nhân đổi/trả thuộc về TA (lỗi sản xuất, giao sai/thiếu hàng, hư hỏng do vận chuyển): TA chịu toàn bộ chi phí vận chuyển liên quan tới việc gửi trả sản phẩm lỗi và gửi sản phẩm thay thế (nếu có) — Quý khách không phải trả thêm bất kỳ khoản phí nào cho các trường hợp này.',
          'TA không thu bất kỳ khoản phí xử lý, phí kiểm tra nào đối với các yêu cầu đổi/trả hợp lệ theo chính sách này. Mọi khoản phí phát sinh (nếu có) sẽ được TA thông báo rõ ràng, minh bạch cho Quý khách trước khi tiến hành, không thu ẩn hay thu thêm ngoài những gì đã thống nhất.',
        ],
      },
      {
        heading: '5. Hoàn tiền',
        body: [
          'Phương thức hoàn tiền: TA hoàn tiền bằng chuyển khoản ngân hàng về tài khoản do Quý khách cung cấp — thông thường là chính tài khoản đã dùng để thanh toán Đơn hàng ban đầu qua PayOS, hoặc tài khoản khác theo thỏa thuận cụ thể giữa hai bên nếu có lý do chính đáng.',
          'Thời gian hoàn tiền: trong vòng 5 ngày làm việc kể từ khi TA xác nhận sản phẩm trả về đáp ứng đầy đủ điều kiện tại Mục 1. Thời gian tiền về tài khoản thực tế có thể phụ thuộc thêm vào thời gian xử lý của ngân hàng Quý khách sử dụng (thường trong vòng 1–2 ngày làm việc sau khi TA đã thực hiện lệnh chuyển khoản).',
          'Hoàn tiền một phần: áp dụng đối với Đơn hàng gồm nhiều sản phẩm mà chỉ một phần trong đó gặp lỗi — TA hoàn tiền tương ứng với giá trị sản phẩm bị lỗi, các sản phẩm còn lại không bị ảnh hưởng vẫn được giữ nguyên.',
          'Trường hợp hủy đơn trước khi giao hàng: nếu Quý khách yêu cầu hủy Đơn hàng đã thanh toán nhưng CHƯA được bàn giao cho đơn vị vận chuyển, TA hỗ trợ hoàn tiền toàn bộ trong thời gian tương tự như trên.',
        ],
      },
      {
        heading: '6. Chính sách với sản phẩm combo / set quà tặng',
        body: [
          'Đối với các set quà tặng/combo gồm nhiều sản phẩm thành phần, nếu chỉ một thành phần trong set bị lỗi (theo đúng điều kiện Mục 1), Quý khách có thể yêu cầu đổi/trả riêng thành phần đó mà không cần trả lại toàn bộ set, trừ khi lỗi đó ảnh hưởng tới tính nguyên vẹn thẩm mỹ/giá trị của cả set quà tặng — trong trường hợp đó, TA sẽ trao đổi cụ thể với Quý khách để tìm phương án phù hợp nhất (đổi nguyên set hoặc hoàn tiền một phần tương ứng).',
        ],
      },
      {
        heading: '7. Lưu ý đặc biệt với sản phẩm giá trị cao',
        body: [
          'Với các sản phẩm giá trị cao như củ sâm Ngọc Linh tươi nguyên củ, rượu ngâm nguyên cây — nơi mỗi sản phẩm có hình dáng, trọng lượng tự nhiên khác nhau (không phải hàng sản xuất công nghiệp đồng loạt) — TA khuyến nghị Quý khách trao đổi kỹ với đội ngũ tư vấn (qua Zalo/WhatsApp) TRƯỚC khi đặt hàng về hình dáng, kích cỡ, trọng lượng cụ thể mong muốn, và có thể yêu cầu xem ảnh/video thực tế của sản phẩm dự kiến giao trước khi xác nhận đơn — nhằm hạn chế tối đa rủi ro không hài lòng về đặc điểm tự nhiên sau khi nhận hàng (vốn không thuộc diện lỗi được đổi trả theo Mục 2a).',
          'Đối với đơn hàng giá trị cao, TA khuyến khích Quý khách quay video mở hàng đầy đủ, rõ nét ngay từ khi nhận từ nhân viên giao hàng — đây là yêu cầu gần như bắt buộc trên thực tế để quá trình xử lý khiếu nại (nếu có) được nhanh chóng, chính xác, bảo vệ quyền lợi cho cả hai bên.',
        ],
      },
      {
        heading: '8. Phân biệt "Đổi hàng" và "Trả hàng hoàn tiền"',
        body: [
          '"Đổi hàng" là hình thức Quý khách nhận lại một sản phẩm mới (cùng loại không lỗi, hoặc sản phẩm khác có giá trị tương đương theo thỏa thuận) để thay thế cho sản phẩm bị lỗi, mà không cần hoàn tiền — hình thức này thường được xử lý nhanh hơn vì không cần chờ đối soát ngân hàng.',
          '"Trả hàng hoàn tiền" là hình thức Quý khách trả lại sản phẩm lỗi và nhận lại tiền đã thanh toán, không nhận sản phẩm thay thế — áp dụng khi Quý khách không còn nhu cầu với sản phẩm đó, hoặc TA không còn hàng để đổi.',
          'Quý khách có toàn quyền lựa chọn một trong hai hình thức trên khi yêu cầu đủ điều kiện được xác nhận ở Bước 2 của quy trình (Mục 3), TA không tự ý áp đặt hình thức xử lý mà không hỏi ý kiến Quý khách trước.',
          'Trong trường hợp sản phẩm Quý khách muốn đổi sang tạm thời hết hàng tại thời điểm xử lý, TA sẽ thông báo rõ và đưa ra các lựa chọn thay thế: chờ hàng về (kèm thời gian dự kiến cụ thể), đổi sang sản phẩm khác tương đương, hoặc chuyển sang hình thức hoàn tiền — quyết định cuối cùng luôn thuộc về Quý khách.',
        ],
      },
      {
        heading: '9. Khiếu nại khi chưa hài lòng với kết quả xử lý',
        body: [
          'Trong trường hợp Quý khách không đồng ý với kết quả đánh giá ban đầu của TA về việc đơn yêu cầu đổi/trả có đủ điều kiện hay không, Quý khách có quyền phản hồi lại, cung cấp thêm bằng chứng hoặc lập luận để TA xem xét lại. TA cam kết xem xét lại một cách khách quan, công tâm dựa trên bằng chứng thực tế, không giữ nguyên quan điểm ban đầu một cách cứng nhắc nếu có thông tin mới hợp lý.',
          'Nếu sau khi trao đổi lại vẫn chưa đạt được sự đồng thuận, hai bên có thể tham khảo hướng giải quyết tranh chấp chung được quy định tại Điều Khoản Dịch Vụ của TA (thương lượng, hòa giải, và cuối cùng là cơ quan tài phán có thẩm quyền nếu cần thiết) — tuy nhiên TA luôn ưu tiên và mong muốn giải quyết êm thấm ở cấp độ trao đổi trực tiếp trước khi đi tới bước này.',
          'TA xem mỗi khiếu nại là cơ hội để cải thiện chất lượng sản phẩm và dịch vụ, không phải gánh nặng cần né tránh — mọi phản hồi, kể cả khi Quý khách không hài lòng, đều được ghi nhận nghiêm túc để đội ngũ TA rút kinh nghiệm cho các lô hàng, quy trình đóng gói, hoặc quy trình chăm sóc khách hàng sau này.',
        ],
      },
      {
        heading: '10. Câu hỏi thường gặp',
        body: [
          'Tôi phát hiện lỗi sau khi đã dùng thử một ít thì có được đổi trả không? Nếu lỗi đó là lỗi tiềm ẩn từ sản xuất mà chỉ có thể phát hiện được sau khi bắt đầu sử dụng (ví dụ mùi vị bất thường không giống mô tả ngay từ lần dùng đầu), Quý khách vẫn có thể liên hệ trong vòng 7 ngày kèm bằng chứng — TA sẽ xem xét trên từng trường hợp cụ thể. Việc đã dùng thử với mục đích kiểm tra chất lượng khác với việc đã sử dụng hết/gần hết sản phẩm.',
          'Tôi có thể đổi sang sản phẩm khác thay vì hoàn tiền không? Có — nếu đủ điều kiện đổi/trả theo Mục 1, Quý khách có thể chọn đổi sang sản phẩm khác có giá trị tương đương hoặc chênh lệch (bù thêm/hoàn lại phần chênh lệch), tùy thỏa thuận với TA tại Bước 4 của quy trình.',
          'TA có nhận trả lại sản phẩm chỉ vì không thích mùi/vị dù chất lượng vẫn tốt không? Không — đây thuộc trường hợp "đổi ý cá nhân", không thuộc phạm vi áp dụng của chính sách đổi/trả (xem Mục 2a). TA khuyến khích Quý khách tham khảo kỹ mô tả sản phẩm, hoặc liên hệ tư vấn trước khi đặt hàng nếu còn phân vân.',
          'Tôi mua hộ người khác, ai là người được đứng ra yêu cầu đổi trả? TA làm việc với người đứng tên đặt hàng (thông tin trên Đơn hàng) là đầu mối chính thức. Nếu người nhận quà là người phát hiện lỗi, Quý khách (người đặt hàng) có thể ủy quyền hoặc phối hợp cùng người nhận để cung cấp bằng chứng, miễn là thông tin Đơn hàng được xác minh khớp.',
          'Chi phí đổi trả trong trường hợp lỗi do tôi bảo quản sai thì sao? Trường hợp này không thuộc phạm vi áp dụng đổi/trả miễn phí (Mục 2d) — TA có thể tư vấn hướng khắc phục hoặc đề xuất mua sản phẩm mới theo giá thông thường, tùy tình huống cụ thể.',
          'Tôi gửi yêu cầu đổi trả ngoài giờ hành chính hoặc vào cuối tuần thì có bị tính chậm thời hạn 7 ngày không? Không — thời hạn 7 ngày được tính theo ngày lịch kể từ khi Quý khách nhận hàng, không phụ thuộc vào giờ hành chính khi Quý khách gửi yêu cầu. Tuy nhiên, thời gian TA phản hồi và xử lý (Bước 2 trong quy trình, thường 2 ngày làm việc) được tính theo ngày làm việc — yêu cầu gửi vào cuối tuần/ngày lễ có thể được xử lý bắt đầu từ ngày làm việc kế tiếp.',
        ],
      },
      {
        heading: '11. Liên hệ hỗ trợ',
        body: [
          'Mọi thắc mắc, yêu cầu đổi trả, hoặc khiếu nại liên quan tới chính sách này, vui lòng liên hệ email duyenmoc08@gmail.com hoặc số Zalo/WhatsApp tại chân trang Website để được đội ngũ TA hỗ trợ nhanh chóng, tận tình.',
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
        heading: 'Introduction',
        body: [
          'TA (operating the website tasamngoclinh.com, "TA", "we") understands that personal information is private property of every customer. This Privacy Policy clearly explains: what we collect, why, how we use it, who we share it with, how we protect it, and what rights you have over your own data.',
          'We have written this policy in plain language, avoiding confusing legal jargon, so that any customer — regardless of technical or legal background — can clearly understand their rights when dealing with TA.',
        ],
      },
      {
        heading: '1. Scope and Definitions',
        body: [
          'This policy applies to all personal information TA collects when you browse the website, place an order, register for a business partnership, request a free guide, or contact us through our official channels (website, Zalo, WhatsApp, email, phone).',
          'In this policy: "Website" means tasamngoclinh.com and all its subpages; "You"/"Customer" means any individual accessing the Website or transacting with TA; "Personal Data" means any information that can directly or indirectly identify a specific individual (name, phone number, address, email, etc.); "Data Processing" includes any operation such as collecting, storing, using, sharing, or deleting personal data; "Third Party" refers to partners TA works with to complete a transaction (shipping providers, payment gateway).',
          'By using the Website, placing an order, or voluntarily providing information to TA through any channel, you confirm that you have read, understood, and agree to this entire policy. If you do not agree, please stop providing information and discontinue using TA services that involve personal data collection.',
        ],
      },
      {
        heading: '2. Information We Collect',
        body: [
          'a) Identification and contact information: full name, phone number, email address, delivery address, and (where applicable) Zalo number — collected when you place an order, request our free guide, or fill out a contact/partnership form on the Website.',
          'b) Transaction information: products ordered, quantity, order value, order timestamp, payment status (success/failure), and related order code. This information is necessary for TA to process and track your order.',
          'c) Business partnership information: when you register to become a distributor, investor, or OEM/ODM partner, TA collects the additional information you voluntarily provide in the registration form (company/individual name, area of interest, expected scale — depending on what you fill in).',
          'd) Browser-stored technical data: TA uses browser local storage (localStorage) to remember your current cart and the email used in your most recent order, so you do not need to re-enter this information each time you return to the Website. This data is stored directly on your own device — TA has absolutely no access to it unless you actively resubmit it through a form on the Website (e.g. when placing an order).',
          'e) TA does NOT collect and does NOT store bank card numbers, CVV codes, online banking passwords, or any payment account information in any form. All payment transactions are processed directly and independently by our payment gateway, PayOS (VietQR bank transfer) — TA only receives a general transaction result (success/failure, order code) and never accesses your bank account details.',
        ],
      },
      {
        heading: '3. How We Collect Information',
        body: [
          'TA collects information in two ways: directly and indirectly.',
          'Direct collection: when you voluntarily fill in a form on the Website (order, guide request, partnership registration, contact form), or when you message TA directly via Zalo/WhatsApp/email.',
          'Indirect/automatic collection: some minimal technical information is automatically stored by your own browser on your own device (see 2.d above) to improve your browsing experience — TA does not use complex cross-website advertising tracking tools on the current Website.',
        ],
      },
      {
        heading: '4. How We Use Your Information',
        body: [
          'a) Order processing: confirming, packing, shipping, and supporting you throughout the lifecycle of your order (including returns and refunds if needed).',
          'b) Customer care: answering questions, handling complaints, and providing technical support related to using the Website or a purchased product.',
          'c) Responding to business partnership inquiries: following up with customers who registered as a distributor, investor, or OEM/ODM partner via the "Partner Registration" form.',
          'd) Sending materials you have requested: for example, the "Ngoc Linh Ginseng Authentication Guide" when you leave your email/Zalo via the guide sign-up widget.',
          'e) Promotional communication: TA only sends promotional or offer-related messages via Zalo/email when you have voluntarily left your contact details through a form on the Website and have not opted out. You may request to stop receiving these at any time (see Section 9).',
          'f) Service improvement: TA may analyze order data at an aggregated, anonymized level (e.g. which products sell best seasonally) for business planning purposes — this process does NOT re-link the data to a specific individual\'s identity in internal reporting.',
        ],
      },
      {
        heading: '5. Legal Basis for Processing',
        body: [
          'TA processes your personal data on one or more of the following bases: (i) your consent when you voluntarily provide information through Website forms; (ii) the necessity to perform the sales contract between the two parties (e.g. needing an address to ship your order); (iii) compliance with legal obligations (e.g. retaining accounting/tax records for the period required by law); and (iv) TA\'s legitimate interest in operating, protecting, and improving our services, provided this does not override your own legal rights.',
        ],
      },
      {
        heading: '6. Sharing With Third Parties',
        body: [
          'TA shares information only to the minimum extent necessary, strictly to complete a transaction — no other exceptions apply beyond those listed below:',
          '— With shipping partners: TA provides your name, phone number, and delivery address so the shipping partner can complete delivery. Our shipping partners are responsible for safeguarding this data under their own policies and may only use it for delivery purposes.',
          '— With PayOS (payment gateway): TA sends the technical details required to initiate a VietQR transaction (order code, amount) — PayOS processes the payment independently under its own security standards; TA does not control, and is not responsible for, PayOS\'s internal privacy practices (you may review PayOS\'s own privacy policy if interested).',
          '— With competent state authorities: TA only discloses information upon a lawful written request from a competent authority, following the legal procedure required (e.g. for an investigation or tax audit).',
          'TA commits to NEVER selling, renting, or trading customer data to any third party for their own advertising or marketing purposes. This is a core commitment of TA\'s privacy practice.',
        ],
      },
      {
        heading: '7. Data Security',
        body: [
          'Organizationally: customer information is stored on access-controlled systems — only staff directly responsible for order processing, customer care, or accounting can view and act on data relevant to their role. TA does not allow unrestricted internal access to customer data.',
          'Technically: TA\'s data storage infrastructure runs on reputable cloud service providers and applies industry-standard security measures (encrypted HTTPS connections for data in transit, account-based access control).',
          'Incident response: in the unlikely event of a data breach affecting your personal information, TA commits to notifying you and the relevant authority (where legally required) as soon as reasonably possible, and taking necessary remedial action.',
          'We note that no information technology system can guarantee 100% absolute security against every possible form of cyberattack. TA makes reasonable efforts within our means to protect your data, and we also encourage you to protect your own personal information (e.g. never share your order code or authentication details with strangers) and to notify TA immediately if you notice anything suspicious.',
        ],
      },
      {
        heading: '8. Data Retention',
        body: [
          'Order-related information (name, address, products purchased, transaction value) is retained for as long as necessary to: complete the current transaction; process any subsequent return/warranty request within the policy period; and comply with accounting and tax record-keeping obligations under applicable law (typically several years as set by law, not shortened or extended at TA\'s discretion).',
          'Contact information collected via the guide sign-up or partnership form is retained until you request deletion (Section 9) or until TA determines the information no longer serves its original purpose and there is no other legal basis to continue retaining it.',
          'After the necessary retention period expires, information is deleted or anonymized (identity-removed) from TA\'s active systems.',
        ],
      },
      {
        heading: '9. Your Rights Over Your Personal Data',
        body: [
          'You have the following rights regarding the personal data TA processes about you:',
          '(a) Right to be informed: request that TA disclose what types of information it holds about you.',
          '(b) Right of access: request to view the specific content of the personal data TA holds about you.',
          '(c) Right to rectification: request correction of inaccurate or outdated information (e.g. new address, new phone number).',
          '(d) Right to erasure: request that TA delete your personal data once it is no longer needed for the service, except where retention is legally required (e.g. accounting records within their mandatory retention period).',
          '(e) Right to withdraw consent: withdraw consent to receive promotional/marketing messages at any time, without affecting transactions already completed beforehand.',
          '(f) Right to object: object to TA using your data for a specific purpose if you believe it is unnecessary or inappropriate.',
          'To exercise any of the above rights, please contact us directly at duyenmoc08@gmail.com, clearly stating your specific request. TA will reasonably verify your identity before processing the request (to prevent someone else from impersonating you to view/delete your data), and will respond within a reasonable time, typically within 7 business days of receiving sufficient verification information.',
        ],
      },
      {
        heading: '10. Children\'s Privacy',
        body: [
          'TA\'s services and products are not directed at, and are not designed for, children under the age of 16. TA does not knowingly collect personal information from children under 16. If a parent or guardian discovers that their child has provided personal information to TA without guardian consent, please contact us immediately so we can delete that information from our systems.',
        ],
      },
      {
        heading: '11. Links to Third-Party Websites',
        body: [
          'The Website may contain links to external platforms (e.g. Zalo, WhatsApp, social media, the PayOS payment gateway). When you click these links and leave the TA Website, this policy no longer applies — each external platform has its own privacy policy which you should review before providing them with any information. TA is not responsible for the content or privacy practices of any such third-party website or platform.',
        ],
      },
      {
        heading: '12. Changes to This Policy',
        body: [
          'TA may update this Privacy Policy from time to time to reflect our actual operating practices, business changes, or newly enacted legal requirements. Any changes will be published on this page along with the latest update date shown at the top. We encourage you to review this page periodically, especially before providing new personal information to TA. Your continued use of the Website after an update constitutes acceptance of the updated policy.',
        ],
      },
      {
        heading: '13. Contact',
        body: [
          'For any question, request, or complaint regarding this Privacy Policy or how TA handles your personal information, please contact: Email: duyenmoc08@gmail.com, or the Zalo/WhatsApp number shown in the website footer. TA commits to receiving and responding to every valid request seriously and promptly.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    updated: 'Last updated: Sep 7, 2026',
    sections: [
      {
        heading: 'Introduction',
        body: [
          'These Terms of Service ("Terms") form a legal agreement between you and TA (operating tasamngoclinh.com), setting out the rights and obligations of both parties when you access the Website, purchase products, or register for a business partnership with TA. Please read the entire document carefully before using our services.',
        ],
      },
      {
        heading: '1. Scope and Acceptance',
        body: [
          'These Terms apply to every visit to the Website, every purchase transaction, and every partnership registration (distributor, investor, OEM/ODM) made through tasamngoclinh.com.',
          'By accessing the Website, placing an order, or registering as a partner, you confirm that: (a) you have read, understood, and agree to be bound by these entire Terms; (b) you have sufficient legal capacity under Vietnamese law to enter into transactions (if you are under 18, purchase transactions require the consent and supervision of a parent or legal guardian); and (c) all information you provide to TA is accurate and truthful.',
          'If you do not agree with any part of these Terms, please discontinue use of the Website and do not transact with TA.',
        ],
      },
      {
        heading: '2. Definitions',
        body: [
          '"TA", "we", "the seller": refers to the entity operating tasamngoclinh.com. "Website": tasamngoclinh.com and its subpages. "Product": any goods offered for sale by TA on the Website, including but not limited to fresh/dried Ngoc Linh ginseng, processed products, and related regional specialties. "Order": a purchase request submitted by you through the Website and confirmed by TA. "Content": any text, image, video, design, or logo displayed on the Website.',
        ],
      },
      {
        heading: '3. Business Information',
        body: [
          'TA — Vườn Sâm Ngọc Linh nhà Khánh, a GACP-WHO certified cultivation region in Tra Linh, Nam Tra My, Quang Nam province, Vietnam.',
          'Formal business registration details are currently being finalized and will be published transparently here as soon as they are available. In the meantime, for any question regarding the legal status of the seller, please contact duyenmoc08@gmail.com directly for verified, transparent information.',
        ],
      },
      {
        heading: '4. Conditions of Website Use',
        body: [
          'You agree to use the Website for its intended purpose (learning about products, placing orders, contacting us for partnership) and agree NOT to: (a) interfere with, sabotage, or attempt unauthorized access to the Website\'s technical systems; (b) use automated tools (bots, scripts) to scrape data or place bulk orders for improper purposes; (c) post or send false, offensive, or unlawful information through TA\'s contact channels; (d) copy or reuse the Website\'s Content for another party\'s commercial purposes without TA\'s prior written consent (see also Section 9).',
          'TA reserves the right to refuse service, suspend, or terminate access for any user who violates the above conditions, without prior notice.',
        ],
      },
      {
        heading: '5. Products and Product Descriptions',
        body: [
          'TA makes every reasonable effort to describe products (name, ingredients, use, images, origin) as accurately as possible at the time of publishing. However, due to the natural agricultural/herbal nature of the products (Ngoc Linh ginseng, forest honey, medicinal mushrooms, etc.), images and descriptions are illustrative/reference only — the actual color, size, or shape (particularly for whole fresh ginseng roots) may have minor natural variation from the images shown on the Website; this is an inherent characteristic of natural produce, not a product defect.',
          'TA\'s products are health-supporting food/herbal products, NOT medicine, and do NOT substitute for medical treatment. Any information about benefits on the Website is for reference only, based on traditional herbal properties or publicly available scientific literature — it is not a medical guarantee for any specific individual. Customers with underlying health conditions or undergoing medical treatment should consult a doctor before use.',
        ],
      },
      {
        heading: '6. Pricing and Promotions',
        body: [
          'The price shown on the Website is the listed price at the time you view the product page, kept up to date with reasonable care but subject to change over time without prior notice (e.g. due to agricultural market fluctuations or operating cost changes). The price that officially applies to a given order is the price displayed at the moment you complete checkout — any later price change does not retroactively affect an already-confirmed order.',
          'Seasonal promotions, discounts, or gift-set combos (where offered) are announced by TA with clear terms, duration, and quantity limits (if applicable) directly on the relevant product page or banner. TA reserves the right to change, pause, or end a promotion early if necessary, but commits to still honoring orders successfully confirmed while the promotion was active.',
        ],
      },
      {
        heading: '7. Ordering Process and Confirmation',
        body: [
          'Step 1 — Select products: you choose products and desired quantities and add them to your cart.',
          'Step 2 — Enter delivery information: you provide an accurate full name, phone number, and delivery address.',
          'Step 3 — Payment: you complete payment via PayOS (VietQR) or any other method TA supports at the time.',
          'Step 4 — Confirmation: an order is considered complete and legally binding once you receive an order confirmation from TA (via the Website, email, or Zalo message).',
          'If a product becomes unavailable shortly after you have ordered and paid successfully (due to a timing conflict with another customer, or an inventory sync issue), TA will proactively contact you as soon as possible to agree on a resolution: a full refund, or replacement with an equivalent product with your consent. TA will never substitute a product without your agreement.',
          'You are responsible for providing accurate, complete delivery information. TA is not liable for delayed, lost, or misdelivered orders arising directly from inaccurate information you provided.',
        ],
      },
      {
        heading: '8. Payment',
        body: [
          'TA supports payment via PayOS (VietQR bank transfer) — an independent payment intermediary separate from TA. All transactions are processed by PayOS under their own security procedures; TA does not store and has no access to your bank account/card information in any form (see also our Privacy Policy).',
          'If a technical error occurs during payment (funds deducted but the order was not confirmed), please contact TA immediately with evidence of the transaction (screenshot, transaction code) so we can reconcile and resolve it promptly.',
        ],
      },
      {
        heading: '9. Shipping and Returns',
        body: [
          'Delivery areas, estimated timelines, shipping fees, and packaging procedures are set out in detail in our Shipping Policy. Conditions and procedures for returns and refunds are set out in detail in our Refund & Return Policy (linked in the website footer). Both policies form an integral part of these Terms — every transaction is simultaneously governed by all three documents.',
        ],
      },
      {
        heading: '10. Intellectual Property',
        body: [
          'All Content displayed on the Website — including descriptive text, product images, cultivation-region images, logos, the "TA" brand name, and interface design — is owned or lawfully used under license by TA, and protected under applicable intellectual property law.',
          'You are permitted to view, download, and print Content for personal, non-commercial purposes (e.g. saving product information for your own reference). Any form of copying, modifying, redistributing, or using the Content for the commercial purposes of a third party without TA\'s prior written consent is strictly prohibited and may be subject to legal action.',
        ],
      },
      {
        heading: '11. Warranty and Limitation of Liability',
        body: [
          'TA commits that products sold match their stated origin and provenance at the time of delivery, in accordance with the GACP-WHO standard applicable to our cultivation region. Warranty/return responsibility for manufacturing defects or shipping damage is handled under our Refund & Return Policy.',
          'To the extent permitted by law, TA shall not be liable for: (a) harm resulting from product use inconsistent with instructions, use outside recommended dosage, or use as a substitute for necessary medical treatment without professional advice; (b) indirect, incidental, or consequential damages arising from use or inability to use the Website/products; (c) delay or service interruption caused by a force majeure event (Section 13).',
          'In all cases, TA\'s maximum liability for any claim related to a given order shall not exceed the value of that order.',
        ],
      },
      {
        heading: '12. Indemnification',
        body: [
          'You agree to indemnify and hold TA harmless from any claim, loss, or cost (including reasonable legal fees) that TA incurs as a result of your breach of these Terms, misuse of the Website, or infringement of a third party\'s rights.',
        ],
      },
      {
        heading: '13. Force Majeure',
        body: [
          'TA shall be exempt from liability for delay or failure to perform its obligations under these Terms where the direct cause is a force majeure event reasonably beyond TA\'s control, including but not limited to: natural disaster, epidemic, fire, war, civil unrest, sudden change in government policy, or disruption to shipping/telecommunications/payment infrastructure controlled by a third party. In such cases, TA will notify you as soon as reasonably possible and agree on a reasonable course of action together (delayed delivery, partial or full refund).',
        ],
      },
      {
        heading: '14. Termination and Refusal of Service',
        body: [
          'TA reserves the right to refuse to process, cancel an order for, or refuse service to any customer showing signs of fraud, providing false information, abusing a promotion, or seriously breaching these Terms. Where a paid order is cancelled for a reason attributable to TA or an objective reason (Section 7, Section 13), TA commits to a full refund.',
        ],
      },
      {
        heading: '15. Dispute Resolution',
        body: [
          'Any dispute or complaint related to a transaction or these Terms shall first be resolved through good-faith negotiation and mutual respect between both parties. If no agreement is reached after a reasonable attempt at negotiation, the dispute shall be brought before the competent authority in accordance with the laws of Vietnam.',
        ],
      },
      {
        heading: '16. General Provisions',
        body: [
          'Severability: if any provision of this document is declared invalid or unenforceable by a competent authority, the remaining provisions shall continue in full force and effect.',
          'Entire agreement: these Terms, together with our Privacy Policy, Shipping Policy, and Refund & Return Policy, constitute the entire agreement between you and TA regarding use of the Website and purchases, superseding any prior oral or written agreement on the same subject matter (if any).',
          'Language: these Terms are drafted in Vietnamese as the original version with the highest legal validity; translations into other languages (English, Chinese, French) on the Website are for reference and convenience for international customers only.',
          'Governing law: these Terms are governed by and construed in accordance with the laws of the Socialist Republic of Vietnam.',
        ],
      },
      {
        heading: '17. Contact',
        body: [
          'For any question about these Terms of Service, please contact duyenmoc08@gmail.com or the Zalo/WhatsApp number in the website footer.',
        ],
      },
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    updated: 'Last updated: Sep 7, 2026',
    sections: [
      {
        heading: 'Introduction',
        body: [
          'Ngoc Linh ginseng and related products are high-value herbal/agricultural goods that require careful shipping handling to preserve quality from the cultivation region to the customer. This Shipping Policy explains in detail how TA organizes delivery, packaging, and handles issues that may arise during transit.',
        ],
      },
      {
        heading: '1. Delivery Areas',
        body: [
          'TA ships nationwide across Vietnam. Areas near the cultivation region (Quang Nam province, Da Nang city, Kon Tum province, and nearby areas) are delivered directly by TA\'s own team, helping shorten delivery time and allowing closer quality control over the final leg of the journey.',
          'All other provinces and cities across the country are delivered through TA\'s shipping partners — reputable carriers with nationwide coverage.',
          'Regarding international shipping/export: TA currently does NOT support single-order shipping abroad through the retail channel on the Website. Export or international distribution needs should be directed to our B2B Partnership channel (Distributor/OEM-ODM) for a tailored solution suited to volume and each market\'s customs regulations.',
        ],
      },
      {
        heading: '2. Order Processing Before Shipment',
        body: [
          'After an order is confirmed as paid, TA\'s team performs the following steps: (1) check inventory and confirm product availability; (2) final quality check of the product before packaging; (3) package according to the standard appropriate for each product type (see Section 4); (4) hand over to the direct-delivery team or the partner carrier.',
          'Internal processing time (from order confirmation to the goods leaving our warehouse) is typically within 24 business hours on normal days, and may take longer during peak periods or for products requiring special preparation (e.g. fresh ginseng roots that need careful selection per request).',
        ],
      },
      {
        heading: '3. Estimated Delivery Time',
        body: [
          'Direct-delivery area (Quang Nam, Da Nang, Kon Tum and nearby): typically 1–2 business days from order confirmation.',
          'Partner-delivered area — major cities (Hanoi, Ho Chi Minh City, and other major urban centers): typically 2–4 business days.',
          'Partner-delivered area — other provinces further from the center: typically 3–5 business days.',
          'Remote areas, far-flung regions, islands: may take longer than 5 business days depending on local transport infrastructure conditions.',
          'During peak periods (holidays, Lunar New Year, major industry-wide promotional events), delivery may take longer than usual due to increased shipping volume across the carrier\'s entire network, not specific to TA\'s orders. The timeframes above are estimates under normal operating conditions and do not include force majeure situations such as extreme weather, natural disasters, or transport infrastructure disruption.',
        ],
      },
      {
        heading: '4. Packaging by Product Type',
        body: [
          'Whole fresh ginseng roots: cleaned, moisture-appropriately wrapped, and placed in a rigid, impact-resistant box with protective cushioning to minimize mechanical damage during transit.',
          'Dried ginseng and other dried herbal products (Lim Xanh mushroom, tea, etc.): airtight, moisture-proof packaging placed in a box/bag with cushioning to protect the product\'s shape.',
          'Infused liquor, glass bottle/jar products: this is our most fragile product category, given special attention by TA — dedicated cushioning material (shaped foam, filler paper) surrounds each bottle/jar, placed in a carton clearly marked "Fragile" on the outside.',
          'Processed food products (cookies, collagen, other ready-packaged items): packaged according to the manufacturer\'s original standard, with an additional protective outer layer where needed depending on order size.',
          'Combo/gift-set orders: neatly arranged in a dedicated gift box (for products in our gift line), ensuring visual presentation while still following the same protective principles described above for each individual component.',
        ],
      },
      {
        heading: '5. Shipping Fees',
        body: [
          'Shipping fees are calculated based on: the delivery address (distance from TA\'s warehouse), and the total weight and dimensions of the order. This fee is displayed in full and transparently at checkout, before you confirm your order — no hidden fees are added after an order is confirmed, except where you voluntarily change the delivery address to a higher-fee area after placing the order.',
        ],
      },
      {
        heading: '6. Storage Conditions During Transit',
        body: [
          'TA recommends and coordinates with our shipping partners to avoid prolonged direct sun exposure or excessively high temperatures during transit, especially for fresh ginseng and products requiring stable humidity/temperature. However, for interprovincial legs handled by a third-party carrier, TA cannot guarantee 100% control over storage conditions throughout the entire journey — if you notice anything unusual upon receiving your order due to transit conditions, please follow the guidance in Sections 8 and 9 below.',
        ],
      },
      {
        heading: '7. Order Tracking',
        body: [
          'For orders shipped via a partner carrier, you will receive a tracking code to check delivery status directly through that carrier\'s own system. For directly-delivered orders (near the cultivation region), TA\'s team will contact you by phone or Zalo before delivery to confirm a convenient time, avoiding delivery attempts when no one is available to receive the order.',
        ],
      },
      {
        heading: '8. Inspecting Your Order Upon Arrival (Unboxing)',
        body: [
          'TA strongly encourages you to take the following steps upon receiving your order: (1) inspect the outer condition of the package before signing acceptance with the delivery person — if the package shows signs of being opened, seriously crushed, wet, or torn, note this before accepting; (2) if you suspect an issue, record a continuous unboxing video from the outside in (uncut), as this will be important evidence should you need return support later; (3) check the quantity and type of products received against your order.',
          'Recording an unboxing video is not mandatory but is strongly recommended, especially for high-value or fragile orders, as it provides objective evidence that helps any subsequent claim be processed quickly and fairly for both parties.',
        ],
      },
      {
        heading: '9. Delivery Issues',
        body: [
          'If your order is completely lost, delivered to the wrong address, or found damaged upon opening, please contact TA within 48 hours of discovering the issue (or from the expected delivery time if the order is lost), via email at duyenmoc08@gmail.com or the Zalo/WhatsApp number in the website footer, together with: your order code, a description of the issue, and supporting photos/video (if available). TA commits to receiving, verifying, and assisting you in accordance with our Refund & Return Policy.',
          'Reporting an issue as early as possible helps TA coordinate with the carrier for a faster, more effective resolution — please do not delay in notifying us if you find a problem.',
        ],
      },
      {
        heading: '10. Bulk / Corporate Orders',
        body: [
          'For bulk order needs (corporate gifts, events, distribution partners), TA can arrange dedicated shipping and packaging solutions suited to the order\'s scale. Please contact us via the "Partnership" section or the Zalo/WhatsApp number in the website footer for advice on the optimal shipping method and pricing for large orders.',
        ],
      },
      {
        heading: '11. Frequently Asked Questions',
        body: [
          'Can I change my delivery address after ordering? Yes, if the order has not yet been handed over to the carrier — please contact TA as soon as possible via Zalo/WhatsApp.',
          'What if I am not home when the courier arrives? For direct-delivery orders, TA will contact you beforehand to arrange a suitable time. For partner-delivered orders, the carrier will usually contact you beforehand or attempt redelivery — please stay reachable at the phone number you provided when ordering to coordinate a successful delivery.',
          'Is my order insured during transit? Costs arising from a fault/damage during transit are TA\'s responsibility to resolve under our Refund & Return Policy — you do not need to purchase separate shipping insurance.',
        ],
      },
    ],
  },
  refund: {
    title: 'Refund & Return Policy',
    updated: 'Last updated: Sep 7, 2026',
    sections: [
      {
        heading: 'Introduction',
        body: [
          'TA is committed to delivering Ngoc Linh ginseng and related specialty products with the exact quality and provenance we advertise. This Refund & Return Policy clearly and transparently sets out when you are eligible for a return/exchange, how the process works, and how refunds are issued — so you can shop on our Website with confidence.',
        ],
      },
      {
        heading: '1. Eligibility for Return/Exchange',
        body: [
          'TA accepts returns/exchanges within 7 days of the date you receive your order (as recorded by the carrier\'s tracking system or our own direct-delivery confirmation), ONLY in the following cases:',
          '(a) Manufacturing defect: the product\'s contents/weight/specification does not match the description on the Website; the packaging was defective from the manufacturer (torn, unsealed, missing label) right from the factory; the product is spoiled or abnormally damaged through no external cause after leaving TA.',
          '(b) Shipping damage: the product is broken, dented, deformed, or leaking due to impact or inadequate transit conditions.',
          '(c) Wrong or missing items: TA delivered a different product than what was confirmed in your order, or delivered a lower quantity than ordered.',
          'A product submitted for return/exchange must have its original seal, label, and packaging intact and be unused, EXCEPT where the defect itself (e.g. a packaging fault, an internal defect) makes the product unusable right from the moment it is opened — in that case, simply preserve the product\'s current condition and provide evidence (photo/video) following the process in Section 3.',
        ],
      },
      {
        heading: '2. Cases Not Eligible for Return/Exchange',
        body: [
          'To ensure fairness for both buyer and seller, TA does not accept returns/exchanges in the following cases:',
          '(a) Change of mind after purchase: you no longer want the product even though it has no defect (e.g. bought the wrong variant, personal taste does not suit products like infused liquor or tea — this is a subjective sensory factor, not a product defect).',
          '(b) The product has been unsealed or partially used with no clear manufacturing/shipping defect — e.g. having tasted the infused liquor, or used part of the ginseng without noticing anything abnormal on first use, and only later requesting a return.',
          '(c) The request is submitted more than 7 days after delivery, even if the product genuinely has a defect — you must notify TA within the specified window to be eligible for support.',
          '(d) Damage caused by improper storage AFTER a successful, undamaged delivery — e.g. storing the product somewhere damp, hot, or in direct sunlight contrary to the storage instructions printed on the packaging, causing damage after a period of storage/use at the customer\'s home.',
          '(e) Products in special categories that are not eligible for return once the seal is broken, for hygiene/food-safety reasons (e.g. certain liquid or ready-to-eat items already opened), unless there is a clear manufacturer defect.',
        ],
      },
      {
        heading: '3. Step-by-Step Return/Exchange Process',
        body: [
          'Step 1 — Contact us within the window: submit your request via email at duyenmoc08@gmail.com or Zalo/WhatsApp (details in the website footer) within 7 days of delivery. Your request should include: your order code, a clear description of the issue, and clear photos/video showing the actual condition of the product (and of the package/box if the issue is shipping-related).',
          'Step 2 — Confirmation from TA: our team reviews the information and photos/video provided and responds with an eligibility assessment (eligible/not eligible under Sections 1–2) within 2 business days of receiving the necessary information. If more information/images are needed for an accurate assessment, TA will proactively contact you.',
          'Step 3 — Return instructions (if eligible): TA will guide you on how to package and send the product back to the address we provide. For cases where the fault is attributable to TA (manufacturing defect or shipping damage), TA covers or reimburses the return shipping cost.',
          'Step 4 — Final resolution: once TA receives and confirms the returned product meets the agreed conditions, we proceed according to your choice: a replacement (same product, or an equivalent if out of stock, with your consent), or a refund per Section 4 below.',
        ],
      },
      {
        heading: '4. Costs Incurred During Return/Exchange',
        body: [
          'If the reason for the return/exchange is attributable to TA (manufacturing defect, wrong/missing item, shipping damage): TA covers the full shipping cost for both returning the defective item and sending any replacement — you do not pay any additional fee in these cases.',
          'TA does not charge any processing or inspection fee for return/exchange requests that are valid under this policy.',
        ],
      },
      {
        heading: '5. Refunds',
        body: [
          'Refund method: TA issues refunds via bank transfer to the account you provide — typically the same account used for the original PayOS payment, or another account by specific agreement between both parties for good reason.',
          'Refund timeline: within 5 business days of TA confirming the returned product meets the conditions in Section 1. The actual time for funds to appear in your account may also depend on your own bank\'s processing time (typically 1–2 business days after TA has issued the transfer).',
          'Partial refunds: apply to orders containing multiple products where only part of the order is defective — TA refunds the value corresponding to the defective item(s); the remaining unaffected products are unaffected.',
          'Cancellation before shipment: if you request to cancel a paid order that has NOT yet been handed over to the carrier, TA supports a full refund within the same timeframe as above.',
        ],
      },
      {
        heading: '6. Policy for Combo / Gift Set Products',
        body: [
          'For gift sets/combos consisting of multiple component products, if only one component in the set is defective (per the conditions in Section 1), you may request a return/exchange for that component alone without returning the entire set, unless the defect affects the aesthetic integrity/value of the whole gift set — in that case, TA will discuss with you directly to find the most suitable solution (exchanging the whole set, or a corresponding partial refund).',
        ],
      },
      {
        heading: '7. Frequently Asked Questions',
        body: [
          'I noticed a defect after trying a small amount — can I still return it? If the defect is a latent manufacturing issue only detectable after starting to use the product (e.g. an abnormal taste/smell unlike the description from the very first use), you may still contact us within 7 days with evidence — TA will review this on a case-by-case basis. Trying a small amount to check quality is different from having used most or all of the product.',
          'Can I exchange for a different product instead of getting a refund? Yes — if eligible under Section 1, you may choose to exchange for a different product of equivalent or different value (topping up or receiving the difference), as agreed with TA at Step 4 of the process.',
          'Does TA accept a return simply because I don\'t like the smell/taste, even if the quality is fine? No — this falls under "change of mind" and is not covered by this policy (see Section 2a). We encourage you to review the product description carefully, or contact us for advice before ordering if you are unsure.',
        ],
      },
      {
        heading: '8. Support Contact',
        body: [
          'For any question, return request, or complaint related to this policy, please contact us at duyenmoc08@gmail.com or the Zalo/WhatsApp number in the website footer for prompt, dedicated support from the TA team.',
        ],
      },
    ],
  },
};

export function getPolicyContent(policyKey: PolicyKey, lang: string): PolicyContent {
  return lang === 'vi' ? vi[policyKey] : en[policyKey];
}
