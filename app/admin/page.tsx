import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Products</h2>
          <p className="text-gray-600 mb-4">Manage all products, pricing, and inventory</p>
          <Link href="/admin/products" className="text-blue-600 hover:text-blue-800 font-medium">
            Manage Products →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Header Settings</h2>
          <p className="text-gray-600 mb-4">Control navigation, logo, and hero section</p>
          <Link href="/admin/header" className="text-blue-600 hover:text-blue-800 font-medium">
            Edit Header →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Footer Settings</h2>
          <p className="text-gray-600 mb-4">Manage company info and footer links</p>
          <Link href="/admin/footer" className="text-blue-600 hover:text-blue-800 font-medium">
            Edit Footer →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Social Links</h2>
          <p className="text-gray-600 mb-4">Configure social media connections</p>
          <Link href="/admin/social-links" className="text-blue-600 hover:text-blue-800 font-medium">
            Manage Links →
          </Link>
        </div>
      </div>
    </div>
  );
}
