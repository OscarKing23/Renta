import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    HomeScreen,
    CategoriesScreen,
    CategoryProductsScreen,
    CartScreen,
    PurchasesScreen,
    AccountScreen,
    MenuScreen,
    SettingsScreen,
    ProductDetailScreen,
    ContactScreen,
    LoginScreen,
} from '../screens';
import { useAuth } from '../context';
import { useTheme } from '../theme';

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
    const { user, isLoading } = useAuth();
    const { colors } = useTheme();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'fade',
                contentStyle: { backgroundColor: colors.background },
                navigationBarColor: colors.background,
            }}
        >
            {user ? (
                <>
                    <Stack.Screen name="Inicio" component={HomeScreen} />
                    <Stack.Screen name="Categorías" component={CategoriesScreen} />
                    <Stack.Screen name="Carrito" component={CartScreen} />
                    <Stack.Screen name="Compras" component={PurchasesScreen} />
                    <Stack.Screen name="Mi cuenta" component={AccountScreen} />
                    <Stack.Screen name="Menú" component={MenuScreen} />
                    <Stack.Screen name="Configuración" component={SettingsScreen} />
                    <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
                    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
                    <Stack.Screen name="Contact" component={ContactScreen} />
                </>
            ) : (
                <Stack.Screen name="Login" component={LoginScreen} />
            )}
        </Stack.Navigator>
    );
};
