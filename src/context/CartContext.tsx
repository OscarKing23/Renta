import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

export type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

type CartContextType = {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
    version: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [version, setVersion] = useState(0);
    const { user } = useAuth();
    const prevUserId = useRef<number | null>(user?.id ?? null);

    // Vaciar carrito al cambiar de usuario o cerrar sesión
    useEffect(() => {
        const currentId = user?.id ?? null;
        if (prevUserId.current !== currentId) {
            setItems([]);
            setVersion(v => v + 1);
            prevUserId.current = currentId;
        }
    }, [user]);

    const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
                );
            }
            return [...prev, { ...item, quantity }];
        });
        setVersion(v => v + 1);
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
        setVersion(v => v + 1);
    }, []);

    const updateQuantity = useCallback((id: string, newQty: number) => {
        if (newQty <= 0) {
            setItems(prev => prev.filter(i => i.id !== id));
        } else {
            setItems(prev => prev.map(i => (i.id === id ? { ...i, quantity: newQty } : i)));
        }
        setVersion(v => v + 1);
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
        setVersion(v => v + 1);
    }, []);

    const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

    const contextValue = useMemo(() => ({
        items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, version,
    }), [items, version, total, itemCount, addItem, removeItem, updateQuantity, clearCart]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de CartProvider');
    }
    return context;
};
