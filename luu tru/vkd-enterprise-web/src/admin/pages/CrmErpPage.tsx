import { useState } from 'react';
import { Send, Trash2, CheckCircle2 } from 'lucide-react';
import { CUSTOMERS, CONSENT_LOG, ADMIN_IMAGES, fmt, type CustomerSegment } from '../adminMockData';

export default function CrmErpPage() {
  const [filter, setFilter] = useState<'all' | CustomerSegment>('all');
  const [selectedId, setSelectedId] = useState(CUSTOMERS[0].id);
  const [purged, setPurged] = useState<Record<number, boolean>>({});
  const [purgeTarget, setPurgeTarget] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const list = CUSTOMERS.filter((c) => filter === 'all' || c.segment === filter);
  const selected = CUSTOMERS.find((c) => c.id === selectedId)!;
  const isPurged = !!purged[selected.id];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden h-36">
        <img src={ADMIN_IMAGES.crmHero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-forest-950/65" />
        <div className="relative h-full flex flex-col justify-center px-8">
          <p className="text-xs uppercase tracking-widest text-gold-300">Khách hàng / CRM &amp; ERP</p>
          <h1 className="font-display text-2xl text-cream-50 mt-1">CRM &amp; Phân nhóm khách hàng VIP</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-[2fr_1.2fr] gap-6 items-start">
        <div>
          <div className="flex flex-wrap gap-3 mb-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-3.5 py-2.5 rounded-xl border border-forest-100 bg-white text-sm"
            >
              <option value="all">Tất cả khách VIP</option>
              <option value="lapsed_vip">Chi tiêu &gt;20tr / 3 tháng, chưa mua lại</option>
              <option value="active_vip">VIP đang hoạt động</option>
            </select>
            <button
              onClick={() => showToast('Đã đẩy nhóm khách hàng sang HubSpot & gửi ZNS qua Zalo OA')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" /> Gửi chiến dịch Zalo OA/HubSpot
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-forest-100 overflow-hidden shadow-elegant">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-forest-900 text-cream-100 text-xs uppercase tracking-wide">
                  <th className="text-left font-medium px-4 py-3">Khách hàng</th>
                  <th className="text-left font-medium px-4 py-3">Hạng</th>
                  <th className="text-left font-medium px-4 py-3">Tổng chi tiêu</th>
                  <th className="text-left font-medium px-4 py-3">Đơn gần nhất</th>
                </tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`cursor-pointer border-t border-forest-50 ${
                      c.id === selectedId ? 'bg-forest-50' : 'hover:bg-cream-100'
                    }`}
                  >
                    <td className="px-4 py-3">{c.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          c.tier === 'Platinum'
                            ? 'bg-slate-200 text-slate-700'
                            : c.tier === 'Gold'
                            ? 'bg-gold-100 text-gold-700'
                            : 'bg-cream-200 text-cream-800'
                        }`}
                      >
                        {c.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums">{fmt(c.spend)}đ</td>
                    <td className="px-4 py-3">{c.last}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-forest-100 p-5 shadow-elegant sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-forest-900">{selected.name}</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gold-100 text-gold-700">
              Elite {selected.tier}
            </span>
          </div>

          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between border-b border-dashed border-forest-100 pb-2">
              <dt className="text-forest-500">Tổng chi tiêu tích lũy</dt>
              <dd className="font-mono">{fmt(selected.spend)}đ</dd>
            </div>
            <div className="flex justify-between border-b border-dashed border-forest-100 pb-2">
              <dt className="text-forest-500">Đơn hàng gần nhất</dt>
              <dd className="font-mono">{selected.last}</dd>
            </div>
            <div className="flex justify-between border-b border-dashed border-forest-100 pb-2">
              <dt className="text-forest-500">Thiết bị đã quét QR</dt>
              <dd className="font-mono">{selected.devices} thiết bị</dd>
            </div>
          </dl>

          <h4 className="text-[11px] uppercase tracking-wide text-gold-600 mt-4 mb-2">
            Nhật ký đồng ý dữ liệu (Luật 91/2025/QH15)
          </h4>
          <table className="w-full text-xs">
            <tbody>
              {CONSENT_LOG.map((row, i) => (
                <tr key={i} className="border-b border-forest-50">
                  <td className="py-1.5 pr-2 text-forest-500">{row[0]}</td>
                  <td className="py-1.5">{isPurged && row[1].includes('sức khỏe') ? 'Dữ liệu sức khỏe đã xoá' : row[1]}</td>
                  <td className="py-1.5 text-right text-forest-500">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {isPurged ? (
            <div className="flex items-center gap-2 mt-4 bg-forest-50 text-forest-700 rounded-lg p-3 text-xs">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> Đã xoá toàn bộ dữ liệu nhạy cảm theo yêu cầu khách hàng.
            </div>
          ) : (
            <button
              onClick={() => setPurgeTarget(selected.id)}
              className="w-full mt-4 flex items-center justify-center gap-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg py-2.5 text-xs transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Xoá dữ liệu nhạy cảm của khách hàng
            </button>
          )}
        </div>
      </div>

      {purgeTarget !== null && (
        <div
          className="fixed inset-0 bg-forest-950/50 z-50 flex items-center justify-center p-5"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPurgeTarget(null);
          }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-display text-lg text-forest-900">Xác nhận xoá dữ liệu nhạy cảm</h3>
            <p className="text-sm text-forest-500 leading-relaxed mt-2">
              Toàn bộ dữ liệu sức khoẻ nhạy cảm của <b>{CUSTOMERS.find((c) => c.id === purgeTarget)?.name}</b> sẽ được
              xoá vĩnh viễn theo quyền yêu cầu xoá dữ liệu quy định tại Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15. Hành
              động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setPurgeTarget(null)}
                className="px-4 py-2 rounded-lg border border-forest-100 text-sm text-forest-700"
              >
                Huỷ
              </button>
              <button
                onClick={() => {
                  setPurged((prev) => ({ ...prev, [purgeTarget]: true }));
                  setPurgeTarget(null);
                  showToast('Đã xoá dữ liệu nhạy cảm theo yêu cầu');
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm"
              >
                Xác nhận xoá
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-forest-950 text-cream-50 px-5 py-3 rounded-xl text-sm shadow-elegant-lg z-50 border border-gold-400/30">
          {toast}
        </div>
      )}
    </div>
  );
}
