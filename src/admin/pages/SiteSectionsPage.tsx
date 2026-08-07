import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { fetchAllSiteSections, updateSiteSectionVisibility, type SiteSection } from '../adminApi';

type Row = SiteSection & { visible: boolean };

export default function SiteSectionsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchAllSiteSections()
      .then(setRows)
      .catch((e) => showToast(e instanceof Error ? e.message : 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggle = async (row: Row) => {
    try {
      await updateSiteSectionVisibility(row.id, !row.visible);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi cập nhật');
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-xl md:text-2xl font-display text-forest-900 mb-1">Quản lý Trang</h1>
      <p className="text-sm text-forest-500 mb-6">
        Các trang đã build sẵn nhưng chưa có nội dung thật — bật "Hiện" khi
        sẵn sàng, trang sẽ xuất hiện ngay trong menu điều hướng tương ứng,
        không cần sửa code.
      </p>

      {toast && <div className="mb-4 px-4 py-2 rounded-lg bg-forest-900 text-white text-sm">{toast}</div>}

      {loading ? (
        <p className="text-sm text-forest-500">Đang tải…</p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="bg-white border border-cream-200 rounded-xl p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-forest-900">{row.label_vi}</p>
                <p className="text-xs text-forest-500">key: {row.key}{row.nav_group ? ` · nhóm nav: ${row.nav_group}` : ''}</p>
              </div>
              <button
                onClick={() => toggle(row)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium ${
                  row.visible ? 'bg-forest-100 text-forest-800' : 'bg-gold-400/15 text-gold-700'
                }`}
              >
                {row.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {row.visible ? 'Đang hiện' : 'Đang ẩn'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
