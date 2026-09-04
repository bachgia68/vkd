import { useEffect } from 'react';

interface DocumentMeta {
  title: string;
  description?: string;
  path: string;
  image?: string;
  // Cho phép component gọi hook này vô điều kiện (Rules of Hooks) nhưng chỉ
  // thực sự ghi đè meta khi đang ở trang đầy đủ — vd. Blog.tsx dùng chung cho
  // cả section preview trên trang chủ lẫn trang /blog riêng, chỉ trang /blog
  // mới cần đổi canonical.
  enabled?: boolean;
  // Path (không kèm domain) của trang phân trang trước/sau, vd. '/blog?page=1'
  // — bỏ trống ở trang đầu/cuối. Google không dùng tín hiệu này để rank nữa
  // nhưng Bing và vài crawler khác vẫn đọc, chi phí thêm gần như 0.
  prevPath?: string;
  nextPath?: string;
}

function setMetaContent(selector: string, content: string) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute('content', content);
}

function setOrRemoveLink(rel: string, path: string | undefined) {
  const existing = document.querySelector(`link[rel="${rel}"]`);
  if (!path) {
    existing?.remove();
    return;
  }
  const el = existing ?? document.createElement('link');
  el.setAttribute('rel', rel);
  el.setAttribute('href', `https://tasamngoclinh.com${path}`);
  if (!existing) document.head.appendChild(el);
}

// SPA không có SSR/prerender, nên mọi trang mặc định dùng chung title/meta
// description/canonical/OG tag đặt tĩnh trong index.html (trang chủ) — kể cả
// khi route đã đổi (/blog/<id>, /product/<slug>). Hook này ghi đè các thẻ đó
// khi vào trang chi tiết, trả lại giá trị gốc khi rời trang, để mỗi URL có
// tiêu đề/mô tả riêng trên kết quả tìm kiếm thay vì trùng lặp.
export function useDocumentMeta({ title, description, path, image, enabled = true, prevPath, nextPath }: DocumentMeta) {
  useEffect(() => {
    if (!enabled) return;
    const originalTitle = document.title;
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    const originalCanonical = canonicalEl?.getAttribute('href') ?? null;
    const url = `https://tasamngoclinh.com${path}`;

    document.title = title;
    canonicalEl?.setAttribute('href', url);
    setMetaContent('meta[name="description"]', description ?? '');
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:url"]', url);
    if (description) setMetaContent('meta[property="og:description"]', description);
    if (image) setMetaContent('meta[property="og:image"]', image);
    setOrRemoveLink('prev', prevPath);
    setOrRemoveLink('next', nextPath);

    return () => {
      document.title = originalTitle;
      if (originalCanonical) canonicalEl?.setAttribute('href', originalCanonical);
      setOrRemoveLink('prev', undefined);
      setOrRemoveLink('next', undefined);
    };
  }, [title, description, path, image, enabled, prevPath, nextPath]);
}
