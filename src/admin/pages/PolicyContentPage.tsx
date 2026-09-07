import { useState, useEffect } from 'react';
import { Save, Loader2, FileText, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { fetchAllPolicyPages, updatePolicyPage } from '../adminApi';
import type { PolicyPageContent, PolicySectionBlock } from '../../lib/siteContentApi';

const LABELS: Record<string, string> = {
  privacy: 'Chính Sách Bảo Mật',
  terms: 'Điều Khoản Dịch Vụ',
  shipping: 'Chính Sách Vận Chuyển',
  refund: 'Chính Sách Đổi Trả & Hoàn Tiền',
};

// Sua 2026-09-07: chuyen tu 1 o van ban dai sang danh sach muc (tieu de +
// noi dung), khop voi cach trang chinh sach that su hien thi (h2 + doan van
// tung muc) — truoc day sua o day chi ghi vao body_vi (1 khoi van ban phang),
// hien thi xau hon ban co san trong code va de bi tuong nham la "mat noi
// dung" khi bang policy_pages rong (khong co dong nao de sua).
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

  const updateField = (id: string, field: 'title_vi' | 'updated_label', val: string) => {
    setPages(pages.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
  };

  const sectionsOf = (p: PolicyPageContent): PolicySectionBlock[] => p.sections_vi ?? [];

  const setSections = (id: string, next: PolicySectionBlock[]) => {
    setPages(pages.map((p) => (p.id === id ? { ...p, sections_vi: next } : p)));
  };

  const updateSection = (pageId: string, idx: number, field: 'heading' | 'body', val: string) => {
    const p = pages.find((x) => x.id === pageId);
    if (!p) return;
    const next = [...sectionsOf(p)];
    if (field === 'heading') next[idx] = { ...next[idx], heading: val };
    else next[idx] = { ...next[idx], body: val.split('\n').filter((l) => l.trim() !== '') };
    setSections(pageId, next);
  };

  const addSection = (pageId: string) => {
    const p = pages.find((x) => x.id === pageId);
    if (!p) return;
    setSections(pageId, [...sectionsOf(p), { heading: 'Mục mới', body: [''] }]);
  };

  const deleteSection = (pageId: string, idx: number) => {
    const p = pages.find((x) => x.id === pageId);
    if (!p) return;
    if (!confirm('Xóa mục này khỏi trang chính sách?')) return;
    setSections(pageId, sectionsOf(p).filter((_, i) => i !== idx));
  };

  const moveSection = (pageId: string, idx: number, dir: -1 | 1) => {
    const p = pages.find((x) => x.id === pageId);
    if (!p) return;
    const next = [...sectionsOf(p)];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setSections(pageId, next);
  };

  const save = async (page: PolicyPageContent) => {
    setSaving(page.id);
    try {
      await updatePolicyPage(page.id, {
        title_vi: page.title_vi,
        updated_label: page.updated_label,
        sections_vi: page.sections_vi,
      });
      showToast('Đã lưu — hiệu lực ngay trên trang chính sách.');
    } catch (e) { showToast((e as Error).message); }
    finally { setSaving(null); }
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-forest-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gold-600" /> Nội Dung Trang Chính Sách
        </h1>
        <p className="text-sm text-forest-500 mt-0.5">Sửa tiêu đề trang + từng mục (tiêu đề mục / nội dung). Xuống dòng mới trong ô nội dung = đoạn văn mới trong cùng mục.</p>
      </div>

      {toast && <div className="mb-4 px-4 py-2 rounded-lg bg-forest-900 text-white text-sm">{toast}</div>}

      {loading ? <div className="text-sm text-forest-500">Đang tải...</div> : (
        <div className="space-y-8">
          {pages.length === 0 && (
            <div className="text-center py-10 text-forest-400 border-2 border-dashed border-cream-300 rounded-xl">
              Chưa có trang chính sách nào trong hệ thống — báo Claude/dev để khởi tạo lại.
            </div>
          )}
          {pages.map((page) => (
            <div key={page.id} className="bg-white border border-cream-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-forest-800">{LABELS[page.policy_key] ?? page.policy_key}</h2>
                <Button
                  onClick={() => save(page)}
                  disabled={saving === page.id}
                  size="sm"
                  className="bg-forest-600 hover:bg-forest-700 text-white"
                >
                  {saving === page.id ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                  Lưu trang này
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-forest-500 mb-1">Tiêu đề trang</label>
                  <input
                    value={page.title_vi}
                    onChange={(e) => updateField(page.id, 'title_vi', e.target.value)}
                    className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-forest-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-forest-500 mb-1">Nhãn ngày cập nhật</label>
                  <input
                    value={page.updated_label}
                    onChange={(e) => updateField(page.id, 'updated_label', e.target.value)}
                    className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-forest-400"
                  />
                </div>
              </div>

              <div className="space-y-3 border-t border-cream-100 pt-4">
                {sectionsOf(page).map((section, idx) => (
                  <div key={idx} className="border border-cream-200 rounded-xl p-3 bg-cream-50/40">
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col gap-0.5 pt-1">
                        <button onClick={() => moveSection(page.id, idx, -1)} disabled={idx === 0} className="p-0.5 text-forest-400 hover:text-forest-700 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                        <button onClick={() => moveSection(page.id, idx, 1)} disabled={idx === sectionsOf(page).length - 1} className="p-0.5 text-forest-400 hover:text-forest-700 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          value={section.heading}
                          onChange={(e) => updateSection(page.id, idx, 'heading', e.target.value)}
                          className="w-full border border-cream-300 rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-none focus:border-forest-400"
                          placeholder="Tiêu đề mục (vd: 1. Điều kiện áp dụng)"
                        />
                        <textarea
                          value={section.body.join('\n')}
                          onChange={(e) => updateSection(page.id, idx, 'body', e.target.value)}
                          rows={3}
                          className="w-full border border-cream-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-forest-400 resize-y"
                          placeholder="Nội dung — xuống dòng = đoạn mới"
                        />
                      </div>
                      <button onClick={() => deleteSection(page.id, idx)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addSection(page.id)}
                  className="w-full py-2.5 border-2 border-dashed border-cream-300 rounded-xl text-forest-400 hover:border-gold-400 hover:text-forest-600 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" /> Thêm mục
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
