// URL that cho 4 trang chinh sach — dung chung giua App.tsx (dieu huong +
// doc URL luc tai thang) va Footer.tsx (render <a href> that thay vi
// <button>, de Google index rieng tung trang va link chia se hoat dong
// dung khi mo tab moi / copy link).
export const POLICY_PATHS: Record<string, string> = {
  'policy-privacy': '/chinh-sach-bao-mat',
  'policy-terms': '/dieu-khoan-su-dung',
  'policy-shipping': '/chinh-sach-van-chuyen',
  'policy-refund': '/chinh-sach-doi-tra',
};

// Cac trang tinh khac cung dang khong co URL rieng (luon la "/" du dang
// xem trang nao — xem comment ROOT CAUSE trong App.tsx navigate()) — mo
// rong dan tu POLICY_PATHS, KHONG dung vao 'catalog'/'blog'/'blog-post'/
// 'product-detail' (da co route rieng, router do da vo 2 lan, khong dong
// vao). Them page nao vao day chi can 1 dong, App.tsx tu doc/ghi 2 chieu.
export const STATIC_PAGE_PATHS: Record<string, string> = {
  ...POLICY_PATHS,
  'about-story': '/gioi-thieu',
};
