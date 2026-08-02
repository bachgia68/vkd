export type ProductTypeId =
  | 'sam-cu-tuoi-kho'
  | 'sam-ngam-mat-ong'
  | 'tra-nuoc-uong-sam'
  | 'ruou-sam'
  | 'nam-lim-duoc-lieu'
  | 'my-pham-sam'
  | 'set-qua-tang';

export interface ProductTypeMeta {
  id: ProductTypeId;
  labelVi: string;
  labelEn: string;
  desc: string;
}

export const productTypes: ProductTypeMeta[] = [
  { id: 'sam-cu-tuoi-kho', labelVi: 'Sâm Củ Tươi & Sâm Khô', labelEn: 'Fresh & Dried Ginseng Root', desc: 'Sâm Ngọc Linh nguyên củ, lát khô, lá, hoa sâm' },
  { id: 'sam-ngam-mat-ong', labelVi: 'Sâm Ngâm Mật Ong', labelEn: 'Honey-Steeped Ginseng', desc: 'Sâm ngâm mật ong rừng nguyên chất' },
  { id: 'tra-nuoc-uong-sam', labelVi: 'Trà & Nước Uống Sâm', labelEn: 'Ginseng Tea & Drinks', desc: 'Trà túi lọc, nước uống, tinh chất PanaxX' },
  { id: 'ruou-sam', labelVi: 'Rượu Sâm', labelEn: 'Ginseng Wine', desc: 'Rượu sâm Ngọc Linh, rượu dược liệu cao cấp' },
  { id: 'nam-lim-duoc-lieu', labelVi: 'Nấm Lim Xanh & Dược Liệu', labelEn: 'Green Lim Mushroom & Herbs', desc: 'Nấm Lim Xanh, mật ong rừng, dược liệu quý' },
  { id: 'my-pham-sam', labelVi: 'Mỹ Phẩm Sâm', labelEn: 'Ginseng Cosmetics', desc: 'Collagen sâm, kem dưỡng, serum Pn\'s Choice' },
  { id: 'set-qua-tang', labelVi: 'Set Quà Tặng', labelEn: 'Gift Sets', desc: 'Set quà sức khỏe cao cấp cho dịp lễ, Tết' },
];

export function getProductTypeMeta(id: ProductTypeId): ProductTypeMeta {
  const meta = productTypes.find((t) => t.id === id);
  if (!meta) throw new Error(`Unknown productType: ${id}`);
  return meta;
}
