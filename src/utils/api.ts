import { Platform } from 'react-native';

// ── URL base de la API ──
const LOCAL_IP = '192.168.100.12'; // tu IP local en la red WiFi

const getApiUrl = () => {
    if (Platform.OS === 'web') return 'http://localhost:3001/api';
    return `http://${LOCAL_IP}:3001/api`; // dispositivo físico / emulador
};

export const API_URL = getApiUrl();

type FetchOptions = RequestInit & {
    retries?: number;
    retryDelay?: number;
    timeoutMs?: number;
};

/**
 * Fetch con reintentos automáticos y timeout.
 * - 3 reintentos por defecto con backoff exponencial
 * - Timeout de 10 segundos por defecto
 */
export async function apiFetch(endpoint: string, options: FetchOptions = {}): Promise<Response> {
    const {
        retries = 3,
        retryDelay = 1000,
        timeoutMs = 10000,
        ...fetchOptions
    } = options;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeoutMs);

            const response = await fetch(`${API_URL}${endpoint}`, {
                ...fetchOptions,
                signal: controller.signal,
            });

            clearTimeout(timer);
            return response;
        } catch (error: any) {
            lastError = error;

            // No reintentar si fue abort manual (no timeout)
            if (error.name === 'AbortError' && attempt === 0) {
                break;
            }

            // Esperar antes de reintentar (backoff exponencial)
            if (attempt < retries) {
                const delay = retryDelay * Math.pow(2, attempt);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError || new Error('No se pudo conectar al servidor');
}

/**
 * Verifica si el servidor está disponible.
 */
export async function checkServerHealth(): Promise<boolean> {
    try {
        const res = await apiFetch('/health', { retries: 1, timeoutMs: 5000 });
        return res.ok;
    } catch {
        return false;
    }
}
