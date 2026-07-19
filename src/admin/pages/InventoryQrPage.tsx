import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Route, CheckCircle2, QrCode, Download, Copy, Printer, ClipboardList, FlaskConical } from 'lucide-react';
import { PROVINCE_COORDS, ADMIN_IMAGES, haversineKm, fmt } from '../adminMockData';
import {
  fetchWarehouses,
  fetchInventory,
  fetchQrHeatmap,
  fetchProducts,
  fetchCultivationRegions,
  fetchBatches,
  createBatch,
  type Warehouse,
  type InventoryRow,
  type DbProduct,
  type CultivationRegion,
  type Batch,
} from '../adminApi';

function traceUrl(qrHash: string) {
  return `${window.location.origin}/?trace=${encodeURIComponent(qrHash)}`;
}

interface RouteResult {
  code: string;
  name: string;
  distanceKm: number;
  totalStock: number;
}

export default function InventoryQrPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [heatmap, setHeatmap] = useState<{ region: string; count: number; suspect: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [routeOpen, setRouteOpen] = useState(false);
  const [province, setProvince] = useState('Huế');
  const [result, setResult] = useState<RouteResult | null>(null);
  const [ranOnce, setRanOnce] = useState(false);

  const [products, setProducts] = useState<DbProduct[]>([]);
  const [regions, setRegions] = useState<CultivationRegion[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  const [batchForm, setBatchForm] = useState({
    product_id: '',
    cultivation_region_code: '',
    harvest_date: new Date().toISOString().slice(0, 10),
    qty_kg: 1,
    warehouse_location: '',
    qc_status: 'pending',
  });
  const [batchError, setBatchError] = useState('');
  const [creatingBatch, setCreatingBatch] = useState(false);
  const [copiedHash, setCopiedHash] = useState('');

  const [printMode, setPrintMode] = useState<'single' | 'all' | null>(null);
  const [printTarget, setPrintTarget] = useState<Batch | null>(null);
  const [hiResQr, setHiResQr] = useState<Record<string, string>>({});

  const loadBatchDeps = () => {
    Promise.all([fetchProducts(), fetchCultivationRegions(), fetchBatches()]).then(([p, r, b]) => {
      setProducts(p);
      setRegions(r);
      setBatches(b);
      setBatchForm((f) => ({
        ...f,
        product_id: f.product_id || p[0]?.id || '',
        cultivation_region_code: f.cultivation_region_code || r[0]?.code || '',
      }));
    });
  };

  useEffect(loadBatchDeps, []);

  useEffect(() => {
    batches.forEach((b) => {
      if (qrImages[b.qr_hash]) return;
      QRCode.toDataURL(traceUrl(b.qr_hash), { width: 160, margin: 1 }).then((url) => {
        setQrImages((cur) => ({ ...cur, [b.qr_hash]: url }));
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batches]);

  const submitBatch = async () => {
    const product = products.find((p) => p.id === batchForm.product_id);
    if (!product) {
      setBatchError('Chọn sản phẩm.');
      return;
    }
    if (!batchForm.cultivation_region_code) {
      setBatchError('Chọn vùng trồng.');
      return;
    }
    if (batchForm.qty_kg <= 0) {
      setBatchError('Khối lượng phải lớn hơn 0.');
      return;
    }
    setCreatingBatch(true);
    setBatchError('');
    try {
      await createBatch({ ...batchForm, product_sku: product.sku });
      loadBatchDeps();
    } catch (e) {
      setBatchError(e instanceof Error ? e.message : 'Lỗi tạo lô hàng.');
    } finally {
      setCreatingBatch(false);
    }
  };

  const copyLink = (qrHash: string) => {
    navigator.clipboard.writeText(traceUrl(qrHash));
    setCopiedHash(qrHash);
    setTimeout(() => setCopiedHash(''), 1500);
  };

  const ensureHiResQr = async (hashes: string[]) => {
    const missing = hashes.filter((h) => !hiResQr[h]);
    if (missing.length === 0) return;
    const entries = await Promise.all(
      missing.map(async (h) => [h, await QRCode.toDataURL(traceUrl(h), { width: 480, margin: 1 })] as const)
    );
    setHiResQr((cur) => ({ ...cur, ...Object.fromEntries(entries) }));
  };

  const printSingleLabel = async (batch: Batch) => {
    await ensureHiResQr([batch.qr_hash]);
    setPrintTarget(batch);
    setPrintMode('single');
  };

  const printAllLabels = async () => {
    await ensureHiResQr(batches.map((b) => b.qr_hash));
    setPrintTarget(null);
    setPrintMode('all');
  };

  useEffect(() => {
    if (!printMode) return;
    const timer = setTimeout(() => window.print(), 80);
    const onAfterPrint = () => {
      setPrintMode(null);
      setPrintTarget(null);
    };
    window.addEventListener('afterprint', onAfterPrint);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('afterprint', onAfterPrint);
    };
  }, [printMode]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchWarehouses(), fetchInventory(), fetchQrHeatmap()])
      .then(([w, inv, h]) => {
        setWarehouses(w);
        setInventory(inv);
        setHeatmap(h);
        setLoadError(null);
      })
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const maxHeat = Math.max(1, ...heatmap.map((h) => h.count));

  function autoRoute(prov: string): RouteResult | null {
    const dest = PROVINCE_COORDS[prov];
    if (!dest) return null;
    let best: RouteResult | null = null;
    warehouses.forEach((w) => {
      const totalStock = inventory.reduce((s, item) => s + (item.stock[w.code] ?? 0), 0);
      if (totalStock <= 0) return;
      const d = haversineKm(dest, { lat: w.lat, lng: w.lng });
      if (!best || d < best.distanceKm) best = { code: w.code, name: w.name, distanceKm: d, totalStock };
    });
    return best;
  }

  if (loading) return <p className="text-sm text-forest-500">Đang tải dữ liệu kho hàng…</p>;
  if (loadError) return <p className="text-sm text-red-600">Lỗi tải dữ liệu: {loadError}</p>;

  return (
    <>
    <div className="space-y-6 print:hidden">
      <div className="relative rounded-2xl overflow-hidden h-36">
        <img src={ADMIN_IMAGES.warehouseHero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-forest-950/65" />
        <div className="relative h-full flex flex-col justify-center px-8">
          <p className="text-xs uppercase tracking-widest text-gold-300">Vận hành / Kho hàng</p>
          <h1 className="font-display text-2xl text-cream-50 mt-1">Tồn kho đa điểm &amp; Truy xuất QR</h1>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-forest-500">Cập nhật thời gian thực · {warehouses.length} kho/showroom</p>
        <button
          onClick={() => {
            setRouteOpen(true);
            setResult(null);
            setRanOnce(false);
          }}
          className="btn-primary text-xs"
        >
          <Route className="w-4 h-4" /> Tự động định tuyến kho
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl border border-forest-100 shadow-elegant">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="bg-forest-900 text-cream-100 text-xs uppercase tracking-wide">
              <th className="text-left font-medium px-4 py-3">SKU / Sản phẩm</th>
              {warehouses.map((w) => (
                <th key={w.code} className="text-right font-medium px-4 py-3">
                  {w.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.sku} className="border-t border-forest-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-forest-900">{item.name}</p>
                  <p className="text-xs font-mono text-forest-400">{item.sku}</p>
                </td>
                {warehouses.map((w) => {
                  const qty = item.stock[w.code] ?? 0;
                  const low = qty < item.threshold;
                  return (
                    <td key={w.code} className="px-4 py-3 text-right">
                      <span
                        className={`inline-block font-mono text-xs px-2 py-0.5 rounded ${
                          low ? 'bg-gold-100 text-gold-800 border border-gold-400' : 'bg-forest-50 text-forest-700'
                        }`}
                      >
                        {qty}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-2xl border border-forest-100 p-5 shadow-elegant">
        <h4 className="text-xs uppercase tracking-wide text-gold-600 mb-3">
          Bản đồ nhiệt vị trí quét QR (theo khu vực)
        </h4>
        {heatmap.length === 0 ? (
          <p className="text-sm text-forest-400">
            Chưa ghi nhận lượt quét QR truy xuất nguồn gốc nào. Dữ liệu sẽ tự cập nhật khi khách hàng quét mã trên
            cổng truy xuất.
          </p>
        ) : (
          <div className="space-y-2">
            {heatmap.map((h) => (
              <div key={h.region} className="flex items-center gap-3 text-sm">
                <span className="w-24 flex-shrink-0 text-forest-600">{h.region}</span>
                <div className="flex-1 h-2 rounded-full bg-cream-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-300 to-red-500"
                    style={{ width: `${(h.count / maxHeat) * 100}%` }}
                  />
                </div>
                <span className={`w-16 text-right font-mono ${h.suspect ? 'text-red-600 font-semibold' : ''}`}>
                  {h.count}
                  {h.suspect ? ' ⚠' : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-forest-50 rounded-2xl border border-forest-100 p-5">
        <h4 className="text-xs uppercase tracking-wide text-gold-600 mb-3 flex items-center gap-2">
          <ClipboardList className="w-3.5 h-3.5" /> Hướng dẫn triển khai cho nhân viên kho/đóng gói
        </h4>
        <ol className="space-y-2 text-sm text-forest-700 list-decimal list-inside">
          <li>
            <b>Trước khi đóng gói</b>, vào mục bên dưới tạo 1 lô hàng mới cho đúng sản phẩm + vùng trồng + ngày thu
            hoạch thật — hệ thống tự sinh 1 mã QR duy nhất cho lô đó.
          </li>
          <li>
            Bấm <b>"In nhãn"</b> trên lô vừa tạo để in trực tiếp ra khổ tem dán (hoặc <b>"Tải QR"</b> nếu dùng máy in
            tem riêng), rồi dán/in lên từng thùng/đơn vị sản phẩm trước khi niêm phong.
          </li>
          <li className="flex items-start gap-1.5">
            <FlaskConical className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-forest-500" />
            <span>
              Dùng điện thoại quét thử 1 tem sau khi dán để xác nhận link truy xuất hiển thị đúng sản phẩm/vùng
              trồng/ngày thu hoạch trước khi xuất kho.
            </span>
          </li>
          <li>
            <b>Không dùng lại mã QR cũ</b> cho lô khác — mỗi lô hàng luôn phải có mã riêng để đảm bảo truy xuất chính
            xác và phát hiện hàng giả (hệ thống tự cảnh báo nếu 1 mã bị quét từ nhiều vùng khác nhau trong 24h).
          </li>
          <li>Nếu lô bị huỷ hoặc in lỗi tem, tạo lô mới thay vì sửa lại lô cũ.</li>
        </ol>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6 items-start">
        <div className="bg-white rounded-2xl border border-forest-100 p-5 shadow-elegant">
          <h3 className="font-display text-lg text-forest-900 mb-1">Tạo lô hàng &amp; mã QR truy xuất</h3>
          <p className="text-xs text-forest-500 mb-4">Mỗi lô hàng có một mã QR duy nhất để in lên bao bì.</p>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] uppercase tracking-wide text-forest-400">Sản phẩm</label>
              <select
                value={batchForm.product_id}
                onChange={(e) => setBatchForm((f) => ({ ...f, product_id: e.target.value }))}
                className="w-full border border-forest-100 rounded-lg px-3 py-2 text-sm mt-1"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.sku} — {p.name_vi}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wide text-forest-400">Vùng trồng</label>
              <select
                value={batchForm.cultivation_region_code}
                onChange={(e) => setBatchForm((f) => ({ ...f, cultivation_region_code: e.target.value }))}
                className="w-full border border-forest-100 rounded-lg px-3 py-2 text-sm mt-1"
              >
                {regions.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name_vi} ({r.province})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] uppercase tracking-wide text-forest-400">Ngày thu hoạch</label>
                <input
                  type="date"
                  value={batchForm.harvest_date}
                  onChange={(e) => setBatchForm((f) => ({ ...f, harvest_date: e.target.value }))}
                  className="w-full border border-forest-100 rounded-lg px-3 py-2 text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide text-forest-400">Khối lượng (kg)</label>
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={batchForm.qty_kg}
                  onChange={(e) => setBatchForm((f) => ({ ...f, qty_kg: Number(e.target.value) || 0 }))}
                  className="w-full border border-forest-100 rounded-lg px-3 py-2 text-sm mt-1 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wide text-forest-400">Vị trí kho</label>
              <input
                type="text"
                value={batchForm.warehouse_location}
                onChange={(e) => setBatchForm((f) => ({ ...f, warehouse_location: e.target.value }))}
                placeholder="VD: KHO-TMR - Kệ A3"
                className="w-full border border-forest-100 rounded-lg px-3 py-2 text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wide text-forest-400">Trạng thái kiểm định</label>
              <select
                value={batchForm.qc_status}
                onChange={(e) => setBatchForm((f) => ({ ...f, qc_status: e.target.value }))}
                className="w-full border border-forest-100 rounded-lg px-3 py-2 text-sm mt-1"
              >
                <option value="pending">Đang chờ kiểm định</option>
                <option value="passed">Đạt kiểm định chất lượng</option>
                <option value="failed">Không đạt kiểm định</option>
              </select>
            </div>

            {batchError && <p className="text-xs text-red-600">{batchError}</p>}

            <button onClick={submitBatch} disabled={creatingBatch} className="btn-primary text-xs w-full justify-center mt-2 disabled:opacity-60">
              <QrCode className="w-4 h-4" /> {creatingBatch ? 'Đang tạo…' : 'Tạo lô hàng & sinh mã QR'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-forest-100 p-5 shadow-elegant">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-forest-900">Lô hàng đã tạo ({batches.length})</h3>
            {batches.length > 0 && (
              <button
                onClick={printAllLabels}
                className="text-[11px] px-2.5 py-1.5 rounded-md border border-forest-200 text-forest-700 flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> In tất cả nhãn
              </button>
            )}
          </div>
          {batches.length === 0 ? (
            <p className="text-sm text-forest-400">Chưa có lô hàng nào — tạo lô đầu tiên ở bên trái.</p>
          ) : (
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {batches.map((b) => (
                <div key={b.id} className="flex items-start gap-4 bg-forest-50 rounded-xl p-3">
                  {qrImages[b.qr_hash] ? (
                    <img src={qrImages[b.qr_hash]} alt="QR" className="w-20 h-20 rounded-lg bg-white p-1 flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-white flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-xs text-forest-900 font-semibold truncate">{b.batch_id}</p>
                      {b.is_demo && (
                        <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-gold-100 text-gold-800 border border-gold-300 font-semibold">
                          DEMO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-forest-600 mt-0.5 truncate">{b.product_sku} · {b.cultivation_region_name}</p>
                    <p className="text-xs text-forest-400">{b.harvest_date ? new Date(b.harvest_date).toLocaleDateString('vi-VN') : '—'}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <a
                        href={qrImages[b.qr_hash]}
                        download={`qr-${b.batch_id}.png`}
                        className="text-[11px] px-2 py-1 rounded-md border border-forest-200 text-forest-700 flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Tải QR
                      </a>
                      <button
                        onClick={() => copyLink(b.qr_hash)}
                        className="text-[11px] px-2 py-1 rounded-md border border-forest-200 text-forest-700 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> {copiedHash === b.qr_hash ? 'Đã chép!' : 'Sao chép link'}
                      </button>
                      <button
                        onClick={() => printSingleLabel(b)}
                        className="text-[11px] px-2 py-1 rounded-md border border-forest-200 text-forest-700 flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" /> In nhãn
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {routeOpen && (
        <div
          className="fixed inset-0 bg-forest-950/50 z-50 flex items-center justify-center p-5"
          onClick={(e) => {
            if (e.target === e.currentTarget) setRouteOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-display text-lg text-forest-900">Tự động định tuyến kho (Amazon-style)</h3>
            <p className="text-xs text-forest-500 mt-2 leading-relaxed">
              Chọn tỉnh/thành giao hàng của khách để hệ thống quét các kho còn tồn và gán đơn cho kho gần nhất.
            </p>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full border border-forest-100 rounded-lg px-3 py-2.5 text-sm my-4"
            >
              {Object.keys(PROVINCE_COORDS).map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <button
              onClick={() => {
                setResult(autoRoute(province));
                setRanOnce(true);
              }}
              className="btn-primary text-xs w-full justify-center"
            >
              Chạy thuật toán định tuyến
            </button>

            {result && (
              <div className="flex items-start gap-2.5 bg-forest-50 text-forest-700 rounded-xl p-4 text-sm mt-4">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Đã gán đơn cho <b>{result.name}</b>
                  <br />
                  Khoảng cách ước tính: {result.distanceKm.toFixed(0)} km · Tồn kho khả dụng: {fmt(result.totalStock)}{' '}
                  sản phẩm
                </span>
              </div>
            )}
            {ranOnce && result === null && (
              <p className="text-xs text-red-600 mt-2">Không có kho nào còn tồn kho khả dụng cho tuyến này.</p>
            )}

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setRouteOpen(false)}
                className="px-4 py-2 rounded-lg border border-forest-100 text-sm text-forest-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    {printMode && (
      <div className="hidden print:block">
        <style>{`
          @page { size: auto; margin: 10mm; }
          .qr-label-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6mm; }
          .qr-label { border: 1px dashed #999; border-radius: 3mm; padding: 4mm; display: flex; flex-direction: column; align-items: center; text-align: center; page-break-inside: avoid; }
          .qr-label-brand { font-family: Georgia, serif; font-size: 10pt; font-weight: 700; color: #0B2F1D; letter-spacing: 0.05em; }
          .qr-label-brand-sub { font-family: Arial, sans-serif; font-size: 7pt; color: #9c7f2e; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 1mm; }
          .qr-label-qr { width: 28mm; height: 28mm; margin: 3mm 0; }
          .qr-label-batch { font-family: 'Courier New', monospace; font-size: 8pt; font-weight: 700; color: #1B1E1B; word-break: break-all; }
          .qr-label-product { font-size: 7.5pt; color: #1B1E1B; margin-top: 1mm; }
          .qr-label-cta { font-size: 6.5pt; color: #666; margin-top: 1.5mm; }
          .qr-label-single { width: 60mm; margin: 0 auto; }
          .qr-label-single .qr-label-qr { width: 36mm; height: 36mm; }
        `}</style>
        {printMode === 'single' && printTarget && (
          <div className="qr-label qr-label-single">
            <div className="qr-label-brand">VKD GROUP</div>
            <div className="qr-label-brand-sub">Sâm Ngọc Linh</div>
            {hiResQr[printTarget.qr_hash] && <img src={hiResQr[printTarget.qr_hash]} alt="QR" className="qr-label-qr" />}
            <p className="qr-label-batch">{printTarget.batch_id}</p>
            <p className="qr-label-product">
              {printTarget.product_sku}
              {printTarget.harvest_date ? ` · ${new Date(printTarget.harvest_date).toLocaleDateString('vi-VN')}` : ''}
            </p>
            <p className="qr-label-cta">Quét mã QR để truy xuất nguồn gốc</p>
          </div>
        )}
        {printMode === 'all' && (
          <div className="qr-label-grid">
            {batches.map((b) => (
              <div key={b.id} className="qr-label">
                <div className="qr-label-brand">VKD GROUP</div>
                <div className="qr-label-brand-sub">Sâm Ngọc Linh</div>
                {hiResQr[b.qr_hash] && <img src={hiResQr[b.qr_hash]} alt="QR" className="qr-label-qr" />}
                <p className="qr-label-batch">{b.batch_id}</p>
                <p className="qr-label-product">{b.product_sku}</p>
                <p className="qr-label-cta">Quét mã QR để truy xuất nguồn gốc</p>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
    </>
  );
}
