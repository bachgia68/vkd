import { useEffect, useState } from 'react';
import { Eye, EyeOff, Plus, Loader2, Languages as LanguagesIcon } from 'lucide-react';
import {
  fetchAllSiteLanguages,
  createSiteLanguage,
  updateSiteLanguage,
  type AdminSiteLanguage,
} from '../adminApi';
import { Button } from '../../components/ui/button';

export default function LanguagesPage() {
  const [rows, setRows] = useState<AdminSiteLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [newKey, setNewKey] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchAllSiteLanguages()
      .then(setRows)
      .catch((e) => showToast(e instanceof Error ? e.message : 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggle = async (row: AdminSiteLanguage) => {
    try {
      await updateSiteLanguage(row.id, { visible: !row.visible });
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi cập nhật');
    }
  };

  const submit = async () => {
    const key = newKey.trim().toLowerCase();
    if (!key || !newLabel.trim()) return;
    setSaving(true);
    try {
      await createSiteLanguage({ key, label: newLabel.trim(), sort_order: rows.length + 1 });
      setNewKey('');
      setNewLabel('');
      load();
      showToast('Đã thêm ngôn ngữ — đang ẩn cho tới khi bật thủ công (cần dịch xong translations.ts trước).');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi thêm ngôn ngữ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-xl md:text-2xl font-display text-forest-900 mb-1 flex items-center gap-2">
        <LanguagesIcon className="w-5 h-5 text-gold-600" />
        Ngôn Ngữ Hiển Thị
      </h1>
      <p className="text-sm text-forest-500 mb-6">
        Ẩn/hiện ngôn ngữ ở bộ chọn ngôn ngữ trên Header và Footer trang khách hàng.
        <strong> Không thể xóa ngôn ngữ</strong> tại đây — chỉ ẩn, để tránh mất công bản dịch đã có.
        Ngôn ngữ mới thêm phải có bản dịch đầy đủ trong <code>src/i18n/translations.ts</code> trước khi bật hiện.
      </p>

      {toast && <div className="mb-4 px-4 py-2 rounded-lg bg-forest-900 text-white text-sm">{toast}</div>}

      {loading ? (
        <p className="text-sm text-forest-500">Đang tải…</p>
      ) : (
        <div className="bg-white border border-cream-200 rounded-2xl divide-y divide-cream-100 mb-8">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-medium text-forest-900">
                  {row.label} <span className="text-forest-400 font-normal">({row.key})</span>
                </p>
              </div>
              <Button
                onClick={() => toggle(row)}
                size="sm"
                className={`h-auto px-3 py-1.5 text-xs rounded-lg ${
                  row.visible ? 'bg-forest-100 text-forest-800 hover:bg-forest-200' : 'bg-gold-400/15 text-gold-700 hover:bg-gold-400/25'
                }`}
              >
                {row.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {row.visible ? 'Đang hiện' : 'Đang ẩn'}
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-cream-200 rounded-2xl p-4 md:p-6">
        <h2 className="font-semibold text-forest-900 mb-4">Thêm ngôn ngữ mới</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-forest-500 mb-1">Mã ngôn ngữ (vd. ja, ko)</label>
            <input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm"
              placeholder="ja"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-forest-500 mb-1">Tên hiển thị</label>
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm"
              placeholder="日本語"
            />
          </div>
        </div>
        <Button onClick={submit} disabled={saving || !newKey.trim() || !newLabel.trim()} className="w-full sm:w-auto mt-4">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Thêm ngôn ngữ (mặc định ẩn)
        </Button>
      </div>
    </div>
  );
}
