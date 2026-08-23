'use client';

import { useState } from 'react';

interface Product {
  sku: string;
  name: string;
  price: number;
  salePrice: number;
  stock: number;
  description: string;
}

interface Video {
  name: string;
  url: string;
}

interface Image {
  name: string;
  url: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [showAddForm, setShowAddForm] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const [products, setProducts] = useState<Product[]>([
    {
      sku: 'SAM-001',
      name: 'Sâm Ngọc Linh Premium 6 tuổi',
      price: 500000,
      salePrice: 450000,
      stock: 25,
      description: 'Sâm tự nhiên 100% từ rừng Ngọc Linh',
    },
    {
      sku: 'SAM-002',
      name: 'Sâm Ngọc Linh 3 tuổi',
      price: 250000,
      salePrice: 220000,
      stock: 50,
      description: 'Sâm chất lượng cao',
    },
    {
      sku: 'SAM-003',
      name: 'Trà Sâm Ngọc Linh',
      price: 150000,
      salePrice: 150000,
      stock: 100,
      description: 'Trà sâm thơm ngon',
    },
  ]);

  const [videos, setVideos] = useState<Video[]>([]);
  const [images, setImages] = useState<Image[]>([]);

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    price: '',
    salePrice: '',
    stock: '',
    description: '',
  });

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  const handleAddProduct = () => {
    if (formData.sku && formData.name && formData.price) {
      setProducts([
        ...products,
        {
          sku: formData.sku,
          name: formData.name,
          price: parseInt(formData.price),
          salePrice: parseInt(formData.salePrice) || 0,
          stock: parseInt(formData.stock) || 0,
          description: formData.description,
        },
      ]);
      setFormData({ sku: '', name: '', price: '', salePrice: '', stock: '', description: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteProduct = (idx: number) => {
    if (confirm('Xác nhận xóa?')) {
      setProducts(products.filter((_, i) => i !== idx));
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      for (let file of Array.from(files)) {
        const url = URL.createObjectURL(file);
        setVideos([...videos, { name: file.name, url }]);
      }
      e.currentTarget.value = '';
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      for (let file of Array.from(files)) {
        const url = URL.createObjectURL(file);
        setImages([...images, { name: file.name, url }]);
      }
      e.currentTarget.value = '';
    }
  };

  const handleDeleteVideo = (idx: number) => {
    setVideos(videos.filter((_, i) => i !== idx));
  };

  const handleDeleteImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const carouselPrev = () => {
    setCarouselIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const carouselNext = () => {
    setCarouselIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#333',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* HEADER */}
        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '30px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <h1 style={{ color: '#2d5016', marginBottom: '10px' }}>🎋 TA Admin Dashboard</h1>
          <p>Quản lý sâm ngọc linh nhà Khánh</p>
          <div
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: '#10b981',
              color: 'white',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              marginTop: '10px',
            }}
          >
            ✅ Kết nối thành công
          </div>
        </div>

        {/* TABS */}
        <div
          style={{
            display: 'flex',
            gap: '5px',
            background: 'white',
            padding: '10px',
            borderRadius: '10px',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            flexWrap: 'wrap',
          }}
        >
          {['products', 'videos', 'carousel', 'gallery'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: activeTab === tab ? '#2d5016' : '#f0f0f0',
                color: activeTab === tab ? 'white' : '#333',
                cursor: 'pointer',
                borderRadius: '5px',
                fontWeight: 500,
                transition: 'all 0.3s',
              }}
            >
              {tab === 'products' && '📦 Sản Phẩm'}
              {tab === 'videos' && '📹 Video'}
              {tab === 'carousel' && '🖼️ Carousel'}
              {tab === 'gallery' && '📸 Hình Ảnh'}
            </button>
          ))}
        </div>

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <h2>📦 Quản Lý Sản Phẩm</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '15px',
                marginBottom: '30px',
              }}
            >
              <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d5016' }}>{products.length}</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>Tổng Sản Phẩm</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d5016' }}>{totalStock}</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>Tổng Kho</div>
              </div>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px',
                background: '#2d5016',
                color: 'white',
                fontWeight: 'bold',
                marginBottom: '20px',
              }}
            >
              + Thêm Sản Phẩm
            </button>

            {showAddForm && (
              <div
                style={{
                  marginBottom: '20px',
                  padding: '20px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                }}
              >
                <h3>Thêm Sản Phẩm Mới</h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                  }}
                >
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>SKU</label>
                    <input
                      type="text"
                      placeholder="SAM-001"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Tên Sản Phẩm</label>
                    <input
                      type="text"
                      placeholder="Sâm Ngọc Linh"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Giá (₫)</label>
                    <input
                      type="number"
                      placeholder="500000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Giá Sale (₫)</label>
                    <input
                      type="number"
                      placeholder="450000"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Số Lượng Kho</label>
                    <input
                      type="number"
                      placeholder="25"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Mô Tả</label>
                    <textarea
                      placeholder="Mô tả sản phẩm..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '14px',
                        minHeight: '80px',
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddProduct}
                  style={{
                    padding: '10px 15px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    background: '#2d5016',
                    color: 'white',
                    fontWeight: 'bold',
                    marginTop: '10px',
                  }}
                >
                  Lưu
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  style={{
                    padding: '10px 15px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    background: '#ddd',
                    marginLeft: '10px',
                  }}
                >
                  Hủy
                </button>
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px',
              }}
            >
              {products.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'white',
                    transition: 'all 0.3s',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '150px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '40px',
                    }}
                  >
                    📦
                  </div>
                  <div style={{ padding: '15px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{p.name}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                      <strong>SKU:</strong> {p.sku}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                      <strong>Giá:</strong> {p.price.toLocaleString('vi-VN')} ₫
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                      <strong>Sale:</strong> {p.salePrice.toLocaleString('vi-VN')} ₫
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                      <strong>Kho:</strong> {p.stock}
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(idx)}
                      style={{
                        padding: '10px 15px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        background: '#ff4d4d',
                        color: 'white',
                        fontSize: '12px',
                        transition: 'all 0.3s',
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIDEOS TAB */}
        {activeTab === 'videos' && (
          <div
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <h2>📹 Quản Lý Video</h2>
            <div
              style={{
                padding: '20px',
                background: '#f9fafb',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            >
              <h3>Tải Video Mới</h3>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoUpload}
                style={{
                  padding: '10px',
                  border: '1px dashed #667eea',
                  width: '100%',
                  borderRadius: '5px',
                  marginBottom: '10px',
                }}
              />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px',
              }}
            >
              {videos.map((v, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'white',
                  }}
                >
                  <video
                    src={v.url}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{ padding: '15px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{v.name}</div>
                    <button
                      onClick={() => handleDeleteVideo(idx)}
                      style={{
                        padding: '10px 15px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        background: '#ff4d4d',
                        color: 'white',
                        fontSize: '12px',
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CAROUSEL TAB */}
        {activeTab === 'carousel' && (
          <div
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <h2>🖼️ Carousel Sâm (KGC Style)</h2>
            {images.length > 0 ? (
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '8px',
                  background: '#f0f0f0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '20px',
                    padding: '10px',
                    transition: 'transform 0.3s',
                  }}
                >
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        flex: '0 0 300px',
                        height: '200px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'grab',
                        transform: idx === carouselIndex ? 'scale(1.05)' : 'scale(1)',
                        boxShadow:
                          idx === carouselIndex ? '0 10px 30px rgba(0,0,0,0.2)' : 'none',
                        transition: 'all 0.3s',
                      }}
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={carouselPrev}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '10px',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    fontSize: '18px',
                  }}
                >
                  ❮
                </button>
                <button
                  onClick={carouselNext}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    fontSize: '18px',
                  }}
                >
                  ❯
                </button>
              </div>
            ) : (
              <p style={{ color: '#999' }}>Tải hình ảnh từ tab "Hình Ảnh" để xem carousel</p>
            )}
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && (
          <div
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <h2>📸 Thư Viện Hình Ảnh</h2>
            <div
              style={{
                padding: '20px',
                background: '#f9fafb',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            >
              <h3>Tải Hình Ảnh Mới</h3>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{
                  padding: '10px',
                  border: '1px dashed #667eea',
                  width: '100%',
                  borderRadius: '5px',
                  marginBottom: '10px',
                }}
              />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px',
              }}
            >
              {images.map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'white',
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{ padding: '15px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{img.name}</div>
                    <button
                      onClick={() => handleDeleteImage(idx)}
                      style={{
                        padding: '10px 15px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        background: '#ff4d4d',
                        color: 'white',
                        fontSize: '12px',
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
