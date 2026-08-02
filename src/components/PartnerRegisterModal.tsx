import { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { submitB2BLead, type B2BLeadType } from '../lib/siteContentApi';

interface PartnerRegisterModalProps {
  type: B2BLeadType;
  onClose: () => void;
}

const TYPE_LABELS: Record<B2BLeadType, string> = {
  distributor: 'Nhà Phân Phối',
  investor: 'Nhà Đầu Tư',
  oem: 'OEM/ODM',
};

export default function PartnerRegisterModal({ type, onClose }: PartnerRegisterModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    if (!name.trim() || !phone.trim()) {
      setError('Vui lòng nhập họ tên và số điện thoại liên hệ.');
      return;
    }
    setSubmitting(true);
    try {
      await submitB2BLead({
        type,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-forest-950/60 z-[100] flex items-center justify-center p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md relative shadow-elegant-lg">
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 text-forest-400 hover:text-forest-700"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-forest-600 mx-auto mb-4" />
            <h3 className="font-display text-xl text-forest-900 mb-2">Đã gửi đăng ký thành công</h3>
            <p className="text-forest-600 text-sm leading-relaxed">
              Cảm ơn bạn đã quan tâm hợp tác cùng TA với vai trò <b>{TYPE_LABELS[type]}</b>. Đội ngũ của chúng tôi sẽ
              liên hệ lại trong thời gian sớm nhất qua số điện thoại bạn đã cung cấp.
            </p>
            <button onClick={onClose} className="btn-primary text-sm mt-6 mx-auto">
              Đóng
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-1">Hợp tác đối tác</p>
            <h3 className="font-display text-xl text-forest-900 mb-1">Đăng Ký {TYPE_LABELS[type]}</h3>
            <p className="text-forest-500 text-sm mb-5">
              Điền thông tin bên dưới, đội ngũ TA sẽ liên hệ tư vấn hợp tác chi tiết.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] uppercase tracking-wide text-forest-400">Họ và tên *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-forest-200 rounded-lg px-3 py-2.5 text-sm mt-1 focus:outline-none focus:border-gold-400"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide text-forest-400">Số điện thoại *</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-forest-200 rounded-lg px-3 py-2.5 text-sm mt-1 focus:outline-none focus:border-gold-400"
                  placeholder="09xx xxx xxx"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide text-forest-400">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full border border-forest-200 rounded-lg px-3 py-2.5 text-sm mt-1 focus:outline-none focus:border-gold-400"
                  placeholder="ban@congty.com"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wide text-forest-400">Nội dung hợp tác</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-forest-200 rounded-lg px-3 py-2.5 text-sm mt-1 min-h-20 focus:outline-none focus:border-gold-400"
                  placeholder="Khu vực, quy mô kinh doanh dự kiến..."
                />
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <button
                onClick={submit}
                disabled={submitting}
                className="btn-gold text-sm w-full justify-center mt-2 disabled:opacity-60 disabled:pointer-events-none"
              >
                {submitting ? 'Đang gửi...' : 'Gửi Đăng Ký'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
