import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header, useToast } from '../components';
import { useTheme, Typography, Spacing, BorderRadius } from '../theme';
import type { ThemeColors } from '../theme';
import { useCart } from '../context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.lg * 2 - Spacing.md) / 2;

type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    stock: number;
};

const PRODUCTS_BY_CATEGORY: Record<string, Product[]> = {
    Sillas: [
        {
            id: '1',
            name: 'Silla Tiffany Dorada',
            price: 45,
            image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&q=80',
            description: 'Elegante silla Tiffany con acabado dorado',
            stock: 150,
        },
        {
            id: '2',
            name: 'Silla Plegable Blanca',
            price: 25,
            image: 'https://images.unsplash.com/photo-1551298370-9d3d08a94b1e?w=400&q=80',
            description: 'Silla plegable resistente color blanco',
            stock: 200,
        },
        {
            id: '3',
            name: 'Silla Crossback',
            price: 55,
            image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&q=80',
            description: 'Silla crossback estilo rústico',
            stock: 80,
        },
        {
            id: '101',
            name: 'Silla Fantasma',
            price: 65,
            image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&q=80',
            description: 'Silla transparente estilo ghost',
            stock: 0,
        },
        {
            id: '102',
            name: 'Silla Chiavari Plata',
            price: 50,
            image: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=400&q=80',
            description: 'Silla Chiavari con acabado plateado',
            stock: 120,
        },
        {
            id: '103',
            name: 'Silla Avant Garde',
            price: 70,
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
            description: 'Silla moderna estilo avant garde',
            stock: 60,
        },
    ],
    Mesas: [
        {
            id: '4',
            name: 'Mesa Redonda 150cm',
            price: 130,
            image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=400&q=80',
            description: 'Mesa redonda para 10 personas',
            stock: 40,
        },
        {
            id: '5',
            name: 'Mesa Rectangular',
            price: 150,
            image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=400&q=80',
            description: 'Mesa rectangular para 8 personas',
            stock: 30,
        },
        {
            id: '6',
            name: 'Mesa Coctelera Alta',
            price: 85,
            image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&q=80',
            description: 'Mesa coctelera alta para eventos',
            stock: 25,
        },
        {
            id: '104',
            name: 'Mesa Imperial',
            price: 200,
            image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=400&q=80',
            description: 'Mesa imperial de madera para banquetes',
            stock: 0,
        },
    ],
    Manteles: [
        {
            id: '7',
            name: 'Mantel Redondo Blanco',
            price: 25,
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
            description: 'Mantel redondo blanco de tela premium',
            stock: 100,
        },
        {
            id: '105',
            name: 'Mantel Rectangular Negro',
            price: 30,
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
            description: 'Mantel rectangular color negro elegante',
            stock: 80,
        },
        {
            id: '106',
            name: 'Cubremantel Dorado',
            price: 20,
            image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80',
            description: 'Cubremantel con detalles dorados',
            stock: 50,
        },
        {
            id: '107',
            name: 'Camino de Mesa',
            price: 15,
            image: 'https://images.unsplash.com/photo-1507914997068-4ae68d5e tried?w=400&q=80',
            description: 'Camino de mesa decorativo',
            stock: 0,
        },
        {
            id: '108',
            name: 'Mantel Organza',
            price: 35,
            image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80',
            description: 'Mantel de organza translúcido',
            stock: 45,
        },
    ],
    Paquetes: [
        {
            id: '109',
            name: 'Paquete Boda 100',
            price: 8500,
            image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80',
            description: '100 sillas, 10 mesas, manteles y decoración',
            stock: 5,
        },
        {
            id: '110',
            name: 'Paquete XV Años',
            price: 6500,
            image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80',
            description: '80 sillas, 8 mesas, manteles y centro de mesa',
            stock: 3,
        },
        {
            id: '111',
            name: 'Paquete Corporativo',
            price: 5000,
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
            description: '50 sillas, 5 mesas y equipo de audio',
            stock: 4,
        },
        {
            id: '112',
            name: 'Paquete Jardín',
            price: 4500,
            image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80',
            description: 'Mobiliario de jardín, toldos e iluminación',
            stock: 0,
        },
    ],
    Decoración: [
        {
            id: '8',
            name: 'Centro de Mesa Floral',
            price: 120,
            image: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400&q=80',
            description: 'Arreglo floral para centro de mesa',
            stock: 30,
        },
        {
            id: '113',
            name: 'Arco de Flores',
            price: 350,
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
            description: 'Arco decorativo con flores naturales',
            stock: 8,
        },
        {
            id: '9',
            name: 'Cortina de Luces',
            price: 85,
            image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80',
            description: 'Cortina de luces LED cálidas',
            stock: 20,
        },
        {
            id: '114',
            name: 'Globos Helio Kit',
            price: 60,
            image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80',
            description: 'Kit de globos con helio variados',
            stock: 15,
        },
        {
            id: 'd5',
            name: 'Letras Gigantes LED',
            price: 200,
            image: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=400&q=80',
            description: 'Letras luminosas gigantes personalizables',
            stock: 0,
        },
    ],
    Iluminación: [
        {
            id: 'i1',
            name: 'Serie de Luces LED',
            price: 45,
            image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80',
            description: 'Serie de luces LED para exteriores',
            stock: 35,
        },
        {
            id: 'i2',
            name: 'Lámpara Colgante',
            price: 90,
            image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&q=80',
            description: 'Lámpara colgante estilo vintage',
            stock: 12,
        },
        {
            id: 'i3',
            name: 'Velas LED Pack x20',
            price: 35,
            image: 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400&q=80',
            description: 'Pack de 20 velas LED sin flama',
            stock: 50,
        },
        {
            id: 'i4',
            name: 'Reflector RGB',
            price: 120,
            image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80',
            description: 'Reflector LED con cambio de colores',
            stock: 10,
        },
    ],
};

export const CategoryProductsScreen: React.FC<{ navigation: any; route: any }> = ({
    navigation,
    route,
}) => {
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const { addItem } = useCart();
    const { showToast } = useToast();

    const category = route.params?.category || { name: 'Productos', color: '#D4A843' };
    const products = PRODUCTS_BY_CATEGORY[category.name] || [];

    const handleAddToCart = (product: Product) => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
        });
        showToast('success', 'Agregado al carrito', `${product.name} se ha agregado a tu carrito.`);
    };

    return (
        <View style={styles.container}>
            <Header
                title={category.name}
                showBack
                onBackPress={() => navigation.goBack()}
                onHomePress={() => navigation.navigate('Inicio')}
            />
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.grid}
            >
                {products.map((product) => (
                    <TouchableOpacity activeOpacity={1}
                        key={product.id}
                        style={styles.productCard}
                        
                        onPress={() =>
                            navigation.navigate('ProductDetail', {
                                product: {
                                    title: product.name,
                                    price: `$${product.price}`,
                                    image: product.image,
                                    stock: product.stock,
                                },
                            })
                        }
                    >
                        <View style={styles.imageWrapper}>
                            <Image
                                source={{ uri: product.image }}
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                            <View style={[
                                styles.stockBadge,
                                { backgroundColor: product.stock > 0 ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.9)' }
                            ]}>
                                <Ionicons
                                    name={product.stock > 0 ? 'checkmark-circle' : 'close-circle'}
                                    size={12}
                                    color="#FFFFFF"
                                />
                                <Text style={styles.stockText}>
                                    {product.stock > 0 ? `En stock (${product.stock})` : 'Agotado'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={2}>
                                {product.name}
                            </Text>
                            <Text style={styles.productDescription} numberOfLines={1}>
                                {product.description}
                            </Text>
                            <Text style={styles.productPrice}>
                                ${product.price.toLocaleString()}
                                <Text style={styles.priceUnit}> /día</Text>
                            </Text>
                        </View>
                        <TouchableOpacity activeOpacity={1}
                            style={[styles.addButton, {
                                backgroundColor: product.stock > 0
                                    ? (category.color || colors.primary)
                                    : colors.textMuted
                            }]}
                            
                            onPress={() => product.stock > 0 && handleAddToCart(product)}
                            disabled={product.stock === 0}
                        >
                            <Ionicons name={product.stock > 0 ? 'cart-outline' : 'ban'} size={16} color="#FFFFFF" />
                            <Text style={styles.addButtonText}>{product.stock > 0 ? 'Agregar' : 'Agotado'}</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const makeStyles = (colors: ThemeColors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollView: {
            flex: 1,
        },
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: Spacing.lg,
            paddingBottom: 100,
            gap: Spacing.md,
        },
        productCard: {
            width: CARD_WIDTH,
            backgroundColor: colors.surface,
            borderRadius: BorderRadius.lg,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.border,
        },
        imageWrapper: {
            width: '100%',
            height: CARD_WIDTH * 0.85,
            backgroundColor: colors.surfaceLight,
            position: 'relative',
        },
        stockBadge: {
            position: 'absolute',
            top: 6,
            left: 6,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 6,
            paddingVertical: 3,
            borderRadius: 6,
            gap: 3,
        },
        stockText: {
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '700',
        },
        productImage: {
            width: '100%',
            height: '100%',
        },
        productInfo: {
            padding: Spacing.sm,
            flex: 1,
        },
        productName: {
            ...Typography.subtitle,
            color: colors.textPrimary,
            fontSize: 14,
            marginBottom: 2,
        },
        productDescription: {
            ...Typography.caption,
            color: colors.textMuted,
            fontSize: 11,
            marginBottom: Spacing.xs,
        },
        productPrice: {
            ...Typography.subtitle,
            color: colors.primary,
            fontSize: 16,
            fontWeight: '700',
        },
        priceUnit: {
            ...Typography.caption,
            color: colors.textMuted,
            fontWeight: '400',
            fontSize: 11,
        },
        addButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: Spacing.sm,
            gap: 6,
            marginHorizontal: Spacing.sm,
            marginBottom: Spacing.sm,
            borderRadius: BorderRadius.md,
        },
        addButtonText: {
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: 13,
        },
    });
