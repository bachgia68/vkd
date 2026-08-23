import '../globals.css';

export const metadata = {
  title: 'Admin Dashboard - TA',
  description: 'Admin management panel',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex h-screen bg-gray-900">
          <aside className="w-64 bg-gray-800 text-white p-6 overflow-y-auto">
            <h1 className="text-2xl font-bold mb-8">TA Admin</h1>
            <nav className="space-y-2">
              <a href="/admin" className="block px-4 py-2 rounded hover:bg-gray-700">Dashboard</a>
              <a href="/admin/products" className="block px-4 py-2 rounded hover:bg-gray-700">Products</a>
              <a href="/admin/header" className="block px-4 py-2 rounded hover:bg-gray-700">Header Settings</a>
              <a href="/admin/footer" className="block px-4 py-2 rounded hover:bg-gray-700">Footer Settings</a>
              <a href="/admin/social-links" className="block px-4 py-2 rounded hover:bg-gray-700">Social Links</a>
            </nav>
          </aside>
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
