import { useEffect, useState } from 'react';
import { Eye, EyeOff, Trash2, ImagePlus, Loader2, ImageOff, ExternalLink } from 'lucide-react';
import {
  fetchAllFieldVideos,
  createFieldVideo,
  updateFieldVideo,
  deleteFieldVideo,
  uploadFieldVideoThumbnail,
  type FieldVideo,
} from '../adminApi';
import { Button } from '../../components/ui/button';

type Row = FieldVideo & { visible: boolean };

export default function FieldVideosPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [facebookUrl, setFacebookUrl] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchAllFieldVideos()
      .then(setRows)
      .catch((e) => showToast(e instanceof Error ? e.message : 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const onPickThumb = (file: File | null) => {
    setThumbFile(file);
    if (thumbPreview) URL.revokeObjectURL(thumbPreview);
    setThumbPreview(file ? URL.createObjectURL(file) : null);
  };

  const toggle = async (row: Row) => {
    try {
      await updateFieldVideo(row.id, { visible: !row.visible });
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi cập nhật');
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteFieldVideo(id);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi xoá');
    }
  };

  const submit = async () => {
    if (!thumbFile || !facebookUrl.trim() || !title.trim()) return;
    setSaving(true);
    try {
      const thumbnail_url = await uploadFieldVideoThumbnail(thumbFile);
      await createFieldVideo({
        facebook_url: facebookUrl.trim(),
        thumbnail_url,
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        sort_order: rows.length + 1,
      });
      setFacebookUrl('');
      setTitle('');
      setSubtitle('');
      onPickThumb(null);
      load();
      showToast('Đã thêm video — hiện trong danh sách bên dưới.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi tải video lên');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl md:text-2xl font-display text-forest-900 mb-1">Video Thực Địa — Câu chuyện từ Fanpage</h1>
      <p className="text-sm text-forest-500 mb-6">
        Video/ảnh trong mục "Câu Chuyện Thực Địa" trên trang chủ. Click card sẽ mở
        sang link Facebook — không nhúng video nặng vào web. Ẩn/hiện hoặc xoá từng
        video tại đây. Muốn ẩn cả mục này, vào <strong>Quản lý Trang</strong>.
      </p>

      {toast && <div className="mb-4 px-4 py-2 rounded-lg bg-forest-900 text-white text-sm">{toast}</div>}

      <div className="bg-white border border-cream-200 rounded-2xl p-4 md:p-6 mb-8">
        <h2 className="font-semibold text-forest-900 mb-4">Thêm video mới</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-forest-500 mb-1">Link Facebook video</label>
            <input
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm"
              placeholder="https://www.facebook.com/..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-forest-500 mb-1">Tiêu đề</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm"
              placeholder="VD: Hành Trình Gieo Trồng Sâm Ngọc Linh"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-forest-500 mb-1">Mô tả ngắn (không bắt buộc)</label>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm"
              placeholder="VD: Câu chuyện của Khánh và vườn sâm tại Trà Linh"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-forest-500 mb-1">Ảnh thumbnail</label>
            <label className="flex items-center gap-2 border border-dashed border-cream-300 rounded-lg px-3 py-2 text-sm cursor-pointer text-forest-500 w-fit">
              <ImagePlus className="w-4 h-4" />
              {thumbFile ? thumbFile.name : 'Chọn ảnh'}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickThumb(e.target.files?.[0] ?? null)} />
            </label>
            {thumbPreview && <img src={thumbPreview} alt="" className="mt-2 h-24 rounded-lg object-cover" />}
          </div>
        </div>
        <Button
          onClick={submit}
          disabled={saving || !thumbFile || !facebookUrl.trim() || !title.trim()}
          className="w-full sm:w-auto mt-4"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          Thêm video
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-forest-500">Đang tải…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-forest-500">Chưa có video nào.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {rows.map((row) => (
            <div key={row.id} className="bg-white border border-cream-200 rounded-xl overflow-hidden">
              <div className="aspect-[9/16] bg-cream-100">
                {row.thumbnail_url ? (
                  <img src={row.thumbnail_url} alt={row.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="w-6 h-6 text-cream-400" />
                  </div>
                )}
              </div>
              <div className="p-2.5 space-y-2">
                <p className="text-xs text-forest-600 truncate" title={row.title}>{row.title}</p>
                <a
                  href={row.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-forest-400 truncate hover:text-forest-600"
                  title={row.facebook_url}
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  {row.facebook_url}
                </a>
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
