import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Trash2, Plus, Eye, EyeOff, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { fetchPageSectionsForAdmin, updatePageSection, deletePageSection, reorderPageSections, createPageSection, uploadPageSectionImage } from '../adminApi';
import type { PageSection } from '../../lib/siteContentApi';

const PAGE_OPTIONS = [
  { key: 'home', label: 'Trang Chủ' },
  { key: 'about', label: 'Giới Thiệu' },
  { key: 'heritage', label: 'Vùng Trồng' },
  { key: 'products', label: 'Sản Phẩm' },
  { key: 'b2b', label: 'Hợp Tác B2B' },
  { key: 'contact', label: 'Liên Hệ' },
];

const BLOCK_TYPES = ['hero', 'text', 'image', 'image-text', 'cta', 'gallery', 'carousel', 'testimonial', 'faq'];

// "Block type" cho page="Trang Chủ": nếu KHÔNG khớp 1 trong các block_type có
// component riêng (bảng LIVE_WIRED_BLOCKS dưới), site sẽ hiện qua bộ hiển thị
// CHUNG (GenericPageSectionBlock.tsx) — nghĩa là mọi block thêm mới ở page
// "Trang Chủ" ĐỀU hiện được, chỉ khác bố cục theo block_type (xem file đó).
// GIỚI HẠN: mỗi block chỉ lưu được 1 ảnh (cột image_url) — 'gallery'/'carousel'
// hiện là 1 ảnh lớn, CHƯA phải carousel trượt nhiều ảnh thật.
// Thứ tự HIỂN THỊ THẬT trên trang chủ đi theo sort_order (mũi tên lên/xuống ở
// đây) — kéo/thả đổi vị trí đúng vị trí block trên site thật, không chỉ đổi
// số trong DB. Với page KHÁC "Trang Chủ" (Giới thiệu/Vùng Trồng/Sản Phẩm/...),
// bộ hiển thị chung CHƯA được nối vào — sửa/thêm block ở các page đó vẫn chỉ
// lưu vào Supabase, chưa hiện lên site khách.
const LIVE_WIRED_BLOCKS: { page_key: string; block_type: string; note: string }[] = [
  { page_key: 'home', block_type: 'hero', note: 'Banner đầu trang chủ (tiêu đề lớn, ảnh nền, nút CTA) — KHÔNG ẩn được (luôn bắt buộc hiện)' },
  { page_key: 'home', block_type: 'about', note: 'Khối "Giới thiệu TA" trên trang chủ' },
  { page_key: 'home', block_type: 'heritage', note: 'Khối "Vùng Trồng / Di sản" trên trang chủ' },
  { page_key: 'home', block_type: 'products', note: 'Tiêu đề + mô tả khối sản phẩm nổi bật trang chủ' },
  { page_key: 'home', block_type: 'combo-of-the-month', note: 'Khối "Combo Tháng Này" (tiêu đề đổi được, chỉ hiện khi có combo đang active)' },
  { page_key: 'home', block_type: 'elite-teaser', note: 'Khối quảng bá TA Elite Club (tích điểm/hạng thành viên)' },
  { page_key: 'home', block_type: 'product-advisor', note: 'TA Advisor — khối hỏi 2 câu tìm sản phẩm phù hợp' },
  { page_key: 'home', block_type: 'certifications', note: 'Tiêu đề + mô tả carousel chứng nhận (ảnh chứng nhận sửa ở trang "Giấy Chứng Nhận" riêng, không phải ở đây)' },
  { page_key: 'home', block_type: 'trust-proof', note: 'Khối đánh giá/báo chí/ảnh minh chứng — chỉ ẩn/hiện được, không có tiêu đề riêng để sửa' },
  { page_key: 'home', block_type: 'b2b', note: 'Khối "Hợp tác B2B" trên trang chủ' },
  { page_key: 'home', block_type: 'newsletter', note: 'Khối đăng ký nhận cẩm nang (chỉ ẩn/hiện được — nội dung bên trong sửa riêng ở NewsletterCTA, không phải ở đây)' },
  { page_key: 'home', block_type: 'showrooms', note: 'Khối "Hệ Thống Điểm Kết Nối TA"' },
  { page_key: 'home', block_type: 'pillar', note: '3 trụ cột trong khối Heritage (Tập Hợp Đặc Sản/Cam Kết/52+ Saponin) — QUẢN LÝ Ở TRANG RIÊNG "Nội Dung Trang Chủ" (/gate-vkd-control-2026/homepage-text), không sửa ở đây vì UI ở đây không có chọn icon' },
];

const BLOCK_TYPE_HELP: Record<string, string> = {
  hero: 'Banner lớn đầu trang — tiêu đề, ảnh nền, 1 nút bấm (CTA). Chỉ thật sự hiện nếu page="Trang Chủ" (dùng type "hero" cho block MỚI ở trang chủ sẽ hiện qua bộ hiển thị chung dạng banner căn giữa, không phải Hero thật của site — Hero thật chỉ 1 cái, không tạo thêm được).',
  text: 'Khối chữ đơn giản (tiêu đề + đoạn văn), không có ảnh.',
  image: 'Khối 1 ảnh lớn + tiêu đề/mô tả bên dưới.',
  'image-text': 'Ảnh + chữ song song.',
  cta: 'Khối kêu gọi hành động: tiêu đề + mô tả + 1 nút bấm dẫn tới link (điền CTA Text + CTA URL bên dưới).',
  gallery: '1 ảnh lớn + tiêu đề/mô tả — CHƯA phải nhiều ảnh trượt được (mỗi block chỉ lưu 1 ảnh). Muốn nhiều ảnh thật, dùng trang "Ảnh Vườn Sâm" hoặc "Giấy Chứng Nhận".',
  carousel: 'Giống "gallery" — hiện tại cũng chỉ 1 ảnh/block, tên gọi khác nhau để phân loại nội dung, CHƯA có carousel nhiều ảnh trượt thật.',
  testimonial: 'Trích dẫn/đánh giá khách hàng (Nội dung = câu trích, Tiêu đề = tên người nói).',
  faq: 'Câu hỏi thường gặp (Tiêu đề = câu hỏi, Nội dung = câu trả lời).',
};

interface EditState {
  title_vi: string;
  content_vi: string;
  image_url: string;
  cta_text: string;
  cta_url: string;
  block_type: string;
}

export default function PageBuilderPage() {
  const [pageKey, setPageKey] = useState('home');
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({ title_vi: '', content_vi: '', image_url: '', cta_text: '', cta_url: '', block_type: 'text' });
  const [adding, setAdding] = useState(false);
  const [newBlock, setNewBlock] = useState<EditState>({ title_vi: '', content_vi: '', image_url: '', cta_text: '', cta_url: '', block_type: 'text' });
  const [uploadingEdit, setUploadingEdit] = useState(false);
  const [uploadingNew, setUploadingNew] = useState(false);

  useEffect(() => {
    setLoading(true);
    setEditId(null);
    fetchPageSectionsForAdmin(pageKey)
      .then(setSections)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [pageKey]);

  const move = async (idx: number, dir: -1 | 1) => {
    const next = [...sections];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setSections(next);
    try {
      await reorderPageSections(next.map((s) => s.id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi sắp xếp');
    }
  };

  const toggleVisible = async (s: PageSection) => {
    setSaving(s.id);
    try {
      await updatePageSection(s.id, { visible: !s.visible });
      setSections(sections.map((sec) => sec.id === s.id ? { ...sec, visible: !sec.visible } : sec));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi');
    } finally {
      setSaving(null);
    }
  };

  const startEdit = (s: PageSection) => {
    setEditId(s.id);
    setEditState({ title_vi: s.title_vi ?? '', content_vi: s.content_vi ?? '', image_url: s.image_url ?? '', cta_text: s.cta_text ?? '', cta_url: s.cta_url ?? '', block_type: s.block_type });
  };

  const saveEdit = async () => {
    if (!editId) return;
    setSaving(editId);
    try {
      await updatePageSection(editId, editState);
      setSections(sections.map((s) => s.id === editId ? { ...s, ...editState } : s));
      setEditId(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi lưu');
    } finally {
      setSaving(null);
    }
  };

  const del = async (id: string) => {
    if (!confirm('Xóa block này?')) return;
    setSaving(id);
    try {
      await deletePageSection(id);
      setSections(sections.filter((s) => s.id !== id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi xóa');
    } finally {
      setSaving(null);
    }
  };

  const pickEditImage = async (file: File | null) => {
    if (!file) return;
    setUploadingEdit(true);
    try {
      const url = await uploadPageSectionImage(file);
      setEditState((s) => ({ ...s, image_url: url }));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi tải ảnh lên');
    } finally {
      setUploadingEdit(false);
    }
  };

  const pickNewImage = async (file: File | null) => {
    if (!file) return;
    setUploadingNew(true);
    try {
      const url = await uploadPageSectionImage(file);
      setNewBlock((s) => ({ ...s, image_url: url }));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi tải ảnh lên');
    } finally {
      setUploadingNew(false);
    }
  };

  const addSection = async () => {
    try {
      await createPageSection({ page_key: pageKey, sort_order: sections.length, ...newBlock });
      setAdding(false);
      const fresh = await fetchPageSectionsForAdmin(pageKey);
      setSections(fresh);
      setNewBlock({ title_vi: '', content_vi: '', image_url: '', cta_text: '', cta_url: '', block_type: 'text' });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi thêm');
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">Page Builder</h1>
          <p className="text-forest-500 text-sm mt-0.5">Chỉnh sửa nội dung từng trang</p>
        </div>
        <select
          value={pageKey}
          onChange={(e) => setPageKey(e.target.value)}
          className="px-3 py-2 border border-forest-200 rounded-lg text-sm focus:outline-none focus:border-forest-500"
        >
          {PAGE_OPTIONS.map((p) => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-4 p-4 bg-forest-50 border border-forest-100 rounded-xl text-xs text-forest-700 leading-relaxed">
        <p className="font-semibold text-forest-800 mb-2">Với page = "Trang Chủ": các block sau có giao diện riêng đã thiết kế sẵn</p>
        <ul className="space-y-0.5 mb-2">
          {LIVE_WIRED_BLOCKS.map((b) => (
            <li key={b.block_type}><code className="bg-forest-100 px-1 rounded">{b.block_type}</code> — {b.note}</li>
          ))}
        </ul>
        <p className="mb-2">Block type KHÁC (text/image/image-text/cta/gallery/carousel/testimonial/faq, hoặc tên tự đặt) ở page "Trang Chủ" vẫn <strong>hiện thật trên site</strong> qua giao diện chung — chỉ khác bố cục theo block_type (xem gợi ý dưới ô chọn Block type). Thứ tự hiện đúng theo mũi tên lên/xuống, ẩn/hiện đúng theo icon con mắt.</p>
        <p><strong>⚠️ Trang KHÁC "Trang Chủ"</strong> (Giới thiệu/Vùng Trồng/Sản Phẩm/Hợp Tác B2B/Liên Hệ): sửa/thêm block ở đây vẫn chỉ <strong>lưu vào Supabase, CHƯA hiện lên site khách</strong> — các trang đó chưa nối vào Page Builder.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="underline">Đóng</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-forest-500">Đang tải...</div>
      ) : (
        <div className="space-y-3">
          {sections.length === 0 && (
            <div className="text-center py-10 text-forest-400 border-2 border-dashed border-forest-200 rounded-xl">
              Chưa có block nào cho trang này.
            </div>
          )}

          {sections.map((s, idx) => (
            <div key={s.id} className={`rounded-xl border ${saving === s.id ? 'opacity-50 pointer-events-none' : ''} ${s.visible ? 'border-forest-200 bg-white' : 'border-dashed border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => move(idx, -1)} disabled={idx === 0} className="p-0.5 text-forest-400 hover:text-forest-700 disabled:opacity-30">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => move(idx, 1)} disabled={idx === sections.length - 1} className="p-0.5 text-forest-400 hover:text-forest-700 disabled:opacity-30">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-block px-2 py-0.5 bg-forest-100 text-forest-700 rounded text-xs font-mono">{s.block_type}</span>
                    <span className="font-medium text-forest-900 truncate">{s.title_vi || '(chưa có tiêu đề)'}</span>
                  </div>
                  {s.content_vi && <p className="text-xs text-forest-500 mt-0.5 line-clamp-1">{s.content_vi}</p>}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => toggleVisible(s)} className={`p-1.5 rounded hover:bg-forest-100 ${s.visible ? 'text-forest-600' : 'text-gray-400'}`} title={s.visible ? 'Đang hiện — click để ẩn' : 'Đang ẩn — click để hiện'}>
                    {s.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => (editId === s.id ? setEditId(null) : startEdit(s))} className="px-3 py-1.5 text-xs bg-forest-600 text-white rounded hover:bg-forest-700">
                    {editId === s.id ? 'Đóng' : 'Sửa'}
                  </button>
                  <button onClick={() => del(s.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {editId === s.id && (
                <div className="border-t border-forest-100 px-4 py-4 space-y-3 bg-forest-50/50">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-forest-600 mb-1">Block type</label>
                      <select value={editState.block_type} onChange={(e) => setEditState({ ...editState, block_type: e.target.value })} className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500">
                        {BLOCK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <p className="text-[11px] text-forest-400 mt-1">{BLOCK_TYPE_HELP[editState.block_type]}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-forest-600 mb-1">Tiêu đề (VI)</label>
                      <input type="text" value={editState.title_vi} onChange={(e) => setEditState({ ...editState, title_vi: e.target.value })} className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-forest-600 mb-1">Nội dung (VI)</label>
                    <textarea value={editState.content_vi} onChange={(e) => setEditState({ ...editState, content_vi: e.target.value })} rows={3} className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500 resize-y" />
                  </div>
                  <div>
                    <label className="block text-xs text-forest-600 mb-1">Ảnh</label>
                    <label className="flex items-center gap-2 border border-dashed border-forest-200 rounded px-2 py-1.5 text-sm text-forest-500 cursor-pointer hover:border-forest-400">
                      {uploadingEdit ? 'Đang tải ảnh lên...' : '📷 Chọn ảnh (tự resize & WebP)'}
                      <input type="file" accept="image/*" className="hidden" disabled={uploadingEdit} onChange={(e) => pickEditImage(e.target.files?.[0] ?? null)} />
                    </label>
                    {editState.image_url && (
                      <img src={editState.image_url} alt="" className="mt-2 h-20 w-32 object-cover rounded border border-forest-100" />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-forest-600 mb-1">CTA Text</label>
                      <input type="text" value={editState.cta_text} onChange={(e) => setEditState({ ...editState, cta_text: e.target.value })} className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-forest-600 mb-1">CTA URL</label>
                      <input type="text" value={editState.cta_url} onChange={(e) => setEditState({ ...editState, cta_url: e.target.value })} className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={saveEdit} disabled={saving === s.id} className="bg-forest-600 hover:bg-forest-700 text-white text-sm">
                      <Save className="w-3.5 h-3.5 mr-1.5" /> Lưu
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {adding && (
            <div className="rounded-xl border-2 border-dashed border-gold-400 bg-gold-50/30 p-4 space-y-3">
              <h3 className="font-semibold text-forest-800 text-sm">Thêm block mới</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-forest-600 mb-1">Block type</label>
                  <select value={newBlock.block_type} onChange={(e) => setNewBlock({ ...newBlock, block_type: e.target.value })} className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500">
                    {BLOCK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <p className="text-[11px] text-forest-400 mt-1">{BLOCK_TYPE_HELP[newBlock.block_type]}</p>
                </div>
                <div>
                  <label className="block text-xs text-forest-600 mb-1">Tiêu đề</label>
                  <input type="text" value={newBlock.title_vi} onChange={(e) => setNewBlock({ ...newBlock, title_vi: e.target.value })} className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-forest-600 mb-1">Nội dung</label>
                <textarea value={newBlock.content_vi} onChange={(e) => setNewBlock({ ...newBlock, content_vi: e.target.value })} rows={2} className="w-full px-2 py-1.5 border border-forest-200 rounded text-sm focus:outline-none focus:border-forest-500 resize-y" />
              </div>
              <div>
                <label className="block text-xs text-forest-600 mb-1">Ảnh</label>
                <label className="flex items-center gap-2 border border-dashed border-forest-200 rounded px-2 py-1.5 text-sm text-forest-500 cursor-pointer hover:border-forest-400">
                  {uploadingNew ? 'Đang tải ảnh lên...' : '📷 Chọn ảnh (tự resize & WebP)'}
                  <input type="file" accept="image/*" className="hidden" disabled={uploadingNew} onChange={(e) => pickNewImage(e.target.files?.[0] ?? null)} />
                </label>
                {newBlock.image_url && (
                  <img src={newBlock.image_url} alt="" className="mt-2 h-20 w-32 object-cover rounded border border-forest-100" />
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setAdding(false)} className="text-sm">Hủy</Button>
                <Button onClick={addSection} className="bg-gold-500 hover:bg-gold-600 text-forest-900 text-sm">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Thêm
                </Button>
              </div>
            </div>
          )}

          {!adding && (
            <button onClick={() => setAdding(true)} className="w-full py-3 border-2 border-dashed border-forest-200 rounded-xl text-forest-400 hover:border-forest-400 hover:text-forest-600 transition-colors flex items-center justify-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Thêm block
            </button>
          )}
        </div>
      )}
    </div>
  );
}
