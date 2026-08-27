import { useEffect, useState } from 'react';
import {
  Save, Loader2, Type, Share2, Phone, Plus, Trash2, Pencil, Eye, EyeOff,
  Link2, Video, MessageCircle, Music2,
} from 'lucide-react';
import {
  fetchAllTextOverrides, upsertTextOverride,
  fetchAllSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink,
  fetchAllContactPhones, createContactPhone, updateContactPhone, deleteContactPhone,
  type SocialLink, type ContactPhone,
} from '../adminApi';
import { translations } from '../../i18n/translations';
import { Button } from '../../components/ui/button';

const SOCIAL_PLATFORMS = ['Facebook', 'TikTok', 'YouTube', 'Instagram', 'Zalo', 'WhatsApp'];

const SOCIAL_ICONS: Record<string, typeof Share2> = {
  Facebook: Link2,
  TikTok: Music2,
  YouTube: Video,
  Instagram: Link2,
  Zalo: MessageCircle,
  WhatsApp: Share2,
};

interface FieldDef {
  key: string;
  label: string;
  placeholder: string;
  textarea?: boolean;
}

const FIELDS: FieldDef[] = [
  { key: 'header.nav.home', label: 'Menu — Trang chủ', placeholder: translations.vi.nav.home },
  { key: 'header.nav.about', label: 'Menu — Giới thiệu', placeholder: translations.vi.nav.about },
  { key: 'header.nav.products', label: 'Menu — Sản phẩm', placeholder: translations.vi.nav.products },
  { key: 'header.nav.traceability', label: 'Menu — Truy xuất', placeholder: translations.vi.nav.traceability },
  { key: 'header.nav.blog', label: 'Menu — Blog', placeholder: translations.vi.nav.blog },
  { key: 'header.nav.partnership', label: 'Menu — Hợp tác', placeholder: translations.vi.nav.b2b },
  { key: 'footer.brandDesc', label: 'Mô tả thương hiệu (cột đầu Footer)', placeholder: translations.vi.footer.brandDesc, textarea: true },
  { key: 'footer.quickLinks', label: 'Tiêu đề cột — Liên Kết Nhanh', placeholder: translations.vi.footer.quickLinks },
  { key: 'footer.contact', label: 'Tiêu đề cột — Liên Hệ', placeholder: translations.vi.footer.contact },
  { key: 'footer.followUs', label: 'Tiêu đề cột — Theo Dõi', placeholder: translations.vi.footer.followUs },
  { key: 'footer.email', label: 'Email liên hệ (Footer)', placeholder: translations.vi.footer.email },
  { key: 'footer.address', label: 'Địa chỉ (Footer)', placeholder: translations.vi.footer.address, textarea: true },
  { key: 'footer.phone', label: 'Zalo/WhatsApp text (Footer)', placeholder: translations.vi.footer.phone },
  { key: 'footer.copyright', label: 'Dòng bản quyền (cuối Footer)', placeholder: translations.vi.footer.copyright },
  { key: 'policies.privacy', label: 'Link chính sách — Bảo Mật', placeholder: translations.vi.policies.privacy },
  { key: 'policies.terms', label: 'Link chính sách — Điều Khoản', placeholder: translations.vi.policies.terms },
  { key: 'policies.shipping', label: 'Link chính sách — Vận Chuyển', placeholder: translations.vi.policies.shipping },
  { key: 'policies.refund', label: 'Link chính sách — Đổi Trả', placeholder: translations.vi.policies.refund },
];

export default function HeaderFooterPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [socialLinks, setSocialLinks] = useState<(SocialLink & { visible: boolean })[]>([]);
  const [phones, setPhones] = useState<(ContactPhone & { visible: boolean })[]>([]);

  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [editSocialPlatform, setEditSocialPlatform] = useState('');
  const [editSocialUrl, setEditSocialUrl] = useState('');
  const [newSocialPlatform, setNewSocialPlatform] = useState(SOCIAL_PLATFORMS[0]);
  const [newSocialUrl, setNewSocialUrl] = useState('');

  const [editingPhoneId, setEditingPhoneId] = useState<string | null>(null);
  const [editPhoneLabel, setEditPhoneLabel] = useState('');
  const [editPhoneValue, setEditPhoneValue] = useState('');
  const [newPhoneLabel, setNewPhoneLabel] = useState('');
  const [newPhoneValue, setNewPhoneValue] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([fetchAllTextOverrides(), fetchAllSocialLinks(), fetchAllContactPhones()])
      .then(([rows, socials, phoneRows]) => {
        const map: Record<string, string> = {};
        rows.forEach((r) => {
          map[r.key] = r.value_vi;
        });
        setValues(map);
        setSocialLinks(socials);
        setPhones(phoneRows);
      })
      .catch((e) => showToast(e instanceof Error ? e.message : 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const save = async (key: string) => {
    setSavingKey(key);
    try {
      await upsertTextOverride(key, (values[key] ?? '').trim());
      showToast('Đã lưu — hiệu lực ngay trên Header/Footer.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi lưu');
    } finally {
      setSavingKey(null);
    }
  };

  // ---- Social links ----
  const addSocial = async () => {
    if (!newSocialUrl.trim()) return;
    try {
      await createSocialLink(newSocialPlatform, newSocialUrl.trim());
      setNewSocialUrl('');
      load();
      showToast('Đã thêm liên kết mạng xã hội.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi thêm liên kết');
    }
  };
  const toggleSocialVisible = async (s: SocialLink & { visible: boolean }) => {
    try {
      await updateSocialLink(s.id, { visible: !s.visible });
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi cập nhật');
    }
  };
  const startEditSocial = (s: SocialLink) => {
    setEditingSocialId(s.id);
    setEditSocialPlatform(s.platform);
    setEditSocialUrl(s.url);
  };
  const saveEditSocial = async (id: string) => {
    try {
      await updateSocialLink(id, { platform: editSocialPlatform, url: editSocialUrl.trim() });
      setEditingSocialId(null);
      load();
      showToast('Đã lưu thay đổi.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi lưu');
    }
  };
  const removeSocial = async (id: string) => {
    if (!window.confirm('Xoá liên kết mạng xã hội này?')) return;
    try {
      await deleteSocialLink(id);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi xoá liên kết');
    }
  };

  // ---- Contact phones ----
  const addPhone = async () => {
    if (!newPhoneLabel.trim() || !newPhoneValue.trim()) return;
    try {
      await createContactPhone(newPhoneLabel.trim(), newPhoneValue.trim());
      setNewPhoneLabel('');
      setNewPhoneValue('');
      load();
      showToast('Đã thêm số điện thoại.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi thêm số điện thoại');
    }
  };
  const togglePhoneVisible = async (p: ContactPhone & { visible: boolean }) => {
    try {
      await updateContactPhone(p.id, { visible: !p.visible });
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi cập nhật');
    }
  };
  const startEditPhone = (p: ContactPhone) => {
    setEditingPhoneId(p.id);
    setEditPhoneLabel(p.label);
    setEditPhoneValue(p.value);
  };
  const saveEditPhone = async (id: string) => {
    try {
      await updateContactPhone(id, { label: editPhoneLabel.trim(), value: editPhoneValue.trim() });
      setEditingPhoneId(null);
      load();
      showToast('Đã lưu thay đổi.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi lưu');
    }
  };
  const removePhone = async (id: string) => {
    if (!window.confirm('Xoá số điện thoại này?')) return;
    try {
      await deleteContactPhone(id);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi xoá số điện thoại');
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-xl md:text-2xl font-display text-forest-900 mb-1 flex items-center gap-2">
        <Type className="w-5 h-5 text-gold-600" />
        Header &amp; Footer
      </h1>
      <p className="text-sm text-forest-500 mb-6">
        Sửa nhãn menu, tiêu đề Footer, mạng xã hội và số điện thoại liên hệ (chỉ bản tiếng Việt). Để trống
        rồi lưu để quay lại mặc định trong <code>src/i18n/translations.ts</code>.
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

          {/* Social links */}
          <div className="bg-white border border-cream-200 rounded-2xl p-4 md:p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-forest-900 mb-1">
              <Share2 className="w-4 h-4 text-gold-600" />
              Mạng Xã Hội
            </h2>
            <p className="text-xs text-forest-500 mb-4">
              Icon hiển thị đúng theo nền tảng ở Footer. Ẩn để tạm gỡ khỏi Footer mà không mất dữ liệu.
            </p>

            <div className="space-y-2 mb-4">
              {socialLinks.length === 0 ? (
                <p className="text-sm text-forest-400">Chưa có liên kết mạng xã hội nào.</p>
              ) : (
                socialLinks.map((s) => {
                  const Icon = SOCIAL_ICONS[s.platform] ?? Link2;
                  const isEditing = editingSocialId === s.id;
                  return (
                    <div key={s.id} className="bg-cream-50 rounded-xl p-3 text-sm">
                      {isEditing ? (
                        <div className="flex flex-col md:flex-row gap-2">
                          <select
                            value={editSocialPlatform}
                            onChange={(e) => setEditSocialPlatform(e.target.value)}
                            className="border border-cream-300 rounded-lg px-2 py-1.5 text-sm"
                          >
                            {SOCIAL_PLATFORMS.map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                          <input
                            value={editSocialUrl}
                            onChange={(e) => setEditSocialUrl(e.target.value)}
                            className="flex-1 border border-cream-300 rounded-lg px-3 py-1.5 text-sm"
                            placeholder="URL"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => saveEditSocial(s.id)}>Lưu</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingSocialId(null)}>Huỷ</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <div className={`flex items-center gap-2 min-w-0 ${s.visible ? '' : 'opacity-40'}`}>
                            <Icon className="w-4 h-4 text-forest-600 flex-shrink-0" />
                            <b className="flex-shrink-0">{s.platform}</b>
                            <span className="text-forest-500 truncate">{s.url}</span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              onClick={() => toggleSocialVisible(s)}
                              variant="ghost"
                              size="icon"
                              aria-label={s.visible ? 'Ẩn' : 'Hiện'}
                              className="h-8 w-8 text-forest-400 hover:text-forest-700"
                            >
                              {s.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </Button>
                            <Button
                              onClick={() => startEditSocial(s)}
                              variant="ghost"
                              size="icon"
                              aria-label="Sửa"
                              className="h-8 w-8 text-forest-400 hover:text-forest-700"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => removeSocial(s.id)}
                              variant="ghost"
                              size="icon"
                              aria-label="Xoá"
                              className="h-8 w-8 text-forest-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex items-center gap-2 border border-cream-300 rounded-lg px-2 py-1.5">
                {(() => {
                  const PreviewIcon = SOCIAL_ICONS[newSocialPlatform] ?? Link2;
                  return <PreviewIcon className="w-4 h-4 text-forest-500 flex-shrink-0" />;
                })()}
                <select
                  value={newSocialPlatform}
                  onChange={(e) => setNewSocialPlatform(e.target.value)}
                  className="text-sm bg-transparent"
                >
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <input
                value={newSocialUrl}
                onChange={(e) => setNewSocialUrl(e.target.value)}
                placeholder="Dán link trang/kênh"
                className="flex-1 border border-cream-300 rounded-lg px-3 py-2 text-sm"
              />
              <Button onClick={addSocial} size="sm">
                <Plus className="w-4 h-4" /> Thêm
              </Button>
            </div>
          </div>

          {/* Contact phones */}
          <div className="bg-white border border-cream-200 rounded-2xl p-4 md:p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-forest-900 mb-1">
              <Phone className="w-4 h-4 text-gold-600" />
              Số Điện Thoại Liên Hệ
            </h2>
            <p className="text-xs text-forest-500 mb-4">
              Hiển thị ở Footer và các khối liên hệ trên trang chủ.
            </p>

            <div className="space-y-2 mb-4">
              {phones.length === 0 ? (
                <p className="text-sm text-forest-400">Chưa có số điện thoại nào.</p>
              ) : (
                phones.map((p) => {
                  const isEditing = editingPhoneId === p.id;
                  return (
                    <div key={p.id} className="bg-cream-50 rounded-xl p-3 text-sm">
                      {isEditing ? (
                        <div className="flex flex-col md:flex-row gap-2">
                          <input
                            value={editPhoneLabel}
                            onChange={(e) => setEditPhoneLabel(e.target.value)}
                            className="border border-cream-300 rounded-lg px-3 py-1.5 text-sm"
                            placeholder="Nhãn"
                          />
                          <input
                            value={editPhoneValue}
                            onChange={(e) => setEditPhoneValue(e.target.value)}
                            className="flex-1 border border-cream-300 rounded-lg px-3 py-1.5 text-sm"
                            placeholder="Số điện thoại"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => saveEditPhone(p.id)}>Lưu</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingPhoneId(null)}>Huỷ</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span className={p.visible ? '' : 'opacity-40'}>
                            <b>{p.label}</b>: {p.value}
                          </span>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              onClick={() => togglePhoneVisible(p)}
                              variant="ghost"
                              size="icon"
                              aria-label={p.visible ? 'Ẩn' : 'Hiện'}
                              className="h-8 w-8 text-forest-400 hover:text-forest-700"
                            >
                              {p.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </Button>
                            <Button
                              onClick={() => startEditPhone(p)}
                              variant="ghost"
                              size="icon"
                              aria-label="Sửa"
                              className="h-8 w-8 text-forest-400 hover:text-forest-700"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => removePhone(p.id)}
                              variant="ghost"
                              size="icon"
                              aria-label="Xoá"
                              className="h-8 w-8 text-forest-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <input
                value={newPhoneLabel}
                onChange={(e) => setNewPhoneLabel(e.target.value)}
                placeholder="Nhãn (vd. Hotline)"
                className="flex-1 border border-cream-300 rounded-lg px-3 py-2 text-sm"
              />
              <input
                value={newPhoneValue}
                onChange={(e) => setNewPhoneValue(e.target.value)}
                placeholder="Số điện thoại"
                className="flex-1 border border-cream-300 rounded-lg px-3 py-2 text-sm"
              />
              <Button onClick={addPhone} size="sm">
                <Plus className="w-4 h-4" /> Thêm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
