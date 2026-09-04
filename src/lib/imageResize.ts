// Resize + nén ảnh ngay trên trình duyệt trước khi upload, tránh admin upload
// ảnh gốc vài MB thẳng lên site (chậm trang, tốn dung lượng Supabase Storage).
// Dùng canvas để scale xuống maxWidth (giữ tỉ lệ, không phóng to ảnh nhỏ hơn)
// rồi convert sang WebP — định dạng nhẹ nhất mà mọi trình duyệt hiện đại đọc được.

export async function resizeImageToWebp(
  file: File,
  maxWidth = 1600,
  quality = 0.85
): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', quality)
  );
  if (!blob) return file;

  const newName = file.name.replace(/\.[^.]+$/, '') + '.webp';
  return new File([blob], newName, { type: 'image/webp' });
}
