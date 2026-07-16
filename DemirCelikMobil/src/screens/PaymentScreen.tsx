import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import api from '../services/api';
import HazardStripe from '../components/HazardStripe';
import { colors, spacing, radii, typography, shadow } from '../theme/theme';

interface Payment {
  id: number;
  customer?: { companyName: string };
  order?: { id: number };
  paymentDate: string;
  amount: number;
  paymentMethod: string;
}

const formatMoney = (value: number) =>
  value.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('tr-TR');
  } catch {
    return iso;
  }
};

const PaymentScreen: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPayments = useCallback((isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    api
      .get<Payment[]>('/payments')
      .then((res) => {
        setPayments(res.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error('Ödeme verisi çekme hatası:', error);
        setLoading(false);
        setRefreshing(false);
        Alert.alert('Bağlantı Hatası', `Ödemeler yüklenemedi: ${error.message}`);
      });
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <View style={styles.root}>
        <HazardStripe />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.amber} />
          <Text style={styles.loadingText}>Ödemeler yükleniyor…</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <HazardStripe />
      <View style={styles.container}>
        <Text style={typography.eyebrow}>CANLI VERİ</Text>
        <Text style={styles.title}>Ödeme Kayıtları</Text>

        <View style={styles.summaryCard}>
          <Text style={typography.label}>TOPLAM TAHSİLAT</Text>
          <Text style={styles.summaryValue}>{formatMoney(totalAmount)} ₺</Text>
          <Text style={styles.summarySub}>{payments.length} ödeme kaydı</Text>
        </View>

        <FlatList
          data={payments}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchPayments(true)} tintColor={colors.amber} />
          }
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Henüz ödeme kaydı yok.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.customerName}>{item.customer?.companyName ?? 'Bilinmeyen müşteri'}</Text>
                <Text style={styles.amount}>{formatMoney(item.amount)} ₺</Text>
              </View>
              <View style={[styles.row, { marginTop: spacing.xs }]}>
                <Text style={styles.metaText}>
                  {formatDate(item.paymentDate)} {item.order ? `· Sipariş #${item.order.id}` : ''}
                </Text>
                <View style={styles.methodTag}>
                  <Text style={styles.methodText}>{item.paymentMethod}</Text>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: spacing.lg },
  title: { ...typography.display, fontSize: 22, marginTop: spacing.xs, marginBottom: spacing.md },
  summaryCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.amber,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow,
  },
  summaryValue: { ...typography.display, fontSize: 26, marginTop: spacing.xs },
  summarySub: { ...typography.bodyMuted, marginTop: 2 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  customerName: { color: colors.textPrimary, fontSize: 14, fontWeight: '800', flex: 1, marginRight: spacing.sm },
  amount: { ...typography.mono, fontSize: 15, fontWeight: '700', color: colors.safetyGreen },
  metaText: { color: colors.textMuted, fontSize: 11 },
  methodTag: {
    backgroundColor: colors.surfaceInput,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  methodText: { color: colors.steelBlue, fontSize: 10, fontWeight: '700' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: spacing.xxl },
  loadingText: { ...typography.bodyMuted, marginTop: spacing.md },
  emptyText: { ...typography.bodyMuted, textAlign: 'center' },
});

export default PaymentScreen;