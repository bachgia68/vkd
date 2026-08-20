import { useState } from 'react';
import { Plus, Pencil, EyeOff, Eye, Trash2 } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useAdminAuth } from '../AdminAuthContext';
import type { DbProduct } from '../types/admin';
import { Button } from '../../components/ui/button';

export default function ProductsPage() {
  const { data: products = [], isLoading, error, update, delete: deleteProduct } = useProducts();
  const { isOwner } = useAdminAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({ name_vi: '', price_vnd: 0 });
  const [showAddModal, setShowAddModal] = useState(false);

  if (isLoading) return <div className="p-6">Đang tải...</div>;
  if (error) return <div className="p-6 text-red-600">Lỗi: {String(error)}</div>;

  const handleEdit = (p: DbProduct) => {
    setEditingId(p.id);
    setEditDraft({ name_vi: p.name_vi, price_vnd: p.price_vnd || 0 });
  };

  const handleSave = () => {
    if (editingId) {
      update({ id: editingId, input: editDraft });
      setEditingId(null);
    }
  };

  const handleToggle = (p: DbProduct) => {
    update({ id: p.id, input: { active: !p.active } });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sản phẩm & Kho hàng</h1>
        <Button onClick={() => setShowAddModal(true)} variant="primary">
          <Plus className="w-4 h-4" /> Thêm sản phẩm
        </Button>
      </div>

      <div className="space-y-2">
        {products?.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div className="flex-1">
              <p className="font-medium">{p.name_vi}</p>
              <p className="text-sm text-gray-600">
                SKU: {p.sku} | Giá: {(p.price_vnd || 0).toLocaleString()} đ | Kho: {p.stock_qty}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleToggle(p)}
                title={p.active ? 'Ẩn' : 'Hiện'}
              >
                {p.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEdit(p)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              {isOwner && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteProduct(p.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold">Sửa sản phẩm</h2>
            <input
              value={editDraft.name_vi}
              onChange={(e) => setEditDraft({ ...editDraft, name_vi: e.target.value })}
              placeholder="Tên sản phẩm"
              className="w-full p-2 border rounded"
            />
            <input
              value={editDraft.price_vnd}
              onChange={(e) => setEditDraft({ ...editDraft, price_vnd: Number(e.target.value) || 0 })}
              placeholder="Giá (đ)"
              type="number"
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setEditingId(null)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Lưu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
