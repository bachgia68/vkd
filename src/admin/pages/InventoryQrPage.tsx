import { useEffect, useState } from 'react';
import { Route, CheckCircle2 } from 'lucide-react';
import { PROVINCE_COORDS, ADMIN_IMAGES, haversineKm, fmt } from '../adminMockData';
import { fetchWarehouses, fetchInventory, fetchQrHeatmap, type Warehouse, type InventoryRow } from '../adminApi';

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
    <div className="space-y-6">
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
  );
}
