import { useEffect } from 'react';

interface DocumentMeta {
  title: string;
  description?: string;
  path: string;
  image?: string;
}

function setMetaContent(selector: string, content: string) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute('content', content);
}

// SPA không có SSR/prerender, nên mọi trang mặc định dùng chung title/meta
// description/canonical/OG tag đặt tĩnh trong index.html (trang chủ) — kể cả
// khi route đã đổi (/blog/<id>, /product/<slug>). Hook này ghi đè các thẻ đó
// khi vào trang chi tiết, trả lại giá trị gốc khi rời trang, để mỗi URL có
// tiêu đề/mô tả riêng trên kết quả tìm kiếm thay vì trùng lặp.
export function useDocumentMeta({ title, description, path, image }: DocumentMeta) {
  useEffect(() => {
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

    return () => {
      document.title = originalTitle;
      if (originalCanonical) canonicalEl?.setAttribute('href', originalCanonical);
    };
  }, [title, description, path, image]);
}
