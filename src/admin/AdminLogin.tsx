import { useState, type FormEvent } from 'react';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { ADMIN_IMAGES } from './adminMockData';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setError('');
    } else {
      setError('Mật khẩu không đúng. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-forest-950">
      <div className="relative hidden lg:block overflow-hidden">
        <img
          src={ADMIN_IMAGES.loginHero}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-forest-950/10" />
        <div className="relative h-full flex flex-col justify-end p-14">
          <span className="text-gold-400 text-xs tracking-[0.2em] uppercase mb-3">Enterprise Control</span>
          <h2 className="font-display text-4xl text-cream-50 leading-tight max-w-md">
            Vận hành nội bộ Võ Kim Đường
          </h2>
          <p className="text-cream-200/70 text-sm mt-4 max-w-sm leading-relaxed">
            Khu vực dành riêng cho đội ngũ vận hành: nội dung y khoa, CRM &amp; ERP khách hàng VIP,
            định tuyến kho hàng và truy xuất QR.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-full bg-gold-400/15 border border-gold-400/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <p className="text-cream-50 font-display text-lg leading-none">Võ Kim Đường</p>
              <p className="text-gold-400/80 text-[10px] tracking-[0.18em] uppercase mt-1">Control Portal</p>
            </div>
          </div>

          <h1 className="font-display text-2xl text-cream-50 mb-2">Đăng nhập quản trị</h1>
          <p className="text-cream-300/60 text-sm mb-8">
            Nhập mật khẩu nội bộ để tiếp tục vào hệ thống vận hành.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-cream-300/70 mb-2 tracking-wide uppercase">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-cream-50 placeholder:text-cream-500/40 focus:outline-none focus:border-gold-400/60 focus:bg-white/[0.07] transition-colors"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              className="w-full btn-gold justify-center mt-2"
            >
              Vào hệ thống <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-cream-500/40 text-xs mt-10 leading-relaxed">
            Đây là khu vực nội bộ không được liên kết từ menu công khai. Nếu bạn không thuộc đội
            ngũ vận hành VKD, vui lòng quay lại{' '}
            <a href="/" className="text-gold-400/80 hover:text-gold-400 underline underline-offset-2">
              trang chủ
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
