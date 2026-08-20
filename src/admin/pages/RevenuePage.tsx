import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMetrics } from '../hooks/useMetrics';

export default function RevenuePage() {
  const { revenue, kpis, isLoading, error } = useMetrics();

  if (isLoading) return <div className="p-6">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-6 text-red-600">Lỗi: {String(error)}</div>;

  const chartData = revenue.map((day) => ({
    date: new Date(day.date).toLocaleDateString('vi-VN'),
    showroom: day.showroom_vnd,
    online: day.online_vnd,
    affiliate: day.affiliate_vnd,
    total: day.total_vnd,
  }));

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Doanh thu Đa kênh</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-600">Tổng doanh thu (30 ngày)</p>
          <p className="text-2xl font-bold">{kpis.revenueThisMonth.toLocaleString()} đ</p>
        </div>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-gray-600">Số đơn hàng</p>
          <p className="text-2xl font-bold">{kpis.paidOrdersThisMonth}</p>
        </div>
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-gray-600">Khách hàng</p>
          <p className="text-2xl font-bold">{kpis.totalCustomers}</p>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Doanh thu 90 ngày</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => (value as number).toLocaleString()} />
              <Legend />
              <Line type="monotone" dataKey="showroom" stroke="#3b82f6" name="Showroom" />
              <Line type="monotone" dataKey="online" stroke="#10b981" name="Online" />
              <Line type="monotone" dataKey="affiliate" stroke="#f59e0b" name="Affiliate" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-600 text-center py-8">Chưa có dữ liệu doanh thu</p>
        )}
      </div>
    </div>
  );
}
