import { useState } from 'react';
import { PauseCircle, PlayCircle } from 'lucide-react';
import { AGENTS, fmt, type Agent } from '../adminMockData';

const TIER_TONE: Record<Agent['tier'], string> = {
  'Cấp 1': 'bg-forest-50 text-forest-700',
  'Cấp 2': 'bg-cream-200 text-cream-800',
  'Affiliate KOL/KOC': 'bg-gold-100 text-gold-700',
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const updateDiscount = (id: string, value: string) => {
    const pct = Math.max(0, Math.min(90, Number(value) || 0));
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, discountPct: pct } : a)));
  };

  const toggleStatus = (a: Agent) => {
    setAgents((prev) => prev.map((x) => (x.id === a.id ? { ...x, status: x.status === 'active' ? 'paused' : 'active' } : x)));
    showToast(a.status === 'active' ? `Đã tạm dừng ${a.name}` : `Đã kích hoạt lại ${a.name}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-forest-500 mb-1">Vận hành / Đại lý &amp; Affiliate</p>
        <h1 className="font-display text-3xl text-forest-900">Đại lý &amp; Affiliate</h1>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl border border-forest-100 shadow-elegant">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="bg-forest-900 text-cream-100 text-xs uppercase tracking-wide">
              <th className="text-left font-medium px-4 py-3">Mã đại lý</th>
              <th className="text-left font-medium px-4 py-3">Tên đối tác</th>
              <th className="text-left font-medium px-4 py-3">Cấp bậc</th>
              <th className="text-right font-medium px-4 py-3">% Chiết khấu</th>
              <th className="text-right font-medium px-4 py-3">Doanh số tích luỹ</th>
              <th className="text-left font-medium px-4 py-3">Trạng thái</th>
              <th className="text-right font-medium px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <tr key={a.id} className="border-t border-forest-50">
                <td className="px-4 py-3 font-mono text-xs text-forest-400">{a.code}</td>
                <td className="px-4 py-3 font-medium text-forest-900">{a.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${TIER_TONE[a.tier]}`}>{a.tier}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <input
                      type="number"
                      value={a.discountPct}
                      onChange={(e) => updateDiscount(a.id, e.target.value)}
                      className="w-16 border border-forest-100 rounded-lg px-2 py-1 text-right font-mono text-sm focus:border-gold-400 focus:outline-none"
                    />
                    <span className="text-forest-400">%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">{fmt(a.revenue)}đ</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      a.status === 'active' ? 'bg-forest-50 text-forest-700' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {a.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => toggleStatus(a)}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-forest-100 hover:bg-forest-50 text-forest-700"
                  >
                    {a.status === 'active' ? (
                      <>
                        <PauseCircle className="w-3.5 h-3.5" /> Tạm dừng
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-3.5 h-3.5" /> Duyệt lại
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-forest-950 text-cream-50 px-5 py-3 rounded-xl text-sm shadow-elegant-lg z-50 border border-gold-400/30">
          {toast}
        </div>
      )}
    </div>
  );
}
