// Sinh tự động bởi scripts/migrate-to-unified-products.mjs từ vkdProducts.ts +
// trimicoProducts.ts — nguồn dữ liệu VẬN HÀNH (UI khách hàng đọc từ đây).
// 2 file gốc KHÔNG bị xoá, dùng cho admin đối chiếu giao hàng theo NCC.
// Nếu sửa productType/giftEligible thủ công sau khi sinh, sửa TRỰC TIẾP trong
// file này (không chạy lại script trừ khi 2 file gốc có SKU mới).

import type { HealthGoal, TargetAudience } from './mockData.ts';
import type { ProductTypeId } from './productTypes.ts';

export type SupplierId = 'vkd' | 'trimico' | 'samk5';

export interface Product {
  sku: string;
  supplierId: SupplierId;
  slug: string;
  name: string;
  price: number | null;
  image: string;
  productType: ProductTypeId;
  healthGoal: HealthGoal;
  audiences: TargetAudience[];
  familySafe: boolean;
  displayOnly18Plus?: boolean;
  giftEligible?: boolean;
  badge?: string;
  activeIngredient?: string;
  description: string;
  ingredients?: string;
  usage?: string;
  targetUsers?: string;
  warnings?: string;
  volume?: string;
  sourceUrl: string;
}

export const products: Product[] = [
  {
    "sku": "VKD-001",
    "supplierId": "vkd",
    "slug": "sam-ngoc-linh-thai-lat-ngam-mat-ong",
    "name": "Sâm Ngọc Linh thái lát ngâm mật ong",
    "price": 2500000,
    "image": "/products/premium-bg/01-sam-ngoc-linh-thai-lat-ngam-mat-ong.png",
    "productType": "sam-ngam-mat-ong",
    "healthGoal": "immunity",
    "audiences": [
      "men",
      "women",
      "seniors",
      "executives"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "Quốc Bảo",
    "activeIngredient": "Majonoside R2 (MR2) — độc quyền Ngọc Linh",
    "description": "Được chế biến từ những củ sâm Ngọc Linh quý hiếm, trồng tại vùng núi Ngọc Linh hoang sơ, kết hợp với mật ong rừng để tăng khả năng hấp thu dưỡng chất.",
    "ingredients": "Sâm Ngọc Linh 8-10 năm tuổi (8%), mật ong (90%), gừng, vitamin B3, vitamin B6",
    "volume": "120ml/chai",
    "warnings": "Không nên sử dụng vào buổi tối trước khi đi ngủ. Không có tác dụng thay thế thuốc chữa bệnh.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/sam-ngoc-linh-thai-lat-ngam-mat-ong/"
  },
  {
    "sku": "VKD-002",
    "supplierId": "vkd",
    "slug": "cao-sam-ngoc-linh-mat-ong",
    "name": "Cao Sâm Ngọc Linh Mật Ong",
    "price": 2200000,
    "image": "/products/premium-bg/02-cao-sam-ngoc-linh-mat-ong.png",
    "productType": "tra-nuoc-uong-sam",
    "healthGoal": "energy",
    "audiences": [
      "men",
      "women",
      "seniors"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "Hàm lượng cao",
    "activeIngredient": "Cao đặc 70% + Saponin MR2",
    "description": "Cao đặc Sâm Ngọc Linh kết hợp mật ong nguyên chất, tăng khả năng hấp thu dưỡng chất cho cơ thể.",
    "ingredients": "Cao đặc Sâm Ngọc Linh 70%, Mật ong 28%, chất bảo quản Potassium Sorbate, Sodium benzoate, Vitamin B3, Vitamin B6",
    "volume": "30g/hũ; 2 hũ/hộp",
    "warnings": "Dùng 1 lần/ngày, 0,7–1g pha với 100–150ml nước ấm. Sản phẩm có thể lắng sau thời gian dài bảo quản, không ảnh hưởng chất lượng.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/cao-sam-ngoc-linh-mat-ong/"
  },
  {
    "sku": "VKD-003",
    "supplierId": "vkd",
    "slug": "nuoc-cot-sam-ngoc-linh",
    "name": "Nước Cốt Sâm Ngọc Linh",
    "price": 445000,
    "image": "/products/03-nuoc-cot-sam-ngoc-linh.png",
    "productType": "tra-nuoc-uong-sam",
    "healthGoal": "energy",
    "audiences": [
      "men",
      "women",
      "seniors"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Chiết xuất sâm 8–10 năm tuổi",
    "description": "Chế biến từ củ sâm Ngọc Linh quý hiếm 8-10 năm tuổi, kết hợp cùng nhiều loại thảo dược quý — tinh chất thiên nhiên cung cấp năng lượng cho cơ thể.",
    "ingredients": "Chiết xuất Sâm Ngọc Linh, Nhân sâm, Đại táo, Đảng sâm, Hoàng kỳ, Đương quy, Bạch chỉ, Quế nhục, Đỗ trọng, Câu kỷ tử, Cam thảo, Vitamin B3, B6",
    "volume": "50ml/chai; 5 chai/hộp",
    "warnings": "Không dùng buổi tối trước khi ngủ. Tránh dùng trà/cà phê sau khi uống. Lắc đều trước khi dùng.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/nuoc-cot-sam-ngoc-linh/"
  },
  {
    "sku": "VKD-004",
    "supplierId": "vkd",
    "slug": "giai-doc-gan-panaxx-naturis",
    "name": "Giải Độc Gan Panaxx Naturis",
    "price": 440000,
    "image": "/products/premium-bg/04-giai-doc-gan-panaxx-naturis.png",
    "productType": "tra-nuoc-uong-sam",
    "healthGoal": "energy",
    "audiences": [
      "men",
      "women",
      "seniors"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "Bảo vệ gan",
    "activeIngredient": "MR2 + Cà gai leo + Khúng khéng",
    "description": "Chế biến từ sâm Ngọc Linh 8-10 năm tuổi kết hợp thảo dược quý, giúp bảo vệ gan và giảm tác hại của rượu bia.",
    "ingredients": "Nước tinh khiết, Chiết xuất Sâm Ngọc Linh (0,3%), Chiết xuất Khúng khéng, Taurine, Chiết xuất Nhân sâm, Cà gai leo, Long nhãn, Huyền sâm",
    "volume": "50ml/chai; 5 chai/hộp",
    "warnings": "Sản phẩm không phải là thuốc, không thay thế thuốc chữa bệnh. Tránh dùng trà/cà phê sau khi uống.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/giai-doc-gan-panaxx-naturis/"
  },
  {
    "sku": "VKD-009",
    "supplierId": "vkd",
    "slug": "banh-sam-ngoc-linh-panaxx-cookie",
    "name": "Bánh Sâm Ngọc Linh (PanaxX Cookie)",
    "price": 58000,
    "image": "/products/09-banh-sam-ngoc-linh-panaxx-cookie.png",
    "productType": "tra-nuoc-uong-sam",
    "healthGoal": "energy",
    "audiences": [
      "men",
      "women",
      "seniors",
      "family"
    ],
    "familySafe": true,
    "giftEligible": false,
    "activeIngredient": "Chiết xuất sâm Ngọc Linh",
    "description": "Bánh quy bổ sung chiết xuất Sâm Ngọc Linh, tiện lợi cho bữa ăn nhẹ hàng ngày.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/banh-sam-ngoc-linh-panaxx-cookie/"
  },
  {
    "sku": "VKD-010",
    "supplierId": "vkd",
    "slug": "panaxx-super-drink-190ml-ban-moi",
    "name": "Panaxx Super Drink 190ml (Bản Mới)",
    "price": 15000,
    "image": "/products/10-panaxx-super-drink-190ml-ban-moi.png",
    "productType": "tra-nuoc-uong-sam",
    "healthGoal": "energy",
    "audiences": [
      "men",
      "women",
      "seniors"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "MR2 + Vitamin B3/B6",
    "description": "Nước tăng lực chiết xuất từ sâm Ngọc Linh quý hiếm, kết hợp vitamin và axit amin thiết yếu giúp bổ sung năng lượng bền vững, chống mệt mỏi.",
    "ingredients": "Chiết xuất Sâm Ngọc Linh (0,05%), nước, đường tinh luyện, taurine, inositol, caffeine, nước chanh dây cô đặc, fructooligosaccharides, acid citric, trinatri citrat, hương sâm, vitamin B3, B6",
    "volume": "325ml/lon",
    "warnings": "Chứa caffeine — không khuyến nghị cho người nhạy cảm caffeine. Lắc đều trước khi dùng, ngon hơn khi uống lạnh. Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/panaxx-super-drink-190ml-ban-moi/"
  },
  {
    "sku": "VKD-011",
    "supplierId": "vkd",
    "slug": "tra-sam-ngoc-linh",
    "name": "Trà Sâm Ngọc Linh",
    "price": 345000,
    "image": "/products/11-tra-sam-ngoc-linh.png",
    "productType": "tra-nuoc-uong-sam",
    "healthGoal": "energy",
    "audiences": [
      "men",
      "women",
      "seniors",
      "family"
    ],
    "familySafe": true,
    "giftEligible": false,
    "activeIngredient": "Lát sâm Ngọc Linh sấy khô",
    "description": "Trà túi lọc từ lát Sâm Ngọc Linh sấy khô — sản phẩm thuộc hành trình gần 10 năm nghiên cứu và phát triển với sứ mệnh \"mang Sâm Ngọc Linh đến với mọi nhà\".",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/tra-sam-ngoc-linh/"
  },
  {
    "sku": "VKD-017",
    "supplierId": "vkd",
    "slug": "ruou-ngoc-de-thien-huong-750ml",
    "name": "Rượu Ngọc Đế -Thiên Hương 750ml",
    "price": 1750000,
    "image": "/products/premium-bg/17-ruou-ngoc-de-thien-huong-750ml.png",
    "productType": "ruou-sam",
    "healthGoal": "stress",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "Cao cấp",
    "activeIngredient": "Sâm Ngọc Linh ngâm ủ truyền thống",
    "description": "Dòng rượu Ngọc Đế cao cấp, ngâm ủ truyền thống cùng Sâm Ngọc Linh — sản phẩm chính hãng TA.",
    "volume": "750ml",
    "warnings": "Không dành cho người dưới 18 tuổi, phụ nữ mang thai hoặc đang cho con bú.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/ruou-ngoc-de-thien-huong-750ml/"
  },
  {
    "sku": "VKD-018",
    "supplierId": "vkd",
    "slug": "ruou-ngoc-de-sam-ngoc-linh-12-nam-500ml",
    "name": "Rượu Ngọc Đế Sâm Ngọc Linh 12 năm – 500ml",
    "price": 1118000,
    "image": "/products/premium-bg/18-ruou-ngoc-de-sam-ngoc-linh-12-nam-500ml.png",
    "productType": "ruou-sam",
    "healthGoal": "stress",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "12 năm",
    "activeIngredient": "Sâm 12 năm tuổi + Hồng Sâm + Tam Thất",
    "description": "Dòng rượu cao cấp kết hợp Sâm Ngọc Linh 12 năm tuổi cùng dược liệu quý: Hồng Sâm, Tam Thất, Ba Kích, Đương Quy, Long Nhãn… mang lại tác dụng bổ khí huyết, tăng cường sức khỏe, cải thiện sinh lực và hỗ trợ giấc ngủ — món quà biếu sang trọng. Quy trình sản xuất khép kín, công nghệ chưng cất châu Âu, loại bỏ độc tố.",
    "ingredients": "Sâm Ngọc Linh, Hồng Sâm, Tam Thất, Ba Kích, Sâm Cau, Câu Kỉ Tử, Đương Quy, Long Nhãn, rượu gạo truyền thống",
    "volume": "500ml — nồng độ cồn 28%vol",
    "warnings": "Không dành cho người dưới 18 tuổi, phụ nữ mang thai hoặc đang cho con bú. Không sử dụng khi vận hành máy móc/lái xe. Bảo quản nơi khô ráo, thoáng mát.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/ruou-ngoc-de-sam-ngoc-linh-12-nam-500ml/"
  },
  {
    "sku": "VKD-019",
    "supplierId": "vkd",
    "slug": "ruou-ngoc-de-sam-ngoc-linh-10-nam-500ml",
    "name": "Rượu Ngọc Đế Sâm Ngọc Linh 10 năm – 500ml",
    "price": 980000,
    "image": "/products/premium-bg/19-ruou-ngoc-de-sam-ngoc-linh-10-nam-500ml.png",
    "productType": "ruou-sam",
    "healthGoal": "stress",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "10 năm",
    "activeIngredient": "Sâm 10 năm tuổi — chưng cất châu Âu",
    "description": "Dòng rượu cao cấp chế tác từ Sâm Ngọc Linh quý hiếm 10 năm tuổi.",
    "ingredients": "Sâm Ngọc Linh 10 năm, Hồng Sâm, Tam Thất, Lộc Nhung, Ba Kích, Long Nhãn",
    "volume": "500ml — nồng độ cồn 28%vol",
    "warnings": "Không dành cho người dưới 18 tuổi, phụ nữ mang thai hoặc đang cho con bú. Bảo quản nơi khô ráo, thoáng mát.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/ruou-ngoc-de-sam-ngoc-linh-10-nam-500ml/"
  },
  {
    "sku": "VKD-020",
    "supplierId": "vkd",
    "slug": "ruou-ngoc-de-thang-long-chai-cao-500ml",
    "name": "Rượu Ngọc Đế – Thăng Long (Chai cao) 500ml",
    "price": 860000,
    "image": "/products/20-ruou-ngoc-de-thang-long-chai-cao-500ml.png",
    "productType": "ruou-sam",
    "healthGoal": "stress",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Sâm Ngọc Linh 8+ năm tuổi",
    "description": "Rượu Ngọc Đế dòng Thăng Long, chai cao — sản phẩm chính hãng TA.",
    "volume": "500ml",
    "warnings": "Không dành cho người dưới 18 tuổi, phụ nữ đang mang thai.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/ruou-ngoc-de-thang-long-chai-cao-500ml/"
  },
  {
    "sku": "VKD-021",
    "supplierId": "vkd",
    "slug": "ruou-ngoc-de-thang-long-chai-thap-500ml",
    "name": "Rượu Ngọc Đế – Thăng Long (Chai thấp) 500ml",
    "price": 860000,
    "image": "/products/21-ruou-ngoc-de-thang-long-chai-thap-500ml.png",
    "productType": "ruou-sam",
    "healthGoal": "stress",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Sâm Ngọc Linh 8+ năm tuổi",
    "description": "Rượu Sâm Ngọc Linh thơm ngon, đậm vị, kết hợp nhung hươu và thảo dược quý, ủ cùng rượu gạo truyền thống.",
    "ingredients": "Sâm Ngọc Linh, nhung hươu, thảo dược quý, rượu gạo truyền thống 29%vol",
    "volume": "500ml",
    "warnings": "Không dành cho người dưới 18 tuổi, phụ nữ mang thai hoặc đang cho con bú. Không vận hành máy móc/lái xe sau khi dùng.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/ruou-ngoc-de-thang-long-chai-thap-500ml/"
  },
  {
    "sku": "VKD-022",
    "supplierId": "vkd",
    "slug": "ruou-ngoc-de-sam-ngoc-linh-normal-500ml",
    "name": "Rượu Ngọc Đế Sâm Ngọc Linh Normal 500ml",
    "price": 585000,
    "image": "/products/22-ruou-ngoc-de-sam-ngoc-linh-normal-500ml.png",
    "productType": "ruou-sam",
    "healthGoal": "stress",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Sâm Ngọc Linh 8+ năm + Tam Thất + Câu Kỉ",
    "description": "Kết hợp rượu gạo truyền thống và công nghệ chưng cất châu Âu cùng Sâm Ngọc Linh và dược liệu quý, mang lại hương vị tinh tế và lợi ích sức khỏe.",
    "ingredients": "Sâm Ngọc Linh, Tam Thất, Câu Kỉ Tử, rượu gạo truyền thống",
    "volume": "500ml — nồng độ cồn 26%vol",
    "warnings": "Không dành cho người dưới 18 tuổi, phụ nữ mang thai hoặc đang cho con bú. Không dùng trước khi vận hành máy móc/lái xe.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/ruou-ngoc-de-sam-ngoc-linh-normal-500ml/"
  },
  {
    "sku": "VKD-023",
    "supplierId": "vkd",
    "slug": "ruou-sam-ngoc-linh-xe-dang",
    "name": "Rượu Sâm Ngọc Linh Xê Đăng",
    "price": 690000,
    "image": "/products/23-ruou-sam-ngoc-linh-xe-dang.png",
    "productType": "ruou-sam",
    "healthGoal": "stress",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Sâm Ngọc Linh + Dược liệu quý",
    "description": "Rượu gạo truyền thống ngâm Sâm Ngọc Linh và các thảo dược quý, mang đậm bản sắc vùng đồng bào Xê Đăng.",
    "ingredients": "Sâm Ngọc Linh, rượu gạo truyền thống 25%vol, các thảo dược khác",
    "volume": "500ml — nồng độ cồn 25%vol",
    "warnings": "Không dành cho người dưới 18 tuổi, phụ nữ mang thai hoặc đang cho con bú. Không vận hành máy móc/lái xe sau khi dùng.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/ruou-sam-ngoc-linh-xe-dang/"
  },
  {
    "sku": "VKD-024",
    "supplierId": "vkd",
    "slug": "ruou-sam-ngoc-linh-19-5-do",
    "name": "Rượu Sâm Ngọc Linh 19.5 Độ",
    "price": 370000,
    "image": "/products/24-ruou-sam-ngoc-linh-19-5-do.png",
    "productType": "ruou-sam",
    "healthGoal": "stress",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Sâm Ngọc Linh 8+ năm — 19.5°",
    "description": "Sự kết hợp hoàn hảo giữa sản xuất rượu gạo truyền thống với công nghệ hiện đại từ châu Âu cùng Sâm Ngọc Linh 8+ năm và dược liệu quý.",
    "ingredients": "Sâm Ngọc Linh, Câu Kỉ Tử (Goji berry), Đông trùng hạ thảo, rượu gạo truyền thống",
    "volume": "500ml — nồng độ cồn 19.5%vol",
    "warnings": "Không dành cho người dưới 18 tuổi, phụ nữ mang thai hoặc đang cho con bú. Không vận hành máy móc/lái xe.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/ruou-sam-ngoc-linh-19-5-do/"
  },
  {
    "sku": "VKD-025",
    "supplierId": "vkd",
    "slug": "combo-2-chai-ruou-sam-ngoc-linh-19-5-do",
    "name": "Combo 2 Chai Rượu Sâm Ngọc Linh 19.5 Độ",
    "price": 715000,
    "image": "/products/premium-bg/25-combo-2-chai-ruou-sam-ngoc-linh-19-5-do.png",
    "productType": "ruou-sam",
    "healthGoal": "stress",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "Combo",
    "activeIngredient": "Combo 2 chai — tiết kiệm",
    "description": "Rượu Sâm Ngọc Linh là sự kết hợp hoàn hảo giữa sản xuất rượu gạo truyền thống với công nghệ hiện đại châu Âu và dược liệu quý hiếm — combo 2 chai tiết kiệm.",
    "ingredients": "Chiết xuất Sâm Ngọc Linh, Câu Kỉ Tử, Đông trùng hạ thảo, rượu gạo truyền thống 19.5°",
    "volume": "2 x 500ml — nồng độ cồn 19.5%vol",
    "warnings": "Không dành cho người dưới 18 tuổi, phụ nữ mang thai hoặc đang cho con bú.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/combo-2-chai-ruou-sam-ngoc-linh-19-5-do/"
  },
  {
    "sku": "VKD-026",
    "supplierId": "vkd",
    "slug": "ruou-ngoc-de-pho-thong-300ml",
    "name": "Rượu Ngọc Đế Phổ Thông 300ml",
    "price": 200000,
    "image": "/products/26-ruou-ngoc-de-pho-thong-300ml.png",
    "productType": "ruou-sam",
    "healthGoal": "stress",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Sâm Ngọc Linh ngâm ủ",
    "description": "Dòng rượu Ngọc Đế phổ thông, dung tích nhỏ gọn, phù hợp dùng thường ngày.",
    "volume": "300ml",
    "warnings": "Không dành cho người dưới 18 tuổi, phụ nữ đang mang thai. Thưởng thức có trách nhiệm, không lái xe khi đã uống rượu.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/ruou-ngoc-de-pho-thong-300ml/"
  },
  {
    "sku": "VKD-027",
    "supplierId": "vkd",
    "slug": "ruou-kim-boi",
    "name": "Rượu Kim Bôi",
    "price": 72000,
    "image": "/products/27-ruou-kim-boi.png",
    "productType": "ruou-sam",
    "healthGoal": "stress",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Rượu gạo truyền thống + Sâm Ngọc Linh",
    "description": "Rượu Sâm Ngọc Linh thơm ngon, đậm vị, hỗ trợ điều hòa hoạt động của não bộ.",
    "warnings": "Không dành cho người dưới 18 tuổi, phụ nữ đang mang thai. Thưởng thức có trách nhiệm, tránh lái xe sau khi uống.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/ruou-kim-boi/"
  },
  {
    "sku": "VKD-028",
    "supplierId": "vkd",
    "slug": "men-kim-boi",
    "name": "Men Kim Bôi",
    "price": 80000,
    "image": "/products/28-men-kim-boi.png",
    "productType": "ruou-sam",
    "healthGoal": "stress",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "36 vị thuốc bắc — men rượu truyền thống",
    "description": "Men rượu truyền thống Kim Bôi — tổng hợp 36 vị thuốc bắc và vi sinh vật lên men, dùng để nấu rượu/cháo rượu truyền thống.",
    "ingredients": "36 vị thuốc bắc (gừng, cam thảo, đương quy...) và các vi sinh vật lên men",
    "volume": "Đóng gói PE: 500g, 1kg, 2kg, 3kg, 5kg, 10kg, 15kg, 20kg. Tỉ lệ dùng: 1–1,2kg men / 20–25kg gạo.",
    "warnings": "Hạn sử dụng 24 tháng kể từ ngày sản xuất.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/men-kim-boi/"
  },
  {
    "sku": "VKD-029",
    "supplierId": "vkd",
    "slug": "bo-tre-hoa-combo-big-size",
    "name": "Bộ Trẻ Hóa Combo (Big Size)",
    "price": 8760000,
    "image": "/products/premium-bg/29-bo-tre-hoa-combo-big-size.png",
    "productType": "my-pham-sam",
    "healthGoal": "youth",
    "audiences": [
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "Combo Premium",
    "activeIngredient": "Sâm Ngọc Linh + PCG (Tam Thất + Đông Trùng + Linh Chi)",
    "description": "Cung cấp, duy trì độ ẩm cho da, tái tạo làn da, giúp trẻ hóa da — bộ 4 sản phẩm full-size dòng Pn’s Choice.",
    "ingredients": "Panax Vietnamensis Extract (Sâm Ngọc Linh), Panax Notoginseng Root Extract (Tam thất), Cordyceps Sinensis Extract (Đông trùng hạ thảo), Ganoderma Lucidum Extract (Nấm Linh chi)",
    "volume": "Bộ 4 sản phẩm: Advanced Day Repair Cream 50gr, Advanced Night Repair Cream 50gr, Serum Power Rejuvenation 50ml, Purely Refreshing Gold Water 100ml",
    "warnings": "Tránh tiếp xúc trực tiếp ánh nắng mặt trời và nhiệt độ cao. Để xa tầm tay trẻ sơ sinh.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/bo-tre-hoa-combo-big-size/"
  },
  {
    "sku": "VKD-030",
    "supplierId": "vkd",
    "slug": "bo-phuc-hoi-da",
    "name": "Bộ phục hồi da",
    "price": 3230000,
    "image": "/products/30-bo-phuc-hoi-da.png",
    "productType": "my-pham-sam",
    "healthGoal": "youth",
    "audiences": [
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Chiết xuất sâm Ngọc Linh Pn’s Choice",
    "description": "Bộ sản phẩm Pn’s Choice phục hồi làn da hư tổn do mụn, cháy nắng, hóa chất hoặc sau các điều trị như laser, lăn kim.",
    "ingredients": "Bộ 5 sản phẩm: Sữa rửa mặt Micellar Cleanser, Toner Micellar Repair, Serum Micellar Repair, Kem dưỡng ngày & đêm Micellar Repair — cùng phức hợp Concentrated Saponin",
    "warnings": "Hướng dẫn sử dụng chi tiết in trên hộp sản phẩm.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/bo-phuc-hoi-da/"
  },
  {
    "sku": "VKD-031",
    "supplierId": "vkd",
    "slug": "nuoc-tre-hoa-da-purely-refreshing",
    "name": "Nước Trẻ Hóa Da (Purely Refreshing)",
    "price": 3470000,
    "image": "/products/premium-bg/31-nuoc-tre-hoa-da-purely-refreshing.png",
    "productType": "my-pham-sam",
    "healthGoal": "youth",
    "audiences": [
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "Nước thần",
    "activeIngredient": "Gold Water + Saponin cô đặc",
    "description": "Purely Refreshing Gold Water chăm sóc bảo vệ da, duy trì độ ẩm, hỗ trợ phục hồi da hư tổn, cải thiện độ đàn hồi, làm mờ vết thâm/nám, làm sáng da.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/nuoc-tre-hoa-da-purely-refreshing/"
  },
  {
    "sku": "VKD-032",
    "supplierId": "vkd",
    "slug": "bo-tre-hoa-da-combo-mini-size",
    "name": "Bộ Trẻ Hóa Da Combo (Mini Size)",
    "price": 1850000,
    "image": "/products/32-bo-tre-hoa-da-combo-mini-size.png",
    "productType": "my-pham-sam",
    "healthGoal": "youth",
    "audiences": [
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Combo 4 sản phẩm Pn’s Choice",
    "description": "Cung cấp, duy trì độ ẩm cho da, tái tạo làn da, giúp trẻ hóa da — phiên bản mini tiện lợi mang theo.",
    "volume": "Bộ 6 sản phẩm mini: Refreshing Gold Water 20ml, Power Rejuvenation Serum 10ml, Advanced Day Cream 15gr, Advanced Night Cream 15gr, Daily UV Sunscreen 20gr, Active Intensive Eye Cream 5gr",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/bo-tre-hoa-da-combo-mini-size/"
  },
  {
    "sku": "VKD-033",
    "supplierId": "vkd",
    "slug": "kem-duong-ban-dem-night-cream",
    "name": "Kem Dưỡng Ban Đêm (Night Cream)",
    "price": 1900000,
    "image": "/products/33-kem-duong-ban-dem-night-cream.png",
    "productType": "my-pham-sam",
    "healthGoal": "youth",
    "audiences": [
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Advanced Night Repair + Sâm Ngọc Linh",
    "description": "Kem dưỡng da ban đêm Advanced Night Repair Cream giúp phục hồi và tái tạo tế bào da mới.",
    "volume": "50gr",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/kem-duong-ban-dem-night-cream/"
  },
  {
    "sku": "VKD-034",
    "supplierId": "vkd",
    "slug": "serum-duong-da-serum",
    "name": "Serum Dưỡng Da (Serum)",
    "price": 1780000,
    "image": "/products/34-serum-duong-da-serum.png",
    "productType": "my-pham-sam",
    "healthGoal": "youth",
    "audiences": [
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Power Rejuvenation Serum + Saponin",
    "description": "Tinh chất dưỡng da Power Rejuvenation Serum giúp chăm sóc và duy trì độ ẩm cho da, hỗ trợ quá trình phục hồi da bị hư tổn.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/serum-duong-da-serum/"
  },
  {
    "sku": "VKD-035",
    "supplierId": "vkd",
    "slug": "kem-duong-ban-ngay-day-cream",
    "name": "Kem Dưỡng Ban Ngày (Day Cream)",
    "price": 1580000,
    "image": "/products/35-kem-duong-ban-ngay-day-cream.png",
    "productType": "my-pham-sam",
    "healthGoal": "youth",
    "audiences": [
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Advanced Day Repair + Sâm Ngọc Linh",
    "description": "Kem dưỡng da ban ngày Advanced Day Repair Cream giúp dưỡng ẩm, phục hồi làn da và tạo lớp bảo vệ trước tác hại ánh nắng, ô nhiễm môi trường.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/kem-duong-ban-ngay-day-cream/"
  },
  {
    "sku": "VKD-036",
    "supplierId": "vkd",
    "slug": "kem-mat-eyes-cream",
    "name": "Kem Mắt (Eyes Cream)",
    "price": 1150000,
    "image": "/products/36-kem-mat-eyes-cream.png",
    "productType": "my-pham-sam",
    "healthGoal": "youth",
    "audiences": [
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Active Intensive Eye Cream + Sâm",
    "description": "Kem mắt Active Intensive Eye Cream chăm sóc, bảo vệ và hỗ trợ phục hồi da vùng mắt, giảm thâm và hạn chế quầng thâm quanh mắt.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/kem-mat-eyes-cream/"
  },
  {
    "sku": "VKD-037",
    "supplierId": "vkd",
    "slug": "kem-duong-ban-dem-night-cream-pn-s",
    "name": "Kem Dưỡng Ban Đêm (Night Cream) — Pn’s",
    "price": 780000,
    "image": "/products/37-kem-duong-ban-dem-night-cream-pn-s.png",
    "productType": "my-pham-sam",
    "healthGoal": "youth",
    "audiences": [
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Micellar Repair Night — Saponin cô đặc",
    "description": "Kem dưỡng da ban đêm Micellar Repair Night Cream Concentrated Saponin giúp dưỡng ẩm da, phục hồi làn da mịn màng, dưỡng sáng da.",
    "volume": "30g",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/kem-ban-dem-night-cream/"
  },
  {
    "sku": "VKD-038",
    "supplierId": "vkd",
    "slug": "kem-chong-nang-daily-uv",
    "name": "Kem Chống Nắng (Daily UV)",
    "price": 850000,
    "image": "/products/38-kem-chong-nang-daily-uv.png",
    "productType": "my-pham-sam",
    "healthGoal": "youth",
    "audiences": [
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "SPF 50 PA++++ + Sâm Ngọc Linh",
    "description": "Kem chống nắng Daily UV Rejuvenation Sunscreen với SPF 50 PA++++, ngăn ngừa tác hại từ ánh nắng mặt trời, phù hợp khi tiếp xúc nước/đi biển.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/kem-chong-nang-daily-uv/"
  },
  {
    "sku": "VKD-039",
    "supplierId": "vkd",
    "slug": "nuoc-duong-da-micellar-serum",
    "name": "Nước Dưỡng Da (Micellar Serum)",
    "price": 850000,
    "image": "/products/39-nuoc-duong-da-micellar-serum.png",
    "productType": "my-pham-sam",
    "healthGoal": "youth",
    "audiences": [
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Micellar Repair Serum — Saponin",
    "description": "Micellar Repair Serum Concentrated Saponin giúp chăm sóc, duy trì độ ẩm cho da và hỗ trợ quá trình phục hồi da bị hư tổn.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/nuoc-duong-da-micellar-serum/"
  },
  {
    "sku": "VKD-040",
    "supplierId": "vkd",
    "slug": "kem-ban-ngay-day-cream-pn-s",
    "name": "Kem Ban Ngày (Day Cream) — Pn’s",
    "price": 580000,
    "image": "/products/40-kem-ban-ngay-day-cream-pn-s.png",
    "productType": "my-pham-sam",
    "healthGoal": "youth",
    "audiences": [
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Micellar Repair Day + Sâm Ngọc Linh",
    "description": "Kem dưỡng da ban ngày Micellar Repair Day Cream giúp chăm sóc, dưỡng ẩm, phục hồi làn da mịn màng và chống nắng bảo vệ da trước tác hại tia UV.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/kem-ban-ngay-day-cream/"
  },
  {
    "sku": "VKD-041",
    "supplierId": "vkd",
    "slug": "nuoc-can-bang-micellar-toner",
    "name": "Nước Cân Bằng (Micellar Toner)",
    "price": 560000,
    "image": "/products/41-nuoc-can-bang-micellar-toner.png",
    "productType": "my-pham-sam",
    "healthGoal": "youth",
    "audiences": [
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Micellar Repair Toner — Saponin",
    "description": "Micellar Repair Toner Concentrated Saponin giúp cân bằng và duy trì độ ẩm tự nhiên, se khít lỗ chân lông, ngăn ngừa và làm mờ vết thâm, nám, tàn nhang.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/nuoc-can-bang-micellar-toner/"
  },
  {
    "sku": "VKD-042",
    "supplierId": "vkd",
    "slug": "sua-rua-mat-micellar-cleaner",
    "name": "Sữa Rửa Mặt (Micellar Cleaner)",
    "price": 450000,
    "image": "/products/42-sua-rua-mat-micellar-cleaner.png",
    "productType": "my-pham-sam",
    "healthGoal": "youth",
    "audiences": [
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Micellar Repair Cleaner + Sâm",
    "description": "Sữa rửa mặt hàng ngày Micellar Repair Cleaner giúp làm sạch bụi bẩn, dầu thừa, tế bào chết và duy trì độ ẩm tự nhiên cho da.",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/sua-rua-mat-micellar-cleaner/"
  },
  {
    "sku": "VKD-043",
    "supplierId": "vkd",
    "slug": "mat-na-duong-da-face-mask-5-mieng",
    "name": "Mặt Nạ Dưỡng Da (Face Mask) 5 Miếng",
    "price": 250000,
    "image": "/products/43-mat-na-duong-da-face-mask-5-mieng.png",
    "productType": "my-pham-sam",
    "healthGoal": "youth",
    "audiences": [
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "activeIngredient": "Rejuvenating Face Mask + Sâm Ngọc Linh",
    "description": "Mặt nạ dưỡng da Rejuvenating Face Mask cung cấp độ ẩm tối ưu, tăng cường độ đàn hồi da, cho làn da tươi sáng, mịn màng; ngăn chặn và làm chậm quá trình lão hóa da.",
    "volume": "5 miếng/hộp",
    "sourceUrl": "https://samngoclinhvkdgroup.com/san-pham/mat-na-duong-da-face-mask-5-mieng/"
  },
  {
    "sku": "TRM-001",
    "supplierId": "trimico",
    "slug": "sangoli-crackers-banh-mam-gao-lut-sam-ngoc-linh",
    "name": "Sangoli Crackers - Bánh Mầm Gạo Lứt Sâm Ngọc Linh",
    "price": 269000,
    "image": "/products/trimico/01-sangoli-crackers.png",
    "productType": "tra-nuoc-uong-sam",
    "healthGoal": "energy",
    "audiences": [
      "seniors",
      "women",
      "men"
    ],
    "familySafe": true,
    "giftEligible": false,
    "description": "Bánh Sangoli Crackers kết hợp sâm Ngọc Linh cùng mầm gạo lứt, vị ngọt thanh tự nhiên từ mật hoa dừa và mè, sản xuất theo quy trình chuẩn ISO. Thiết kế như thực phẩm bổ sung hàng ngày dành cho người bận rộn và người lớn tuổi.",
    "ingredients": "Bột lúa mì, bột yến mạch, bột mầm gạo lứt sấy khô, đường hoa dừa, mè đen, bột sâm Ngọc Linh, mật mía và các thành phần khác.",
    "volume": "100g (10g x 10 gói)",
    "sourceUrl": "https://trimico.vn/sangoli-crackers-banh-mam-gao-lut-sam-ngoc-linh"
  },
  {
    "sku": "TRM-002",
    "supplierId": "trimico",
    "slug": "tra-sam-ngoc-linh-thuong-hang",
    "name": "Trà Sâm Ngọc Linh Thượng Hạng - MITRI TEA",
    "price": 690000,
    "image": "/products/premium-bg/02-tra-sam-ngoc-linh-thuong-hang.png",
    "productType": "tra-nuoc-uong-sam",
    "healthGoal": "immunity",
    "audiences": [
      "seniors",
      "women",
      "men"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "Thượng Hạng",
    "description": "Kết tinh từ lá sâm Ngọc Linh quý và thảo quyết minh thanh mát, MITRI TEA giúp bồi bổ khí huyết, tăng cường sức khỏe và nâng cao đề kháng. Sản xuất chuẩn GMP, không chất bảo quản, không hương liệu. Túi lọc tiện lợi.",
    "ingredients": "Lá sâm Ngọc Linh (bồi bổ khí huyết); Thảo quyết minh/hạt muồng (thanh nhiệt, giải độc, ngủ ngon).",
    "usage": "Cho 1 túi trà vào cốc, thêm 200ml nước nóng (80-100°C), hãm 2-3 phút. Dùng 1-2 túi mỗi ngày.",
    "warnings": "Không phù hợp với phụ nữ mang thai hoặc người nhạy cảm với thành phần sản phẩm. Bảo quản nơi khô ráo, thoáng mát.",
    "targetUsers": "Người cơ thể suy nhược, mệt mỏi, mới ốm dậy, đang dưỡng bệnh, sức đề kháng kém, cần bồi bổ.",
    "sourceUrl": "https://trimico.vn/tra-sam-ngoc-linh-thuong-hang"
  },
  {
    "sku": "TRM-003",
    "supplierId": "trimico",
    "slug": "tra-sam-ngoc-linh-trimico",
    "name": "Trà Sâm Ngọc Linh Túi Lọc",
    "price": 290000,
    "image": "/products/trimico/03-tra-sam-ngoc-linh-trimico.png",
    "productType": "tra-nuoc-uong-sam",
    "healthGoal": "immunity",
    "audiences": [
      "seniors",
      "women",
      "men"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "OCOP",
    "description": "Kết hợp \"Quốc bảo\" sâm Ngọc Linh cùng các dược liệu quý: hạt muồng, sâm dây, cà gai leo. Không chất bảo quản, không hương liệu nhân tạo. Đạt chứng nhận Sản phẩm vàng vì sức khỏe cộng đồng và OCOP.",
    "ingredients": "Mỗi gói 2g: 0.5g bột lá sâm Ngọc Linh, 0.3g bột lá sâm dây, 0.3g bột lá sâm Bố Chính, 0.3g bột lá khổ qua rừng, 0.3g bột hạt muồng, 0.3g bột cà gai leo.",
    "usage": "Dùng 1 gói túi lọc pha khoảng 200ml nước nóng, để 2-3 phút rồi dùng phần nước.",
    "volume": "Hộp 12 gói, mỗi gói 2g",
    "warnings": "Dùng 1-2 gói/ngày. Không phù hợp với phụ nữ mang thai hoặc người nhạy cảm với thành phần. Bảo quản nơi khô ráo, thoáng mát.",
    "sourceUrl": "https://trimico.vn/tra-sam-ngoc-linh-trimico"
  },
  {
    "sku": "TRM-004",
    "supplierId": "trimico",
    "slug": "sam-ngoc-linh-ngam-mat-ong-trimico-90ml",
    "name": "Sâm Ngọc Linh Ngâm Mật Ong 90ml",
    "price": 450000,
    "image": "/products/trimico/04-sam-mat-ong-90ml.png",
    "productType": "sam-ngam-mat-ong",
    "healthGoal": "energy",
    "audiences": [
      "men",
      "women",
      "seniors",
      "executives"
    ],
    "familySafe": false,
    "giftEligible": false,
    "description": "Sâm Ngọc Linh tươi kết hợp mật ong nguyên chất, không hóa chất, không chất bảo quản. Chứa 84 hợp chất saponin, đặc biệt saponin MR2, hỗ trợ ức chế tế bào ung thư và tăng cường miễn dịch.",
    "ingredients": "2g sâm Ngọc Linh; 90ml mật ong nguyên chất.",
    "usage": "Lấy 5-10ml pha với 200ml nước ấm (~60°C), uống buổi sáng khi bụng đói.",
    "volume": "90ml (2g sâm + 90ml mật ong, hộp 3 lọ)",
    "warnings": "Không phù hợp với phụ nữ mang thai và trẻ em dưới 13 tuổi. Bảo quản nơi khô ráo, thoáng mát.",
    "sourceUrl": "https://trimico.vn/sam-ngoc-linh-ngam-mat-ong-trimico-90ml"
  },
  {
    "sku": "TRM-005",
    "supplierId": "trimico",
    "slug": "sam-ngoc-linh-ngam-mat-ong-trimico-175ml",
    "name": "Sâm Ngọc Linh Ngâm Mật Ong 175ml",
    "price": 1250000,
    "image": "/products/trimico/05-sam-mat-ong-175ml.png",
    "productType": "sam-ngam-mat-ong",
    "healthGoal": "energy",
    "audiences": [
      "men",
      "women",
      "seniors",
      "executives"
    ],
    "familySafe": false,
    "giftEligible": false,
    "description": "Củ sâm Ngọc Linh tươi vùng núi cao trên 1500m kết hợp mật ong rừng nguyên chất, chứa 84 hợp chất saponin trong đó có saponin MR2 hiếm với tiềm năng chống ung thư.",
    "ingredients": "15g sâm Ngọc Linh tươi (Quảng Nam); 175ml mật ong nguyên chất.",
    "usage": "Lấy 5-10ml pha với 200ml nước ấm (~60°C), uống buổi sáng khi bụng đói. Có thể nhai kèm lát sâm.",
    "volume": "175ml",
    "warnings": "Không phù hợp với phụ nữ mang thai và trẻ em dưới 13 tuổi.",
    "sourceUrl": "https://trimico.vn/sam-ngoc-linh-ngam-mat-ong-trimico-175ml"
  },
  {
    "sku": "TRM-006",
    "supplierId": "trimico",
    "slug": "thach-sam-ngoc-linh-trimico",
    "name": "Thạch Sâm Ngọc Linh",
    "price": 250000,
    "image": "/products/trimico/06-thach-sam-ngoc-linh.png",
    "productType": "tra-nuoc-uong-sam",
    "healthGoal": "youth",
    "audiences": [
      "women",
      "family"
    ],
    "familySafe": true,
    "giftEligible": false,
    "description": "Thạch mềm mịn làm từ sâm Ngọc Linh tươi, đẳng sâm, nano collagen — bổ sung năng lượng, hỗ trợ phòng ung thư. Hương thơm tinh tế, vị ngọt thanh tự nhiên, tan dần trong miệng.",
    "ingredients": "Chiết xuất củ sâm Ngọc Linh, Nano Collagen, Đẳng Sâm và phụ liệu cao cấp khác.",
    "usage": "Dùng trực tiếp, ngày 2 lần, mỗi lần 1-2 gói.",
    "volume": "Hộp 10 gói, mỗi gói 20g",
    "warnings": "Không dùng cho trẻ em dưới 6 tuổi; không phù hợp với phụ nữ mang thai hoặc người nhạy cảm với thành phần.",
    "sourceUrl": "https://trimico.vn/thach-sam-ngoc-linh-trimico"
  },
  {
    "sku": "TRM-007",
    "supplierId": "trimico",
    "slug": "sam-ngoc-linh-ngam-mat-ong-trimico-lo-30ml",
    "name": "Sâm Ngọc Linh Ngâm Mật Ong Lọ 30ml",
    "price": 150000,
    "image": "/products/trimico/07-sam-mat-ong-30ml.png",
    "productType": "sam-ngam-mat-ong",
    "healthGoal": "energy",
    "audiences": [
      "men",
      "women",
      "seniors"
    ],
    "familySafe": false,
    "giftEligible": false,
    "description": "Củ sâm Ngọc Linh tươi chọn lọc kỹ càng kết hợp mật ong giàu dưỡng chất — phiên bản lọ nhỏ, tiện mang theo.",
    "usage": "Lấy 5-10ml pha với 200ml nước ấm (~60°C), uống buổi sáng khi bụng đói.",
    "volume": "30ml/lọ",
    "warnings": "Không phù hợp với phụ nữ mang thai và trẻ em dưới 13 tuổi.",
    "sourceUrl": "https://trimico.vn/sam-ngoc-linh-ngam-mat-ong-trimico-lo-30ml"
  },
  {
    "sku": "TRM-008",
    "supplierId": "trimico",
    "slug": "sam-ngoc-linh-ngam-mat-ong-hu-gom-300ml",
    "name": "Sâm Ngọc Linh Ngâm Mật Ong Hũ Gốm 300ml",
    "price": 2500000,
    "image": "/products/trimico/08-sam-mat-ong-hu-gom-300ml.png",
    "productType": "sam-ngam-mat-ong",
    "healthGoal": "energy",
    "audiences": [
      "executives",
      "seniors",
      "men"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "Hũ Gốm Cao Cấp",
    "description": "20g sâm Ngọc Linh kết hợp 300ml mật ong rừng nguyên chất, 100% tự nhiên, không chất bảo quản — đóng hũ gốm quà tặng sang trọng.",
    "ingredients": "20g Sâm Ngọc Linh; 300ml mật ong nguyên chất.",
    "usage": "Lấy 5-10ml pha với 200ml nước ấm (~60°C), uống buổi sáng khi bụng đói, có thể nhai kèm lát sâm.",
    "volume": "300ml, hũ gốm kèm hộp cứng cao cấp",
    "warnings": "Không phù hợp với phụ nữ mang thai và trẻ em dưới 13 tuổi.",
    "sourceUrl": "https://trimico.vn/sam-ngoc-linh-ngam-mat-ong-hu-gom-300ml"
  },
  {
    "sku": "TRM-009",
    "supplierId": "trimico",
    "slug": "sam-ngoc-linh-ngam-mat-ong-hu-gom-500ml",
    "name": "Sâm Ngọc Linh Ngâm Mật Ong Hũ Gốm 500ml",
    "price": 5000000,
    "image": "/products/trimico/09-sam-mat-ong-hu-gom-500ml.png",
    "productType": "sam-ngam-mat-ong",
    "healthGoal": "energy",
    "audiences": [
      "executives",
      "seniors",
      "men"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "Hũ Gốm Cao Cấp",
    "description": "45g sâm Ngọc Linh kết hợp 500ml mật ong rừng nguyên chất trong hũ gốm tinh tế. Sâm chứa 84 loại saponin, đặc biệt MR2 có tính kháng khuẩn.",
    "ingredients": "45g sâm Ngọc Linh; 500ml mật ong nguyên chất.",
    "usage": "Lấy 5-10ml pha với 200ml nước ấm (~60°C), uống buổi sáng khi bụng đói.",
    "volume": "500ml, hũ gốm kèm hộp cứng cao cấp",
    "warnings": "Không phù hợp với phụ nữ mang thai và trẻ em dưới 13 tuổi.",
    "targetUsers": "Người tiêu dùng trưởng thành tìm kiếm lợi ích sức khỏe.",
    "sourceUrl": "https://trimico.vn/sam-ngoc-linh-ngam-mat-ong-hu-gom-500ml"
  },
  {
    "sku": "TRM-010",
    "supplierId": "trimico",
    "slug": "sam-ngoc-linh-ngam-mat-ong-500ml",
    "name": "Sâm Ngọc Linh Ngâm Mật Ong 500ml",
    "price": 4000000,
    "image": "/products/trimico/10-sam-mat-ong-500ml.png",
    "productType": "sam-ngam-mat-ong",
    "healthGoal": "energy",
    "audiences": [
      "executives",
      "seniors",
      "men"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "Hộp Gỗ Quà Tặng",
    "description": "40g sâm Ngọc Linh quý hiếm kết hợp mật ong rừng nguyên chất, đóng hũ thủy tinh kèm hộp gỗ quà tặng cao cấp.",
    "ingredients": "40g sâm Ngọc Linh; 500ml mật ong nguyên chất.",
    "usage": "Lấy 5-10ml pha với 200ml nước ấm (~60°C), uống buổi sáng khi bụng đói và nhai kèm lát sâm.",
    "volume": "500ml, hũ thủy tinh kèm hộp gỗ cao cấp",
    "warnings": "Không phù hợp với phụ nữ mang thai và trẻ em dưới 13 tuổi.",
    "sourceUrl": "https://trimico.vn/sam-ngoc-linh-ngam-mat-ong-500ml"
  },
  {
    "sku": "TRM-011",
    "supplierId": "trimico",
    "slug": "hoa-sam-ngoc-linh-tuoi",
    "name": "Hoa Sâm Ngọc Linh Tươi",
    "price": null,
    "image": "/products/premium-bg/11-hoa-sam-tuoi.png",
    "productType": "sam-cu-tuoi-kho",
    "healthGoal": "youth",
    "audiences": [
      "women",
      "men"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "Theo Thời Giá",
    "description": "Hoa sâm Ngọc Linh tươi từ vùng núi cao trên 1.500m rừng nguyên sinh. Hàm lượng ginsenosid cao gấp 5-6 lần phần củ, với các hoạt chất Rb1, Rg1, Rh2, MR2. Hoa ra một lần mỗi năm vào cuối tháng 6.",
    "usage": "Hãm 2-3 bông hoa tươi với 200ml nước sôi ~10 phút, thêm mật ong/đường tùy ý. Hoặc ngâm 100g hoa với 2 lít rượu (35 độ) trong 3 tháng.",
    "warnings": "Không khuyến khích cho phụ nữ mang thai hoặc đang cho con bú.",
    "targetUsers": "Đặc biệt phù hợp cho phụ nữ; cũng khuyến nghị cho nam giới (dùng ngâm rượu).",
    "sourceUrl": "https://trimico.vn/hoa-sam-ngoc-linh-tuoi"
  },
  {
    "sku": "TRM-012",
    "supplierId": "trimico",
    "slug": "la-sam-ngoc-linh-kho-100g",
    "name": "Lá Sâm Ngọc Linh Khô 100g",
    "price": 6000000,
    "image": "/products/trimico/12-la-sam-kho-100g.png",
    "productType": "sam-cu-tuoi-kho",
    "healthGoal": "immunity",
    "audiences": [
      "men",
      "women",
      "seniors"
    ],
    "familySafe": false,
    "giftEligible": false,
    "description": "100% lá sâm tươi tự nhiên sấy khô, không chất bảo quản, giữ nguyên dưỡng chất. Nguồn từ núi Ngọc Linh (Quảng Nam) trên 1500m — lựa chọn tiết kiệm hơn củ sâm tươi.",
    "usage": "Hãm trà: 10g lá khô với 500ml nước nóng, hãm 10-15 phút. Ngâm rượu: 30g lá khô/1 lít rượu, ủ 3 tháng.",
    "volume": "100g",
    "warnings": "Không dùng cho phụ nữ mang thai và cho con bú. Tránh dùng quá liều. Người cao huyết áp/vấn đề tiêu hóa nên hỏi ý kiến bác sĩ.",
    "targetUsers": "Người tiêu dùng phổ thông, ngoại trừ phụ nữ mang thai và cho con bú.",
    "sourceUrl": "https://trimico.vn/la-sam-ngoc-linh-kho-100g"
  },
  {
    "sku": "TRM-013",
    "supplierId": "trimico",
    "slug": "hoa-sam-ngoc-linh-kho-50g",
    "name": "Hoa Sâm Ngọc Linh Khô 50g",
    "price": 5000000,
    "image": "/products/trimico/13-hoa-sam-kho-50g.png",
    "productType": "sam-cu-tuoi-kho",
    "healthGoal": "youth",
    "audiences": [
      "women",
      "seniors"
    ],
    "familySafe": false,
    "giftEligible": false,
    "description": "Hoa sâm khô thu hoạch từ hoa sâm Ngọc Linh quý hiếm, ra hoa một lần mỗi năm. Mô hình khép kín trên 30 hecta trồng, thu hoạch, sản xuất, phân phối.",
    "volume": "50g",
    "warnings": "Không dùng cho phụ nữ mang thai và cho con bú. Bảo quản nơi khô ráo, thoáng mát.",
    "targetUsers": "Người dùng bổ sung sức khỏe phổ thông.",
    "sourceUrl": "https://trimico.vn/hoa-sam-ngoc-linh-kho-50g"
  },
  {
    "sku": "TRM-014",
    "supplierId": "trimico",
    "slug": "la-sam-ngoc-linh-tuoi",
    "name": "Lá Sâm Ngọc Linh Tươi",
    "price": null,
    "image": "/products/trimico/14-la-sam-tuoi.png",
    "productType": "sam-cu-tuoi-kho",
    "healthGoal": "immunity",
    "audiences": [
      "men",
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "Theo Thời Giá",
    "description": "Lá sâm tươi thu hoạch từ cây trồng trên 1.500m tại núi Ngọc Linh (Quảng Nam). Mô hình khép kín, 30 hecta rừng trồng, nguồn cung trực tiếp không qua trung gian.",
    "ingredients": "Ginsenoside (nhóm saponin, hoạt chất chính); Panaxolide (sesquiterpene lactone).",
    "usage": "Hãm trà: 5g lá với 500ml nước sôi, hãm 5-10 phút. Ngâm rượu: 350g lá với 18 lít rượu 30-35 độ, ngâm 90 ngày.",
    "warnings": "Không dùng cho phụ nữ mang thai. Tránh dùng quá liều. Người cao huyết áp/tiêu hóa nên hỏi ý kiến bác sĩ.",
    "targetUsers": "Người tiêu dùng phổ thông; không phù hợp phụ nữ mang thai/cho con bú.",
    "sourceUrl": "https://trimico.vn/la-sam-ngoc-linh-tuoi"
  },
  {
    "sku": "TRM-015",
    "supplierId": "trimico",
    "slug": "sam-ngoc-linh-tuoi",
    "name": "Củ Sâm Ngọc Linh Tươi",
    "price": null,
    "image": "/products/trimico/15-cu-sam-tuoi.png",
    "productType": "sam-cu-tuoi-kho",
    "healthGoal": "immunity",
    "audiences": [
      "men",
      "women",
      "seniors",
      "executives"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "Theo Thời Giá",
    "description": "Củ sâm Ngọc Linh tươi từ đỉnh núi Ngọc Linh (Quảng Nam), trên 1.500m, hoàn toàn tự nhiên, mỗi củ có mã truy xuất nguồn gốc. Hàm lượng saponin cao (52%) gồm saponin MR2, 20 nguyên tố vi lượng, 18 axit béo, 18 axit amin, vitamin C.",
    "sourceUrl": "https://trimico.vn/sam-ngoc-linh-tuoi"
  },
  {
    "sku": "TRM-016",
    "supplierId": "trimico",
    "slug": "tra-nam-lim-xanh",
    "name": "Trà Nấm Lim Xanh",
    "price": 105000,
    "image": "/products/trimico/16-tra-nam-lim-xanh.png",
    "productType": "nam-lim-duoc-lieu",
    "healthGoal": "immunity",
    "audiences": [
      "seniors",
      "women",
      "men",
      "family"
    ],
    "familySafe": true,
    "giftEligible": false,
    "description": "Kết hợp nấm Lim Xanh tự nhiên cùng dược liệu thiên nhiên khác. Hỗ trợ giải độc cơ thể, hỗ trợ gan, điều hòa huyết áp/đường huyết, kiểm soát cân nặng. Chứa Germanium cao gấp 5-7 lần sâm, polysaccharide và protein Ling Zhi-8.",
    "ingredients": "Bột nấm Lim Xanh, bột mật nhân/mật ong, bột hạt muồng.",
    "usage": "Pha gói trà với 200ml nước nóng (80-100°C), sau 2-3 phút là dùng được.",
    "volume": "Hộp 12 gói, mỗi gói 2g",
    "targetUsers": "Phù hợp cho mọi lứa tuổi.",
    "sourceUrl": "https://trimico.vn/tra-nam-lim-xanh"
  },
  {
    "sku": "TRM-017",
    "supplierId": "trimico",
    "slug": "nam-lim-xanh-rung-thai-lat-100g",
    "name": "Nấm Lim Xanh Rừng Thái Lát 100g",
    "price": 320000,
    "image": "/products/trimico/17-nam-lim-thai-lat-100g.png",
    "productType": "nam-lim-duoc-lieu",
    "healthGoal": "immunity",
    "audiences": [
      "seniors",
      "men",
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "description": "Nấm Lim Xanh (Ganoderma lucidum) mọc từ thân cây lim đã chết trong rừng sâu, chứa Germanium cao gấp 5-7 lần sâm, tăng cường hệ miễn dịch. Sấy khô, hút chân không bảo toàn dưỡng chất.",
    "usage": "Nấu 2 lần nước (2L còn 1.5L, rồi 1.5L còn 1L), trộn hai nước, dùng dần trong ngày, để tủ lạnh.",
    "volume": "100g",
    "warnings": "Hạn chế mỡ động vật và gia vị cay khi dùng. Bảo quản nơi khô ráo, thoáng mát.",
    "targetUsers": "Liều theo tình trạng: ung thư 30g/ngày, tiểu đường 20g/ngày; có liều riêng cho viêm gan, gan nhiễm mỡ, gout, viêm khớp.",
    "sourceUrl": "https://trimico.vn/nam-lim-xanh-rung-thai-lat-100g"
  },
  {
    "sku": "TRM-018",
    "supplierId": "trimico",
    "slug": "nam-lim-xanh-rung-thai-lat-500g",
    "name": "Nấm Lim Xanh Rừng Thái Lát 500g",
    "price": 1450000,
    "image": "/products/trimico/18-nam-lim-thai-lat-500g.png",
    "productType": "nam-lim-duoc-lieu",
    "healthGoal": "immunity",
    "audiences": [
      "seniors",
      "men",
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "description": "Nấm Lim Xanh rừng tự nhiên, chứa Germanium cao gấp 5-7 lần sâm, hỗ trợ tăng cường hệ miễn dịch, tuần hoàn máu và giải độc. Sấy khô theo quy trình tiên tiến, đóng gói hút chân không.",
    "usage": "Nấu 2 lần nước (2L còn 1.5L, rồi 1.5L còn 1L), trộn hai nước, dùng dần trong ngày.",
    "volume": "500g",
    "warnings": "Hạn chế mỡ động vật và gia vị cay khi dùng. Bảo quản nơi khô ráo, thoáng mát.",
    "targetUsers": "Liều theo tình trạng: ung thư 30g/ngày; các liều riêng cho cao huyết áp, tiểu đường, gan, gout.",
    "sourceUrl": "https://trimico.vn/nam-lim-xanh-rung-thai-lat-500g"
  },
  {
    "sku": "TRM-019",
    "supplierId": "trimico",
    "slug": "nam-lim-xanh-rung-nguyen-cay-500g",
    "name": "Nấm Lim Xanh Rừng Nguyên Cây 500g",
    "price": 1250000,
    "image": "/products/trimico/19-nam-lim-nguyen-cay-500g.png",
    "productType": "nam-lim-duoc-lieu",
    "healthGoal": "immunity",
    "audiences": [
      "seniors",
      "men",
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "description": "Thu hái từ rừng nguyên sinh Quảng Nam, chế biến nghiêm ngặt, không chất bảo quản. Germanium cao gấp 5-7 lần sâm — hỗ trợ điều trị viêm gan, xơ gan, tăng cường hệ miễn dịch.",
    "usage": "Sơ chế: cắt gốc, rửa nước muối, thái lát/bẻ nhỏ theo liều. Nấu 2 lần nước, trộn, dùng dần trong ngày (để tủ lạnh).",
    "volume": "500g",
    "warnings": "Hạn chế mỡ động vật và gia vị cay. Không dùng khi hết hạn/hư hỏng. Bảo quản nơi khô ráo, thoáng mát.",
    "targetUsers": "Nhóm hỗ trợ điều trị (30g/ngày ung thư, 20g/ngày tiểu đường...) và nhóm bồi bổ/tăng cường sức khỏe.",
    "sourceUrl": "https://trimico.vn/nam-lim-xanh-rung-nguyen-cay-500g"
  },
  {
    "sku": "TRM-020",
    "supplierId": "trimico",
    "slug": "ruou-sam-ngoc-linh-500ml",
    "name": "Rượu Sâm Ngọc Linh 500ml",
    "price": 550000,
    "image": "/products/trimico/20-ruou-sam-500ml.png",
    "productType": "ruou-sam",
    "healthGoal": "energy",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "displayOnly18Plus": true,
    "giftEligible": false,
    "description": "Kết hợp sâm Ngọc Linh quý hiếm với rượu nếp cái hoa vàng, công nghệ hiện đại xử lý loại bỏ andehit, cắt liên kết cồn để an toàn cho gan. Hỗ trợ tăng cường sinh lực và giảm căng thẳng.",
    "ingredients": "10g lá sâm Ngọc Linh tươi; rượu nếp cái hoa vàng (đã xử lý loại bỏ andehit).",
    "usage": "Rót ra ly nhỏ, thưởng thức từ từ.",
    "volume": "500ml/chai; 12 chai/thùng",
    "warnings": "Không phù hợp với phụ nữ mang thai, người vận hành máy móc/tàu xe, người nhạy cảm với thành phần.",
    "sourceUrl": "https://trimico.vn/ruou-sam-ngoc-linh-500ml"
  },
  {
    "sku": "TRM-021",
    "supplierId": "trimico",
    "slug": "ruou-thay-ong-noi-thuong-hang-1000ml",
    "name": "Rượu Thầy Ông Nội Thượng Hạng 1000ml",
    "price": 2700000,
    "image": "/products/trimico/21-ruou-thay-ong-noi-1000ml.png",
    "productType": "ruou-sam",
    "healthGoal": "energy",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "displayOnly18Plus": true,
    "giftEligible": false,
    "badge": "Thượng Hạng",
    "description": "Trải nghiệm đẳng cấp với hương vị êm dịu, tinh tế từ các dược liệu quý kết hợp rượu nếp cái hoa vàng.",
    "ingredients": "Củ sâm Ngọc Linh, rượu nếp cái hoa vàng, dâm dương hoắc, mú từng, bạch tật lê, cỏ cà ri, ba kích, ka kun, ngọc cẩu, sâm dây Ngọc Linh, chuối hột.",
    "usage": "Mỗi ngày nên sử dụng một lượng vừa đủ.",
    "volume": "1000ml",
    "warnings": "Không phù hợp với phụ nữ mang thai; người vận hành máy móc/tàu xe; người mẫn cảm với thành phần.",
    "sourceUrl": "https://trimico.vn/ruou-thay-ong-noi-thuong-hang-1000ml"
  },
  {
    "sku": "TRM-022",
    "supplierId": "trimico",
    "slug": "ruou-thay-ong-noi-300ml",
    "name": "Rượu Thầy Ông Nội 300ml",
    "price": 200000,
    "image": "/products/trimico/22-ruou-thay-ong-noi-300ml.png",
    "productType": "ruou-sam",
    "healthGoal": "stress",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "displayOnly18Plus": true,
    "giftEligible": false,
    "description": "Rượu dược liệu kết hợp y học cổ truyền với công nghệ sản xuất hiện đại, hỗ trợ cải thiện đề kháng, giảm stress khi dùng lượng vừa đủ.",
    "ingredients": "Chiết xuất sâm Ngọc Linh, rượu nếp cái hoa vàng, dâm dương hoắc, mú từng, bạch tật lê, cỏ cà ri, ba kích, ka kun, ngọc cẩu, sâm dây Ngọc Linh, chuối hột.",
    "usage": "Mỗi ngày nên sử dụng một lượng vừa đủ.",
    "volume": "300ml",
    "warnings": "Không phù hợp với phụ nữ mang thai; người vận hành máy móc/tàu xe; người mẫn cảm với thành phần.",
    "sourceUrl": "https://trimico.vn/ruou-thay-ong-noi-300ml"
  },
  {
    "sku": "TRM-023",
    "supplierId": "trimico",
    "slug": "ruou-sam-ngoc-linh-thuong-hang",
    "name": "Rượu Sâm Ngọc Linh Thượng Hạng 500ml",
    "price": 2300000,
    "image": "/products/trimico/23-ruou-sam-thuong-hang.png",
    "productType": "ruou-sam",
    "healthGoal": "energy",
    "audiences": [
      "executives",
      "men"
    ],
    "familySafe": false,
    "displayOnly18Plus": true,
    "giftEligible": false,
    "badge": "Thượng Hạng",
    "description": "Sâm Ngọc Linh từ rừng nguyên sinh Quảng Nam kết hợp rượu nếp cái hoa vàng lên men truyền thống, chưng cất 6 tầng, khử andehit và hạ thổ hai lần. Chai kèm ly thủy tinh cao cấp và hộp quà sang trọng.",
    "ingredients": "Củ sâm Ngọc Linh tươi; rượu nếp cái hoa vàng.",
    "usage": "Mỗi ngày nên sử dụng một lượng vừa đủ.",
    "volume": "500ml, chai thủy tinh kèm ly cao cấp và hộp quà sang trọng",
    "warnings": "Không phù hợp với phụ nữ mang thai, người vận hành máy móc/tàu xe, người mẫn cảm với thành phần.",
    "sourceUrl": "https://trimico.vn/ruou-sam-ngoc-linh-thuong-hang"
  },
  {
    "sku": "TRM-024",
    "supplierId": "trimico",
    "slug": "ruou-sam-ngoc-linh-hop-den",
    "name": "Rượu Sâm Ngọc Linh 500ml (Hộp Đen)",
    "price": 600000,
    "image": "/products/trimico/24-ruou-sam-hop-den.png",
    "productType": "ruou-sam",
    "healthGoal": "energy",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "displayOnly18Plus": true,
    "giftEligible": false,
    "description": "Kết hợp tinh tế sâm Ngọc Linh và rượu nếp cái hoa vàng, thiết kế hộp đen sang trọng, phù hợp làm quà tặng lễ, Tết, sự kiện.",
    "ingredients": "10g lá sâm Ngọc Linh tươi; rượu nếp cái hoa vàng.",
    "usage": "Rót ra ly nhỏ, thưởng thức từ từ.",
    "volume": "500ml, hộp đen cao cấp",
    "warnings": "Mỗi ngày nên sử dụng một lượng vừa đủ. Không phù hợp với phụ nữ mang thai.",
    "targetUsers": "Người tiêu dùng phổ thông tìm kiếm thức uống bổ dưỡng.",
    "sourceUrl": "https://trimico.vn/ruou-sam-ngoc-linh-hop-den"
  },
  {
    "sku": "TRM-025",
    "supplierId": "trimico",
    "slug": "ruou-la-sam-ngoc-linh-2-lit",
    "name": "Rượu Lá Sâm Ngọc Linh 2 Lít",
    "price": 1350000,
    "image": "/products/trimico/25-ruou-la-sam-2l.png",
    "productType": "ruou-sam",
    "healthGoal": "energy",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "displayOnly18Plus": true,
    "giftEligible": false,
    "description": "Rượu nếp cái hoa vàng kết hợp lá sâm Ngọc Linh, vị đắng ngọt đặc trưng, hơi hăng nhẹ của lá sâm và hậu vị ấm nồng, mang lại cảm giác sảng khoái.",
    "ingredients": "Bản tươi: 40g lá sâm tươi + rượu nếp. Bản khô: 15g lá sâm khô + rượu nếp cái hoa vàng.",
    "volume": "2 lít",
    "warnings": "Không phù hợp với phụ nữ mang thai; người vận hành máy móc/tàu xe; người mẫn cảm với thành phần.",
    "sourceUrl": "https://trimico.vn/ruou-la-sam-ngoc-linh-2-lit"
  },
  {
    "sku": "TRM-026",
    "supplierId": "trimico",
    "slug": "ruou-la-sam-ngoc-linh-5-lit",
    "name": "Rượu Lá Sâm Ngọc Linh 5 Lít",
    "price": 3800000,
    "image": "/products/trimico/26-ruou-la-sam-5l.png",
    "productType": "ruou-sam",
    "healthGoal": "energy",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "displayOnly18Plus": true,
    "giftEligible": false,
    "description": "Lá sâm Ngọc Linh và rượu nếp cái hoa vàng, vị đắng ngọt đặc trưng cùng hương ấm nồng, không gây mệt mỏi/đau đầu thường thấy ở rượu thông thường.",
    "ingredients": "Bản tươi: 150g lá sâm tươi + rượu nếp. Bản khô: 50g lá sâm khô + rượu nếp cái hoa vàng.",
    "volume": "5 lít",
    "warnings": "Không phù hợp với phụ nữ mang thai; người vận hành máy móc/tàu xe; người mẫn cảm với thành phần.",
    "sourceUrl": "https://trimico.vn/ruou-la-sam-ngoc-linh-5-lit"
  },
  {
    "sku": "TRM-027",
    "supplierId": "trimico",
    "slug": "ruou-la-sam-ngoc-linh-12-lit",
    "name": "Rượu Lá Sâm Ngọc Linh 12 Lít",
    "price": 10050000,
    "image": "/products/trimico/27-ruou-la-sam-12l.jpg",
    "productType": "ruou-sam",
    "healthGoal": "energy",
    "audiences": [
      "executives"
    ],
    "familySafe": false,
    "displayOnly18Plus": true,
    "giftEligible": false,
    "badge": "Số Lượng Lớn",
    "description": "Rượu truyền thống kết hợp tinh chất lá sâm Ngọc Linh cao cấp, quy trình sản xuất giữ dưỡng chất thiết yếu và giảm chất có hại — phù hợp làm quà/kinh doanh số lượng lớn.",
    "ingredients": "400g lá sâm Ngọc Linh tươi; rượu nếp cái hoa vàng.",
    "volume": "12 lít",
    "warnings": "Không phù hợp với phụ nữ mang thai, người vận hành máy móc/tàu xe, người mẫn cảm với thành phần.",
    "sourceUrl": "https://trimico.vn/ruou-la-sam-ngoc-linh-12-lit"
  },
  {
    "sku": "TRM-028",
    "supplierId": "trimico",
    "slug": "ruou-nam-lim-xanh-3-lit",
    "name": "Rượu Nấm Lim Xanh 3 Lít (Nấm Nguyên Cây)",
    "price": 1900000,
    "image": "/products/trimico/28-ruou-nam-lim-3l.png",
    "productType": "ruou-sam",
    "healthGoal": "immunity",
    "audiences": [
      "men",
      "seniors"
    ],
    "familySafe": false,
    "displayOnly18Plus": true,
    "giftEligible": false,
    "description": "Hàm lượng Germanium cao cùng hoạt chất chống oxy hóa, tăng sức đề kháng, hỗ trợ phòng ngừa ung thư. Nấm Lim Xanh rừng tự nhiên kết hợp rượu gạo truyền thống.",
    "ingredients": "200g nấm Lim Xanh rừng tự nhiên; rượu gạo truyền thống.",
    "volume": "3 lít",
    "warnings": "Không dùng cho phụ nữ có thai, người vận hành máy móc, người mẫn cảm với thành phần.",
    "sourceUrl": "https://trimico.vn/ruou-nam-lim-xanh-3-lit"
  },
  {
    "sku": "TRM-029",
    "supplierId": "trimico",
    "slug": "ruou-nam-lim-xanh-5-lit",
    "name": "Rượu Nấm Lim Xanh 5 Lít (Nấm Nguyên Cây)",
    "price": 2800000,
    "image": "/products/trimico/29-ruou-nam-lim-5l.png",
    "productType": "ruou-sam",
    "healthGoal": "immunity",
    "audiences": [
      "men",
      "seniors"
    ],
    "familySafe": false,
    "displayOnly18Plus": true,
    "giftEligible": false,
    "description": "Germanium cao (5-7 lần so với sâm) cùng chất chống oxy hóa, hỗ trợ miễn dịch, cải thiện giấc ngủ và tuần hoàn máu.",
    "ingredients": "300g nấm Lim Xanh rừng tự nhiên; rượu nếp cái hoa vàng.",
    "volume": "5 lít",
    "warnings": "Không sử dụng cho phụ nữ có thai, người vận hành máy móc, người mẫn cảm với thành phần.",
    "sourceUrl": "https://trimico.vn/ruou-nam-lim-xanh-5-lit"
  },
  {
    "sku": "TRM-030",
    "supplierId": "trimico",
    "slug": "ruou-hoa-sam-ngoc-linh-50g",
    "name": "Rượu Hoa Sâm Ngọc Linh 1 Lít",
    "price": 1700000,
    "image": "/products/trimico/30-ruou-hoa-sam-1l.png",
    "productType": "ruou-sam",
    "healthGoal": "immunity",
    "audiences": [
      "women",
      "men",
      "executives"
    ],
    "familySafe": false,
    "displayOnly18Plus": true,
    "giftEligible": false,
    "description": "Hoa sâm Ngọc Linh ở độ cao trên 1.500m, ginsenosid cao gấp 5-6 lần phần củ, hỗ trợ miễn dịch và chức năng gan, ngâm cùng rượu nếp cái hoa vàng đã lọc.",
    "ingredients": "50g hoa sâm Ngọc Linh tươi; rượu nếp cái hoa vàng.",
    "volume": "1 lít",
    "warnings": "Không phù hợp với phụ nữ mang thai; người vận hành máy móc/tàu xe; người mẫn cảm với thành phần.",
    "sourceUrl": "https://trimico.vn/ruou-hoa-sam-ngoc-linh-50g"
  },
  {
    "sku": "TRM-031",
    "supplierId": "trimico",
    "slug": "ruou-hoa-sam-ngoc-linh-70g",
    "name": "Rượu Hoa Sâm Ngọc Linh 2 Lít",
    "price": 2250000,
    "image": "/products/trimico/31-ruou-hoa-sam-2l.png",
    "productType": "ruou-sam",
    "healthGoal": "immunity",
    "audiences": [
      "women",
      "men",
      "executives"
    ],
    "familySafe": false,
    "displayOnly18Plus": true,
    "giftEligible": false,
    "description": "Dược tính quý của hoa sâm Ngọc Linh kết hợp nghệ thuật ngâm rượu truyền thống, vị đắng nhẹ chuyển ngọt thanh, hậu vị ấm nồng kéo dài.",
    "ingredients": "70g hoa sâm Ngọc Linh tươi; rượu nếp cái hoa vàng.",
    "volume": "2 lít",
    "warnings": "Không phù hợp với phụ nữ mang thai; người vận hành máy móc/tàu xe; người mẫn cảm với thành phần.",
    "sourceUrl": "https://trimico.vn/ruou-hoa-sam-ngoc-linh-70g"
  },
  {
    "sku": "TRM-032",
    "supplierId": "trimico",
    "slug": "ruou-hoa-sam-ngoc-linh-100g",
    "name": "Rượu Hoa Sâm Ngọc Linh 3 Lít",
    "price": 3150000,
    "image": "/products/trimico/32-ruou-hoa-sam-3l.png",
    "productType": "ruou-sam",
    "healthGoal": "immunity",
    "audiences": [
      "executives",
      "men"
    ],
    "familySafe": false,
    "displayOnly18Plus": true,
    "giftEligible": false,
    "description": "100g hoa sâm Ngọc Linh tươi kết hợp rượu nếp cái hoa vàng. Ginsenosid cao gấp 5-6 lần phần củ, hỗ trợ miễn dịch, điều hòa thần kinh, tăng cường chức năng gan.",
    "ingredients": "100g hoa sâm Ngọc Linh tươi; rượu nếp cái hoa vàng.",
    "volume": "3 lít",
    "warnings": "Không phù hợp với phụ nữ mang thai, người vận hành máy móc/tàu xe, người mẫn cảm với thành phần.",
    "sourceUrl": "https://trimico.vn/ruou-hoa-sam-ngoc-linh-100g"
  },
  {
    "sku": "TRM-033",
    "supplierId": "trimico",
    "slug": "ruou-hoa-sam-ngoc-linh-150g",
    "name": "Rượu Hoa Sâm Ngọc Linh 8 Lít",
    "price": 5600000,
    "image": "/products/trimico/33-ruou-hoa-sam-8l.jpg",
    "productType": "ruou-sam",
    "healthGoal": "immunity",
    "audiences": [
      "executives"
    ],
    "familySafe": false,
    "displayOnly18Plus": true,
    "giftEligible": false,
    "badge": "Số Lượng Lớn",
    "description": "Hoa sâm Ngọc Linh ngâm rượu nếp đã qua lọc — hỗ trợ cải thiện chức năng sinh lý, tăng cường hệ miễn dịch và giảm căng thẳng.",
    "ingredients": "150g hoa sâm Ngọc Linh tươi; rượu nếp cái hoa vàng.",
    "volume": "8 lít",
    "warnings": "Không phù hợp với phụ nữ mang thai, người vận hành máy móc/tàu xe, người mẫn cảm với thành phần.",
    "sourceUrl": "https://trimico.vn/ruou-hoa-sam-ngoc-linh-150g"
  },
  {
    "sku": "TRM-034",
    "supplierId": "trimico",
    "slug": "ruou-cu-sam-ngoc-linh",
    "name": "Rượu Củ Sâm Ngọc Linh 1 Lít",
    "price": 5500000,
    "image": "/products/trimico/34-ruou-cu-sam-1l.png",
    "productType": "ruou-sam",
    "healthGoal": "energy",
    "audiences": [
      "executives",
      "men"
    ],
    "familySafe": false,
    "displayOnly18Plus": true,
    "giftEligible": false,
    "badge": "7 Năm Tuổi",
    "description": "Ngâm ủ từ 30g củ sâm tươi 7 năm tuổi cùng rượu gạo nấu thủ công. Hương thơm đặc trưng, vị đắng và hậu ngọt cân bằng.",
    "ingredients": "30g củ sâm Ngọc Linh tươi (7 năm tuổi); rượu nếp cái hoa vàng.",
    "volume": "1 lít",
    "warnings": "Không phù hợp với phụ nữ mang thai; người vận hành máy móc, tàu xe; người mẫn cảm với thành phần.",
    "sourceUrl": "https://trimico.vn/ruou-cu-sam-ngoc-linh"
  },
  {
    "sku": "TRM-035",
    "supplierId": "trimico",
    "slug": "ruou-cu-sam-ngoc-linh-2-lit-cu-sam-40g",
    "name": "Rượu Củ Sâm Ngọc Linh 2 Lít — Củ Sâm Tươi 40g Có 8 Năm Tuổi",
    "price": 7400000,
    "image": "/products/trimico/35-ruou-cu-sam-2l.png",
    "productType": "ruou-sam",
    "healthGoal": "energy",
    "audiences": [
      "executives",
      "men"
    ],
    "familySafe": false,
    "displayOnly18Plus": true,
    "giftEligible": false,
    "badge": "8 Năm Tuổi",
    "description": "Hương thơm đặc trưng mang lại cảm giác thoải mái, vị đắng nhẹ kết hợp hậu ngọt tạo trải nghiệm vị giác độc đáo.",
    "ingredients": "40g củ sâm Ngọc Linh tươi (8 năm tuổi); rượu nếp cái hoa vàng.",
    "volume": "2 lít",
    "warnings": "Không phù hợp với phụ nữ mang thai, người vận hành máy móc/tàu xe, người mẫn cảm với thành phần.",
    "sourceUrl": "https://trimico.vn/ruou-cu-sam-ngoc-linh-2-lit-cu-sam-40g"
  },
  {
    "sku": "TRM-036",
    "supplierId": "trimico",
    "slug": "ruou-phu-ninh-tuu",
    "name": "Rượu Phú Ninh Tửu – Rượu Gạo Truyền Thống",
    "price": 50000,
    "image": "/products/trimico/36-ruou-phu-ninh-tuu.png",
    "productType": "ruou-sam",
    "healthGoal": "energy",
    "audiences": [
      "men"
    ],
    "familySafe": false,
    "displayOnly18Plus": true,
    "giftEligible": false,
    "description": "Rượu gạo truyền thống Việt Nam chưng cất tỉ mỉ, thơm nồng, đậm đà — cũng dùng làm dung môi ngâm dược liệu như Sâm Ngọc Linh, Nấm Lim Xanh, Ba Kích.",
    "warnings": "Không dùng cho phụ nữ có thai, đang cho con bú, người dị ứng cồn, người có bệnh gan/thận (nên hỏi ý kiến bác sĩ).",
    "sourceUrl": "https://trimico.vn/ruou-phu-ninh-tuu"
  },
  {
    "sku": "TRM-037",
    "supplierId": "trimico",
    "slug": "tra-thanh-nhiet-giai-doc-gan",
    "name": "Trà Thanh Nhiệt",
    "price": 80000,
    "image": "/products/trimico/37-tra-thanh-nhiet.png",
    "productType": "tra-nuoc-uong-sam",
    "healthGoal": "immunity",
    "audiences": [
      "seniors",
      "men",
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "description": "Trà thảo mộc sản xuất khép kín, bảo toàn dược tính, không chất bảo quản, không hương liệu nhân tạo — hỗ trợ thanh nhiệt, giải độc gan.",
    "ingredients": "Nấm Linh Chi, hạt muồng, đậu đen.",
    "usage": "Dùng ~50g trà, hãm với 500ml nước sôi (90-100°C), ủ 10-15 phút. Nên dùng khi còn ấm, tốt nhất buổi sáng.",
    "volume": "500g/hộp",
    "sourceUrl": "https://trimico.vn/tra-thanh-nhiet-giai-doc-gan"
  },
  {
    "sku": "TRM-038",
    "supplierId": "trimico",
    "slug": "kakun-kho",
    "name": "KaKun Khô (Khúc Khắc)",
    "price": 200000,
    "image": "/products/trimico/38-kakun-kho.png",
    "productType": "nam-lim-duoc-lieu",
    "healthGoal": "immunity",
    "audiences": [
      "seniors",
      "men"
    ],
    "familySafe": false,
    "giftEligible": false,
    "description": "Rễ cây Smilax glabra mọc ở vùng núi miền Trung/Bắc Việt Nam. Hỗ trợ thanh nhiệt giải độc, xương khớp, tiêu hóa, tăng đề kháng và làm đẹp da, chống lão hóa.",
    "usage": "Sắc 50-60g rễ khô với 1 lít nước đến còn 500ml. Dùng 7 ngày rồi nghỉ vài ngày. Có thể ngâm rượu.",
    "warnings": "Không dùng cho phụ nữ có thai/cho con bú, trẻ dưới 12 tuổi, người đang dùng thuốc theo đơn, người dị ứng Smilax. Không kết hợp trà xanh/trà tươi.",
    "sourceUrl": "https://trimico.vn/kakun-kho"
  },
  {
    "sku": "TRM-039",
    "supplierId": "trimico",
    "slug": "ba-kich-tim",
    "name": "Ba Kích Tím",
    "price": 300000,
    "image": "/products/trimico/39-ba-kich-tim.png",
    "productType": "nam-lim-duoc-lieu",
    "healthGoal": "energy",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "giftEligible": false,
    "description": "Dược liệu quý y học cổ truyền phương Đông. Phần thịt màu tím đặc trưng, giá trị cao hơn loại trắng. Hỗ trợ thận yếu, kinh nguyệt không đều, đau lưng mỏi gối.",
    "ingredients": "Rubiadin, gentianine, choline, trigonelline, quercetin, luteolin, vitamin B1, vitamin C, phytosterol, tinh dầu.",
    "warnings": "Tránh/hạn chế dùng nếu sốt về chiều, táo bón, viêm đường tiết niệu, huyết áp thấp, hoặc nam giới khó xuất tinh.",
    "sourceUrl": "https://trimico.vn/ba-kich-tim"
  },
  {
    "sku": "TRM-040",
    "supplierId": "trimico",
    "slug": "hong-dang-sam",
    "name": "Hồng Đẳng Sâm",
    "price": 500000,
    "image": "/products/trimico/40-hong-dang-sam.png",
    "productType": "nam-lim-duoc-lieu",
    "healthGoal": "immunity",
    "audiences": [
      "family",
      "seniors",
      "women",
      "men"
    ],
    "familySafe": true,
    "giftEligible": false,
    "description": "Một trong 10 loại sâm quý phổ biến nhất Việt Nam, mọc ở vùng núi cao 900-2000m. Phần củ rễ là dược liệu chính, dùng chế biến món ăn bổ dưỡng.",
    "usage": "Chế biến món ăn bổ dưỡng như hầm gà, nấu súp, hoặc ngâm rượu gạo tự nhiên.",
    "warnings": "Trẻ dưới 1 tuổi, người rối loạn đông máu, hoặc đang dùng thuốc khác nên hỏi ý kiến bác sĩ.",
    "sourceUrl": "https://trimico.vn/hong-dang-sam"
  },
  {
    "sku": "TRM-041",
    "supplierId": "trimico",
    "slug": "mat-ong-rung-500ml",
    "name": "Mật Ong Rừng 500ml",
    "price": 450000,
    "image": "/products/trimico/41-mat-ong-rung-500ml.png",
    "productType": "nam-lim-duoc-lieu",
    "healthGoal": "energy",
    "audiences": [
      "family",
      "seniors",
      "women",
      "men"
    ],
    "familySafe": true,
    "giftEligible": false,
    "description": "Mật ong rừng nguyên chất từ tổ ong hoang dã, không hóa chất/pha trộn. Giàu đường tự nhiên, vitamin B1-B6, E, K, C và khoáng chất — hỗ trợ trao đổi chất, tăng đề kháng.",
    "volume": "500ml",
    "sourceUrl": "https://trimico.vn/mat-ong-rung-500ml"
  },
  {
    "sku": "TRM-042",
    "supplierId": "trimico",
    "slug": "mat-ong-dang-rung-ngoc-linh-500ml",
    "name": "Mật Ong Đắng Rừng Ngọc Linh 500ml",
    "price": 600000,
    "image": "/products/premium-bg/42-mat-ong-dang-rung-500ml.png",
    "productType": "nam-lim-duoc-lieu",
    "healthGoal": "immunity",
    "audiences": [
      "men",
      "women",
      "seniors"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "Đặc Sản",
    "description": "Ong lấy phấn hoa từ hoa xoan, lá ngón, anh túc, chó đẻ — vị đắng đặc trưng chuyển ngọt dịu. Thu hoạch mùa đông đến tháng 3, sản lượng hạn chế, nguyên chất không pha trộn.",
    "volume": "500ml",
    "sourceUrl": "https://trimico.vn/mat-ong-dang-rung-ngoc-linh-500ml"
  },
  {
    "sku": "TRM-043",
    "supplierId": "trimico",
    "slug": "tieu-tien-phuoc-100g",
    "name": "Tiêu Tiên Phước 100g",
    "price": 80000,
    "image": "/products/trimico/43-tieu-tien-phuoc-100g.png",
    "productType": "nam-lim-duoc-lieu",
    "healthGoal": "immunity",
    "audiences": [
      "family"
    ],
    "familySafe": true,
    "giftEligible": false,
    "description": "Tiêu đặc sản huyện Tiên Phước, Quảng Nam — mùi thơm nồng, vị cay đặc trưng (\"tiêu nguồn\"). Trồng truyền thống, không giàn nhân tạo hay hóa chất.",
    "usage": "Dùng cho món nướng, xào, kho, trộn salad, kết hợp tốt với nghệ, tỏi, chanh, húng quế.",
    "volume": "100g",
    "sourceUrl": "https://trimico.vn/tieu-tien-phuoc-100g"
  },
  {
    "sku": "TRM-044",
    "supplierId": "trimico",
    "slug": "kho-qua-rung-dong-goi",
    "name": "Khổ Qua Rừng",
    "price": 400000,
    "image": "/products/trimico/44-kho-qua-rung.png",
    "productType": "nam-lim-duoc-lieu",
    "healthGoal": "immunity",
    "audiences": [
      "seniors",
      "men",
      "women"
    ],
    "familySafe": false,
    "giftEligible": false,
    "description": "Dược liệu quý giàu amino acid, hợp chất đắng chống oxy hóa, flavonoid, lutein, vitamin C, canxi, kali — tốt cho miễn dịch, thị lực, xương khớp và tim mạch.",
    "ingredients": "Amino acid, hợp chất đắng, chất xơ, flavonoid, lutein, vitamin C, canxi, kali.",
    "warnings": "Người bệnh gan, phụ nữ có thai/cho con bú/dự định mang thai, người huyết áp thấp hoặc rối loạn tiêu hóa nên tránh sử dụng.",
    "sourceUrl": "https://trimico.vn/kho-qua-rung-dong-goi"
  },
  {
    "sku": "TRM-045",
    "supplierId": "trimico",
    "slug": "mat-ong-rung-1-lit",
    "name": "Mật Ong Rừng 1 Lít",
    "price": 900000,
    "image": "/products/trimico/45-mat-ong-rung-1l.png",
    "productType": "nam-lim-duoc-lieu",
    "healthGoal": "energy",
    "audiences": [
      "family",
      "seniors",
      "women",
      "men"
    ],
    "familySafe": true,
    "giftEligible": false,
    "description": "Mật ong nguyên chất từ tổ ong hoang dã, không can thiệp con người, hướng đến người tiêu dùng đề cao sản phẩm tự nhiên.",
    "volume": "1 lít",
    "sourceUrl": "https://trimico.vn/mat-ong-rung-1-lit"
  },
  {
    "sku": "TRM-046",
    "supplierId": "trimico",
    "slug": "mat-ong-dang-rung-ngoc-linh",
    "name": "Mật Ong Đắng Rừng Ngọc Linh 1 Lít",
    "price": 1200000,
    "image": "/products/trimico/46-mat-ong-dang-rung-1l.png",
    "productType": "nam-lim-duoc-lieu",
    "healthGoal": "immunity",
    "audiences": [
      "men",
      "women",
      "seniors"
    ],
    "familySafe": false,
    "giftEligible": false,
    "badge": "Đặc Sản",
    "description": "Ong thu phấn hoa từ các loài hoa hiếm (hoa xoan, lá ngón, anh túc, chó đẻ) — vị đắng nhẹ đầu lưỡi, ngọt dịu về sau. Sản lượng khan hiếm, nguyên chất.",
    "volume": "1 lít",
    "sourceUrl": "https://trimico.vn/mat-ong-dang-rung-ngoc-linh"
  },
  {
    "sku": "TRM-047",
    "supplierId": "trimico",
    "slug": "tieu-tien-phuoc-200g",
    "name": "Tiêu Tiên Phước 200g",
    "price": 140000,
    "image": "/products/trimico/47-tieu-tien-phuoc-200g.png",
    "productType": "nam-lim-duoc-lieu",
    "healthGoal": "immunity",
    "audiences": [
      "family"
    ],
    "familySafe": true,
    "giftEligible": false,
    "description": "Giống tiêu sẻ đặc sản Tiên Phước, Quảng Nam, hạt nhỏ đến trung bình, màu đen nhiều nếp nhăn, thơm đặc trưng. Trồng truyền thống, không giàn nhân tạo/hóa chất.",
    "usage": "Dùng cho món nướng, xào, kho hoặc rắc salad, kết hợp tốt với nghệ, tỏi, chanh, húng quế.",
    "volume": "200g",
    "sourceUrl": "https://trimico.vn/tieu-tien-phuoc-200g"
  },
  {
    "sku": "TRM-048",
    "supplierId": "trimico",
    "slug": "tieu-tien-phuoc-500g",
    "name": "Tiêu Tiên Phước 500g",
    "price": 350000,
    "image": "/products/trimico/48-tieu-tien-phuoc-500g.png",
    "productType": "nam-lim-duoc-lieu",
    "healthGoal": "immunity",
    "audiences": [
      "family"
    ],
    "familySafe": true,
    "giftEligible": false,
    "description": "Tiêu sẻ hạt nhỏ vừa, phơi khô màu đen nhiều nếp nhăn, mùi thơm đặc biệt. Đặc sản Tiên Phước, canh tác truyền thống qua nhiều thế hệ.",
    "usage": "Dùng cho món nướng, xào, kho, rắc salad, kết hợp tốt với nghệ, tỏi, chanh, húng quế.",
    "volume": "500g",
    "sourceUrl": "https://trimico.vn/tieu-tien-phuoc-500g"
  },
  {
    "sku": "TRM-049",
    "supplierId": "trimico",
    "slug": "chuoi-hot-rung",
    "name": "Chuối Hột Rừng",
    "price": 100000,
    "image": "/products/trimico/49-chuoi-hot-rung.png",
    "productType": "nam-lim-duoc-lieu",
    "healthGoal": "energy",
    "audiences": [
      "men"
    ],
    "familySafe": false,
    "giftEligible": false,
    "description": "Hạt chuối hột rừng sấy khô, ứng dụng nhiều trong y học cổ truyền — hình dạng góc cạnh, hạt lớn cứng, vỏ dày bền.",
    "usage": "Ngâm rượu: trộn hạt khô với rượu gạo (40-50 độ) tỷ lệ 1:4, bình thủy tinh/gốm, đậy kín, bảo quản nơi mát tối 3-4 tháng.",
    "warnings": "Là thực phẩm tốt cho sức khỏe nhưng không nên sử dụng bừa bãi hay lạm dụng lâu dài.",
    "sourceUrl": "https://trimico.vn/chuoi-hot-rung"
  },
  {
    "sku": "TRM-050",
    "supplierId": "trimico",
    "slug": "set-qua-dai-cat-dai-loi",
    "name": "Set Quà Đại Cát Đại Lợi",
    "price": 890000,
    "image": "/products/trimico/50-set-qua-dai-cat-dai-loi.png",
    "productType": "set-qua-tang",
    "healthGoal": "energy",
    "audiences": [
      "executives",
      "seniors"
    ],
    "familySafe": false,
    "displayOnly18Plus": true,
    "giftEligible": true,
    "badge": "Quà Tết",
    "description": "Kết hợp giá trị sức khỏe, tính thẩm mỹ và ý nghĩa tình cảm — \"lựa chọn hoàn hảo, đáp ứng nhu cầu chất lượng và phù hợp với nhiều mức ngân sách\".",
    "ingredients": "Rượu sâm Ngọc Linh 300ml (ngâm lá sâm tươi và rượu nếp); Thạch sâm Ngọc Linh 100g (5 gói x 20g); Trà nấm Lim Xanh 10g (5 gói x 2g); kèm túi quà và thiệp chúc mừng.",
    "volume": "Rượu 300ml, Thạch 100g, Trà nấm Lim Xanh 10g; hộp quà bìa cứng cao cấp",
    "warnings": "Thành phần rượu trong set chỉ trưng bày và đang chờ phê duyệt của Bộ Công Thương. Cam kết không bán rượu cho người dưới 18 tuổi.",
    "sourceUrl": "https://trimico.vn/set-qua-dai-cat-dai-loi"
  },
  {
    "sku": "SK5-001",
    "supplierId": "samk5",
    "slug": "nuoc-uong-duong-da-sam-ngoc-linh-collagen-noliko",
    "name": "Nước Uống Dưỡng Da Sâm Ngọc Linh Collagen Noliko",
    "price": 20000,
    "image": "/products/samk5/01-nuoc-uong-duong-da-collagen.png",
    "productType": "tra-nuoc-uong-sam",
    "healthGoal": "youth",
    "audiences": [
      "women",
      "seniors"
    ],
    "familySafe": true,
    "giftEligible": false,
    "description": "Bổ sung collagen giúp da sáng đẹp, ngăn ngừa lão hoá, cung cấp vitamin cần thiết tốt cho sức khoẻ.",
    "volume": "240ml/lon",
    "sourceUrl": "https://samk5.vn/san-pham/thuc-pham-bo-sung-nuoc-uong-duong-da-sam-ngoc-linh-collagen-noliko-240mllon"
  },
  {
    "sku": "SK5-002",
    "supplierId": "samk5",
    "slug": "nuoc-tang-luc-sam-ngoc-linh-dau-tay-do",
    "name": "Nước Tăng Lực Sâm Ngọc Linh Dâu Tây Đỏ",
    "price": 252000,
    "image": "/products/samk5/02-nuoc-tang-luc-dau-tay-do.png",
    "productType": "tra-nuoc-uong-sam",
    "healthGoal": "energy",
    "audiences": [
      "men",
      "executives"
    ],
    "familySafe": false,
    "giftEligible": false,
    "description": "Nước giải khát bổ sung dâu tây đỏ và chiết xuất Sâm Ngọc Linh, hương thơm dịu ngọt, vị gas nhẹ, mang đến thức uống giàu năng lượng.",
    "ingredients": "Nước bão hòa CO2, đường mía, Dextrose, Taurine, nước ép dâu tây đỏ (1,5g/l), Caffein, cao Sâm Ngọc Linh (40mg/l), Vitamin B3, B5, B6, Kẽm.",
    "volume": "Lon 320ml",
    "warnings": "Chứa caffein — không khuyến khích dùng cho trẻ em.",
    "sourceUrl": "https://samk5.vn/san-pham/thuc-pham-bo-sung-nuoc-tang-luc-sam-ngoc-linh-k5-dau-tay-do"
  },
  {
    "sku": "SK5-003",
    "supplierId": "samk5",
    "slug": "chanh-khoang-sam-ngoc-linh",
    "name": "Chanh Khoáng Sâm Ngọc Linh",
    "price": 252000,
    "image": "/products/samk5/03-chanh-khoang.png",
    "productType": "tra-nuoc-uong-sam",
    "healthGoal": "energy",
    "audiences": [
      "men",
      "women",
      "executives"
    ],
    "familySafe": true,
    "giftEligible": false,
    "description": "Kết hợp vị chanh tươi mát cùng tinh chất Sâm Ngọc Linh và khoáng chất — giải nhiệt, bù nước, bù khoáng, tăng cường sức khỏe.",
    "sourceUrl": "https://samk5.vn/san-pham/thuc-pham-bo-sung-k5-chanh-khoang-sam-ngoc-linh"
  },
  {
    "sku": "SK5-004",
    "supplierId": "samk5",
    "slug": "to-yen-sam-ngoc-linh-100ml-5-hu-hop",
    "name": "Tổ Yến Sâm Ngọc Linh 100ml – 5 Hủ/Hộp",
    "price": 525000,
    "image": "/products/samk5/04-to-yen-sam-100ml-5hu.png",
    "productType": "tra-nuoc-uong-sam",
    "healthGoal": "immunity",
    "audiences": [
      "seniors",
      "women",
      "men"
    ],
    "familySafe": true,
    "giftEligible": true,
    "description": "Tổ Yến Sâm Ngọc Linh tinh chế từ cây Sâm Ngọc Linh trên 10 năm tuổi trồng tự nhiên, kết hợp Tổ Yến tươi nuôi tự nhiên tại Việt Nam.",
    "ingredients": "Nước, đường phèn, Tổ Yến chưng (10%), Cao Sâm Ngọc Linh (125mg/l), Canxi lactate, chất ổn định, chất bảo quản, hương tổng hợp yến sâm.",
    "volume": "Hộp 5 chai 100ml",
    "sourceUrl": "https://samk5.vn/san-pham/to-yen-sam-ngoc-linh-100ml-5-huhop"
  },
  {
    "sku": "SK5-005",
    "supplierId": "samk5",
    "slug": "to-yen-sam-ngoc-linh-kids",
    "name": "Tổ Yến Sâm Ngọc Linh Kids",
    "price": 225000,
    "image": "/products/samk5/05-to-yen-sam-kids.png",
    "productType": "tra-nuoc-uong-sam",
    "healthGoal": "immunity",
    "audiences": [
      "family"
    ],
    "familySafe": true,
    "giftEligible": false,
    "description": "Tổ Yến Sâm Ngọc Linh đặc chế dành riêng cho trẻ em, kết hợp Tổ Yến nguyên chất, DHA, Omega, Taurine và các dưỡng chất hỗ trợ phát triển toàn diện.",
    "ingredients": "Nước, đường phèn, Tổ Yến chưng (10%), Cao Sâm Ngọc Linh (0,25g/l), chất xơ, Lysine, Taurine, Omega 3-6, DHA, Kẽm Gluconate, Vitamin D3.",
    "volume": "Lốc 5 hũ 100ml",
    "sourceUrl": "https://samk5.vn/san-pham/to-yen-sam-ngoc-linh-k5-kids"
  },
  {
    "sku": "SK5-006",
    "supplierId": "samk5",
    "slug": "collagen-sam-ngoc-linh-to-yen-noliko-plus",
    "name": "Collagen Sâm Ngọc Linh Tổ Yến Noliko+",
    "price": 500000,
    "image": "/products/samk5/06-collagen-to-yen-noliko-plus.png",
    "productType": "tra-nuoc-uong-sam",
    "healthGoal": "youth",
    "audiences": [
      "women"
    ],
    "familySafe": true,
    "giftEligible": true,
    "description": "Kết hợp Sâm Ngọc Linh, Đông Trùng Hạ Thảo, Đương Quy, Tổ Yến tươi cùng collagen và vitamin C/B3/B5/B6 — hỗ trợ làn da tươi trẻ, mịn màng.",
    "ingredients": "Nước, đường Isomalt, Tổ Yến (8%), Collagen Peptide (2400-2800mg), chiết xuất táo, chiết xuất Sâm Ngọc Linh (2%), chiết xuất Đông Trùng Hạ Thảo, chiết xuất Đương Quy, vitamin C/B3/B5/B6.",
    "volume": "Hộp",
    "sourceUrl": "https://samk5.vn/san-pham/tpbs-collagen-sam-ngoc-linh-to-yen-noliko"
  }
];

export function getProductsByType(id: ProductTypeId): Product[] {
  return products.filter((p) => p.productType === id);
}

const VND_PER_USD = 25000;

export interface CartCompatibleProduct {
  id: string;
  name: string;
  nameVi: string;
  category: string;
  healthGoal: HealthGoal;
  audiences: TargetAudience[];
  priceUSD: number;
  priceVND: number;
  priceJPY: number;
  priceCNY: number;
  priceEUR: number;
  activeIngredient: string;
  description: string;
  descriptionVi: string;
  image: string;
  badge: string;
  rating: number;
  reviews: number;
  familySafe?: boolean;
}

export function toCartProduct(p: Product): CartCompatibleProduct {
  const price = p.price ?? 0;
  const priceUSD = Math.round((price / VND_PER_USD) * 100) / 100;
  return {
    id: p.sku,
    name: p.name,
    nameVi: p.name,
    category: p.productType,
    healthGoal: p.healthGoal,
    audiences: p.audiences,
    priceUSD,
    priceVND: price,
    priceJPY: Math.round(priceUSD * 150),
    priceCNY: Math.round(priceUSD * 7.2 * 100) / 100,
    priceEUR: Math.round(priceUSD * 0.93 * 100) / 100,
    activeIngredient: p.activeIngredient ?? '',
    description: p.description,
    descriptionVi: p.description,
    image: p.image,
    badge: p.badge ?? '',
    rating: 0,
    reviews: 0,
    familySafe: p.familySafe,
  };
}
