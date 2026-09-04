// Sinh PDF "Cẩm Nang Phân Biệt Sâm Ngọc Linh" ngay trên trình duyệt khi khách
// đăng ký — cùng pattern jsPDF + font Inter (có dấu tiếng Việt) đã dùng ở
// CatalogExportPage.tsx. Nội dung chỉ lấy từ các claim ĐÃ CÓ SẴN và verify
// trên chính site (Heritage.tsx, FounderStory.tsx, BatchTraceabilityLookup.tsx)
// — không bịa số liệu, không bịa chuyên gia/trích dẫn.

const BRAND = {
  forest900: '#0B2F1D',
  gold400: '#D4AF37',
  cream50: '#fefdfb',
};

let interFontsPromise: Promise<{ regular: string; bold: string } | null> | null = null;

function loadInterFonts(): Promise<{ regular: string; bold: string } | null> {
  if (!interFontsPromise) {
    interFontsPromise = (async () => {
      try {
        const toBase64 = async (url: string) => {
          const res = await fetch(url);
          if (!res.ok) return null;
          const buf = await res.arrayBuffer();
          let binary = '';
          const bytes = new Uint8Array(buf);
          for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
          return btoa(binary);
        };
        const [regular, bold] = await Promise.all([
          toBase64('/fonts/Inter-Regular.ttf'),
          toBase64('/fonts/Inter-Bold.ttf'),
        ]);
        if (!regular || !bold) return null;
        return { regular, bold };
      } catch {
        return null;
      }
    })();
  }
  return interFontsPromise;
}

export async function generateCamNangPdf(): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  let y = 0;

  const fonts = await loadInterFonts();
  const font = fonts ? 'Inter' : 'helvetica';
  if (fonts) {
    doc.addFileToVFS('Inter-Regular.ttf', fonts.regular);
    doc.addFont('Inter-Regular.ttf', 'Inter', 'normal');
    doc.addFileToVFS('Inter-Bold.ttf', fonts.bold);
    doc.addFont('Inter-Bold.ttf', 'Inter', 'bold');
  }

  // ---- Cover ----
  doc.setFillColor(BRAND.forest900);
  doc.rect(0, 0, pageWidth, 90, 'F');
  doc.setTextColor(BRAND.gold400);
  doc.setFont(font, 'bold');
  doc.setFontSize(11);
  doc.text('TA — SÂM NGỌC LINH', margin, 30);
  doc.setTextColor('#ffffff');
  doc.setFontSize(24);
  doc.text('Cẩm Nang Phân Biệt', margin, 50);
  doc.text('Sâm Ngọc Linh Thật', margin, 62);
  doc.setFont(font, 'normal');
  doc.setFontSize(11);
  doc.setTextColor(BRAND.gold400);
  doc.text('Nhận diện đúng — mua đúng — dùng đúng.', margin, 76);

  y = 105;
  doc.setTextColor(BRAND.forest900);

  const h2 = (text: string) => {
    doc.setFont(font, 'bold');
    doc.setFontSize(14);
    doc.setTextColor(BRAND.forest900);
    doc.text(text, margin, y);
    doc.setDrawColor(BRAND.gold400);
    doc.setLineWidth(0.8);
    doc.line(margin, y + 2, margin + 30, y + 2);
    y += 9;
  };

  const body = (text: string) => {
    doc.setFont(font, 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor('#333333');
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 5.2 + 5;
  };

  // ---- 1. Nguồn gốc — dữ liệu thật lấy từ FounderStory.tsx ----
  h2('1. Nguồn gốc — vùng trồng thật');
  body(
    'Sâm Ngọc Linh TA được trồng tại xã Trà Linh, huyện Nam Trà My, tỉnh Quảng Nam — ' +
    'dưới tán rừng già ở độ cao trên 1.800m, một trong những vùng lõi bản địa của cây Sâm Ngọc Linh ' +
    '(Panax vietnamensis) tại Việt Nam. Sâm mọc hoang dã hoặc trồng dưới tán rừng tự nhiên khác hẳn ' +
    'sâm trồng công nghiệp ở vùng đất thấp, khí hậu không phù hợp — nơi cây khó tích lũy đủ hoạt chất đặc trưng.'
  );

  // ---- 2. Chỉ dấu khoa học MR2 — bảng so sánh thật lấy từ Heritage.tsx ----
  h2('2. Chỉ dấu khoa học: Majonoside-R2 (MR2)');
  body(
    'Majonoside-R2 (MR2) là saponin khung ocotillol đặc hữu, được dùng làm chỉ dấu định danh ' +
    'Sâm Ngọc Linh trong Dược điển Việt Nam IV. Đây là hoạt chất giúp phân biệt khoa học Sâm Ngọc Linh ' +
    'với các loại sâm khác cùng chi Panax:'
  );

  const rows: [string, string, string][] = [
    ['Sâm Ngọc Linh (Panax vietnamensis)', 'Có MR2', '~50% tổng saponin'],
    ['Sâm Hàn Quốc (Panax ginseng)', 'Không có MR2', '—'],
    ['Sâm Hoa Kỳ (Panax quinquefolium)', 'Không có MR2', '—'],
    ['Tam Thất (Panax notoginseng)', 'Không có MR2', '—'],
  ];
  doc.setFont(font, 'bold');
  doc.setFontSize(9.5);
  doc.setFillColor('#f4f0e6');
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  doc.text('Loài', margin + 2, y + 5);
  doc.text('MR2', margin + 95, y + 5);
  doc.text('Tỷ trọng', margin + 135, y + 5);
  y += 7;
  doc.setFont(font, 'normal');
  rows.forEach(([name, has, note], i) => {
    if (i % 2 === 1) { doc.setFillColor('#fafafa'); doc.rect(margin, y, pageWidth - margin * 2, 7, 'F'); }
    doc.setTextColor('#333333');
    doc.text(name, margin + 2, y + 5);
    doc.setTextColor(has === 'Có MR2' ? BRAND.forest900 : '#999999');
    doc.text(has, margin + 95, y + 5);
    doc.text(note, margin + 135, y + 5);
    y += 7;
  });
  y += 8;
  doc.setTextColor('#333333');

  // ---- 3. Chứng nhận & truy xuất — dữ liệu thật lấy từ BatchTraceabilityLookup/About ----
  h2('3. Chứng nhận & truy xuất nguồn gốc');
  body(
    'Sản phẩm TA đạt chứng nhận GACP-WHO (thực hành trồng trọt và thu hái tốt theo tiêu chuẩn ' +
    'Tổ chức Y tế Thế giới). Mỗi lô sản phẩm có mã truy xuất riêng — khách hàng tra cứu trực tiếp ' +
    'tại mục "Truy Xuất" trên website tasamngoclinh.com để xem thông tin lô hàng, không cần tin theo lời quảng cáo.'
  );

  // ---- 4. Dấu hiệu cảnh giác ----
  h2('4. Dấu hiệu cần cảnh giác khi mua sâm');
  body(
    '• Giá rẻ bất thường so với mặt bằng chung của Sâm Ngọc Linh thật (chi phí trồng dưới tán rừng ' +
    'tự nhiên, thời gian sinh trưởng nhiều năm khiến giá thành cao, không thể rẻ đột biến).\n' +
    '• Người bán không cung cấp được mã lô/thông tin truy xuất nguồn gốc rõ ràng khi được hỏi.\n' +
    '• Không ghi rõ vùng trồng cụ thể (chỉ nói chung chung "sâm núi", "sâm rừng" mà không có địa chỉ, ' +
    'toạ độ, hoặc chứng nhận kiểm định xác thực).\n' +
    '• Quảng cáo công dụng như thuốc chữa bệnh, cam kết khỏi bệnh — sản phẩm từ thảo dược không phải ' +
    'là thuốc và không thay thế thuốc chữa bệnh.'
  );

  // ---- CTA ----
  y += 4;
  doc.setFillColor(BRAND.forest900);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 26, 3, 3, 'F');
  doc.setTextColor(BRAND.gold400);
  doc.setFont(font, 'bold');
  doc.setFontSize(11);
  doc.text('Cần tư vấn thêm? Nhắn Zalo đội ngũ TA:', margin + 6, y + 11);
  doc.setTextColor('#ffffff');
  doc.setFont(font, 'normal');
  doc.setFontSize(10);
  doc.text('zalo.me/0984999309  ·  tasamngoclinh.com', margin + 6, y + 19);

  doc.save('cam-nang-phan-biet-sam-ngoc-linh-TA.pdf');
}
