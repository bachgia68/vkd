import { Crown, ArrowRight } from 'lucide-react';
import { loyaltyTiers } from '../data/mockData';
import type { Language } from '../i18n/translations';

interface EliteTeaserProps {
  lang: Language;
  onNavigate: (page: string) => void;
}

const COPY: Record<Language, { kicker: string; title: string; body: string; cta: string }> = {
  vi: {
    kicker: 'TA ELITE CLUB',
    title: 'Tích điểm mỗi đơn hàng, lên hạng nhận ưu đãi',
    body: `Từ ${loyaltyTiers[0].discount}% hoàn tiền hạng ${loyaltyTiers[0].nameVi} đến ${loyaltyTiers[loyaltyTiers.length - 1].discount}% hạng ${loyaltyTiers[loyaltyTiers.length - 1].nameVi} — cùng các đặc quyền riêng cho thành viên.`,
    cta: 'Tham gia miễn phí',
  },
  en: {
    kicker: 'TA ELITE CLUB',
    title: 'Earn on every order, unlock tier perks',
    body: `From ${loyaltyTiers[0].discount}% cashback at ${loyaltyTiers[0].name} to ${loyaltyTiers[loyaltyTiers.length - 1].discount}% at ${loyaltyTiers[loyaltyTiers.length - 1].name} — plus member-only perks.`,
    cta: 'Join for free',
  },
  zh: {
    kicker: 'TA尊享俱乐部',
    title: '每笔订单赚积分，升级解锁更多权益',
    body: `从 ${loyaltyTiers[0].name} 级 ${loyaltyTiers[0].discount}% 返现，到 ${loyaltyTiers[loyaltyTiers.length - 1].name} 级 ${loyaltyTiers[loyaltyTiers.length - 1].discount}% —— 还有会员专属权益。`,
    cta: '免费加入',
  },
  fr: {
    kicker: 'TA ELITE CLUB',
    title: 'Cumulez à chaque commande, débloquez des avantages',
    body: `De ${loyaltyTiers[0].discount}% de cashback au niveau ${loyaltyTiers[0].name} jusqu'à ${loyaltyTiers[loyaltyTiers.length - 1].discount}% au niveau ${loyaltyTiers[loyaltyTiers.length - 1].name} — plus des avantages réservés aux membres.`,
    cta: 'Adhérer gratuitement',
  },
  ar: {
    kicker: 'نادي TA للنخبة',
    title: 'اكسب نقاطًا مع كل طلب، وافتح مزايا أعلى',
    body: `من استرداد نقدي ${loyaltyTiers[0].discount}% في مستوى ${loyaltyTiers[0].name} إلى ${loyaltyTiers[loyaltyTiers.length - 1].discount}% في مستوى ${loyaltyTiers[loyaltyTiers.length - 1].name} — بالإضافة إلى مزايا حصرية للأعضاء.`,
    cta: 'انضم مجانًا',
  },
};

export default function EliteTeaser({ lang, onNavigate }: EliteTeaserProps) {
  const c = COPY[lang];
  const isRTL = lang === 'ar';

  return (
    <section className="section-padding-sm bg-forest-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-forest-800 to-forest-900 border border-gold-400/20 rounded-3xl p-8 md:p-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gold-400/15 flex items-center justify-center shrink-0">
              <Crown className="w-7 h-7 text-gold-400" />
            </div>
            <div>
              <span className="text-gold-400 text-xs font-semibold tracking-wider uppercase block mb-1">
                {c.kicker}
              </span>
              <h3 className="font-display text-xl md:text-2xl text-white mb-1">{c.title}</h3>
              <p className="text-white/70 text-sm max-w-xl">{c.body}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('loyalty')}
            className="btn-gold shrink-0 whitespace-nowrap"
          >
            {c.cta}
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </section>
  );
}
