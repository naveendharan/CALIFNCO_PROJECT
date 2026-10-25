import React, { createContext, useContext, useState, useMemo } from 'react';
import { Product } from '../data/products';
import { useAuth } from './AuthContext';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  discountCode: string;
  applyDiscountCode: (code: string) => { success: boolean; message: string };
  removeDiscountCode: () => void;
  tax: number;
  shipping: number;
  total: number;
  totalWholesaleSavings: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  subtotal: 0,
  discount: 0,
  discountCode: '',
  applyDiscountCode: () => ({ success: false, message: '' }),
  removeDiscountCode: () => {},
  tax: 0,
  shipping: 0,
  total: 0,
  totalWholesaleSavings: 0
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDealer } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const addToCart = (product: Product, quantity?: number) => {
    setItems(prevItems => {
      const existing = prevItems.find(item => item.product.id === product.id);
      const minQty = isDealer ? product.dealerMoq : 1;
      const addQty = quantity !== undefined ? quantity : minQty;

      if (existing) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + addQty }
            : item
        );
      } else {
        return [...prevItems, { product, quantity: Math.max(addQty, minQty) }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const minQty = isDealer ? item.product.dealerMoq : 1;
          return { ...item, quantity: Math.max(minQty, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscountCode('');
    setDiscountAmount(0);
  };

  const applyDiscountCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WELCOME10' || clean.includes('RAHUL') || clean.includes('CALI')) {
      setDiscountCode(clean);
      setDiscountAmount(500); // Flat ₹500 off
      return { success: true, message: 'Promo Code applied! Flat ₹500 discount.' };
    } else if (clean === 'DEALERVIP' || clean.includes('VIP')) {
      setDiscountCode(clean);
      setDiscountAmount(1500); // ₹1500 wholesale credit
      return { success: true, message: 'VIP Wholesale Voucher applied! ₹1,500 extra discount.' };
    }
    return { success: false, message: 'Invalid or expired coupon code.' };
  };

  const removeDiscountCode = () => {
    setDiscountCode('');
    setDiscountAmount(0);
  };

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const unitPrice = isDealer ? item.product.wholesalePrice : item.product.retailPrice;
      return sum + unitPrice * item.quantity;
    }, 0);
  }, [items, isDealer]);

  const totalWholesaleSavings = useMemo(() => {
    return items.reduce((sum, item) => {
      const retailTotal = item.product.retailPrice * item.quantity;
      const wholesaleTotal = item.product.wholesalePrice * item.quantity;
      return sum + Math.max(0, retailTotal - wholesaleTotal);
    }, 0);
  }, [items]);

  const discount = Math.min(discountAmount, subtotal);
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.18); // 18% GST
  const shipping = subtotal > 1500 || isDealer || items.length === 0 ? 0 : 99;
  const total = taxableAmount + tax + shipping;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        discount,
        discountCode,
        applyDiscountCode,
        removeDiscountCode,
        tax,
        shipping,
        total,
        totalWholesaleSavings
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
