// Nội dung Chính sách/Điều khoản thật cho 4 trang pháp lý (Sub-project B).
// Chỉ có bản Việt (đầy đủ) và Anh (đầy đủ) — zh/fr/ar dùng tạm bản Anh vì đây
// là nội dung pháp lý cần độ chính xác cao, không nên dịch máy không kiểm chứng.
// Sự thật nghiệp vụ dùng trong nội dung (đã xác nhận với Joe ngày 2026-08-07):
//   - Đổi/trả: 7 ngày kể từ ngày nhận hàng, chỉ khi lỗi sản xuất/vận chuyển.
//   - Vận chuyển: tự giao khu vực gần vùng trồng, đối tác vận chuyển cho tỉnh/thành khác.
//   - Thông tin đăng ký kinh doanh (MST/GPKD): CHƯA CÓ — để placeholder rõ ràng,
//     KHÔNG bịa số. Cần Joe cập nhật khi có giấy phép chính thức.

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
    updated: 'Cập nhật lần cuối: 07/08/2026',
    sections: [
      {
        heading: '1. Thông tin chúng tôi thu thập',
        body: [
          'Khi đặt hàng hoặc liên hệ, TA thu thập: họ tên, số điện thoại, địa chỉ giao hàng, email. Chúng tôi KHÔNG thu thập hoặc lưu trữ số thẻ ngân hàng hay thông tin tài khoản thanh toán — toàn bộ giao dịch được xử lý trực tiếp qua cổng thanh toán PayOS (VietQR), TA chỉ nhận thông báo kết quả giao dịch (thành công/thất bại).',
        ],
      },
      {
        heading: '2. Mục đích sử dụng thông tin',
        body: [
          'Xử lý và giao đơn hàng, liên hệ xác nhận đơn/hỗ trợ đổi trả, chăm sóc khách hàng. Chúng tôi chỉ gửi thông tin khuyến mãi qua Zalo/email nếu khách hàng đồng ý nhận.',
        ],
      },
      {
        heading: '3. Chia sẻ thông tin với bên thứ ba',
        body: [
          'TA chỉ chia sẻ thông tin cần thiết (tên, SĐT, địa chỉ) với đơn vị vận chuyển để giao hàng, và với PayOS để xử lý thanh toán. TA không bán, cho thuê, hay chia sẻ dữ liệu khách hàng cho bên thứ ba vì mục đích quảng cáo.',
        ],
      },
      {
        heading: '4. Bảo mật dữ liệu',
        body: [
          'Thông tin khách hàng được lưu trữ có kiểm soát truy cập, chỉ nhân sự phụ trách xử lý đơn hàng mới được xem.',
        ],
      },
      {
        heading: '5. Quyền của khách hàng',
        body: [
          'Khách hàng có quyền yêu cầu xem, chỉnh sửa, hoặc xoá thông tin cá nhân đã cung cấp bằng cách liên hệ khanh@tasamngoclinh.com.',
        ],
      },
      {
        heading: '6. Thay đổi chính sách',
        body: [
          'Chính sách này có thể được cập nhật để phản ánh đúng thực tế vận hành. Ngày cập nhật gần nhất luôn hiển thị ở đầu trang.',
        ],
      },
    ],
  },
  terms: {
    title: 'Điều Khoản Dịch Vụ',
    updated: 'Cập nhật lần cuối: 07/08/2026',
    sections: [
      {
        heading: '1. Phạm vi áp dụng',
        body: [
          'Điều khoản này áp dụng cho mọi giao dịch mua hàng trên tasamngoclinh.com ("TA"). Khi đặt hàng, khách hàng đồng ý với các điều khoản dưới đây.',
        ],
      },
      {
        heading: '2. Thông tin đơn vị vận hành',
        body: [
          'TA — Vườn Sâm Ngọc Linh nhà Khánh, vùng trồng chuẩn GACP-WHO tại Trà Linh, Nam Trà My, Quảng Nam.',
          'Thông tin đăng ký hộ kinh doanh/giấy phép kinh doanh chính thức: đang cập nhật, sẽ bổ sung tại đây khi hoàn tất thủ tục đăng ký. Mọi thắc mắc pháp lý xin liên hệ trực tiếp khanh@tasamngoclinh.com trong thời gian chờ cập nhật.',
        ],
      },
      {
        heading: '3. Đặt hàng',
        body: [
          'Đơn hàng được xác nhận sau khi khách hàng hoàn tất bước thanh toán hoặc xác nhận đặt hàng (COD nếu có hỗ trợ). Giá sản phẩm hiển thị tại thời điểm đặt hàng là giá áp dụng cho đơn hàng đó.',
        ],
      },
      {
        heading: '4. Thanh toán',
        body: [
          'TA hỗ trợ thanh toán qua PayOS (chuyển khoản VietQR). Giao dịch được xử lý bởi PayOS, TA không lưu trữ thông tin tài khoản/thẻ ngân hàng của khách hàng.',
        ],
      },
      {
        heading: '5. Vận chuyển & Đổi trả',
        body: [
          'Xem chi tiết tại Chính Sách Vận Chuyển và Chính Sách Đổi Trả & Hoàn Tiền (liên kết ở cuối trang).',
        ],
      },
      {
        heading: '6. Sở hữu trí tuệ',
        body: [
          'Toàn bộ nội dung, hình ảnh, thương hiệu TA trên website thuộc quyền sở hữu của TA. Không sao chép, sử dụng lại cho mục đích thương mại khi chưa được đồng ý.',
        ],
      },
      {
        heading: '7. Giới hạn trách nhiệm',
        body: [
          'TA nỗ lực đảm bảo thông tin sản phẩm chính xác nhưng không chịu trách nhiệm với thiệt hại phát sinh từ việc sử dụng sản phẩm sai hướng dẫn hoặc sai mục đích.',
        ],
      },
      {
        heading: '8. Luật áp dụng',
        body: [
          'Điều khoản này tuân theo pháp luật Việt Nam, bao gồm Luật Bảo vệ quyền lợi người tiêu dùng và các quy định thương mại điện tử hiện hành.',
        ],
      },
    ],
  },
  shipping: {
    title: 'Chính Sách Vận Chuyển',
    updated: 'Cập nhật lần cuối: 07/08/2026',
    sections: [
      {
        heading: '1. Khu vực giao hàng',
        body: [
          'TA giao hàng toàn quốc. Khu vực gần vùng trồng (Quảng Nam, Đà Nẵng, Kon Tum và lân cận) do TA tự giao; các tỉnh/thành khác giao qua đối tác vận chuyển.',
        ],
      },
      {
        heading: '2. Thời gian giao hàng dự kiến',
        body: [
          'Khu vực tự giao: thường 1–2 ngày làm việc. Khu vực qua đối tác vận chuyển: 2–5 ngày làm việc tuỳ khoảng cách, có thể lâu hơn với vùng sâu/vùng xa hoặc thời điểm cao điểm lễ Tết.',
        ],
      },
      {
        heading: '3. Phí vận chuyển',
        body: [
          'Phí vận chuyển được tính cụ thể theo địa chỉ và hiển thị đầy đủ ở bước thanh toán trước khi khách hàng xác nhận đặt hàng.',
        ],
      },
      {
        heading: '4. Theo dõi đơn hàng',
        body: [
          'Đơn qua đối tác vận chuyển sẽ được cung cấp mã vận đơn để tra cứu. Đơn tự giao, khách hàng được liên hệ trực tiếp qua điện thoại/Zalo trước khi giao.',
        ],
      },
      {
        heading: '5. Sự cố khi giao hàng',
        body: [
          'Nếu hàng bị thất lạc hoặc hư hỏng trong quá trình vận chuyển, khách hàng vui lòng liên hệ khanh@tasamngoclinh.com hoặc số Zalo/WhatsApp ở cuối trang trong vòng 48 giờ kể từ khi phát hiện để được hỗ trợ theo Chính Sách Đổi Trả & Hoàn Tiền.',
        ],
      },
    ],
  },
  refund: {
    title: 'Chính Sách Đổi Trả & Hoàn Tiền',
    updated: 'Cập nhật lần cuối: 07/08/2026',
    sections: [
      {
        heading: '1. Điều kiện áp dụng',
        body: [
          'TA nhận đổi/trả trong vòng 7 ngày kể từ ngày khách hàng nhận hàng, CHỈ áp dụng khi sản phẩm bị lỗi do sản xuất hoặc hư hỏng do quá trình vận chuyển. Sản phẩm còn nguyên tem, bao bì, chưa qua sử dụng.',
        ],
      },
      {
        heading: '2. Trường hợp không áp dụng',
        body: [
          'TA không nhận đổi/trả với lý do đổi ý sau khi mua, sản phẩm đã bóc tem/sử dụng (trừ trường hợp lỗi rõ ràng), hoặc yêu cầu gửi sau 7 ngày kể từ ngày nhận hàng.',
        ],
      },
      {
        heading: '3. Quy trình yêu cầu đổi trả',
        body: [
          'Liên hệ khanh@tasamngoclinh.com hoặc Zalo/WhatsApp (thông tin ở cuối trang) trong vòng 7 ngày, kèm ảnh/video mở hàng làm bằng chứng. TA xác nhận tình trạng lỗi trong vòng 2 ngày làm việc và hướng dẫn gửi trả/đổi sản phẩm.',
        ],
      },
      {
        heading: '4. Hoàn tiền',
        body: [
          'Sau khi TA nhận và xác nhận hàng trả lại đạt điều kiện, tiền được hoàn trong vòng 5 ngày làm việc, chuyển khoản về tài khoản khách hàng đã dùng thanh toán (hoặc theo thoả thuận với khách hàng).',
        ],
      },
    ],
  },
};

const en: Record<PolicyKey, PolicyContent> = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: Aug 7, 2026',
    sections: [
      {
        heading: '1. Information We Collect',
        body: [
          'When you place an order or contact us, TA collects: full name, phone number, delivery address, and email. We do NOT collect or store bank card or account details — all payments are processed directly by our payment provider PayOS (VietQR); TA only receives a success/failure result.',
        ],
      },
      {
        heading: '2. How We Use Your Information',
        body: [
          'To process and deliver orders, confirm orders, and provide customer support. We only send promotional messages via Zalo/email if you have opted in.',
        ],
      },
      {
        heading: '3. Sharing With Third Parties',
        body: [
          'TA shares only the necessary details (name, phone, address) with our shipping partners for delivery, and with PayOS for payment processing. We do not sell, rent, or share customer data with third parties for advertising purposes.',
        ],
      },
      {
        heading: '4. Data Security',
        body: [
          'Customer information is stored with access limited to staff who directly handle order processing.',
        ],
      },
      {
        heading: '5. Your Rights',
        body: [
          'You may request to view, correct, or delete your personal information by contacting khanh@tasamngoclinh.com.',
        ],
      },
      {
        heading: '6. Changes to This Policy',
        body: [
          'This policy may be updated to reflect actual practice. The latest update date is always shown at the top of this page.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    updated: 'Last updated: Aug 7, 2026',
    sections: [
      {
        heading: '1. Scope',
        body: [
          'These terms apply to all purchases made on tasamngoclinh.com ("TA"). By placing an order, you agree to the terms below.',
        ],
      },
      {
        heading: '2. Business Information',
        body: [
          'TA — Vườn Sâm Ngọc Linh nhà Khánh, GACP-WHO certified cultivation region in Tra Linh, Nam Tra My, Quang Nam, Vietnam.',
          'Formal business registration details are being finalized and will be added here once complete. For any legal inquiries in the meantime, please contact khanh@tasamngoclinh.com directly.',
        ],
      },
      {
        heading: '3. Orders',
        body: [
          'An order is confirmed once payment is completed or the order is confirmed (COD where supported). The price shown at the time of order applies to that order.',
        ],
      },
      {
        heading: '4. Payment',
        body: [
          'TA supports payment via PayOS (VietQR bank transfer). Transactions are processed by PayOS; TA does not store customer bank account or card details.',
        ],
      },
      {
        heading: '5. Shipping & Returns',
        body: [
          'See our Shipping Policy and Refund & Return Policy (linked in the footer) for details.',
        ],
      },
      {
        heading: '6. Intellectual Property',
        body: [
          'All content, images, and the TA brand on this website are owned by TA. Reuse for commercial purposes requires prior written consent.',
        ],
      },
      {
        heading: '7. Limitation of Liability',
        body: [
          'TA strives to keep product information accurate but is not liable for damages resulting from product use inconsistent with the provided instructions or intended purpose.',
        ],
      },
      {
        heading: '8. Governing Law',
        body: [
          'These terms are governed by the laws of Vietnam, including consumer protection and e-commerce regulations in force.',
        ],
      },
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    updated: 'Last updated: Aug 7, 2026',
    sections: [
      {
        heading: '1. Delivery Areas',
        body: [
          'TA ships nationwide. Areas near the cultivation region (Quang Nam, Da Nang, Kon Tum and nearby) are delivered directly by TA; other provinces/cities are delivered via shipping partners.',
        ],
      },
      {
        heading: '2. Estimated Delivery Time',
        body: [
          'Direct-delivery areas: usually 1–2 business days. Partner-delivered areas: 2–5 business days depending on distance, longer for remote areas or during holiday peak periods.',
        ],
      },
      {
        heading: '3. Shipping Fees',
        body: [
          'Shipping fees are calculated based on the delivery address and shown in full at checkout before order confirmation.',
        ],
      },
      {
        heading: '4. Order Tracking',
        body: [
          'Orders sent via a shipping partner include a tracking code. For directly-delivered orders, customers are contacted by phone/Zalo before delivery.',
        ],
      },
      {
        heading: '5. Delivery Issues',
        body: [
          'If your order is lost or damaged in transit, please contact khanh@tasamngoclinh.com or the Zalo/WhatsApp number in the footer within 48 hours of discovery, per our Refund & Return Policy.',
        ],
      },
    ],
  },
  refund: {
    title: 'Refund & Return Policy',
    updated: 'Last updated: Aug 7, 2026',
    sections: [
      {
        heading: '1. Eligibility',
        body: [
          'TA accepts returns/exchanges within 7 days of delivery, ONLY for manufacturing defects or damage caused during shipping. The product must be unused with seal and packaging intact.',
        ],
      },
      {
        heading: '2. Not Eligible',
        body: [
          'We do not accept returns for change of mind, products with a broken seal/already used (except in cases of a clear defect), or requests made after 7 days from delivery.',
        ],
      },
      {
        heading: '3. Return Process',
        body: [
          'Contact khanh@tasamngoclinh.com or Zalo/WhatsApp (footer) within 7 days with photos/video of the unboxing as evidence. TA will confirm the defect within 2 business days and provide return/exchange instructions.',
        ],
      },
      {
        heading: '4. Refunds',
        body: [
          'Once TA receives and confirms the returned item meets the conditions above, refunds are issued within 5 business days to the account used for payment (or as otherwise agreed with the customer).',
        ],
      },
    ],
  },
};

export function getPolicyContent(policyKey: PolicyKey, lang: string): PolicyContent {
  return lang === 'vi' ? vi[policyKey] : en[policyKey];
}
