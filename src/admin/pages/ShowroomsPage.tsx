import { useEffect, useRef, useState } from 'react';
import { ArrowRightLeft, CheckCircle2, Upload, Download, Info } from 'lucide-react';
import { fmt } from '../adminMockData';
import {
  fetchWarehouses,
  fetchInventory,
  fetchShowroomRevenueToday,
  fetchTransferLog,
  transferStock,
  uploadShowroomRevenue,
  fetchDemoShowroomRevenue,
  type Warehouse,
  type InventoryRow,
  type TransferLogRow,
  type ShowroomRevenueUploadRow,
  type DemoRevenueRow,
} from '../adminApi';

const CSV_HEADER = 'warehouse_code,revenue_date,revenue_amount,orders_count';

function parseRevenueCsv(text: string, validCodes: Set<string>): ShowroomRevenueUploadRow[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) throw new Error('File rỗng hoặc thiếu dữ liệu (cần ít nhất 1 dòng dữ liệu sau dòng tiêu đề).');

  const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const idx = {
    warehouse_code: header.indexOf('warehouse_code'),
    revenue_date: header.indexOf('revenue_date'),
    revenue_amount: header.indexOf('revenue_amount'),
    orders_count: header.indexOf('orders_count'),
  };
  if (idx.warehouse_code === -1 || idx.revenue_date === -1 || idx.revenue_amount === -1) {
    throw new Error('Thiếu cột bắt buộc: warehouse_code, revenue_date, revenue_amount.');
  }

  return lines.slice(1).map((line, i) => {
    const cols = line.split(',').map((c) => c.trim());
    const warehouse_code = cols[idx.warehouse_code];
    const revenue_date = cols[idx.revenue_date];
    const revenue_amount = Number(cols[idx.revenue_amount]);
    const orders_count = idx.orders_count === -1 ? 0 : Number(cols[idx.orders_count] || 0);

    if (!validCodes.has(warehouse_code)) {
      throw new Error(`Dòng ${i + 2}: mã showroom "${warehouse_code}" không tồn tại.`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(revenue_date)) {
      throw new Error(`Dòng ${i + 2}: revenue_date phải theo định dạng YYYY-MM-DD.`);
    }
    if (!Number.isFinite(revenue_amount) || revenue_amount < 0) {
      throw new Error(`Dòng ${i + 2}: revenue_amount không hợp lệ.`);
    }
    return { warehouse_code, revenue_date, revenue_amount, orders_count };
  });
}

export default function ShowroomsPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [revenueToday, setRevenueToday] = useState<Record<string, number>>({});
  const [log, setLog] = useState<TransferLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');

  const [uploadMsg, setUploadMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [demoRevenue, setDemoRevenue] = useState<DemoRevenueRow[]>([]);

  const showrooms = warehouses.filter((w) => w.type === 'showroom');

  const load = () => {
    setLoading(true);
    Promise.all([fetchWarehouses(), fetchInventory(), fetchShowroomRevenueToday(), fetchTransferLog(), fetchDemoShowroomRevenue()])
      .then(([w, inv, rev, tlog, demo]) => {
        setWarehouses(w);
        setInventory(inv);
        setRevenueToday(rev);
        setLog(tlog);
        setDemoRevenue(demo);
        const sr = w.filter((x) => x.type === 'showroom');
        setFrom((cur) => cur || sr[0]?.code || '');
        setTo((cur) => cur || sr[1]?.code || sr[0]?.code || '');
        setProductId((cur) => cur || inv[0]?.product_id || '');
        setLoadError(null);
      })
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const nameOf = (code: string) => warehouses.find((w) => w.code === code)?.name ?? code;

  const submitTransfer = async () => {
    if (from === to) {
      setError('Kho nguồn và kho đích phải khác nhau.');
      return;
    }
    if (qty <= 0) {
      setError('Số lượng phải lớn hơn 0.');
      return;
    }
    try {
      await transferStock(from, to, productId, qty);
      setError('');
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi chuyển kho');
    }
  };

  const downloadTemplate = () => {
    const today = new Date().toISOString().slice(0, 10);
    const sample = showrooms.length
      ? showrooms.map((s, i) => `${s.code},${today},${(80 + i * 15) * 1000000},${10 + i * 3}`).join('\n')
      : `SR-DN,${today},84000000,12\nSR-HN,${today},96000000,14\nSR-HCM,${today},121000000,18`;
    const csv = `${CSV_HEADER}\n${sample}\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mau_doanh_thu_showroom.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadMsg(null);
    try {
      const text = await file.text();
      const validCodes = new Set(showrooms.map((s) => s.code));
      const rows = parseRevenueCsv(text, validCodes);
      await uploadShowroomRevenue(rows);
      setUploadMsg({ type: 'ok', text: `Đã nạp ${rows.length} dòng doanh thu thành công.` });
      load();
    } catch (e) {
      setUploadMsg({ type: 'err', text: e instanceof Error ? e.message : 'Lỗi không xác định khi nạp file.' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) return <p className="text-sm text-forest-500">Đang tải dữ liệu showroom…</p>;
  if (loadError) return <p className="text-sm text-red-600">Lỗi tải dữ liệu: {loadError}</p>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-forest-500 mb-1">Vận hành / Chuỗi Showroom O2O</p>
        <h1 className="font-display text-3xl text-forest-900">Chuỗi Showroom vận hành (O2O)</h1>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {showrooms.map((s) => (
          <div key={s.code} className="bg-white rounded-2xl border border-forest-100 p-5 shadow-elegant">
            <p className="text-xs uppercase tracking-wide text-forest-500">{s.name}</p>
            <p className="font-display text-2xl text-forest-900 mt-2">{fmt(revenueToday[s.code] ?? 0)}đ</p>
            <p className="text-xs text-forest-400 mt-1">Doanh thu hôm nay (nạp thủ công qua file — 0 nếu chưa nạp dữ liệu hôm nay)</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-forest-100 p-5 shadow-elegant">
        <h3 className="font-display text-lg text-forest-900 mb-1">Nạp doanh thu showroom/OTC (chưa có POS thật)</h3>
        <p className="text-xs text-forest-500 mb-4">
          Chưa có tích hợp POS trực tiếp. Tạm thời nạp doanh thu bằng file CSV (mở/lưu được bằng Excel) — tải file mẫu,
          điền số liệu thật rồi nạp lại lên đây.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={downloadTemplate} className="px-4 py-2 rounded-lg border border-forest-200 text-xs text-forest-700 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Tải file mẫu (CSV)
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-primary text-xs flex items-center gap-1.5 disabled:opacity-60"
          >
            <Upload className="w-3.5 h-3.5" /> {uploading ? 'Đang nạp…' : 'Nạp file doanh thu'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileUpload(f);
            }}
          />
        </div>
        {uploadMsg && (
          <p className={`text-xs mt-3 ${uploadMsg.type === 'ok' ? 'text-forest-600' : 'text-red-600'}`}>{uploadMsg.text}</p>
        )}
      </div>

      {demoRevenue.length > 0 && (
        <div className="bg-gold-50 rounded-2xl border border-gold-300 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-4 h-4 text-gold-700 flex-shrink-0" />
            <h4 className="text-xs uppercase tracking-wide text-gold-800 font-semibold">
              Dữ liệu minh hoạ (demo) — không tính vào doanh thu thật
            </h4>
          </div>
          <p className="text-xs text-gold-700 mb-3">
            Ví dụ cho thấy tính năng nạp doanh thu showroom hoạt động ra sao. Các dòng này không được cộng vào tổng
            doanh thu ở trang Doanh thu hay "doanh thu hôm nay" phía trên.
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {demoRevenue.map((r, i) => (
              <div key={i} className="bg-white/70 rounded-xl p-3 border border-gold-200">
                <p className="text-[11px] uppercase tracking-wide text-forest-500">{nameOf(r.warehouse_code)}</p>
                <p className="font-display text-lg text-forest-900 mt-1">{fmt(r.revenue_amount)}đ</p>
                <p className="text-[11px] text-forest-400">{r.orders_count} đơn · {new Date(r.revenue_date).toLocaleDateString('vi-VN')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-2xl border border-forest-100 shadow-elegant">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="bg-forest-900 text-cream-100 text-xs uppercase tracking-wide">
              <th className="text-left font-medium px-4 py-3">SKU / Sản phẩm</th>
              {showrooms.map((s) => (
                <th key={s.code} className="text-right font-medium px-4 py-3">
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.product_id} className="border-t border-forest-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-forest-900">{item.name}</p>
                  <p className="text-xs font-mono text-forest-400">{item.sku}</p>
                </td>
                {showrooms.map((s) => (
                  <td key={s.code} className="px-4 py-3 text-right font-mono tabular-nums">
                    {item.stock[s.code] ?? 0}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6 items-start">
        <div className="bg-white rounded-2xl border border-forest-100 p-5 shadow-elegant">
          <h3 className="font-display text-lg text-forest-900 mb-1">Điều phối kho nội bộ</h3>
          <p className="text-xs text-forest-500 mb-4">Tạo lệnh chuyển hàng giữa các showroom.</p>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] uppercase tracking-wide text-forest-400">Từ showroom</label>
                <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border border-forest-100 rounded-lg px-3 py-2 text-sm mt-1">
                  {showrooms.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide text-forest-400">Đến showroom</label>
                <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full border border-forest-100 rounded-lg px-3 py-2 text-sm mt-1">
                  {showrooms.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] uppercase tracking-wide text-forest-400">SKU</label>
                <select value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full border border-forest-100 rounded-lg px-3 py-2 text-sm mt-1">
                  {inventory.map((item) => (
                    <option key={item.product_id} value={item.product_id}>
                      {item.sku}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide text-forest-400">Số lượng</label>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value) || 0)}
                  className="w-full border border-forest-100 rounded-lg px-3 py-2 text-sm mt-1 font-mono"
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button onClick={submitTransfer} className="btn-primary text-xs w-full justify-center mt-2">
              <ArrowRightLeft className="w-4 h-4" /> Tạo lệnh chuyển kho
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-forest-100 p-5 shadow-elegant">
          <h3 className="font-display text-lg text-forest-900 mb-4">Lịch sử điều chuyển</h3>
          {log.length === 0 ? (
            <p className="text-sm text-forest-400">Chưa có lệnh chuyển kho nào.</p>
          ) : (
            <div className="space-y-2">
              {log.map((t) => (
                <div key={t.id} className="flex items-start gap-2.5 text-sm bg-forest-50 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Chuyển <b className="font-mono">{t.qty}</b> x <b className="font-mono">{t.sku}</b> từ{' '}
                    <b>{nameOf(t.from_code)}</b> → <b>{nameOf(t.to_code)}</b>
                    <br />
                    <span className="text-xs text-forest-400">{new Date(t.created_at).toLocaleString('vi-VN')}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
