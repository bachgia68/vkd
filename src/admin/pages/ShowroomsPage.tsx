import { useState } from 'react';
import { ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import { WAREHOUSES, INVENTORY, SHOWROOM_REVENUE_TODAY, fmt, type TransferOrder } from '../adminMockData';

const SHOWROOMS = WAREHOUSES.filter((w) => w.type === 'showroom');

export default function ShowroomsPage() {
  const [stock, setStock] = useState<Record<string, Record<string, number>>>(() => {
    const clone: Record<string, Record<string, number>> = {};
    INVENTORY.forEach((item) => {
      clone[item.sku] = { ...item.stock };
    });
    return clone;
  });
  const [from, setFrom] = useState(SHOWROOMS[0].code);
  const [to, setTo] = useState(SHOWROOMS[1].code);
  const [sku, setSku] = useState(INVENTORY[0].sku);
  const [qty, setQty] = useState(1);
  const [log, setLog] = useState<TransferOrder[]>([]);
  const [error, setError] = useState('');

  const submitTransfer = () => {
    if (from === to) {
      setError('Kho nguồn và kho đích phải khác nhau.');
      return;
    }
    const available = stock[sku]?.[from] ?? 0;
    if (qty <= 0 || qty > available) {
      setError(`Kho nguồn chỉ còn ${available} sản phẩm, không đủ để chuyển ${qty}.`);
      return;
    }
    setStock((prev) => ({
      ...prev,
      [sku]: { ...prev[sku], [from]: prev[sku][from] - qty, [to]: (prev[sku][to] ?? 0) + qty },
    }));
    setLog((prev) => [
      { id: Date.now(), fromCode: from, toCode: to, sku, qty, time: new Date().toLocaleString('vi-VN') },
      ...prev,
    ]);
    setError('');
  };

  const nameOf = (code: string) => WAREHOUSES.find((w) => w.code === code)?.name ?? code;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-forest-500 mb-1">Vận hành / Chuỗi Showroom O2O</p>
        <h1 className="font-display text-3xl text-forest-900">Chuỗi Showroom vận hành (O2O)</h1>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {SHOWROOMS.map((s) => (
          <div key={s.code} className="bg-white rounded-2xl border border-forest-100 p-5 shadow-elegant">
            <p className="text-xs uppercase tracking-wide text-forest-500">{s.name}</p>
            <p className="font-display text-2xl text-forest-900 mt-2">{fmt(SHOWROOM_REVENUE_TODAY[s.code] ?? 0)}đ</p>
            <p className="text-xs text-forest-400 mt-1">Doanh thu hôm nay</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl border border-forest-100 shadow-elegant">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="bg-forest-900 text-cream-100 text-xs uppercase tracking-wide">
              <th className="text-left font-medium px-4 py-3">SKU / Sản phẩm</th>
              {SHOWROOMS.map((s) => (
                <th key={s.code} className="text-right font-medium px-4 py-3">
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVENTORY.map((item) => (
              <tr key={item.sku} className="border-t border-forest-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-forest-900">{item.name}</p>
                  <p className="text-xs font-mono text-forest-400">{item.sku}</p>
                </td>
                {SHOWROOMS.map((s) => (
                  <td key={s.code} className="px-4 py-3 text-right font-mono tabular-nums">
                    {stock[item.sku]?.[s.code] ?? 0}
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
                  {SHOWROOMS.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide text-forest-400">Đến showroom</label>
                <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full border border-forest-100 rounded-lg px-3 py-2 text-sm mt-1">
                  {SHOWROOMS.map((s) => (
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
                <select value={sku} onChange={(e) => setSku(e.target.value)} className="w-full border border-forest-100 rounded-lg px-3 py-2 text-sm mt-1">
                  {INVENTORY.map((item) => (
                    <option key={item.sku} value={item.sku}>
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
            <p className="text-sm text-forest-400">Chưa có lệnh chuyển kho nào trong phiên này.</p>
          ) : (
            <div className="space-y-2">
              {log.map((t) => (
                <div key={t.id} className="flex items-start gap-2.5 text-sm bg-forest-50 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Chuyển <b className="font-mono">{t.qty}</b> x <b className="font-mono">{t.sku}</b> từ{' '}
                    <b>{nameOf(t.fromCode)}</b> → <b>{nameOf(t.toCode)}</b>
                    <br />
                    <span className="text-xs text-forest-400">{t.time}</span>
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
