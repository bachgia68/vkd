import { useEffect, useState } from 'react';
import { Eye, EyeOff, Trash2, ImagePlus, Loader2, ImageOff } from 'lucide-react';
import {
  fetchAllCertificationImages,
  createCertificationImage,
  updateCertificationImage,
  deleteCertificationImage,
  uploadCertificationImage,
  type CertificationImage,
} from '../adminApi';
import { Button } from '../../components/ui/button';

type Row = CertificationImage & { visible: boolean };

export default function CertificationsGalleryPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [nameVi, setNameVi] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchAllCertificationImages()
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
      await updateCertificationImage(row.id, { visible: !row.visible });
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi cập nhật');
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteCertificationImage(id);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi xoá');
    }
  };

  const submit = async () => {
    if (!imageFile || !nameVi.trim()) return;
    setSaving(true);
    try {
      const image_url = await uploadCertificationImage(imageFile);
      await createCertificationImage({
        image_url,
        name_vi: nameVi.trim(),
        sort_order: rows.length + 1,
      });
      setNameVi('');
      onPickImage(null);
      load();
      showToast('Đã thêm chứng nhận — đang hiện trên trang chủ.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi tải ảnh lên');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl md:text-2xl font-display text-forest-900 mb-1">Giấy Chứng Nhận Quốc Tế</h1>
      <p className="text-sm text-forest-500 mb-6">
        Ảnh giấy chứng nhận thật (cGMP, HACCP, ISO, chứng nhận sâm...) hiện trong
        carousel "Giấy Chứng Nhận Quốc Tế" trên trang chủ. Thêm/ẩn/xoá tại đây —
        thay đổi hiện lên trang chủ ngay, không cần sửa code.
      </p>

      {toast && <div className="mb-4 px-4 py-2 rounded-lg bg-forest-900 text-white text-sm">{toast}</div>}

      <div className="bg-white border border-cream-200 rounded-2xl p-4 md:p-6 mb-8">
        <h2 className="font-semibold text-forest-900 mb-4">Thêm chứng nhận mới</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-forest-500 mb-1">Tên chứng nhận</label>
            <input
              value={nameVi}
              onChange={(e) => setNameVi(e.target.value)}
              className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm"
              placeholder="VD: Chứng Nhận Vùng Trồng 2026"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-forest-500 mb-1">Ảnh chứng nhận</label>
            <label className="flex items-center gap-2 border border-dashed border-cream-300 rounded-lg px-3 py-2 text-sm cursor-pointer text-forest-500">
              <ImagePlus className="w-4 h-4" />
              {imageFile ? imageFile.name : 'Chọn ảnh'}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickImage(e.target.files?.[0] ?? null)} />
            </label>
            {imagePreview && <img src={imagePreview} alt="" className="mt-2 h-20 rounded-lg object-contain" />}
          </div>
        </div>
        <Button
          onClick={submit}
          disabled={saving || !imageFile || !nameVi.trim()}
          className="w-full sm:w-auto mt-4"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          Thêm chứng nhận
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-forest-500">Đang tải…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-forest-500">
          Chưa có chứng nhận nào thêm ở đây — trang chủ đang hiện 7 ảnh mặc định
          (cGMP, HACCP, ISO 9001, ISO 22000, 3 chứng nhận sâm). Thêm ảnh tại đây
          sẽ được CỘNG THÊM vào carousel đó.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {rows.map((row) => (
            <div key={row.id} className="bg-white border border-cream-200 rounded-xl overflow-hidden">
              <div className="aspect-[3/4] bg-cream-100">
                {row.image_url ? (
                  <img src={row.image_url} alt={row.name_vi} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="w-6 h-6 text-cream-400" />
                  </div>
                )}
              </div>
              <div className="p-2.5 space-y-2">
                <p className="text-xs text-forest-600 truncate" title={row.name_vi}>{row.name_vi}</p>
                <div className="flex items-center justify-between gap-1">
                  <Button
                    onClick={() => toggle(row)}
                    size="sm"
                    className={`h-auto px-2 py-1 text-[11px] rounded-lg ${
                      row.visible ? 'bg-forest-100 text-forest-800 hover:bg-forest-200' : 'bg-gold-400/15 text-gold-700 hover:bg-gold-400/25'
                    }`}
                  >
                    {row.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {row.visible ? 'Đang hiện' : 'Đang ẩn'}
                  </Button>
                  <Button
                    onClick={() => remove(row.id)}
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-600 hover:bg-red-50"
                    aria-label="Xoá"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
