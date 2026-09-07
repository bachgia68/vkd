import { useEffect, useState } from 'react';
import { Save, Loader2, Type, Eye, EyeOff, Trash2, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { fetchAllTextOverrides, upsertTextOverride } from '../adminApi';
import {
  fetchPageSectionsForAdmin,
  updatePageSection,
  deletePageSection,
  createPageSection,
  reorderPageSections,
} from '../adminApi';
import type { PageSection } from '../../lib/siteContentApi';
import { Button } from '../../components/ui/button';

interface FieldDef {
  key: string;
  label: string;
  placeholder: string;
  textarea?: boolean;
}

const ICON_OPTIONS = ['Building2', 'Microscope', 'FlaskConical', 'Sparkles', 'ShieldPlus'];

const FIELDS: FieldDef[] = [
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
  {
    key: 'video_gallery.badge',
    label: 'Video Thực Địa — Nhãn nhỏ trên tiêu đề',
    placeholder: 'Câu Chuyện Thực Địa',
  },
  {
    key: 'video_gallery.title',
    label: 'Video Thực Địa — Tiêu đề lớn',
    placeholder: 'Nhìn Tận Mắt — Tin Tận Tâm',
  },
  {
    key: 'video_gallery.desc',
    label: 'Video Thực Địa — Mô tả',
    placeholder: 'Từng thước phim quay thẳng tại vườn sâm nhà Khánh, Trà Linh — không dàn dựng, không chỉnh sửa.',
    textarea: true,
  },
];

interface PillarEditState {
  title_vi: string;
  content_vi: string;
  icon_key: string;
}

const emptyPillar: PillarEditState = { title_vi: '', content_vi: '', icon_key: 'Sparkles' };

export default function HomepageTextPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [pillars, setPillars] = useState<PageSection[]>([]);
  const [pillarsLoading, setPillarsLoading] = useState(true);
  const [pillarSaving, setPillarSaving] = useState<string | null>(null);
  const [pillarEditId, setPillarEditId] = useState<string | null>(null);
  const [pillarEdit, setPillarEdit] = useState<PillarEditState>(emptyPillar);
  const [addingPillar, setAddingPillar] = useState(false);
  const [newPillar, setNewPillar] = useState<PillarEditState>(emptyPillar);

  useEffect(() => {
    fetchAllTextOverrides()
      .then((rows) => {
        const map: Record<string, string> = {};
        rows.forEach((r) => { map[r.key] = r.value_vi; });
        setValues(map);
      })
      .catch((e) => showToast(e instanceof Error ? e.message : 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
    loadPillars();
  }, []);

  const loadPillars = () => {
    setPillarsLoading(true);
    fetchPageSectionsForAdmin('home')
      .then((rows) => setPillars(rows.filter((r) => r.block_type === 'pillar')))
      .catch((e) => showToast(e instanceof Error ? e.message : 'Lỗi tải trụ cột'))
      .finally(() => setPillarsLoading(false));
  };

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

  const startEditPillar = (p: PageSection) => {
    setPillarEditId(p.id);
    setPillarEdit({ title_vi: p.title_vi ?? '', content_vi: p.content_vi ?? '', icon_key: p.icon_key ?? 'Sparkles' });
  };

  const savePillar = async () => {
    if (!pillarEditId) return;
    setPillarSaving(pillarEditId);
    try {
      await updatePageSection(pillarEditId, pillarEdit);
      setPillars((rows) => rows.map((r) => (r.id === pillarEditId ? { ...r, ...pillarEdit } : r)));
      setPillarEditId(null);
      showToast('Đã lưu trụ cột.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi lưu trụ cột');
    } finally {
      setPillarSaving(null);
    }
  };

  const togglePillarVisible = async (p: PageSection) => {
    setPillarSaving(p.id);
    try {
      await updatePageSection(p.id, { visible: !p.visible });
      setPillars((rows) => rows.map((r) => (r.id === p.id ? { ...r, visible: !r.visible } : r)));
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi');
    } finally {
      setPillarSaving(null);
    }
  };

  const deletePillar = async (id: string) => {
    if (!confirm('Xóa trụ cột này? Không thể hoàn tác.')) return;
    setPillarSaving(id);
    try {
      await deletePageSection(id);
      setPillars((rows) => rows.filter((r) => r.id !== id));
      showToast('Đã xóa trụ cột.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi xóa');
    } finally {
      setPillarSaving(null);
    }
  };

  const movePillar = async (idx: number, dir: -1 | 1) => {
    const next = [...pillars];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setPillars(next);
    try {
      await reorderPageSections(next.map((p) => p.id));
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi sắp xếp');
    }
  };

  const addPillar = async () => {
    try {
      await createPageSection({
        page_key: 'home',
        block_type: 'pillar',
        sort_order: pillars.length,
        ...newPillar,
      });
      setAddingPillar(false);
      setNewPillar(emptyPillar);
      loadPillars();
      showToast('Đã thêm trụ cột.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi thêm trụ cột');
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-xl md:text-2xl font-display text-forest-900 mb-1 flex items-center gap-2">
        <Type className="w-5 h-5 text-gold-600" />
        Nội Dung Trang Chủ
      </h1>
      <p className="text-sm text-forest-500 mb-6">
        Quản lý trụ cột Heritage (ẩn/hiện/xóa/sửa/thêm) và các đoạn text khác của trang chủ.
      </p>

      {toast && <div className="mb-4 px-4 py-2 rounded-lg bg-forest-900 text-white text-sm">{toast}</div>}

      {/* Trụ cột Heritage — ẩn/hiện/xóa/sửa/thêm */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-forest-800 mb-1">Trụ Cột Heritage</h2>
        <p className="text-xs text-forest-500 mb-3">
          3 khối "Tập Hợp Đặc Sản / Cam Kết Chất Lượng / 52+ Loại Saponin" trên trang chủ — ẩn/xóa/sửa/thêm ngay tại đây.
        </p>

        {pillarsLoading ? (
          <p className="text-sm text-forest-500">Đang tải…</p>
        ) : (
          <div className="space-y-3">
            {pillars.length === 0 && (
              <div className="text-center py-6 text-forest-400 border-2 border-dashed border-cream-300 rounded-xl text-sm">
                Chưa có trụ cột nào.
              </div>
            )}

            {pillars.map((p, idx) => (
              <div
                key={p.id}
                className={`rounded-xl border ${pillarSaving === p.id ? 'opacity-50 pointer-events-none' : ''} ${
                  p.visible ? 'border-cream-200 bg-white' : 'border-dashed border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => movePillar(idx, -1)} disabled={idx === 0} className="p-0.5 text-forest-400 hover:text-forest-700 disabled:opacity-30">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => movePillar(idx, 1)} disabled={idx === pillars.length - 1} className="p-0.5 text-forest-400 hover:text-forest-700 disabled:opacity-30">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-forest-900 truncate block">{p.title_vi || '(chưa có tiêu đề)'}</span>
                    {p.content_vi && <p className="text-xs text-forest-500 mt-0.5 line-clamp-1">{p.content_vi}</p>}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => togglePillarVisible(p)}
                      className={`p-1.5 rounded hover:bg-forest-100 ${p.visible ? 'text-forest-600' : 'text-gray-400'}`}
                      title={p.visible ? 'Đang hiện — click để ẩn' : 'Đang ẩn — click để hiện'}
                    >
                      {p.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => (pillarEditId === p.id ? setPillarEditId(null) : startEditPillar(p))}
                      className="px-3 py-1.5 text-xs bg-forest-600 text-white rounded hover:bg-forest-700"
                    >
                      {pillarEditId === p.id ? 'Đóng' : 'Sửa'}
                    </button>
                    <button onClick={() => deletePillar(p.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {pillarEditId === p.id && (
                  <div className="border-t border-cream-100 px-4 py-4 space-y-3 bg-cream-50/50">
                    <div>
                      <label className="block text-xs text-forest-600 mb-1">Icon</label>
                      <select
                        value={pillarEdit.icon_key}
                        onChange={(e) => setPillarEdit((s) => ({ ...s, icon_key: e.target.value }))}
                        className="w-full px-2 py-1.5 border border-cream-300 rounded text-sm"
                      >
                        {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-forest-600 mb-1">Tiêu đề</label>
                      <input
                        value={pillarEdit.title_vi}
                        onChange={(e) => setPillarEdit((s) => ({ ...s, title_vi: e.target.value }))}
                        className="w-full px-2 py-1.5 border border-cream-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-forest-600 mb-1">Mô tả</label>
                      <textarea
                        value={pillarEdit.content_vi}
                        onChange={(e) => setPillarEdit((s) => ({ ...s, content_vi: e.target.value }))}
                        rows={3}
                        className="w-full px-2 py-1.5 border border-cream-300 rounded text-sm resize-y"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={savePillar} disabled={pillarSaving === p.id} size="sm">
                        {pillarSaving === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        Lưu
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {addingPillar ? (
              <div className="rounded-xl border-2 border-dashed border-gold-400 bg-gold-50/30 p-4 space-y-3">
                <div>
                  <label className="block text-xs text-forest-600 mb-1">Icon</label>
                  <select
                    value={newPillar.icon_key}
                    onChange={(e) => setNewPillar((s) => ({ ...s, icon_key: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-cream-300 rounded text-sm"
                  >
                    {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-forest-600 mb-1">Tiêu đề</label>
                  <input
                    value={newPillar.title_vi}
                    onChange={(e) => setNewPillar((s) => ({ ...s, title_vi: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-cream-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-forest-600 mb-1">Mô tả</label>
                  <textarea
                    value={newPillar.content_vi}
                    onChange={(e) => setNewPillar((s) => ({ ...s, content_vi: e.target.value }))}
                    rows={2}
                    className="w-full px-2 py-1.5 border border-cream-300 rounded text-sm resize-y"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => { setAddingPillar(false); setNewPillar(emptyPillar); }} className="text-sm">
                    Hủy
                  </Button>
                  <Button onClick={addPillar} className="bg-gold-500 hover:bg-gold-600 text-forest-900 text-sm">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Thêm
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingPillar(true)}
                className="w-full py-3 border-2 border-dashed border-cream-300 rounded-xl text-forest-400 hover:border-gold-400 hover:text-forest-600 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" /> Thêm trụ cột
              </button>
            )}
          </div>
        )}
      </div>

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
