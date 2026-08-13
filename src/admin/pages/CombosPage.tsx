import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader, Upload, Search, CheckSquare } from 'lucide-react';
import {
  fetchAllComboSets,
  createComboSet,
  updateComboSet,
  deleteComboSet,
  uploadComboImage,
  type ComboSet,
} from '../adminApi';
import { products } from '../../data/products';
import { getComboPosterImage, getComboSuggestedPrice, getComboAutoDescription } from '../../data/combos';
import { Button } from '../../components/ui/button';

type EditableCombo = ComboSet & { active: boolean };

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function CombosPage() {
  const [combos, setCombos] = useState<EditableCombo[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [theme, setTheme] = useState('');
  const [months, setMonths] = useState<Set<number>>(new Set());
  const [selectedSkus, setSelectedSkus] = useState<Set<string>>(new Set());
  const [price, setPrice] = useState('');
  const [priceTouched, setPriceTouched] = useState(false);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const skuList = Array.from(selectedSkus);
  const suggestedPrice = getComboSuggestedPrice(skuList);
  const firstComponentImage = skuList.length > 0 ? products.find((p) => p.sku === skuList[0])?.image : undefined;

  // Giá combo tự động = tổng giá các sản phẩm đã chọn, cho tới khi admin tự
  // gõ tay (priceTouched) — lúc đó tôn trọng giá admin đã nhập, chỉ hiện gợi
  // ý bên dưới để admin có thể áp lại nếu muốn.
  useEffect(() => {
    if (!priceTouched && skuList.length > 0) {
      setPrice(suggestedPrice > 0 ? String(suggestedPrice) : '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSkus.size, suggestedPrice, priceTouched]);

  const load = () => {
    setLoading(true);
    fetchAllComboSets()
      .then(setCombos)
      .catch((e) => showToast(`Lỗi tải combo: ${e instanceof Error ? e.message : String(e)}`))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleMonth = (m: number) => {
    setMonths((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  };

  const toggleSku = (sku: string) => {
    setSelectedSkus((prev) => {
      const next = new Set(prev);
      if (next.has(sku)) next.delete(sku);
      else next.add(sku);
      return next;
    });
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadComboImage(file);
      setImageUrl(url);
    } catch (e) {
      showToast(`Lỗi tải ảnh: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setTheme('');
    setMonths(new Set());
    setSelectedSkus(new Set());
    setPrice('');
    setPriceTouched(false);
    setDescription('');
    setImageUrl('');
  };

  const handleCreate = async () => {
    if (!name.trim() || selectedSkus.size === 0 || !price || Number(price) <= 0) {
      showToast('Cần nhập tên, chọn ít nhất 1 sản phẩm, và giá lớn hơn 0.');
      return;
    }
    setSaving(true);
    try {
      await createComboSet({
        slug: `${slugify(name)}-${Date.now().toString(36)}`,
        name_vi: name.trim(),
        theme: theme.trim(),
        month_tags: Array.from(months),
        component_skus: Array.from(selectedSkus),
        price_vnd: Number(price),
        poster_image_url: imageUrl || null,
        description_vi: description.trim() || getComboAutoDescription(Array.from(selectedSkus)),
      });
      showToast('Đã tạo combo — đang ở trạng thái nháp, bấm "Kích hoạt" để hiện lên site.');
      resetForm();
      load();
    } catch (e) {
      showToast(`Lỗi tạo combo: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (combo: EditableCombo) => {
    try {
      await updateComboSet(combo.id, { active: !combo.active });
      load();
    } catch (e) {
      showToast(`Lỗi cập nhật: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteComboSet(id);
      load();
    } catch (e) {
      showToast(`Lỗi xoá: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const filteredProducts = products.filter(
    (p) => !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-forest-900">Combo & Set Quà Tặng</h1>
        <p className="text-sm text-forest-700/70 mt-1">
          Lắp combo từ sản phẩm có sẵn theo tháng/chủ đề. Combo mới tạo ở trạng thái nháp — bấm "Kích hoạt" để hiện trên trang chủ và trang Set Quà Tặng.
        </p>
      </div>

      <section className="bg-white rounded-2xl border border-cream-300 p-4 sm:p-6 space-y-4 max-w-full">
        <h2 className="font-medium text-forest-900">Tạo combo mới</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-forest-700/70 mb-1.5 uppercase tracking-wide">Tên combo</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Combo 3 — Sum Vầy"
              className="w-full px-3 py-2.5 rounded-lg border border-cream-300 text-sm focus:outline-none focus:border-gold-400"
            />
          </div>
          <div>
            <label className="block text-xs text-forest-700/70 mb-1.5 uppercase tracking-wide">Chủ đề</label>
            <input
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="VD: Vu Lan, Tết, Trung Thu"
              className="w-full px-3 py-2.5 rounded-lg border border-cream-300 text-sm focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-forest-700/70 mb-1.5 uppercase tracking-wide">Tháng áp dụng</label>
          <div className="flex flex-wrap gap-2">
            {MONTHS.map((m) => (
              <Button
                key={m}
                type="button"
                onClick={() => toggleMonth(m)}
                variant={months.has(m) ? 'primary' : 'outline'}
                size="sm"
                className="h-auto py-2"
              >
                Tháng {m}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-forest-700/70 mb-1.5 uppercase tracking-wide">Ảnh poster</label>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="btn-secondary w-full sm:w-auto cursor-pointer">
              {uploading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {imageUrl ? 'Đổi ảnh' : 'Tải ảnh lên'}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              />
            </label>
            {imageUrl && <img src={imageUrl} alt="" className="w-16 h-16 object-cover rounded-lg" />}
            {!imageUrl && firstComponentImage && (
              <div className="flex items-center gap-2">
                <img src={firstComponentImage} alt="" className="w-16 h-16 object-cover rounded-lg opacity-70" />
                <span className="text-xs text-forest-700/60 max-w-[14rem]">
                  Chưa tải ảnh riêng — sẽ tự dùng ảnh sản phẩm đầu tiên trong combo
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs text-forest-700/70 mb-1.5 uppercase tracking-wide">
            Sản phẩm trong combo ({selectedSkus.size} đã chọn)
          </label>
          <div className="relative mb-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cream-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên hoặc SKU..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-cream-300 text-sm focus:outline-none focus:border-gold-400"
            />
          </div>
          <div className="max-h-64 overflow-y-auto border border-cream-200 rounded-xl divide-y divide-cream-100">
            {filteredProducts.map((p) => (
              <label key={p.sku} className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-cream-50 cursor-pointer">
                <input type="checkbox" checked={selectedSkus.has(p.sku)} onChange={() => toggleSku(p.sku)} className="accent-gold-500 shrink-0" />
                <span className="text-forest-500/70 w-16 shrink-0 text-xs">{p.sku}</span>
                <span className="flex-1 text-forest-900">{p.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-forest-700/70 mb-1.5 uppercase tracking-wide">Giá combo (VND)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setPriceTouched(true);
              }}
              placeholder="1430000"
              className="w-full px-3 py-2.5 rounded-lg border border-cream-300 text-sm focus:outline-none focus:border-gold-400"
            />
            {suggestedPrice > 0 && (
              <p className="text-xs text-forest-700/60 mt-1.5">
                Tổng giá lẻ: {suggestedPrice.toLocaleString('vi-VN')}đ
                {priceTouched && Number(price) !== suggestedPrice && (
                  <>
                    {' — '}
                    <Button
                      type="button"
                      onClick={() => {
                        setPrice(String(suggestedPrice));
                        setPriceTouched(false);
                      }}
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-gold-600 underline underline-offset-2 hover:text-gold-700 hover:bg-transparent"
                    >
                      Dùng giá này
                    </Button>
                  </>
                )}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs text-forest-700/70 mb-1.5 uppercase tracking-wide">Mô tả ngắn</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Để trống sẽ tự điền: Gồm: <tên (giá)> từng sản phẩm đã chọn"
              className="w-full px-3 py-2.5 rounded-lg border border-cream-300 text-sm focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        <Button onClick={handleCreate} disabled={saving} variant="gold" className="w-full sm:w-auto">
          {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Tạo combo
        </Button>
      </section>

      <section className="bg-white rounded-2xl border border-cream-300 p-4 sm:p-6">
        <h2 className="font-medium text-forest-900 mb-4">Danh sách combo</h2>
        {loading ? (
          <p className="text-sm text-forest-700/60">Đang tải...</p>
        ) : combos.length === 0 ? (
          <p className="text-sm text-forest-700/60">Chưa có combo nào.</p>
        ) : (
          <div className="space-y-3">
            {combos.map((c) => (
              <div key={c.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl border border-cream-200">
                <img src={getComboPosterImage(c)} alt="" className="w-14 h-14 object-cover rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-forest-900 truncate">{c.name_vi}</p>
                  <p className="text-xs text-forest-700/60">
                    {c.theme || '—'} · Tháng {c.month_tags.join(', ') || '—'} · {c.price_vnd.toLocaleString('vi-VN')}đ · {c.component_skus.length} SP
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={() => toggleActive(c)}
                    size="sm"
                    className={`w-full sm:w-auto ${
                      c.active ? 'bg-forest-100 text-forest-800 hover:bg-forest-200' : 'bg-gold-400/15 text-gold-700 hover:bg-gold-400/25'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    {c.active ? 'Đang hiện' : 'Kích hoạt'}
                  </Button>
                  <Button onClick={() => handleDelete(c.id)} variant="danger" size="icon" aria-label="Xoá combo">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {toast && (
        <div className="fixed bottom-6 right-6 left-6 sm:left-auto bg-forest-900 text-cream-50 px-4 py-3 rounded-xl shadow-lg text-sm sm:max-w-sm">
          {toast}
        </div>
      )}
    </div>
  );
}
