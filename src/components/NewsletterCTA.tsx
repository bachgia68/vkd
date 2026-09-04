import { useEffect, useState } from 'react';
import { Gift, Loader2, Send, CheckCircle2 } from 'lucide-react';
import { submitNewsletterSignup, fetchTextOverrides } from '../lib/siteContentApi';
import { generateCamNangPdf } from '../lib/generateCamNangPdf';

const DEFAULT_TITLE = 'Nhận Cẩm Nang Phân Biệt Sâm Ngọc Linh — Miễn Phí';
const DEFAULT_DESC = 'Cách nhận diện sâm thật, chỉ dấu khoa học Majonoside-R2, dấu hiệu cảnh giác khi mua sâm.';
const DEFAULT_BUTTON = 'Nhận cẩm nang';

// Widget CRO chèn giữa danh sách bài viết Blog — khách để lại email và/hoặc
// SĐT Zalo (ít nhất 1 trong 2) để nhận "Cẩm Nang Phân Biệt Sâm Ngọc Linh".
// Ghi thật vào Supabase qua RPC submit_newsletter_signup(), rồi xuất PDF thật
// ngay trên trình duyệt — không giả vờ gửi email/Zalo tự động (site chưa nối
// email server/Zalo OA API thật, nói vậy sẽ là báo cáo láo).
// Tiêu đề/mô tả/chữ nút KHÔNG fix cứng — admin sửa ở "Nội Dung Trang Chủ" (key
// newsletter_cta.title/desc/button) để đổi thành khuyến mãi khác (vd "Nhận 5%").
export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [zalo, setZalo] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [copy, setCopy] = useState({ title: DEFAULT_TITLE, desc: DEFAULT_DESC, button: DEFAULT_BUTTON });

  useEffect(() => {
    fetchTextOverrides()
      .then((overrides) => {
        setCopy({
          title: overrides['newsletter_cta.title'] || DEFAULT_TITLE,
          desc: overrides['newsletter_cta.desc'] || DEFAULT_DESC,
          button: overrides['newsletter_cta.button'] || DEFAULT_BUTTON,
        });
      })
      .catch(() => {});
  }, []);

  const submit = async () => {
    const emailTrim = email.trim();
    const zaloTrim = zalo.trim();
    if (!emailTrim && !zaloTrim) {
      setError('Nhập email hoặc số Zalo để nhận cẩm nang.');
      return;
    }
    setError('');
    setStatus('sending');
    try {
      await submitNewsletterSignup({ email: emailTrim || undefined, zaloPhone: zaloTrim || undefined, source: 'blog_cta' });
      await generateCamNangPdf();
      setStatus('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Có lỗi xảy ra, thử lại sau.');
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="rounded-3xl bg-forest-900 p-8 md:p-10 flex flex-col items-center text-center gap-3">
        <CheckCircle2 className="w-8 h-8 text-gold-400" />
        <h3 className="font-display text-xl text-white">Đã gửi cẩm nang!</h3>
        <p className="text-cream-200/80 text-sm max-w-md">
          File PDF vừa tải về máy bạn. Nếu để lại Zalo, đội ngũ TA sẽ nhắn hỗ trợ thêm trong thời gian sớm nhất.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-forest-900 p-8 md:p-10">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-11 h-11 rounded-full bg-gold-400/20 border border-gold-400/40 flex items-center justify-center flex-shrink-0">
          <Gift className="w-5 h-5 text-gold-400" />
        </div>
        <div>
          <h3 className="font-display text-xl md:text-2xl text-white leading-snug">
            {copy.title}
          </h3>
          <p className="text-cream-200/70 text-sm mt-1.5">
            {copy.desc}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="Email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-gold-400"
        />
        <input
          type="tel"
          placeholder="Số Zalo (tuỳ chọn)"
          value={zalo}
          onChange={(e) => setZalo(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-gold-400"
        />
        <button
          onClick={submit}
          disabled={status === 'sending'}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gold-400 hover:bg-gold-500 text-forest-900 text-sm font-semibold rounded-full transition-colors disabled:opacity-60 flex-shrink-0"
        >
          {status === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {copy.button}
        </button>
      </div>
      {error && <p className="text-red-300 text-xs mt-2">{error}</p>}
    </div>
  );
}
