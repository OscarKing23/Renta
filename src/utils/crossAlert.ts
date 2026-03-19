import { Alert, Platform } from 'react-native';

type AlertButton = {
    text: string;
    style?: 'default' | 'cancel' | 'destructive';
    onPress?: () => void;
};

/**
 * Alert multiplataforma: usa window.alert/confirm en web, Alert.alert en nativo.
 */
export function crossAlert(title: string, message?: string, buttons?: AlertButton[]) {
    if (Platform.OS !== 'web') {
        Alert.alert(title, message, buttons);
        return;
    }

    // Web: si hay botones con acciones, usar confirm; si no, alert simple
    if (!buttons || buttons.length <= 1) {
        window.alert(message ? `${title}\n${message}` : title);
        buttons?.[0]?.onPress?.();
        return;
    }

    // Buscar botón de acción (no-cancel)
    const actionBtn = buttons.find(b => b.style !== 'cancel');
    const confirmed = window.confirm(message ? `${title}\n${message}` : title);
    if (confirmed && actionBtn?.onPress) {
        actionBtn.onPress();
    } else if (!confirmed) {
        const cancelBtn = buttons.find(b => b.style === 'cancel');
        cancelBtn?.onPress?.();
    }
}
