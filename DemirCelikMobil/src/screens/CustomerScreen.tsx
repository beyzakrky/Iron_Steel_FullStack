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

// Veritabanından gelecek müşteri verisinin tipini (Interface) tanımlıyoruz
interface Customer {
  id: number;
  companyName: string;
  city: string;
  totalDebt: number;
}

const formatMoney = (value: number) =>
  value.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const CustomerScreen: React.FC = () => {
  // TypeScript'e bu state'in bir Customer dizisi tutacağını söylüyoruz
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [query, setQuery] = useState('');

  const fetchCustomers = useCallback((isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    api
      .get<Customer[]>('/customers')
      .then((response) => {
        setCustomers(response.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error('Veri çekme hatası:', error);
        setLoading(false);
        setRefreshing(false);
        // HATAYI EKRANA BASALIM:
        Alert.alert('Bağlantı Hatası', `Backend'e erişilemedi: ${error.message}`);
      });
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filtered = customers.filter((c) =>
    `${c.companyName} ${c.city}`.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.root}>
        <HazardStripe />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.amber} />
          <Text style={styles.loadingText}>Müşteri verileri yükleniyor…</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <HazardStripe />
      <View style={styles.container}>
        <Text style={typography.eyebrow}>CANLI VERİ</Text>
        <Text style={styles.title}>Müşteri Cari Kartları</Text>

        <TextInput
          style={styles.search}
          placeholder="Firma veya şehir ara…"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />

        <Text style={styles.resultCount}>
          {filtered.length} müşteri {query ? `· "${query}" için` : 'listeleniyor'}
        </Text>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchCustomers(true)} tintColor={colors.amber} />
          }
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Aramanızla eşleşen müşteri bulunamadı.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const hasDebt = item.totalDebt > 0;
            return (
              <View style={styles.card}>
                <View style={[styles.riskBar, { backgroundColor: hasDebt ? colors.dangerRed : colors.safetyGreen }]} />
                <View style={styles.cardBody}>
                  <Text style={styles.companyName}>{item.companyName}</Text>
                  <Text style={styles.cityText}>📍 {item.city}</Text>
                  <View style={styles.debtRow}>
                    <View style={[styles.tag, { backgroundColor: hasDebt ? '#3A211F' : '#1F3327' }]}>
                      <Text style={[styles.tagText, { color: hasDebt ? colors.dangerRed : colors.safetyGreen }]}>
                        {hasDebt ? 'AKTİF BAKİYE' : 'BAKİYE YOK'}
                      </Text>
                    </View>
                    <Text style={styles.debtValue}>{formatMoney(item.totalDebt)} USD</Text>
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
  resultCount: {
    ...typography.bodyMuted,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
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
  riskBar: { width: 5 },
  cardBody: { flex: 1, padding: spacing.md },
  companyName: { color: colors.textPrimary, fontSize: 15, fontWeight: '800' },
  cityText: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  debtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  tag: { borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  tagText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  debtValue: { ...typography.mono, fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: spacing.xxl },
  loadingText: { ...typography.bodyMuted, marginTop: spacing.md },
  emptyText: { ...typography.bodyMuted, textAlign: 'center' },
});

export default CustomerScreen;