import { useEffect, useState } from 'react';
import { Save, Loader2, Type } from 'lucide-react';
import { fetchAllTextOverrides, upsertTextOverride } from '../adminApi';
import { translations } from '../../i18n/translations';
import { Button } from '../../components/ui/button';

interface FieldDef {
  key: string;
  label: string;
  placeholder: string;
  textarea?: boolean;
}

const t = translations.vi;

const FIELDS: FieldDef[] = [
  { key: 'heritage.pillar1.title', label: 'Pillar 1 — Tiêu đề', placeholder: t.heritage.scaleTitle },
  { key: 'heritage.pillar1.desc', label: 'Pillar 1 — Mô tả', placeholder: t.heritage.scaleDesc, textarea: true },
  { key: 'heritage.pillar2.title', label: 'Pillar 2 — Tiêu đề', placeholder: t.heritage.authorityTitle },
  { key: 'heritage.pillar2.desc', label: 'Pillar 2 — Mô tả', placeholder: t.heritage.authorityDesc, textarea: true },
  { key: 'heritage.pillar3.title', label: 'Pillar 3 — Tiêu đề', placeholder: t.heritage.saponinTitle },
  { key: 'heritage.pillar3.desc', label: 'Pillar 3 — Mô tả', placeholder: t.heritage.saponinDesc, textarea: true },
  {
    key: 'newsletter_cta.title',
    label: 'Widget Blog — Tiêu đề (đổi được vd: "Nhận ngay 5% khi đăng ký")',
    placeholder: 'Nhận Cẩm Nang Phân Biệt Sâm Ngọc Linh — Miễn Phí',
  },
  {
    key: 'newsletter_cta.desc',
    label: 'Widget Blog — Mô tả',
    placeholder: 'Cách nhận diện sâm thật, chỉ dấu khoa học Majonoside-R2, dấu hiệu cảnh giác khi mua sâm.',
    textarea: true,
  },
  {
    key: 'newsletter_cta.button',
    label: 'Widget Blog — Chữ trên nút',
    placeholder: 'Nhận cẩm nang',
  },
];

export default function HomepageTextPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchAllTextOverrides()
      .then((rows) => {
        const map: Record<string, string> = {};
        rows.forEach((r) => { map[r.key] = r.value_vi; });
        setValues(map);
      })
      .catch((e) => showToast(e instanceof Error ? e.message : 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const save = async (key: string) => {
    setSavingKey(key);
    try {
      await upsertTextOverride(key, (values[key] ?? '').trim());
      showToast('Đã lưu — hiệu lực sau lần tải lại trang.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi lưu');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-xl md:text-2xl font-display text-forest-900 mb-1 flex items-center gap-2">
        <Type className="w-5 h-5 text-gold-600" />
        Nội Dung Trang Chủ
      </h1>
      <p className="text-sm text-forest-500 mb-6">
        Sửa tiêu đề và mô tả 3 trụ cột Heritage (chỉ bản tiếng Việt). Để trống rồi lưu để quay lại mặc định.
      </p>

      {toast && <div className="mb-4 px-4 py-2 rounded-lg bg-forest-900 text-white text-sm">{toast}</div>}

      {loading ? (
        <p className="text-sm text-forest-500">Đang tải…</p>
      ) : (
        <div className="space-y-4">
          {FIELDS.map((field) => (
            <div key={field.key} className="bg-white border border-cream-200 rounded-2xl p-4 md:p-6">
              <label className="block text-xs font-medium text-forest-500 mb-1">{field.label}</label>
              {field.textarea ? (
                <textarea
                  value={values[field.key] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                  className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm min-h-[80px]"
                  placeholder={field.placeholder}
                />
              ) : (
                <input
                  value={values[field.key] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                  className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm"
                  placeholder={field.placeholder}
                />
              )}
              <Button
                onClick={() => save(field.key)}
                disabled={savingKey === field.key}
                size="sm"
                className="mt-3"
              >
                {savingKey === field.key ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Lưu
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
