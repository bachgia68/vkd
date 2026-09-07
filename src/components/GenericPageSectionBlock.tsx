import type { PageSection } from '../lib/siteContentApi';

interface Props {
  section: PageSection;
}

// Renderer chung cho MOI block_type Joe tu tao trong Page Builder ma chua co
// component rieng (vd "Gallery Rượu", "carousel", "faq"...) — truoc day cac
// block nay luu duoc vao Supabase nhung KHONG hien o dau tren site (xem
// BLOCK_TYPE_HELP cu trong PageBuilderPage.tsx). Gio moi block tao them deu
// hien duoc, chi khac nhau bo cuc theo block_type.
// GIOI HAN THAT: page_sections chi luu 1 anh/block (cot image_url), nen
// 'gallery'/'carousel' o day la 1 anh lon, KHONG phai carousel nhieu anh
// truot duoc — muon nhieu anh that su can them cot rieng (jsonb) va sua
// component nay, chua lam trong ban nay.
export default function GenericPageSectionBlock({ section }: Props) {
  if (section.visible === false) return null;

  const { block_type, title_vi, content_vi, image_url, cta_text, cta_url } = section;
  if (!title_vi && !content_vi && !image_url) return null;

  const cta =
    cta_text && cta_url ? (
      <a
        href={cta_url}
        target={cta_url.startsWith('http') ? '_blank' : undefined}
        rel={cta_url.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="btn-gold inline-flex mt-6"
      >
        {cta_text}
      </a>
    ) : null;

  if (block_type === 'testimonial') {
    return (
      <section className="section-padding-sm bg-cream-50">
        <div className="container-wide max-w-2xl mx-auto text-center">
          {content_vi && <p className="font-display text-xl md:text-2xl text-forest-900 italic mb-4">"{content_vi}"</p>}
          {title_vi && <p className="text-forest-500 text-sm">{title_vi}</p>}
        </div>
      </section>
    );
  }

  if (block_type === 'faq') {
    return (
      <section className="section-padding-sm bg-cream-50">
        <div className="container-wide max-w-2xl mx-auto">
          {title_vi && <h3 className="font-display text-xl text-forest-900 mb-2">{title_vi}</h3>}
          {content_vi && <p className="text-forest-600 text-sm leading-relaxed">{content_vi}</p>}
        </div>
      </section>
    );
  }

  if (block_type === 'cta') {
    return (
      <section className="section-padding-sm bg-forest-900">
        <div className="container-wide text-center">
          {title_vi && <h3 className="font-display text-2xl text-white mb-2">{title_vi}</h3>}
          {content_vi && <p className="text-cream-200/80 mb-4">{content_vi}</p>}
          {cta}
        </div>
      </section>
    );
  }

  if (block_type === 'image-text') {
    return (
      <section className="section-padding-sm bg-cream-50">
        <div className="container-wide grid md:grid-cols-2 gap-8 items-center">
          {image_url && (
            <img src={image_url} alt={title_vi ?? ''} loading="lazy" className="w-full rounded-2xl object-cover aspect-[4/3]" />
          )}
          <div>
            {title_vi && <h3 className="font-display text-2xl text-forest-900 mb-3">{title_vi}</h3>}
            {content_vi && <p className="text-forest-600 leading-relaxed mb-4">{content_vi}</p>}
            {cta}
          </div>
        </div>
      </section>
    );
  }

  // 'image' / 'gallery' / 'carousel' (1 anh) + moi block_type tuy y khac
  return (
    <section className="section-padding-sm bg-cream-50">
      <div className="container-wide max-w-3xl mx-auto text-center">
        {image_url && (
          <div className="rounded-2xl overflow-hidden mb-6 aspect-video">
            <img src={image_url} alt={title_vi ?? ''} loading="lazy" className="w-full h-full object-cover" />
          </div>
        )}
        {title_vi && <h3 className="font-display text-2xl md:text-3xl text-forest-900 mb-3">{title_vi}</h3>}
        {content_vi && <p className="text-forest-600 leading-relaxed">{content_vi}</p>}
        {cta}
      </div>
    </section>
  );
}
