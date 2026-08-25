import { useEffect, useState } from 'react';
import { PauseCircle, PlayCircle, Plus } from 'lucide-react';
import { fmt } from '../adminMockData';
import { fetchAgents, createAgent, updateAgent, type Agent } from '../adminApi';
import { Button } from '../../components/ui/button';
import { Badge, type BadgeProps } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

const TIER_TONE: Record<Agent['tier'], BadgeProps['tone']> = {
  'Cấp 1': 'neutral',
  'Cấp 2': 'muted',
  'Affiliate KOL/KOC': 'gold',
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
        <Button onClick={() => setShowAddModal(true)} size="sm">
          <Plus className="w-4 h-4" /> Thêm đại lý
        </Button>
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
                    <Badge tone={TIER_TONE[a.tier]} className="text-[10px] rounded px-2 py-0.5">{a.tier}</Badge>
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
                    <Badge tone={a.status === 'active' ? 'success' : 'danger'} className="text-[10px] rounded px-2 py-0.5">
                      {a.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button onClick={() => toggleStatus(a)} variant="outline" size="sm">
                      {a.status === 'active' ? (
                        <>
                          <PauseCircle className="w-3.5 h-3.5" /> Tạm dừng
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-3.5 h-3.5" /> Duyệt lại
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddAgentModal
        open={showAddModal}
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

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-forest-950 text-cream-50 px-5 py-3 rounded-xl text-sm shadow-elegant-lg z-50 border border-gold-400/30">
          {toast}
        </div>
      )}
    </div>
  );
}

function AddAgentModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (input: { code: string; name: string; tier: Agent['tier']; discount_pct: number }) => void;
}) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [tier, setTier] = useState<Agent['tier']>('Cấp 1');
  const [discountPct, setDiscountPct] = useState('10');

  const canSubmit = code.trim() && name.trim();

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm đại lý / affiliate mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Mã đại lý (VD: DL-050)"
            className="font-mono"
          />
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên đối tác"
          />
          <div className="grid grid-cols-2 gap-3">
            <select value={tier} onChange={(e) => setTier(e.target.value as Agent['tier'])} className="border border-forest-100 rounded-lg px-3 py-2.5 text-sm">
              <option value="Cấp 1">Cấp 1</option>
              <option value="Cấp 2">Cấp 2</option>
              <option value="Affiliate KOL/KOC">Affiliate KOL/KOC</option>
            </select>
            <Input
              value={discountPct}
              onChange={(e) => setDiscountPct(e.target.value)}
              placeholder="% Chiết khấu"
              inputMode="numeric"
              className="font-mono"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose} variant="outline">
            Huỷ
          </Button>
          <Button
            disabled={!canSubmit}
            onClick={() => onCreate({ code: code.trim(), name: name.trim(), tier, discount_pct: Math.max(0, Math.min(90, Number(discountPct) || 0)) })}
            variant="gold"
            size="sm"
          >
            Lưu đại lý
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
