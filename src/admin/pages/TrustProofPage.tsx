import { useEffect, useState } from 'react';
import { Plus, Trash2, ImagePlus, Loader2, Quote as QuoteIcon } from 'lucide-react';
import {
  fetchAllTrustProofItems,
  createTrustProofItem,
  updateTrustProofItem,
  deleteTrustProofItem,
  uploadTrustProofImage,
  type TrustProofItem,
} from '../adminApi';
import { Button } from '../../components/ui/button';

const KIND_LABELS: Record<TrustProofItem['kind'], string> = {
  testimonial: 'Cảm nhận khách hàng',
  press: 'Báo chí',
  photo: 'Ảnh sự kiện',
};

type Row = TrustProofItem & { published: boolean };

export default function TrustProofPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const [kind, setKind] = useState<TrustProofItem['kind']>('testimonial');
  const [quoteText, setQuoteText] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const load = () => {
    setLoading(true);
    fetchAllTrustProofItems()
      .then(setItems)
      .catch((e) => showToast(e instanceof Error ? e.message : 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onPickImage = (file: File | null) => {
    setImageFile(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const resetForm = () => {
    setKind('testimonial');
    setQuoteText('');
    setSourceName('');
    setSourceUrl('');
    onPickImage(null);
  };

  const submit = async () => {
    if (!quoteText.trim() || !sourceName.trim()) return;
    setSaving(true);
    try {
      let image_url: string | null = null;
      if (imageFile) image_url = await uploadTrustProofImage(imageFile);
      await createTrustProofItem({
        kind,
        quote_text: quoteText.trim(),
        source_name: sourceName.trim(),
        source_url: sourceUrl.trim() || null,
        image_url,
      });
      resetForm();
      load();
      showToast('Đã thêm — nội dung đang ở trạng thái CHƯA đăng công khai.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi lưu nội dung');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (item: Row) => {
    try {
      await updateTrustProofItem(item.id, { published: !item.published });
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi cập nhật');
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteTrustProofItem(id);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi xoá');
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl md:text-2xl font-display text-forest-900 mb-1">Uy tín &amp; Bằng chứng</h1>
      <p className="text-sm text-forest-500 mb-6">
        Cảm nhận khách hàng, tin báo chí, ảnh sự kiện thật. Chỉ hiển thị trên trang chủ khi đã bấm
        <strong> Đăng công khai</strong> — mặc định luôn ở trạng thái ẩn khi mới thêm.
      </p>

      {toast && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-forest-900 text-white text-sm">{toast}</div>
      )}

      {/* Form thêm mới */}
      <div className="bg-white border border-cream-200 rounded-2xl p-4 md:p-6 mb-8">
        <h2 className="font-semibold text-forest-900 mb-4">Thêm nội dung mới</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-forest-500 mb-1">Loại</label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as TrustProofItem['kind'])}
              className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm"
            >
              {Object.entries(KIND_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-forest-500 mb-1">Tên nguồn (khách hàng/báo)</label>
            <input
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm"
              placeholder="VD: Chị Lan, TP.HCM"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-forest-500 mb-1">Nội dung</label>
            <textarea
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              rows={3}
              className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Trích dẫn cảm nhận thật hoặc tóm tắt tin báo chí"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-forest-500 mb-1">Link nguồn (tuỳ chọn)</label>
            <input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-forest-500 mb-1">Ảnh (tuỳ chọn)</label>
            <label className="flex items-center gap-2 border border-dashed border-cream-300 rounded-lg px-3 py-2 text-sm cursor-pointer text-forest-500">
              <ImagePlus className="w-4 h-4" />
              {imageFile ? imageFile.name : 'Chọn ảnh'}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickImage(e.target.files?.[0] ?? null)} />
            </label>
            {imagePreview && <img src={imagePreview} alt="" className="mt-2 h-20 rounded-lg object-cover" />}
          </div>
        </div>
        <Button
          onClick={submit}
          disabled={saving || !quoteText.trim() || !sourceName.trim()}
          className="w-full sm:w-auto mt-4"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Thêm nội dung
        </Button>
      </div>

      {/* Danh sách */}
      {loading ? (
        <p className="text-sm text-forest-500">Đang tải…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-forest-500">Chưa có nội dung nào.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-cream-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              {item.image_url ? (
                <img src={item.image_url} alt="" className="w-full sm:w-20 h-20 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-full sm:w-20 h-20 rounded-lg bg-cream-100 flex items-center justify-center shrink-0">
                  <QuoteIcon className="w-6 h-6 text-cream-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-xs text-forest-400">{KIND_LABELS[item.kind]}</span>
                <p className="text-sm text-forest-800 truncate">{item.quote_text}</p>
                <p className="text-xs text-forest-500">{item.source_name}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <label className="flex items-center gap-2 text-xs text-forest-600">
                  <input type="checkbox" checked={item.published} onChange={() => togglePublish(item)} />
                  Đăng công khai
                </label>
                <Button
                  onClick={() => remove(item.id)}
                  variant="danger"
                  size="icon"
                  aria-label="Xoá"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
