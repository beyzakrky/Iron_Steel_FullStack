import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
import api from '../services/api';
import HazardStripe from '../components/HazardStripe';
import { colors, spacing, radii, typography, shadow } from '../theme/theme';

// NOT: Alan adları, backend Product.java entity'nizle eşleşmeli.
// Sizinki farklıysa (örn. "name" yerine "productName" değilse),
// aşağıdaki interface'i ve renderItem içindeki item.xxx erişimlerini
// tek tek güncellemeniz yeterli — yapıyı değiştirmenize gerek yok.
interface Product {
  id: number;
  productName: string;
  productType: string;
  steelQuality: string;
  thicknessMm: number;
  stockTons: number;
  pricePerTon: number;
}

const formatNumber = (value: number) =>
  value.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const ProductScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');

  const fetchProducts = useCallback((isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    api
      .get<Product[]>('/products')
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error('Ürün verisi çekme hatası:', error);
        setLoading(false);
        setRefreshing(false);
        Alert.alert('Bağlantı Hatası', `Ürünler yüklenemedi: ${error.message}`);
      });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = products.filter((p) =>
    `${p.productName} ${p.productType} ${p.steelQuality}`.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.root}>
        <HazardStripe />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.amber} />
          <Text style={styles.loadingText}>Ürünler yükleniyor…</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <HazardStripe />
      <View style={styles.container}>
        <Text style={typography.eyebrow}>CANLI VERİ</Text>
        <Text style={styles.title}>Ürün Kataloğu</Text>

        <TextInput
          style={styles.search}
          placeholder="Ürün adı, tipi veya kalite ara…"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />

        <Text style={styles.resultCount}>{filtered.length} ürün listeleniyor</Text>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchProducts(true)} tintColor={colors.amber} />
          }
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Aramanızla eşleşen ürün bulunamadı.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const lowStock = item.stockTons < 20;
            return (
              <View style={styles.card}>
                <View style={[styles.stockBar, { backgroundColor: lowStock ? colors.dangerRed : colors.safetyGreen }]} />
                <View style={styles.cardBody}>
                  <Text style={styles.productName}>{item.productName}</Text>
                  <Text style={styles.metaText}>
                    {item.productType} · {item.steelQuality} · {item.thicknessMm} mm
                  </Text>
                  <View style={styles.row}>
                    <View style={[styles.tag, { backgroundColor: lowStock ? '#3A211F' : '#1F3327' }]}>
                      <Text style={[styles.tagText, { color: lowStock ? colors.dangerRed : colors.safetyGreen }]}>
                        {formatNumber(item.stockTons)} TON STOK
                      </Text>
                    </View>
                    <Text style={styles.priceValue}>{formatNumber(item.pricePerTon)} ₺/ton</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: spacing.lg },
  title: { ...typography.display, fontSize: 22, marginTop: spacing.xs, marginBottom: spacing.md },
  search: {
    backgroundColor: colors.surfaceInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14,
  },
  resultCount: { ...typography.bodyMuted, marginTop: spacing.sm, marginBottom: spacing.md },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadow,
  },
  stockBar: { width: 5 },
  cardBody: { flex: 1, padding: spacing.md },
  productName: { color: colors.textPrimary, fontSize: 15, fontWeight: '800' },
  metaText: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  tag: { borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  tagText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  priceValue: { ...typography.mono, fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: spacing.xxl },
  loadingText: { ...typography.bodyMuted, marginTop: spacing.md },
  emptyText: { ...typography.bodyMuted, textAlign: 'center' },
});

export default ProductScreen;