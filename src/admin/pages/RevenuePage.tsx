import { CHANNEL_REVENUE, SOCIAL_CAMPAIGNS, fmt } from '../adminMockData';

export default function RevenuePage() {
  const totalRevenue = CHANNEL_REVENUE.reduce((s, c) => s + c.revenue, 0);
  const maxReach = Math.max(...SOCIAL_CAMPAIGNS.map((c) => c.reach));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-forest-500 mb-1">Vận hành / Doanh thu &amp; Hiệu suất</p>
        <h1 className="font-display text-3xl text-forest-900">Doanh thu &amp; hiệu suất đa kênh</h1>
      </div>

      <div className="bg-white rounded-2xl border border-forest-100 p-5 shadow-elegant">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="font-display text-lg text-forest-900">Doanh thu theo kênh bán</h3>
          <span className="font-mono text-sm text-forest-500">Tổng: {fmt(totalRevenue)}đ</span>
        </div>
        <div className="space-y-3">
          {CHANNEL_REVENUE.map((c) => (
            <div key={c.channel} className="flex items-center gap-3 text-sm">
              <span className="w-56 flex-shrink-0 text-forest-700">{c.channel}</span>
              <div className="flex-1 h-2.5 rounded-full bg-cream-200 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-forest-500 to-gold-400" style={{ width: `${c.share}%` }} />
              </div>
              <span className="w-14 text-right text-forest-500">{c.share}%</span>
              <span className="w-32 text-right font-mono tabular-nums">{fmt(c.revenue)}đ</span>
              <span className="w-20 text-right text-xs text-forest-400">{c.orders} đơn</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl border border-forest-100 shadow-elegant">
        <table className="w-full text-sm min-w-[680px]">
          <thead>
            <tr className="bg-forest-900 text-cream-100 text-xs uppercase tracking-wide">
              <th className="text-left font-medium px-4 py-3">Nền tảng</th>
              <th className="text-right font-medium px-4 py-3">Tiếp cận (Reach)</th>
              <th className="text-right font-medium px-4 py-3">Tương tác</th>
              <th className="text-right font-medium px-4 py-3">Chuyển đổi</th>
              <th className="text-right font-medium px-4 py-3">Tỷ lệ CĐ</th>
              <th className="text-left font-medium px-4 py-3 w-40">So sánh Reach</th>
            </tr>
          </thead>
          <tbody>
            {SOCIAL_CAMPAIGNS.map((c) => (
              <tr key={c.platform} className="border-t border-forest-50">
                <td className="px-4 py-3 font-medium text-forest-900">{c.platform}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">{fmt(c.reach)}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">{fmt(c.engagement)}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">{fmt(c.conversions)}</td>
                <td className="px-4 py-3 text-right font-mono">{c.convRate}%</td>
                <td className="px-4 py-3">
                  <div className="h-2 rounded-full bg-cream-200 overflow-hidden">
                    <div className="h-full rounded-full bg-gold-400" style={{ width: `${(c.reach / maxReach) * 100}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
