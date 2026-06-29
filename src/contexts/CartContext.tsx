'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
}

type CartAction =
  | { type: 'SET_ITEMS'; items: CartItem[] }
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'UPDATE_QUANTITY'; id: string; quantity: number }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; isLoading: boolean };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.items, isLoading: false };
    case 'ADD_ITEM': {
      const existing = state.items.findIndex(
        (i) => i.product_id === action.item.product_id && i.sku_id === action.item.sku_id
      );
      if (existing >= 0) {
        const newItems = [...state.items];
        newItems[existing] = { ...newItems[existing], quantity: newItems[existing].quantity + action.item.quantity };
        return { ...state, items: newItems };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.id ? { ...i, quantity: Math.max(1, action.quantity) } : i)),
      };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (productId: string, productName: string, productImage: string, price: number, skuId?: string | null, specInfo?: string, quantity?: number) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sid = localStorage.getItem('cart_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('cart_session_id', sid);
  }
  return sid;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isLoading: true });

  const refreshCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', isLoading: true });
      const sid = getSessionId();
      const res = await fetch(`/api/cart?session_id=${sid}`);
      const data = await res.json();
      if (data.success) {
        dispatch({ type: 'SET_ITEMS', items: data.data });
      }
    } catch {
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      refreshCart();
    }
  }, [refreshCart]);

  const addItem = async (productId: string, productName: string, productImage: string, price: number, skuId?: string | null, specInfo?: string, quantity = 1) => {
    const sid = getSessionId();
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sid, product_id: productId, product_name: productName, product_image: productImage, price, sku_id: skuId || null, spec_info: specInfo || '{}', quantity }),
    });
    const data = await res.json();
    if (data.success) {
      await refreshCart();
      return data;
    }
    throw new Error(data.message || 'Failed to add item');
  };

  const updateQuantity = async (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
    const sid = getSessionId();
    await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sid, cart_item_id: id, quantity }),
    });
  };

  const removeItem = async (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', id });
    const sid = getSessionId();
    await fetch(`/api/cart?session_id=${sid}&cart_item_id=${id}`, { method: 'DELETE' });
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
    const sid = getSessionId();
    await fetch(`/api/cart?session_id=${sid}&clear_all=1`, { method: 'DELETE' });
  };

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items: state.items, isLoading: state.isLoading, itemCount, subtotal, addItem, updateQuantity, removeItem, clearCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
