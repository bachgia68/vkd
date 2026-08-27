import { useState, useEffect } from 'react';
import { Save, Loader2, Settings2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { fetchAllSiteSettings, upsertSiteSetting } from '../adminApi';

const SETTINGS: { key: string; label: string; desc: string; type?: string; min?: number; max?: number }[] = [
  {
    key: 'posts_per_page',
    label: 'Số bài viết mỗi trang (Blog)',
    desc: 'Admin có thể tăng/giảm số bài hiển thị trên trang Blog. Mặc định: 9.',
    type: 'number',
    min: 3,
    max: 48,
  },
];

export default function SiteConfigPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchAllSiteSettings()
      .then(setValues)
      .catch((e) => showToast((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const save = async (key: string) => {
    setSaving(key);
    try {
      await upsertSiteSetting(key, values[key] ?? '');
      showToast('Đã lưu cài đặt.');
    } catch (e) { showToast((e as Error).message); }
    finally { setSaving(null); }
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-forest-900 flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-gold-600" /> Cài Đặt Trang
        </h1>
        <p className="text-sm text-forest-500 mt-0.5">Các thông số cấu hình toàn cục cho website TA.</p>
      </div>

      {toast && <div className="mb-4 px-4 py-2 rounded-lg bg-forest-900 text-white text-sm">{toast}</div>}

      {loading ? <div className="text-sm text-forest-500">Đang tải...</div> : (
        <div className="space-y-4">
          {SETTINGS.map((s) => (
            <div key={s.key} className="bg-white border border-cream-200 rounded-2xl p-5">
              <label className="block font-medium text-forest-800 mb-0.5">{s.label}</label>
              <p className="text-xs text-forest-500 mb-3">{s.desc}</p>
              <div className="flex gap-3 items-center">
                <input
                  type={s.type ?? 'text'}
                  min={s.min}
                  max={s.max}
                  value={values[s.key] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [s.key]: e.target.value }))}
                  className="border border-cream-300 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:border-forest-400"
                />
                <Button
                  onClick={() => save(s.key)}
                  disabled={saving === s.key}
                  size="sm"
                  className="bg-forest-600 hover:bg-forest-700 text-white"
                >
                  {saving === s.key ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                  Lưu
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
