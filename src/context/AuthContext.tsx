import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../utils/api';

// ── Tipos ──
export type User = {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    direccion: string | null;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
};

type RegisterData = {
    nombre: string;
    email: string;
    telefono: string;
    password: string;
    direccion?: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restaurar sesión al iniciar (desde AsyncStorage)
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const saved = await AsyncStorage.getItem(TOKEN_KEY);
                if (saved) {
                    setToken(saved);
                    await fetchProfile(saved);
                } else {
                    setIsLoading(false);
                }
            } catch {
                setIsLoading(false);
            }
        };
        restoreSession();
    }, []);

    const fetchProfile = async (authToken: string) => {
        try {
            const res = await apiFetch('/auth/me', {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                setToken(authToken);
            } else {
                await AsyncStorage.removeItem(TOKEN_KEY);
                setToken(null);
                setUser(null);
            }
        } catch {
            // Servidor no disponible — mantener token guardado para reintentar después
            setToken(authToken);
        } finally {
            setIsLoading(false);
        }
    };

    const login = useCallback(async (email: string, password: string) => {
        try {
            const res = await apiFetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                return { success: false, error: data.error || 'Error al iniciar sesión' };
            }

            await AsyncStorage.setItem(TOKEN_KEY, data.token);
            setToken(data.token);
            setUser(data.user);
            return { success: true };
        } catch {
            return { success: false, error: 'No se pudo conectar al servidor. Reintentando...' };
        }
    }, []);

    const register = useCallback(async (registerData: RegisterData) => {
        try {
            const res = await apiFetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData),
            });
            const data = await res.json();

            if (!res.ok) {
                return { success: false, error: data.error || 'Error al registrarse' };
            }

            await AsyncStorage.setItem(TOKEN_KEY, data.token);
            setToken(data.token);
            setUser(data.user);
            return { success: true };
        } catch {
            return { success: false, error: 'No se pudo conectar al servidor. Reintentando...' };
        }
    }, []);

    const logout = useCallback(async () => {
        await AsyncStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
    }, []);

    const updateProfile = useCallback(async (profileData: Partial<User>) => {
        if (!token) return { success: false, error: 'No autenticado' };
        try {
            const res = await apiFetch('/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });
            const data = await res.json();

            if (!res.ok) {
                return { success: false, error: data.error || 'Error al actualizar' };
            }

            setUser(data.user);
            return { success: true };
        } catch {
            return { success: false, error: 'No se pudo conectar al servidor. Reintentando...' };
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};
