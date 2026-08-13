import { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';
import { fetchLoyaltyMembers, type LoyaltyMember } from '../adminApi';
import { Badge, type BadgeProps } from '../../components/ui/badge';

const TIER_TONE: Record<string, BadgeProps['tone']> = {
  Elite: 'gold',
  Platinum: 'neutral',
  Gold: 'warning',
  Silver: 'muted',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN');
}

export default function LoyaltyPage() {
  const [members, setMembers] = useState<LoyaltyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetchLoyaltyMembers()
      .then(setMembers)
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-forest-500">Đang tải dữ liệu hội viên…</p>;
  if (loadError) return <p className="text-sm text-red-600">Lỗi tải dữ liệu: {loadError}</p>;

  const totalPoints = members.reduce((s, m) => s + m.points_balance, 0);

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden bg-forest-950 h-36">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 to-forest-950" />
        <div className="relative h-full flex flex-col justify-center px-8">
          <p className="text-xs uppercase tracking-widest text-gold-300 flex items-center gap-2">
            <Crown className="w-3.5 h-3.5" /> TA Elite Club
          </p>
          <h1 className="font-display text-2xl text-cream-50 mt-1">Hội viên &amp; điểm tích lũy</h1>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-forest-100 p-5">
          <p className="text-forest-400 text-xs uppercase tracking-wide">Tổng hội viên</p>
          <p className="font-display text-2xl font-bold text-forest-900 mt-1">{members.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-forest-100 p-5">
          <p className="text-forest-400 text-xs uppercase tracking-wide">Điểm đang lưu hành</p>
          <p className="font-display text-2xl font-bold text-forest-900 mt-1">{totalPoints.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-forest-100 p-5">
          <p className="text-forest-400 text-xs uppercase tracking-wide">Giá trị quy đổi (~100đ/điểm)</p>
          <p className="font-display text-2xl font-bold text-forest-900 mt-1">{(totalPoints * 100).toLocaleString('vi-VN')}đ</p>
        </div>
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-forest-400 bg-white rounded-2xl border border-forest-100 p-6">
          Chưa có hội viên nào — hội viên sẽ tự động được tạo và tích điểm khi có đơn hàng PayOS
          thanh toán thành công đầu tiên.
        </p>
      ) : (
        <div className="bg-white rounded-2xl border border-forest-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-forest-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3">Mã hội viên</th>
                <th className="text-left px-5 py-3">Khách hàng</th>
                <th className="text-left px-5 py-3">Hạng CRM</th>
                <th className="text-right px-5 py-3">Điểm hiện có</th>
                <th className="text-right px-5 py-3">Điểm trọn đời</th>
                <th className="text-left px-5 py-3">Ngày tham gia</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-t border-cream-100">
                  <td className="px-5 py-3 font-mono text-xs text-forest-600">{m.member_code}</td>
                  <td className="px-5 py-3">
                    <p className="text-forest-900 font-medium">{m.customer_full_name || '—'}</p>
                    <p className="text-forest-400 text-xs">{m.customer_email || '—'}</p>
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={TIER_TONE[m.tier] ?? 'muted'} className="font-semibold">
                      {m.tier}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-forest-900">{m.points_balance.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-forest-500">{m.lifetime_points.toLocaleString()}</td>
                  <td className="px-5 py-3 text-forest-500">{formatDate(m.joined_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-forest-400 text-xs">
        Chỉ xem — hạng CRM (Silver/Gold/Platinum/Elite) và ngưỡng điểm tự động tính theo
        <code className="mx-1 px-1.5 py-0.5 rounded bg-cream-100">accrue_loyalty_points()</code>
        khi đơn hàng PayOS thanh toán thành công. Đây khác với 3 hạng khách hàng thấy trên site
        (Tiêu Chuẩn/VIP/VVIP Elite) — xem <code className="mx-1 px-1.5 py-0.5 rounded bg-cream-100">SUPABASE_SCHEMA.md</code>,
        mục "Two loyalty point systems".
      </p>
    </div>
  );
}
