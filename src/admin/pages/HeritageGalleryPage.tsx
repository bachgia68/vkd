import { useEffect, useState } from 'react';
import { Eye, EyeOff, Trash2, ImagePlus, Loader2, ImageOff } from 'lucide-react';
import {
  fetchAllHeritageGalleryImages,
  createHeritageGalleryImage,
  updateHeritageGalleryImage,
  deleteHeritageGalleryImage,
  uploadHeritageGalleryImage,
  type HeritageGalleryImage,
} from '../adminApi';

type Row = HeritageGalleryImage & { visible: boolean };

export default function HeritageGalleryPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [altVi, setAltVi] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchAllHeritageGalleryImages()
      .then(setRows)
      .catch((e) => showToast(e instanceof Error ? e.message : 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const onPickImage = (file: File | null) => {
    setImageFile(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const toggle = async (row: Row) => {
    try {
      await updateHeritageGalleryImage(row.id, { visible: !row.visible });
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi cập nhật');
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteHeritageGalleryImage(id);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi xoá');
    }
  };

  const submit = async () => {
    if (!imageFile || !altVi.trim()) return;
    setSaving(true);
    try {
      const image_url = await uploadHeritageGalleryImage(imageFile);
      await createHeritageGalleryImage({
        image_url,
        alt_vi: altVi.trim(),
        sort_order: rows.length + 1,
      });
      setAltVi('');
      onPickImage(null);
      load();
      showToast('Đã thêm ảnh — đang hiện trên trang chủ.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi tải ảnh lên');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl md:text-2xl font-display text-forest-900 mb-1">Vườn Sâm Nguyên Sinh — Thư viện ảnh</h1>
      <p className="text-sm text-forest-500 mb-6">
        Ảnh trong mục "Vườn Sâm Nguyên Sinh" trên trang chủ. Ẩn/hiện hoặc xoá từng
        ảnh tại đây — thay đổi lên trang chủ ngay, không cần sửa code. Muốn ẩn cả
        mục này, vào <strong>Quản lý Trang</strong>.
      </p>

      {toast && <div className="mb-4 px-4 py-2 rounded-lg bg-forest-900 text-white text-sm">{toast}</div>}

      <div className="bg-white border border-cream-200 rounded-2xl p-4 md:p-6 mb-8">
        <h2 className="font-semibold text-forest-900 mb-4">Thêm ảnh mới</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-forest-500 mb-1">Mô tả ảnh (alt text)</label>
            <input
              value={altVi}
              onChange={(e) => setAltVi(e.target.value)}
              className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm"
              placeholder="VD: Vườn sâm nguyên sinh buổi sáng"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-forest-500 mb-1">Ảnh</label>
            <label className="flex items-center gap-2 border border-dashed border-cream-300 rounded-lg px-3 py-2 text-sm cursor-pointer text-forest-500">
              <ImagePlus className="w-4 h-4" />
              {imageFile ? imageFile.name : 'Chọn ảnh'}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickImage(e.target.files?.[0] ?? null)} />
            </label>
            {imagePreview && <img src={imagePreview} alt="" className="mt-2 h-20 rounded-lg object-cover" />}
          </div>
        </div>
        <button
          onClick={submit}
          disabled={saving || !imageFile || !altVi.trim()}
          className="w-full sm:w-auto mt-4 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-forest-900 text-white text-sm font-medium disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          Thêm ảnh
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-forest-500">Đang tải…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-forest-500">Chưa có ảnh nào.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {rows.map((row) => (
            <div key={row.id} className="bg-white border border-cream-200 rounded-xl overflow-hidden">
              <div className="aspect-square bg-cream-100">
                {row.image_url ? (
                  <img src={row.image_url} alt={row.alt_vi} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="w-6 h-6 text-cream-400" />
                  </div>
                )}
              </div>
              <div className="p-2.5 space-y-2">
                <p className="text-xs text-forest-600 truncate" title={row.alt_vi}>{row.alt_vi}</p>
                <div className="flex items-center justify-between gap-1">
                  <button
                    onClick={() => toggle(row)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium ${
                      row.visible ? 'bg-forest-100 text-forest-800' : 'bg-gold-400/15 text-gold-700'
                    }`}
                  >
                    {row.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {row.visible ? 'Đang hiện' : 'Đang ẩn'}
                  </button>
                  <button
                    onClick={() => remove(row.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                    aria-label="Xoá"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
