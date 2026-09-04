import { useEffect, useState } from 'react';
import { Mail, Trash2, Download, Users } from 'lucide-react';
import { fetchNewsletterSignups, deleteNewsletterSignup, type NewsletterSignup } from '../adminApi';
import { Button } from '../../components/ui/button';

// Danh sách khách ĐÃ TỰ NGUYỆN để lại email/Zalo qua widget "Nhận Cẩm Nang"
// trên trang Blog. Đây là cách hợp pháp duy nhất để có contact mời vào nhóm
// Zalo/Messenger KOC Mai — không scrape số điện thoại người khác chưa đồng ý.
export default function LeadsPage() {
  const [rows, setRows] = useState<NewsletterSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchNewsletterSignups()
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : 'Lỗi tải danh sách'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id: string) => {
    if (!confirm('Xoá lead này?')) return;
    try {
      await deleteNewsletterSignup(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi xoá');
    }
  };

  const exportCsv = () => {
    const header = 'email,zalo_phone,source,created_at\n';
    const body = rows
      .map((r) => [r.email ?? '', r.zalo_phone ?? '', r.source, r.created_at].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const withZalo = rows.filter((r) => r.zalo_phone).length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-forest-900 flex items-center gap-2">
          <Mail className="w-5 h-5 text-gold-600" /> Đăng Ký Nhận Cẩm Nang
        </h1>
        <Button onClick={exportCsv} disabled={rows.length === 0} size="sm" variant="outline">
          <Download className="w-3.5 h-3.5 mr-1.5" /> Xuất CSV
        </Button>
      </div>
      <p className="text-sm text-forest-500 mb-6">
        {rows.length} lượt đăng ký · {withZalo} có để lại SĐT Zalo (dùng mời vào nhóm Zalo/Messenger KOC Mai —
        đây là contact khách TỰ NGUYỆN để lại, hợp pháp để liên hệ).
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="underline">Đóng</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-forest-500">Đang tải...</div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 text-forest-400 border-2 border-dashed border-forest-200 rounded-xl flex flex-col items-center gap-2">
          <Users className="w-8 h-8 opacity-40" />
          Chưa có ai đăng ký. Widget "Nhận Cẩm Nang" đang hiển thị ở trang /blog.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-forest-200">
          <table className="w-full text-sm">
            <thead className="bg-forest-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-forest-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-forest-700">Zalo</th>
                <th className="px-4 py-3 text-left font-semibold text-forest-700">Nguồn</th>
                <th className="px-4 py-3 text-left font-semibold text-forest-700">Ngày</th>
                <th className="px-4 py-3 text-center font-semibold text-forest-700">Xoá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-forest-50">
                  <td className="px-4 py-3">{r.email || '—'}</td>
                  <td className="px-4 py-3">
                    {r.zalo_phone ? (
                      <a href={`https://zalo.me/${r.zalo_phone}`} target="_blank" rel="noopener noreferrer" className="text-gold-700 hover:underline">
                        {r.zalo_phone}
                      </a>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-forest-500">{r.source}</td>
                  <td className="px-4 py-3 text-forest-500 whitespace-nowrap">{new Date(r.created_at).toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => remove(r.id)} className="text-forest-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
