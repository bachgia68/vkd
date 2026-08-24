import { useEffect, useState } from 'react';
import { Plus, Trash2, MapPin, Handshake, MessageCircle } from 'lucide-react';
import {
  createSiteAddress,
  deleteSiteAddress,
  fetchB2BLeads,
  markLeadContacted,
  deleteLead,
  fetchCustomerLeads,
  markCustomerLeadContacted,
  deleteCustomerLead,
  type SiteAddress,
  type B2BLead,
  type CustomerLead,
} from '../adminApi';
import { fetchSiteAddresses } from '../../lib/siteContentApi';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const LEAD_TYPE_LABELS: Record<string, string> = {
  distributor: 'Nhà Phân Phối',
  investor: 'Nhà Đầu Tư',
  oem: 'OEM/ODM',
};

export default function SettingsPage() {
  const [addresses, setAddresses] = useState<SiteAddress[]>([]);
  const [leads, setLeads] = useState<B2BLead[]>([]);
  const [customerLeads, setCustomerLeads] = useState<CustomerLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const load = () => {
    setLoading(true);
    Promise.all([fetchSiteAddresses(), fetchB2BLeads(), fetchCustomerLeads()])
      .then(([a, l, cl]) => {
        setAddresses(a);
        setLeads(l);
        setCustomerLeads(cl);
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

  const markCustomerContacted = async (id: string) => {
    try {
      await markCustomerLeadContacted(id);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi cập nhật trạng thái');
    }
  };
  const removeCustomerLead = async (id: string) => {
    try {
      await deleteCustomerLead(id);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi xoá yêu cầu tư vấn');
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
          Mạng xã hội và số điện thoại liên hệ đã chuyển sang trang{' '}
          <span className="font-medium text-forest-700">Header &amp; Footer</span>.
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
                    <Badge tone="neutral" className="text-[10px] rounded px-2 py-0.5 ml-1">
                      {a.category === 'showroom' ? 'Showroom' : 'Vùng trồng'}
                    </Badge>
                  </p>
                  <p className="text-xs text-forest-500 mt-0.5">{a.address}</p>
                  <p className="text-xs text-forest-400 mt-0.5">{a.hours} · {a.phone}</p>
                </div>
                <Button onClick={() => removeAddress(a.id)} variant="ghost" size="icon" aria-label="Xoá địa chỉ" className="h-8 w-8 text-forest-400 hover:text-red-600 flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </Button>
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
        <Button onClick={addAddress} size="sm" className="mt-3">
          <Plus className="w-4 h-4" /> Thêm địa chỉ
        </Button>
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
                      <Badge tone={l.status === 'new' ? 'gold' : 'neutral'} className="text-[10px] rounded px-2 py-0.5">
                        {l.status === 'new' ? 'Mới' : 'Đã liên hệ'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      {l.status === 'new' && (
                        <Button onClick={() => markContacted(l.id)} variant="ghost" size="sm" className="h-auto p-0 text-forest-600 hover:underline hover:bg-transparent">
                          Đánh dấu đã liên hệ
                        </Button>
                      )}
                      <Button onClick={() => removeLead(l.id)} variant="ghost" size="icon" aria-label="Xoá" className="h-8 w-8 text-forest-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer consultation leads (chatbot) */}
      <div className="bg-white rounded-2xl border border-forest-100 p-6 shadow-elegant">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-4 h-4 text-gold-600" />
          <h3 className="font-display text-lg text-forest-900">Yêu cầu tư vấn từ Chatbot</h3>
        </div>
        {customerLeads.length === 0 ? (
          <p className="text-sm text-forest-400">Chưa có yêu cầu tư vấn nào từ chatbot trên trang chủ.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-forest-900 text-cream-100 text-xs uppercase tracking-wide">
                  <th className="text-left font-medium px-4 py-3">Liên hệ</th>
                  <th className="text-left font-medium px-4 py-3">Quan tâm</th>
                  <th className="text-left font-medium px-4 py-3">Thời gian</th>
                  <th className="text-left font-medium px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {customerLeads.map((cl) => (
                  <tr key={cl.id} className="border-t border-forest-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-forest-900">{cl.name}</p>
                      <p className="text-xs text-forest-500">{cl.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-forest-600 max-w-xs truncate">{cl.interest || '—'}</td>
                    <td className="px-4 py-3 text-forest-500">{new Date(cl.created_at).toLocaleString('vi-VN')}</td>
                    <td className="px-4 py-3">
                      <Badge tone={cl.status === 'new' ? 'gold' : 'neutral'} className="text-[10px] rounded px-2 py-0.5">
                        {cl.status === 'new' ? 'Mới' : 'Đã liên hệ'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      {cl.status === 'new' && (
                        <Button onClick={() => markCustomerContacted(cl.id)} variant="ghost" size="sm" className="h-auto p-0 text-forest-600 hover:underline hover:bg-transparent">
                          Đánh dấu đã liên hệ
                        </Button>
                      )}
                      <Button onClick={() => removeCustomerLead(cl.id)} variant="ghost" size="icon" aria-label="Xoá" className="h-8 w-8 text-forest-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
