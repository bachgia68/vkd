import { useMemo, useState } from 'react';
import { FileSpreadsheet, FileDown, Search, CheckSquare, Square, Loader } from 'lucide-react';
import { products } from '../../data/products';
import { getProductTypeMeta } from '../../data/productTypes';
import { vkdProducts } from '../../data/vkdProducts';
import { trimicoProducts } from '../../data/trimicoProducts';

const CONTACT_PHONE = '0984 999 309';
const LOGO_URL = '/assets/images/TA_logo_clean.png';

// Bảng màu brand TA (đồng bộ tailwind.config.js) — hex thật vì jsPDF không đọc class Tailwind.
const BRAND = {
  forest900: '#0B2F1D',
  gold400: '#D4AF37',
  cream50: '#fefdfb',
  cream200: '#f4f0e6',
};

function money(v: number | null) {
  if (v === null) return 'Liên hệ';
  return v.toLocaleString('vi-VN') + ' đ';
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
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 14;

      const logo = await loadImageAsDataUrl(LOGO_URL);

      const drawHeader = () => {
        doc.setFillColor(BRAND.forest900);
        doc.rect(0, 0, pageW, 22, 'F');
        if (logo) {
          const h = 12;
          const w = (logo.width / logo.height) * h;
          doc.addImage(logo.dataUrl, 'PNG', margin, 5, w, h);
        }
        doc.setTextColor(BRAND.gold400);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('TA — Catalog Sản Phẩm', pageW - margin, 13, { align: 'right' });
      };

      const drawFooter = (pageNum: number) => {
        doc.setFillColor(BRAND.cream200);
        doc.rect(0, pageH - 14, pageW, 14, 'F');
        doc.setTextColor(BRAND.forest900);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`Liên hệ tư vấn / đặt hàng sỉ: ${CONTACT_PHONE} (Zalo)`, margin, pageH - 6);
        doc.text(String(pageNum), pageW - margin, pageH - 6, { align: 'right' });
      };

      let pageNum = 1;
      drawHeader();
      drawFooter(pageNum);
      let y = 30;

      for (let i = 0; i < chosen.length; i++) {
        const p = chosen[i];
        setPdfProgress(`Đang xử lý ${i + 1}/${chosen.length}: ${p.name}`);

        const blockH = 62;
        if (y + blockH > pageH - 16) {
          doc.addPage();
          pageNum += 1;
          drawHeader();
          drawFooter(pageNum);
          y = 30;
        }

        const imgW = 34;
        const imgH = 34;
        const img = await loadImageAsDataUrl(p.image);
        if (img) {
          try {
            doc.addImage(img.dataUrl, margin, y, imgW, imgH, undefined, 'FAST');
          } catch {
            // ảnh lỗi định dạng (vd. SVG) — bỏ qua, vẫn in đủ text
          }
        }

        const textX = margin + imgW + 6;
        const textW = pageW - margin - textX;
        let ty = y + 4;

        doc.setTextColor(BRAND.forest900);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        const nameLines = doc.splitTextToSize(`${p.name}  (${p.sku})`, textW);
        doc.text(nameLines, textX, ty);
        ty += nameLines.length * 5;

        doc.setTextColor(BRAND.gold400 === '#D4AF37' ? '#a07d24' : BRAND.gold400);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(money(p.price), textX, ty);
        ty += 5;

        doc.setTextColor('#3a3a3a');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        const descLines = doc.splitTextToSize(p.description, textW).slice(0, 3);
        doc.text(descLines, textX, ty);
        ty += descLines.length * 3.8 + 1;

        if (p.ingredients) {
          const ingLines = doc.splitTextToSize(`Thành phần: ${p.ingredients}`, textW).slice(0, 2);
          doc.text(ingLines, textX, ty);
          ty += ingLines.length * 3.8;
        }

        y += blockH;
      }

      const stamp = new Date().toISOString().slice(0, 10);
      doc.save(`TA-catalog-khach-si-${stamp}.pdf`);
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
          <button
            onClick={exportExcel}
            disabled={exportingExcel}
            className="btn-gold shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportingExcel ? <Loader className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            Tải Excel (.xlsx)
          </button>
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
          <button onClick={selectAllFiltered} className="text-sm text-forest-700 hover:text-forest-900 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4" /> Chọn tất cả (kết quả lọc)
          </button>
          <button onClick={clearAllFiltered} className="text-sm text-forest-700/70 hover:text-forest-900 flex items-center gap-1.5">
            <Square className="w-4 h-4" /> Bỏ chọn (kết quả lọc)
          </button>
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
              <span className="text-forest-700/70">{money(p.price)}</span>
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
          <button
            onClick={exportPdf}
            disabled={exportingPdf || selected.size === 0}
            className="btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportingPdf ? <Loader className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            Xuất PDF ({selected.size})
          </button>
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
