import { useEffect, useState } from 'react';
import { Plus, Trash2, MapPin, Phone, Share2, Handshake } from 'lucide-react';
import {
  createSiteAddress,
  deleteSiteAddress,
  createContactPhone,
  deleteContactPhone,
  createSocialLink,
  deleteSocialLink,
  fetchB2BLeads,
  markLeadContacted,
  deleteLead,
  type SiteAddress,
  type ContactPhone,
  type SocialLink,
  type B2BLead,
} from '../adminApi';
import { fetchSiteAddresses, fetchContactPhones, fetchSocialLinks } from '../../lib/siteContentApi';

const LEAD_TYPE_LABELS: Record<string, string> = {
  distributor: 'Nhà Phân Phối',
  investor: 'Nhà Đầu Tư',
  oem: 'OEM/ODM',
};

export default function SettingsPage() {
  const [addresses, setAddresses] = useState<SiteAddress[]>([]);
  const [phones, setPhones] = useState<ContactPhone[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [leads, setLeads] = useState<B2BLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const load = () => {
    setLoading(true);
    Promise.all([fetchSiteAddresses(), fetchContactPhones(), fetchSocialLinks(), fetchB2BLeads()])
      .then(([a, p, s, l]) => {
        setAddresses(a);
        setPhones(p);
        setSocialLinks(s);
        setLeads(l);
        setLoadError(null);
      })
      .catch((e) => setLoadError(e instanceof Error ? e.message : 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const [newAddr, setNewAddr] = useState<Omit<SiteAddress, 'id'>>({
    name: '',
    address: '',
    hours: '',
    phone: '(84) 984 999 309',
    category: 'showroom',
  });
  const [newPhoneLabel, setNewPhoneLabel] = useState('');
  const [newPhoneValue, setNewPhoneValue] = useState('');
  const [newPlatform, setNewPlatform] = useState('Facebook');
  const [newUrl, setNewUrl] = useState('');

  const addAddress = async () => {
    if (!newAddr.name.trim() || !newAddr.address.trim()) return;
    try {
      await createSiteAddress(newAddr);
      setNewAddr({ name: '', address: '', hours: '', phone: '(84) 984 999 309', category: 'showroom' });
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi thêm địa chỉ');
    }
  };
  const removeAddress = async (id: string) => {
    try {
      await deleteSiteAddress(id);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi xoá địa chỉ');
    }
  };

  const addPhone = async () => {
    if (!newPhoneLabel.trim() || !newPhoneValue.trim()) return;
    try {
      await createContactPhone(newPhoneLabel.trim(), newPhoneValue.trim());
      setNewPhoneLabel('');
      setNewPhoneValue('');
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi thêm số điện thoại');
    }
  };
  const removePhone = async (id: string) => {
    try {
      await deleteContactPhone(id);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi xoá số điện thoại');
    }
  };

  const addSocial = async () => {
    if (!newUrl.trim()) return;
    try {
      await createSocialLink(newPlatform, newUrl.trim());
      setNewUrl('');
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi thêm liên kết');
    }
  };
  const removeSocial = async (id: string) => {
    try {
      await deleteSocialLink(id);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi xoá liên kết');
    }
  };

  const markContacted = async (id: string) => {
    try {
      await markLeadContacted(id);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi cập nhật trạng thái');
    }
  };
  const removeLead = async (id: string) => {
    try {
      await deleteLead(id);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi xoá đăng ký');
    }
  };

  if (loading) return <p className="text-sm text-forest-500">Đang tải dữ liệu…</p>;
  if (loadError) return <p className="text-sm text-red-600">Lỗi tải dữ liệu: {loadError}</p>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-forest-500 mb-1">Cài đặt / Website công khai</p>
        <h1 className="font-display text-3xl text-forest-900">Địa Chỉ, Liên Hệ &amp; Đối Tác</h1>
        <p className="text-sm text-forest-500 mt-1">
          Thay đổi ở đây lưu vào database thật và hiển thị ngay trên trang chủ và footer khách hàng.
        </p>
      </div>

      {/* Addresses */}
      <div className="bg-white rounded-2xl border border-forest-100 p-6 shadow-elegant">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-gold-600" />
          <h3 className="font-display text-lg text-forest-900">Địa chỉ &amp; Vùng trồng</h3>
        </div>

        <div className="space-y-2 mb-5">
          {addresses.length === 0 ? (
            <p className="text-sm text-forest-400">Chưa có địa chỉ bổ sung nào.</p>
          ) : (
            addresses.map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-3 bg-cream-50 rounded-xl p-3.5">
                <div>
                  <p className="text-sm font-medium text-forest-900">
                    {a.name}{' '}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-forest-100 text-forest-600 ml-1">
                      {a.category === 'showroom' ? 'Showroom' : 'Vùng trồng'}
                    </span>
                  </p>
                  <p className="text-xs text-forest-500 mt-0.5">{a.address}</p>
                  <p className="text-xs text-forest-400 mt-0.5">{a.hours} · {a.phone}</p>
                </div>
                <button onClick={() => removeAddress(a.id)} aria-label="Xoá địa chỉ" className="text-forest-400 hover:text-red-600 flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <input
            value={newAddr.name}
            onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
            placeholder="Tên địa điểm (vd. Chi Nhánh Cần Thơ)"
            className="border border-forest-100 rounded-lg px-3 py-2 text-sm"
          />
          <select
            value={newAddr.category}
            onChange={(e) => setNewAddr({ ...newAddr, category: e.target.value as SiteAddress['category'] })}
            className="border border-forest-100 rounded-lg px-3 py-2 text-sm"
          >
            <option value="showroom">Showroom / Chi nhánh</option>
            <option value="growing_region">Vùng trồng</option>
          </select>
          <input
            value={newAddr.address}
            onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
            placeholder="Địa chỉ đầy đủ"
            className="border border-forest-100 rounded-lg px-3 py-2 text-sm md:col-span-2"
          />
          <input
            value={newAddr.hours}
            onChange={(e) => setNewAddr({ ...newAddr, hours: e.target.value })}
            placeholder="Giờ hoạt động (vd. 8:00 — 20:00)"
            className="border border-forest-100 rounded-lg px-3 py-2 text-sm"
          />
          <input
            value={newAddr.phone}
            onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
            placeholder="Số điện thoại"
            className="border border-forest-100 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <button onClick={addAddress} className="btn-primary text-xs mt-3">
          <Plus className="w-4 h-4" /> Thêm địa chỉ
        </button>
      </div>

      {/* Contact & socials */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-forest-100 p-6 shadow-elegant">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-4 h-4 text-gold-600" />
            <h3 className="font-display text-lg text-forest-900">Số điện thoại liên hệ</h3>
          </div>
          <div className="space-y-2 mb-4">
            {phones.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-cream-50 rounded-xl p-3 text-sm">
                <span><b>{p.label}</b>: {p.value}</span>
                <button onClick={() => removePhone(p.id)} aria-label="Xoá số điện thoại" className="text-forest-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newPhoneLabel} onChange={(e) => setNewPhoneLabel(e.target.value)} placeholder="Nhãn (vd. Hotline)" className="flex-1 border border-forest-100 rounded-lg px-3 py-2 text-sm" />
            <input value={newPhoneValue} onChange={(e) => setNewPhoneValue(e.target.value)} placeholder="Số điện thoại" className="flex-1 border border-forest-100 rounded-lg px-3 py-2 text-sm" />
            <button onClick={addPhone} className="btn-primary text-xs px-3"><Plus className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-forest-100 p-6 shadow-elegant">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-4 h-4 text-gold-600" />
            <h3 className="font-display text-lg text-forest-900">Mạng xã hội (Facebook, TikTok...)</h3>
          </div>
          <div className="space-y-2 mb-4">
            {socialLinks.map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-cream-50 rounded-xl p-3 text-sm">
                <span><b>{s.platform}</b>: <span className="text-forest-500 truncate">{s.url}</span></span>
                <button onClick={() => removeSocial(s.id)} aria-label="Xoá liên kết" className="text-forest-400 hover:text-red-600 flex-shrink-0 ml-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <select value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)} className="border border-forest-100 rounded-lg px-2 py-2 text-sm">
              <option>Facebook</option>
              <option>TikTok</option>
              <option>YouTube</option>
              <option>Instagram</option>
              <option>Zalo</option>
              <option>WhatsApp</option>
            </select>
            <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="Dán link trang/kênh" className="flex-1 border border-forest-100 rounded-lg px-3 py-2 text-sm" />
            <button onClick={addSocial} className="btn-primary text-xs px-3"><Plus className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* B2B leads */}
      <div className="bg-white rounded-2xl border border-forest-100 p-6 shadow-elegant">
        <div className="flex items-center gap-2 mb-4">
          <Handshake className="w-4 h-4 text-gold-600" />
          <h3 className="font-display text-lg text-forest-900">Đăng ký hợp tác từ khách hàng (B2B)</h3>
        </div>
        {leads.length === 0 ? (
          <p className="text-sm text-forest-400">Chưa có đăng ký hợp tác nào từ trang B2B.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-forest-900 text-cream-100 text-xs uppercase tracking-wide">
                  <th className="text-left font-medium px-4 py-3">Liên hệ</th>
                  <th className="text-left font-medium px-4 py-3">Loại</th>
                  <th className="text-left font-medium px-4 py-3">Nội dung</th>
                  <th className="text-left font-medium px-4 py-3">Thời gian</th>
                  <th className="text-left font-medium px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-t border-forest-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-forest-900">{l.name}</p>
                      <p className="text-xs text-forest-500">{l.phone} {l.email && `· ${l.email}`}</p>
                    </td>
                    <td className="px-4 py-3">{LEAD_TYPE_LABELS[l.type]}</td>
                    <td className="px-4 py-3 text-forest-600 max-w-xs truncate">{l.message || '—'}</td>
                    <td className="px-4 py-3 text-forest-500">{new Date(l.created_at).toLocaleString('vi-VN')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${l.status === 'new' ? 'bg-gold-100 text-gold-700' : 'bg-forest-100 text-forest-600'}`}>
                        {l.status === 'new' ? 'Mới' : 'Đã liên hệ'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      {l.status === 'new' && (
                        <button onClick={() => markContacted(l.id)} className="text-xs text-forest-600 hover:underline">
                          Đánh dấu đã liên hệ
                        </button>
                      )}
                      <button onClick={() => removeLead(l.id)} aria-label="Xoá" className="text-forest-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-forest-950 text-cream-50 px-5 py-3 rounded-xl text-sm shadow-elegant-lg z-50 border border-gold-400/30">
          {toast}
        </div>
      )}
    </div>
  );
}
