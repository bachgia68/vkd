import { useEffect, useState } from 'react';
import { PauseCircle, PlayCircle, Plus } from 'lucide-react';
import { fmt } from '../adminMockData';
import { fetchAgents, createAgent, updateAgent, type Agent } from '../adminApi';

const TIER_TONE: Record<Agent['tier'], string> = {
  'Cấp 1': 'bg-forest-50 text-forest-700',
  'Cấp 2': 'bg-cream-200 text-cream-800',
  'Affiliate KOL/KOC': 'bg-gold-100 text-gold-700',
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const load = () => {
    setLoading(true);
    fetchAgents()
      .then((rows) => {
        setAgents(rows);
        setLoadError(null);
      })
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const updateDiscount = async (id: string, value: string) => {
    const pct = Math.max(0, Math.min(90, Number(value) || 0));
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, discount_pct: pct } : a)));
    try {
      await updateAgent(id, { discount_pct: pct });
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi cập nhật chiết khấu');
      load();
    }
  };

  const toggleStatus = async (a: Agent) => {
    const nextStatus = a.status === 'active' ? 'paused' : 'active';
    try {
      await updateAgent(a.id, { status: nextStatus });
      showToast(a.status === 'active' ? `Đã tạm dừng ${a.name}` : `Đã kích hoạt lại ${a.name}`);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi cập nhật trạng thái');
    }
  };

  if (loading) return <p className="text-sm text-forest-500">Đang tải danh sách đại lý…</p>;
  if (loadError) return <p className="text-sm text-red-600">Lỗi tải dữ liệu: {loadError}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-forest-500 mb-1">Vận hành / Đại lý &amp; Affiliate</p>
          <h1 className="font-display text-3xl text-forest-900">Đại lý &amp; Affiliate</h1>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary text-xs">
          <Plus className="w-4 h-4" /> Thêm đại lý
        </button>
      </div>

      {agents.length === 0 ? (
        <p className="text-sm text-forest-400 bg-white rounded-2xl border border-forest-100 p-6">
          Chưa có đại lý/affiliate nào. Bấm &ldquo;Thêm đại lý&rdquo; để bắt đầu.
        </p>
      ) : (
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
                        value={a.discount_pct}
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
      )}

      {showAddModal && (
        <AddAgentModal
          onClose={() => setShowAddModal(false)}
          onCreate={async (input) => {
            try {
              await createAgent(input);
              setShowAddModal(false);
              showToast('Đã thêm đại lý mới');
              load();
            } catch (e) {
              showToast(e instanceof Error ? e.message : 'Lỗi thêm đại lý');
            }
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-forest-950 text-cream-50 px-5 py-3 rounded-xl text-sm shadow-elegant-lg z-50 border border-gold-400/30">
          {toast}
        </div>
      )}
    </div>
  );
}

function AddAgentModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (input: { code: string; name: string; tier: Agent['tier']; discount_pct: number }) => void;
}) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [tier, setTier] = useState<Agent['tier']>('Cấp 1');
  const [discountPct, setDiscountPct] = useState('10');

  const canSubmit = code.trim() && name.trim();

  return (
    <div className="fixed inset-0 bg-forest-950/50 z-50 flex items-center justify-center p-5" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="font-display text-lg text-forest-900 mb-4">Thêm đại lý / affiliate mới</h3>
        <div className="space-y-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Mã đại lý (VD: DL-050)"
            className="w-full border border-forest-100 rounded-lg px-3 py-2.5 text-sm font-mono"
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên đối tác"
            className="w-full border border-forest-100 rounded-lg px-3 py-2.5 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <select value={tier} onChange={(e) => setTier(e.target.value as Agent['tier'])} className="border border-forest-100 rounded-lg px-3 py-2.5 text-sm">
              <option value="Cấp 1">Cấp 1</option>
              <option value="Cấp 2">Cấp 2</option>
              <option value="Affiliate KOL/KOC">Affiliate KOL/KOC</option>
            </select>
            <input
              value={discountPct}
              onChange={(e) => setDiscountPct(e.target.value)}
              placeholder="% Chiết khấu"
              inputMode="numeric"
              className="border border-forest-100 rounded-lg px-3 py-2.5 text-sm font-mono"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-forest-100 text-sm text-forest-700">
            Huỷ
          </button>
          <button
            disabled={!canSubmit}
            onClick={() => onCreate({ code: code.trim(), name: name.trim(), tier, discount_pct: Math.max(0, Math.min(90, Number(discountPct) || 0)) })}
            className="btn-gold text-xs disabled:opacity-40 disabled:pointer-events-none"
          >
            Lưu đại lý
          </button>
        </div>
      </div>
    </div>
  );
}
