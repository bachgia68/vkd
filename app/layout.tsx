import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TA - Sâm Ngọc Linh',
  description: 'Chất lượng hàng đầu, chăm sóc sức khỏe tự nhiên',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
