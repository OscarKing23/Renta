import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components';
import { useTheme, Typography, Spacing, BorderRadius } from '../theme';
import type { ThemeColors } from '../theme';

const CATEGORIES = [
    {
        id: '1',
        name: 'Sillas',
        count: 48,
        icon: 'person-outline' as const,
        color: '#D4A843',
        image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&q=80',
    },
    {
        id: '2',
        name: 'Mesas',
        count: 32,
        icon: 'tablet-landscape-outline' as const,
        color: '#60A5FA',
        image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=400&q=80',
    },
    {
        id: '3',
        name: 'Manteles',
        count: 65,
        icon: 'layers-outline' as const,
        color: '#4ADE80',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
    },
    {
        id: '4',
        name: 'Paquetes',
        count: 12,
        icon: 'gift-outline' as const,
        color: '#F472B6',
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80',
    },
    {
        id: '5',
        name: 'Decoración',
        count: 89,
        icon: 'flower-outline' as const,
        color: '#A78BFA',
        image: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400&q=80',
    },
    {
        id: '6',
        name: 'Iluminación',
        count: 27,
        icon: 'bulb-outline' as const,
        color: '#FBBF24',
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80',
    },
];

export const CategoriesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Header title="Categorías" showBack onBackPress={() => navigation.goBack()} onHomePress={() => navigation.navigate('Inicio')} />
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 100 }}
            >
                {CATEGORIES.map((category) => (
                    <TouchableOpacity activeOpacity={1}
                        key={category.id}
                        style={styles.categoryCard}
                        
                        onPress={() => navigation.navigate('CategoryProducts', { category })}
                    >
                        <Image
                            source={{ uri: category.image }}
                            style={styles.categoryImage}
                            resizeMode="cover"
                        />
                        <View style={styles.overlay} />
                        <View style={styles.categoryContent}>
                            <View style={[styles.iconCircle, { backgroundColor: `${category.color}20` }]}>
                                <Ionicons name={category.icon} size={24} color={category.color} />
                            </View>
                            <View style={styles.categoryInfo}>
                                <Text style={styles.categoryName}>{category.name}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    categoryCard: {
        height: 100,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        marginBottom: Spacing.md,
        position: 'relative',
        borderWidth: 1,
        borderColor: colors.border,
    },
    categoryImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 15, 20, 0.82)',
    },
    categoryContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryName: {
        ...Typography.subtitle,
        color: '#FFFFFF',
        marginBottom: 2,
    },
    categoryCount: {
        ...Typography.caption,
        color: '#CCCCCC',
    },
});
