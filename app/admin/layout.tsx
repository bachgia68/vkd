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
    <div className="flex h-screen bg-gray-900">
      <aside className="w-56 bg-gray-800 text-white p-4 overflow-y-auto flex-shrink-0">
        <h1 className="text-lg font-bold mb-6 text-green-400">TA Admin</h1>
        <nav className="space-y-1 text-sm">
          <a href="/admin" className="block px-3 py-2 rounded hover:bg-gray-700">Dashboard</a>
          <a href="/admin/blog" className="block px-3 py-2 rounded hover:bg-gray-700 text-green-300">Blog</a>
          <a href="/admin/products" className="block px-3 py-2 rounded hover:bg-gray-700">Products</a>
          <a href="/admin/header" className="block px-3 py-2 rounded hover:bg-gray-700">Header</a>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-950">
        {children}
      </main>
    </div>
  );
}
