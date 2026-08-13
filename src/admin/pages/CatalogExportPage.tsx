import { useMemo, useState } from 'react';
import { FileSpreadsheet, FileDown, Search, CheckSquare, Square, Loader } from 'lucide-react';
import { products } from '../../data/products';
import { getProductTypeMeta } from '../../data/productTypes';
import { vkdProducts } from '../../data/vkdProducts';
import { trimicoProducts } from '../../data/trimicoProducts';
import { Button } from '../../components/ui/button';

const CONTACT_PHONE = '0984 999 309';
const ZALO_URL = 'https://zalo.me/0984999309';
const LOGO_URL = '/assets/images/TA_logo_clean.png';

// Bảng màu brand TA (đồng bộ tailwind.config.js) — hex thật vì jsPDF không đọc class Tailwind.
const BRAND = {
  forest900: '#0B2F1D',
  gold400: '#D4AF37',
  cream50: '#fefdfb',
  cream200: '#f4f0e6',
};

const VND_PER_USD = 25000;

function money(v: number | null, pdfLang: 'vi' | 'en' = 'vi') {
  if (pdfLang === 'en') {
    if (v === null) return 'Contact us';
    return `$${(Math.round((v / VND_PER_USD) * 100) / 100).toFixed(2)}`;
  }
  if (v === null) return 'Liên hệ';
  return v.toLocaleString('vi-VN') + ' đ';
}

let interFontsPromise: Promise<{ regular: string; bold: string } | null> | null = null;

// jsPDF font "helvetica" mac dinh khong co dau tieng Viet — nap Inter (co du dau)
// vao VFS cua jsPDF mot lan, dung chung cho moi lan xuat PDF.
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

async function loadImageAsDataUrl(url: string): Promise<{ dataUrl: string; width: number; height: number } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    const dims: { width: number; height: number } = await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ width: 1, height: 1 });
      img.src = dataUrl;
    });
    return { dataUrl, ...dims };
  } catch {
    return null;
  }
}

export default function CatalogExportPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(() => new Set(products.map((p) => p.sku)));
  const [pdfLang, setPdfLang] = useState<'vi' | 'en'>('vi');
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }, [search]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggle = (sku: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(sku)) next.delete(sku);
      else next.add(sku);
      return next;
    });
  };

  const selectAllFiltered = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      filtered.forEach((p) => next.add(p.sku));
      return next;
    });
  };

  const clearAllFiltered = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      filtered.forEach((p) => next.delete(p.sku));
      return next;
    });
  };

  const exportExcel = async () => {
    setExportingExcel(true);
    try {
      const ExcelJS = (await import('exceljs')).default;
      const { saveAs } = await import('file-saver');
      const wb = new ExcelJS.Workbook();
      wb.creator = 'TA — Control Portal';
      wb.created = new Date();

      const headerRow = ['SKU', 'Tên', 'Dạng Sản Phẩm', 'Giá (VND)', 'Ghi chú'];
      const styleHeader = (ws: import('exceljs').Worksheet) => {
        const row = ws.getRow(1);
        row.font = { bold: true, color: { argb: 'FFFEFDFB' } };
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0B2F1D' } };
        ws.columns = [{ width: 14 }, { width: 46 }, { width: 26 }, { width: 16 }, { width: 40 }];
      };

      const wsVkd = wb.addWorksheet('VKD');
      wsVkd.addRow(headerRow);
      styleHeader(wsVkd);
      vkdProducts.forEach((p) => {
        wsVkd.addRow([p.sku, p.name, p.category, p.price, p.warnings ?? '']);
      });

      const wsTrimico = wb.addWorksheet('Trimico');
      wsTrimico.addRow(headerRow);
      styleHeader(wsTrimico);
      trimicoProducts.forEach((p) => {
        wsTrimico.addRow([p.sku, p.name, p.category, p.price ?? 'Liên hệ', p.displayOnly18Plus ? 'Chỉ trưng bày — chờ cấp phép Bộ Công Thương (18+)' : '']);
      });

      const wsAll = wb.addWorksheet('Tổng Hợp');
      wsAll.addRow(headerRow);
      styleHeader(wsAll);
      products.forEach((p) => {
        wsAll.addRow([p.sku, p.name, getProductTypeMeta(p.productType).labelVi, p.price ?? 'Liên hệ', p.badge ?? '']);
      });

      const buf = await wb.xlsx.writeBuffer();
      const stamp = new Date().toISOString().slice(0, 10);
      saveAs(new Blob([buf]), `TA-bang-gia-si-${stamp}.xlsx`);
      showToast(`Đã xuất Excel — ${products.length} SKU tổng hợp, ${vkdProducts.length} VKD, ${trimicoProducts.length} Trimico.`);
    } catch (e) {
      showToast(`Lỗi xuất Excel: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setExportingExcel(false);
    }
  };

  const exportPdf = async () => {
    const chosen = products.filter((p) => selected.has(p.sku));
    if (chosen.length === 0) {
      showToast('Chưa chọn sản phẩm nào để đưa vào catalog.');
      return;
    }
    setExportingPdf(true);
    try {
      const { jsPDF } = await import('jspdf');
      const QRCode = (await import('qrcode')).default;
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 14;

      const interFonts = await loadInterFonts();
      const fontName = interFonts ? 'Inter' : 'helvetica';
      if (interFonts) {
        doc.addFileToVFS('Inter-Regular.ttf', interFonts.regular);
        doc.addFont('Inter-Regular.ttf', 'Inter', 'normal');
        doc.addFileToVFS('Inter-Bold.ttf', interFonts.bold);
        doc.addFont('Inter-Bold.ttf', 'Inter', 'bold');
      }

      const logo = await loadImageAsDataUrl(LOGO_URL);
      const qrDataUrl = await QRCode.toDataURL(ZALO_URL, {
        margin: 0,
        color: { dark: '#0B2F1D', light: '#00000000' },
      });
      const goldDark = '#a07d24';

      const L = pdfLang === 'en'
        ? {
            headerTitle: 'TA — Product Catalog',
            coverKicker: 'PANAX VIETNAMENSIS · NGOC LINH GINSEING',
            coverTitle: 'TA Ginseng Catalogue',
            coverSubtitle: 'Wholesale Product Catalog',
            saponinCount: '52+',
            saponinLabel: 'TYPES OF SAPONIN',
            saponinDesc: 'Ngoc Linh Ginseng contains the richest saponin profile among all ginseng species worldwide.',
            qrLabel: 'Scan to chat on Zalo',
            footerContact: `Wholesale inquiries: ${CONTACT_PHONE} (Zalo)`,
            ingLabel: 'Ingredients',
            pageOf: (n: number, total: number) => `${n} / ${total}`,
          }
        : {
            headerTitle: 'TA — Catalog Sản Phẩm',
            coverKicker: 'PANAX VIETNAMENSIS · SÂM NGỌC LINH',
            coverTitle: 'TA Catalogue Sản Phẩm',
            coverSubtitle: 'Bảng Catalog Dành Cho Khách Sỉ',
            saponinCount: '52+',
            saponinLabel: 'LOẠI SAPONIN',
            saponinDesc: 'Sâm Ngọc Linh chứa hàm lượng saponin cao nhất trong tất cả các loài sâm trên thế giới.',
            qrLabel: 'Quét mã kết bạn Zalo',
            footerContact: `Liên hệ tư vấn / đặt hàng sỉ: ${CONTACT_PHONE} (Zalo)`,
            ingLabel: 'Thành phần',
            pageOf: (n: number, total: number) => `${n} / ${total}`,
          };

      // ---------- Trang bìa ----------
      doc.setFillColor(BRAND.forest900);
      doc.rect(0, 0, pageW, pageH, 'F');
      // dải gold mỏng viền trong tạo cảm giác cao cấp
      doc.setDrawColor(BRAND.gold400);
      doc.setLineWidth(0.4);
      doc.rect(6, 6, pageW - 12, pageH - 12);

      if (logo) {
        const h = 26;
        const w = (logo.width / logo.height) * h;
        doc.addImage(logo.dataUrl, 'PNG', (pageW - w) / 2, 26, w, h);
      }

      doc.setTextColor(BRAND.gold400);
      doc.setFont(fontName, 'bold');
      doc.setFontSize(9);
      doc.text(L.coverKicker, pageW / 2, 62, { align: 'center' });

      doc.setTextColor(BRAND.cream50);
      doc.setFont(fontName, 'bold');
      doc.setFontSize(30);
      doc.text(L.coverTitle, pageW / 2, 78, { align: 'center' });

      doc.setTextColor(BRAND.gold400);
      doc.setFont(fontName, 'normal');
      doc.setFontSize(13);
      doc.text(L.coverSubtitle, pageW / 2, 88, { align: 'center' });

      // Khối thống kê saponin
      const statY = 118;
      doc.setTextColor(BRAND.gold400);
      doc.setFont(fontName, 'bold');
      doc.setFontSize(46);
      doc.text(L.saponinCount, pageW / 2, statY, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont(fontName, 'bold');
      doc.text(L.saponinLabel, pageW / 2, statY + 8, { align: 'center' });
      doc.setTextColor('#cfd9d1');
      doc.setFont(fontName, 'normal');
      doc.setFontSize(9.5);
      const descLines = doc.splitTextToSize(L.saponinDesc, 130);
      doc.text(descLines, pageW / 2, statY + 17, { align: 'center' });

      // QR + liên hệ, đáy trang bìa
      const qrSize = 26;
      const qrX = (pageW - qrSize) / 2;
      const qrY = pageH - 62;
      doc.setFillColor(BRAND.cream50);
      doc.roundedRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8, 2, 2, 'F');
      doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
      doc.setTextColor(BRAND.cream50);
      doc.setFont(fontName, 'normal');
      doc.setFontSize(9);
      doc.text(L.qrLabel, pageW / 2, qrY + qrSize + 8, { align: 'center' });
      doc.setTextColor(BRAND.gold400);
      doc.setFont(fontName, 'bold');
      doc.text(CONTACT_PHONE, pageW / 2, qrY + qrSize + 14, { align: 'center' });

      // ---------- Header/footer trang sản phẩm ----------
      const drawHeader = () => {
        doc.setFillColor(BRAND.forest900);
        doc.rect(0, 0, pageW, 22, 'F');
        if (logo) {
          const h = 12;
          const w = (logo.width / logo.height) * h;
          doc.addImage(logo.dataUrl, 'PNG', margin, 5, w, h);
        }
        doc.setTextColor(BRAND.gold400);
        doc.setFont(fontName, 'bold');
        doc.setFontSize(13);
        doc.text(L.headerTitle, pageW - margin, 13, { align: 'right' });
      };

      const drawFooter = (pageNum: number, totalPages: number) => {
        doc.setFillColor(BRAND.cream200);
        doc.rect(0, pageH - 16, pageW, 16, 'F');
        doc.setDrawColor(BRAND.gold400);
        doc.setLineWidth(0.3);
        doc.line(0, pageH - 16, pageW, pageH - 16);
        const qrFootSize = 10;
        doc.addImage(qrDataUrl, 'PNG', margin, pageH - 13, qrFootSize, qrFootSize);
        doc.setTextColor(BRAND.forest900);
        doc.setFont(fontName, 'normal');
        doc.setFontSize(9);
        doc.text(L.footerContact, margin + qrFootSize + 3, pageH - 7);
        doc.text(L.pageOf(pageNum, totalPages), pageW - margin, pageH - 7, { align: 'right' });
      };

      // ---------- Lưới sản phẩm 2 cột ----------
      const cols = 2;
      const gutter = 8;
      const colW = (pageW - margin * 2 - gutter * (cols - 1)) / cols;
      const cardH = 76;
      const rowGap = 6;
      const gridTop = 30;

      // total trang được tính trước để in "x/y" chính xác — ước lượng bằng số ô mỗi trang
      const rowsPerPage = Math.floor((pageH - 16 - gridTop) / (cardH + rowGap));
      const itemsPerPage = Math.max(1, rowsPerPage * cols);
      const totalProductPages = Math.max(1, Math.ceil(chosen.length / itemsPerPage));

      let pageNum = 1;
      drawHeader();
      drawFooter(pageNum, totalProductPages);
      let col = 0;
      let row = 0;

      for (let i = 0; i < chosen.length; i++) {
        const p = chosen[i];
        setPdfProgress(`Đang xử lý ${i + 1}/${chosen.length}: ${p.name}`);

        if (row >= rowsPerPage) {
          doc.addPage();
          pageNum += 1;
          drawHeader();
          drawFooter(pageNum, totalProductPages);
          row = 0;
          col = 0;
        }

        const cx = margin + col * (colW + gutter);
        const cy = gridTop + row * (cardH + rowGap);

        // khung thẻ sản phẩm
        doc.setFillColor(BRAND.cream50);
        doc.setDrawColor('#e4dcc4');
        doc.setLineWidth(0.25);
        doc.roundedRect(cx, cy, colW, cardH, 2.5, 2.5, 'FD');

        const imgSize = colW - 10;
        const img = await loadImageAsDataUrl(p.image);
        if (img) {
          try {
            doc.addImage(img.dataUrl, 'PNG', cx + 5, cy + 5, imgSize, 30, undefined, 'FAST');
          } catch {
            // ảnh lỗi định dạng (vd. SVG) — bỏ qua, vẫn in đủ text
          }
        }

        const textX = cx + 5;
        const textW = colW - 10;
        let ty = cy + 40;

        doc.setTextColor(BRAND.forest900);
        doc.setFont(fontName, 'bold');
        doc.setFontSize(9.5);
        const nameLines = doc.splitTextToSize(p.name, textW).slice(0, 2);
        doc.text(nameLines, textX, ty);
        ty += nameLines.length * 4.2;

        doc.setTextColor('#9a8f6f');
        doc.setFont(fontName, 'normal');
        doc.setFontSize(7);
        doc.text(p.sku, textX, ty);
        ty += 4.2;

        doc.setTextColor(goldDark);
        doc.setFont(fontName, 'bold');
        doc.setFontSize(9.5);
        doc.text(money(p.price, pdfLang), textX, ty);
        ty += 4.6;

        doc.setTextColor('#4a4a4a');
        doc.setFont(fontName, 'normal');
        doc.setFontSize(7.3);
        const bodyLines = doc.splitTextToSize(p.description, textW).slice(0, 2);
        doc.text(bodyLines, textX, ty);

        col += 1;
        if (col >= cols) {
          col = 0;
          row += 1;
        }
      }

      const stamp = new Date().toISOString().slice(0, 10);
      const fileSuffix = pdfLang === 'en' ? 'en' : 'vi';
      doc.save(`TA-catalog-khach-si-${fileSuffix}-${stamp}.pdf`);
      showToast(`Đã xuất PDF catalog — ${chosen.length} sản phẩm.`);
    } catch (e) {
      showToast(`Lỗi xuất PDF: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setExportingPdf(false);
      setPdfProgress('');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-forest-900">Catalog &amp; Xuất File</h1>
        <p className="text-sm text-forest-700/70 mt-1">
          Xuất bảng giá Excel nội bộ và catalog ảnh PDF gửi khách mua sỉ. Sinh file ngay trên
          trình duyệt, không lưu server, không có link công khai.
        </p>
      </div>

      {/* Excel */}
      <section className="bg-white rounded-2xl border border-cream-300 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5 text-forest-700" />
            </div>
            <div>
              <h2 className="font-medium text-forest-900">Xuất Excel giá bán sỉ</h2>
              <p className="text-sm text-forest-700/70 mt-0.5">
                3 sheet: VKD ({vkdProducts.length} SKU), Trimico ({trimicoProducts.length} SKU),
                Tổng Hợp ({products.length} SKU). Cột: SKU, Tên, Dạng Sản Phẩm, Giá, Ghi chú.
              </p>
            </div>
          </div>
          <Button
            onClick={exportExcel}
            disabled={exportingExcel}
            variant="gold"
            className="shrink-0"
          >
            {exportingExcel ? <Loader className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            Tải Excel (.xlsx)
          </Button>
        </div>
      </section>

      {/* PDF catalog */}
      <section className="bg-white rounded-2xl border border-cream-300 p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gold-400/15 flex items-center justify-center shrink-0">
            <FileDown className="w-5 h-5 text-gold-600" />
          </div>
          <div>
            <h2 className="font-medium text-forest-900">Tạo catalog ảnh chọn lọc cho khách sỉ</h2>
            <p className="text-sm text-forest-700/70 mt-0.5">
              Tick chọn sản phẩm muốn đưa vào PDF — không bắt buộc lấy hết {products.length} SKU.
              Mỗi PDF tự có logo TA, bảng màu thương hiệu, và liên hệ Zalo {CONTACT_PHONE} ở footer.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 p-1 bg-cream-100 rounded-lg w-fit">
          <Button
            onClick={() => setPdfLang('vi')}
            variant="ghost"
            size="sm"
            className={`rounded-md ${pdfLang === 'vi' ? 'bg-white text-forest-900 shadow-sm hover:bg-white' : 'text-forest-700/60'}`}
          >
            🇻🇳 Tiếng Việt
          </Button>
          <Button
            onClick={() => setPdfLang('en')}
            variant="ghost"
            size="sm"
            className={`rounded-md ${pdfLang === 'en' ? 'bg-white text-forest-900 shadow-sm hover:bg-white' : 'text-forest-700/60'}`}
          >
            🇬🇧 English (USD)
          </Button>
        </div>
        {pdfLang === 'en' && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
            Nhãn, tiêu đề và giá đã chuyển sang tiếng Anh / USD. Tên và mô tả sản phẩm vẫn giữ nguyên tiếng Việt
            vì kho dữ liệu sản phẩm hiện chưa có bản dịch tiếng Anh.
          </p>
        )}

        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cream-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên hoặc SKU..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-cream-300 text-sm focus:outline-none focus:border-gold-400"
            />
          </div>
          <Button onClick={selectAllFiltered} variant="ghost" size="sm" className="text-forest-700 hover:text-forest-900">
            <CheckSquare className="w-4 h-4" /> Chọn tất cả (kết quả lọc)
          </Button>
          <Button onClick={clearAllFiltered} variant="ghost" size="sm" className="text-forest-700/70 hover:text-forest-900">
            <Square className="w-4 h-4" /> Bỏ chọn (kết quả lọc)
          </Button>
        </div>

        <div className="max-h-80 overflow-y-auto border border-cream-200 rounded-xl divide-y divide-cream-100">
          {filtered.map((p) => (
            <label key={p.sku} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-cream-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.has(p.sku)}
                onChange={() => toggle(p.sku)}
                className="accent-gold-500"
              />
              <span className="text-forest-500/70 w-20 shrink-0">{p.sku}</span>
              <span className="flex-1 text-forest-900">{p.name}</span>
              <span className="text-forest-700/70">{money(p.price, pdfLang)}</span>
            </label>
          ))}
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-forest-700/50">Không tìm thấy sản phẩm phù hợp.</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-forest-700/70">
            Đã chọn <span className="font-medium text-forest-900">{selected.size}</span> / {products.length} sản phẩm
            {exportingPdf && pdfProgress ? ` — ${pdfProgress}` : ''}
          </p>
          <Button
            onClick={exportPdf}
            disabled={exportingPdf || selected.size === 0}
            variant="gold"
          >
            {exportingPdf ? <Loader className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            Xuất PDF ({selected.size})
          </Button>
        </div>
      </section>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-forest-900 text-cream-50 px-4 py-3 rounded-xl shadow-lg text-sm max-w-sm">
          {toast}
        </div>
      )}
    </div>
  );
}
