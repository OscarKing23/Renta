import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '../utils/api';

export type Order = {
    id_pedido: number;
    fecha_pedido: string;
    fecha_renta: string;
    fecha_devolucion: string;
    estado: 'borrador' | 'confirmado' | 'en_renta' | 'devuelto' | 'cancelado';
    direccion_entrega: string | null;
    hora_entrega: string | null;
    costo_total: number;
    items: OrderItem[];
};

export type OrderItem = {
    nombre: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
};

type OrdersContextType = {
    orders: Order[];
    isLoading: boolean;
    fetchOrders: () => Promise<void>;
    checkout: (data: CheckoutData) => Promise<{ success: boolean; orderId?: number; error?: string }>;
};

type CheckoutData = {
    items: { id_producto: string; cantidad: number; precio_unitario: number }[];
    metodo_pago: 'efectivo' | 'efectivo_tienda' | 'efectivo_entrega' | 'transferencia' | 'tarjeta';
    fecha_renta: string;
    fecha_devolucion: string;
    direccion_entrega?: string;
    hora_entrega?: string;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchOrders = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const res = await apiFetch('/orders', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders);
            }
        } catch {
            // silenciar
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const checkout = useCallback(async (data: CheckoutData) => {
        if (!token) return { success: false, error: 'No autenticado' };
        try {
            const res = await apiFetch('/orders/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) {
                return { success: false, error: result.error || 'Error al procesar pedido' };
            }
            // Refrescar lista de pedidos
            await fetchOrders();
            return { success: true, orderId: result.orderId };
        } catch {
            return { success: false, error: 'No se pudo conectar al servidor' };
        }
    }, [token, fetchOrders]);

    return (
        <OrdersContext.Provider value={{ orders, isLoading, fetchOrders, checkout }}>
            {children}
        </OrdersContext.Provider>
    );
};

export const useOrders = (): OrdersContextType => {
    const context = useContext(OrdersContext);
    if (!context) {
        throw new Error('useOrders debe usarse dentro de OrdersProvider');
    }
    return context;
};
