import { useState, useEffect } from 'react';
import { Save, Loader2, FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { fetchAllPolicyPages, updatePolicyPage } from '../adminApi';
import type { PolicyPageContent } from '../../lib/siteContentApi';

const LABELS: Record<string, string> = {
  privacy: 'Chính Sách Bảo Mật',
  terms: 'Điều Khoản Dịch Vụ',
  shipping: 'Chính Sách Vận Chuyển',
  refund: 'Chính Sách Đổi Trả & Hoàn Tiền',
};

export default function PolicyContentPage() {
  const [pages, setPages] = useState<PolicyPageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchAllPolicyPages()
      .then(setPages)
      .catch((e) => showToast((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const update = (id: string, field: keyof PolicyPageContent, val: string) => {
    setPages(pages.map((p) => p.id === id ? { ...p, [field]: val } : p));
  };

  const save = async (page: PolicyPageContent) => {
    setSaving(page.id);
    try {
      await updatePolicyPage(page.id, {
        title_vi: page.title_vi,
        body_vi: page.body_vi,
        updated_label: page.updated_label,
      });
      showToast('Đã lưu — hiệu lực ngay trên trang chính sách.');
    } catch (e) { showToast((e as Error).message); }
    finally { setSaving(null); }
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-forest-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gold-600" /> Nội Dung Trang Chính Sách
        </h1>
        <p className="text-sm text-forest-500 mt-0.5">Sửa tiêu đề + nội dung 4 trang chính sách. Xuống dòng mới = đoạn mới.</p>
      </div>

      {toast && <div className="mb-4 px-4 py-2 rounded-lg bg-forest-900 text-white text-sm">{toast}</div>}

      {loading ? <div className="text-sm text-forest-500">Đang tải...</div> : (
        <div className="space-y-6">
          {pages.map((page) => (
            <div key={page.id} className="bg-white border border-cream-200 rounded-2xl p-5 space-y-3">
              <h2 className="font-semibold text-forest-800">{LABELS[page.policy_key] ?? page.policy_key}</h2>

              <div>
                <label className="block text-xs text-forest-500 mb-1">Tiêu đề trang</label>
                <input
                  value={page.title_vi}
                  onChange={(e) => update(page.id, 'title_vi', e.target.value)}
                  className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-forest-400"
                />
              </div>

              <div>
                <label className="block text-xs text-forest-500 mb-1">Nội dung (plain text — xuống dòng = đoạn mới)</label>
                <textarea
                  value={page.body_vi}
                  onChange={(e) => update(page.id, 'body_vi', e.target.value)}
                  rows={8}
                  className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-forest-400 resize-y font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-forest-500 mb-1">Nhãn ngày cập nhật</label>
                <input
                  value={page.updated_label}
                  onChange={(e) => update(page.id, 'updated_label', e.target.value)}
                  className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-forest-400"
                />
              </div>

              <Button
                onClick={() => save(page)}
                disabled={saving === page.id}
                size="sm"
                className="bg-forest-600 hover:bg-forest-700 text-white"
              >
                {saving === page.id ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                Lưu trang {LABELS[page.policy_key] ?? page.policy_key}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
