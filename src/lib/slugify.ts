// Dùng chung cho slug bài blog (URL /blog/<slug>) và slug heading trong
// BlogPostDetail.tsx (mục lục #<slug>) — tách ra 1 nơi để 2 chỗ không lệch
// thuật toán chuyển tiếng Việt có dấu -> ASCII.
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
