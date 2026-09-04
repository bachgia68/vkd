import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../data/mockData';

export interface CartItem extends Product {
  quantity: number;
}

const STORAGE_KEY = 'ta_cart_items';

function loadStoredItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotalUSD: number;
  subtotalVND: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadStoredItems);
  const [isOpen, setIsOpen] = useState(false);

  // Giỏ hàng trước đây chỉ sống trong React state — khách rời trang giữa
  // chừng (đóng tab, mất mạng lúc đang xem) là mất hết, đặc biệt bất lợi khi
  // bắt đầu chạy ads trả phí đổ traffic vào site.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Quota đầy hoặc localStorage bị chặn (chế độ ẩn danh) — bỏ qua, giỏ
      // hàng vẫn hoạt động trong phiên hiện tại, chỉ không persist được.
    }
  }, [items]);

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalUSD = items.reduce((sum, item) => sum + item.priceUSD * item.quantity, 0);
  const subtotalVND = items.reduce((sum, item) => sum + item.priceVND * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        closeCart,
        totalItems,
        subtotalUSD,
        subtotalVND,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
