import React, { createContext, useContext, useCallback, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Typography, Spacing, BorderRadius } from '../theme';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
    id: number;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextValue {
    showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue>({
    showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

const ICON_MAP: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
    success: 'checkmark-circle',
    error: 'close-circle',
    warning: 'warning',
    info: 'information-circle',
};

const ToastItem: React.FC<{
    toast: ToastMessage;
    onDismiss: (id: number) => void;
}> = ({ toast, onDismiss }) => {
    const { colors } = useTheme();
    const translateY = useRef(new Animated.Value(-80)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const colorMap: Record<ToastType, string> = {
        success: colors.success,
        error: colors.error,
        warning: colors.warning,
        info: colors.info,
    };

    React.useEffect(() => {
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 0,
                friction: 8,
                tension: 60,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();

        const timer = setTimeout(() => {
            dismiss();
        }, toast.duration || 3000);

        return () => clearTimeout(timer);
    }, []);

    const dismiss = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -80,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => onDismiss(toast.id));
    };

    const accentColor = colorMap[toast.type];

    return (
        <Animated.View
            style={[
                styles.toastContainer,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderLeftColor: accentColor,
                    transform: [{ translateY }],
                    opacity,
                },
            ]}
        >
            <View style={[styles.iconCircle, { backgroundColor: accentColor + '20' }]}>
                <Ionicons name={ICON_MAP[toast.type]} size={20} color={accentColor} />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>{toast.title}</Text>
                {toast.message && (
                    <Text style={[styles.message, { color: colors.textSecondary }]} numberOfLines={2}>
                        {toast.message}
                    </Text>
                )}
            </View>
            <TouchableOpacity activeOpacity={1} onPress={dismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={18} color={colors.textMuted} />
            </TouchableOpacity>
        </Animated.View>
    );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const idRef = useRef(0);
    const insets = useSafeAreaInsets();

    const showToast = useCallback((type: ToastType, title: string, message?: string, duration?: number) => {
        const id = ++idRef.current;
        setToasts(prev => [...prev, { id, type, title, message, duration }]);
    }, []);

    const dismissToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <View
                style={[styles.toastWrapper, { top: insets.top + Spacing.sm }]}
                pointerEvents="box-none"
            >
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
                ))}
            </View>
        </ToastContext.Provider>
    );
};

const styles = StyleSheet.create({
    toastWrapper: {
        position: 'absolute',
        left: Spacing.md,
        right: Spacing.md,
        zIndex: 9999,
        alignItems: 'center',
        gap: Spacing.sm,
    },
    toastContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderLeftWidth: 4,
        gap: Spacing.sm,
        ...Platform.select({
            web: {
                boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 8,
            },
        }),
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        ...Typography.subtitle,
        fontSize: 14,
    },
    message: {
        ...Typography.caption,
        marginTop: 2,
    },
});
