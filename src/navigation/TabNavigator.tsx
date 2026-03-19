import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import {
    HomeScreen,
    CategoriesScreen,
    CartScreen,
    PurchasesScreen,
    AccountScreen,
    MenuScreen,
} from '../screens';
import { useTheme, Typography } from '../theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
    Inicio: { active: 'home', inactive: 'home-outline' },
    Categorías: { active: 'grid', inactive: 'grid-outline' },
    Carrito: { active: 'cart', inactive: 'cart-outline' },
    Compras: { active: 'receipt', inactive: 'receipt-outline' },
    'Mi cuenta': { active: 'person', inactive: 'person-outline' },
    Menú: { active: 'menu', inactive: 'menu-outline' },
};

export const TabNavigator: React.FC = () => {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    height: Platform.OS === 'web' ? 76 : undefined,
                    paddingTop: 6,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarLabelStyle: styles.tabLabel,
                sceneStyle: { backgroundColor: colors.background },
                tabBarIcon: ({ focused, color, size }) => {
                    const icons = TAB_ICONS[route.name];
                    const iconName = focused ? icons.active : icons.inactive;
                    return <Ionicons name={iconName} size={22} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Inicio" component={HomeScreen} />
            <Tab.Screen name="Categorías" component={CategoriesScreen} />
            <Tab.Screen name="Carrito" component={CartScreen} />
            <Tab.Screen name="Compras" component={PurchasesScreen} />
            <Tab.Screen name="Mi cuenta" component={AccountScreen} />
            <Tab.Screen name="Menú" component={MenuScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
    },
});
