import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Pause, Play, X, Search } from 'lucide-react';
import { fetchAllSubscriptions, updateSubscriptionAdmin } from '../adminApi';
import { products as staticProducts } from '../../data/products';
import type { DbSubscription } from '../types/admin';

const STATUS_LABEL: Record<DbSubscription['status'], string> = {
  active: 'Đang hoạt động',
  paused: 'Tạm dừng',
  cancelled: 'Đã hủy',
};

const STATUS_STYLE: Record<DbSubscription['status'], string> = {
  active: 'bg-forest-100 text-forest-700',
  paused: 'bg-gold-100 text-gold-700',
  cancelled: 'bg-red-50 text-red-500',
};

const FILTERS: { key: 'all' | DbSubscription['status']; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'active', label: 'Đang hoạt động' },
  { key: 'paused', label: 'Tạm dừng' },
  { key: 'cancelled', label: 'Đã hủy' },
];

export default function SubscriptionsPage() {
  const [rows, setRows] = useState<DbSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | DbSubscription['status']>('all');
  const [query, setQuery] = useState('');

  const load = () => {
    setLoading(true);
    fetchAllSubscriptions()
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const setStatus = async (row: DbSubscription, status: DbSubscription['status']) => {
    setSaving(row.id);
    try {
      await updateSubscriptionAdmin(row.id, { status });
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status } : r)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi cập nhật');
    } finally {
      setSaving(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter((r) => filter === 'all' || r.status === filter)
      .filter((r) => !q || r.customer_email.toLowerCase().includes(q) || r.product_sku.toLowerCase().includes(q));
  }, [rows, filter, query]);

  const productName = (sku: string) => staticProducts.find((p) => p.sku === sku)?.name ?? sku;

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-forest-900">Đăng Ký Định Kỳ (Autoship)</h1>
        <p className="text-sm text-forest-500 mt-0.5">
          Toàn bộ gói đăng ký định kỳ khách tự tạo ở trang "Autoship". Khách không có tài khoản đăng
          nhập thật — định danh bằng email đã nhập ở đó, xem/tạo/sửa qua RPC riêng, trang này là nơi
          duy nhất admin thấy TOÀN BỘ danh sách (không lọc theo email).
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex justify-between">
          <span>{error}</span><button onClick={() => setError(null)} className="underline">Đóng</button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f.key ? 'bg-forest-900 text-cream-50' : 'bg-cream-100 text-forest-600 hover:bg-forest-50'
            }`}
          >
            {f.label} {f.key !== 'all' && `(${rows.filter((r) => r.status === f.key).length})`}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="w-3.5 h-3.5 text-forest-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm email hoặc SKU..."
            className="pl-8 pr-3 py-1.5 border border-forest-200 rounded-lg text-sm focus:outline-none focus:border-forest-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-forest-500">Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-forest-400 border-2 border-dashed border-forest-200 rounded-xl">
          Không có đăng ký nào khớp bộ lọc.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((row) => (
            <div
              key={row.id}
              className={`rounded-xl border px-4 py-3 flex items-center gap-4 ${saving === row.id ? 'opacity-50 pointer-events-none' : ''} ${
                row.status === 'cancelled' ? 'border-dashed border-gray-200 bg-gray-50' : 'border-forest-200 bg-white'
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-forest-900 text-sm truncate">{row.customer_email}</p>
                <p className="text-xs text-forest-500 mt-0.5">
                  {productName(row.product_sku)} · Mỗi {row.frequency_days} ngày · Giao tiếp theo {row.next_date}
                </p>
                {row.customer_phone && <p className="text-xs text-forest-400 mt-0.5">{row.customer_phone}</p>}
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${STATUS_STYLE[row.status]}`}>
                {STATUS_LABEL[row.status]}
              </span>
              <div className="flex items-center gap-1 flex-shrink-0">
                {row.status !== 'active' && row.status !== 'cancelled' && (
                  <button onClick={() => setStatus(row, 'active')} title="Kích hoạt lại" className="p-1.5 text-forest-500 hover:text-forest-700 hover:bg-forest-100 rounded">
                    <Play className="w-4 h-4" />
                  </button>
                )}
                {row.status === 'active' && (
                  <button onClick={() => setStatus(row, 'paused')} title="Tạm dừng" className="p-1.5 text-forest-500 hover:text-forest-700 hover:bg-forest-100 rounded">
                    <Pause className="w-4 h-4" />
                  </button>
                )}
                {row.status !== 'cancelled' && (
                  <button onClick={() => setStatus(row, 'cancelled')} title="Hủy" className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button onClick={load} title="Tải lại" className="p-1.5 text-forest-300 hover:text-forest-600 hover:bg-forest-100 rounded">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
