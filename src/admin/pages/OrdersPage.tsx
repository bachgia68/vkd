import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { ChevronDown, Truck, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import type { DbOrder } from '../types/admin';

const STATUS_ICON: Record<DbOrder['status'], typeof Truck> = {
  pending: Clock,
  confirmed: CheckCircle,
  shipped: Truck,
  delivered: CheckCircle,
};

const STATUS_LABEL: Record<DbOrder['status'], string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipped: 'Đã gửi hàng',
  delivered: 'Đã giao',
};

export default function OrdersPage() {
  const { data: orders = [], isLoading, error, updateStatus } = useOrders();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) return <div className="p-6">Đang tải đơn hàng...</div>;
  if (error) return <div className="p-6 text-red-600">Lỗi: {String(error)}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Quản lý Đơn hàng</h1>

      <div className="space-y-2">
        {orders?.map((order) => {
          const Icon = STATUS_ICON[order.status];
          return (
            <div key={order.id} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Icon className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-gray-600">{order.customer_phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold">{order.total_vnd.toLocaleString()} đ</p>
                    <p className="text-sm text-gray-600">{STATUS_LABEL[order.status]}</p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition ${expandedId === order.id ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {expandedId === order.id && (
                <div className="p-4 bg-gray-50 border-t space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Đơn hàng</p>
                      <p className="font-mono text-xs">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Ngày tạo</p>
                      <p>{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(['pending', 'confirmed', 'shipped', 'delivered'] as const).map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={order.status === status ? 'primary' : 'ghost'}
                        onClick={() => updateStatus({ id: order.id, status })}
                      >
                        {STATUS_LABEL[status]}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
