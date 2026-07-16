import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import api from '../services/api';
import HazardStripe from '../components/HazardStripe';
import { colors, spacing, radii, typography, shadow } from '../theme/theme';

// NOT: "customer" alanı nested geliyorsa (OrderController Customer'ı da
// dönüyorsa) companyName gösterilir; gelmiyorsa customerId gösterilir.
// Backend'inizin döndüğü gerçek şekle göre bu interface'i ayarlayın.
interface Order {
  id: number;
  customerId?: number;
  customer?: { companyName: string };
  orderDate: string;
  totalAmount: number;
  deliveryStatus: string;
  paymentStatus: string;
}

const STATUS_COLORS: Record<string, string> = {
  'Sipariş Alındı': colors.steelBlue,
  Üretimde: colors.spark,
  Sevkiyatta: colors.amber,
  'Teslim Edildi': colors.safetyGreen,
  'İptal Edildi': colors.dangerRed,
};

const formatMoney = (value: number) =>
  value.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('tr-TR');
  } catch {
    return iso;
  }
};

const OrderScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback((isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    api
      .get<Order[]>('/orders')
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error('Sipariş verisi çekme hatası:', error);
        setLoading(false);
        setRefreshing(false);
        Alert.alert('Bağlantı Hatası', `Siparişler yüklenemedi: ${error.message}`);
      });
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <View style={styles.root}>
        <HazardStripe />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.amber} />
          <Text style={styles.loadingText}>Siparişler yükleniyor…</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <HazardStripe />
      <View style={styles.container}>
        <Text style={typography.eyebrow}>CANLI VERİ</Text>
        <Text style={styles.title}>Siparişler</Text>
        <Text style={styles.resultCount}>{orders.length} sipariş listeleniyor</Text>

        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchOrders(true)} tintColor={colors.amber} />
          }
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Henüz sipariş yok.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const statusColor = STATUS_COLORS[item.deliveryStatus] ?? colors.textSecondary;
            return (
              <View style={styles.card}>
                <View style={[styles.statusBar, { backgroundColor: statusColor }]} />
                <View style={styles.cardBody}>
                  <View style={styles.row}>
                    <Text style={styles.orderTitle}>
                      {item.customer?.companyName ?? `Müşteri #${item.customerId ?? '—'}`}
                    </Text>
                    <Text style={styles.orderDate}>{formatDate(item.orderDate)}</Text>
                  </View>
                  <View style={[styles.row, { marginTop: spacing.sm }]}>
                    <View style={[styles.tag, { borderColor: statusColor }]}>
                      <Text style={[styles.tagText, { color: statusColor }]}>{item.deliveryStatus}</Text>
                    </View>
                    <Text style={styles.amount}>{formatMoney(item.totalAmount)} ₺</Text>
                  </View>
                  <Text style={styles.paymentText}>Ödeme: {item.paymentStatus}</Text>
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
  title: { ...typography.display, fontSize: 22, marginTop: spacing.xs },
  resultCount: { ...typography.bodyMuted, marginTop: spacing.xs, marginBottom: spacing.md },
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
  statusBar: { width: 5 },
  cardBody: { flex: 1, padding: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '800', flex: 1, marginRight: spacing.sm },
  orderDate: { color: colors.textMuted, fontSize: 11 },
  tag: { borderWidth: 1, borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  tagText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  amount: { ...typography.mono, fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  paymentText: { color: colors.textSecondary, fontSize: 12, marginTop: spacing.xs },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: spacing.xxl },
  loadingText: { ...typography.bodyMuted, marginTop: spacing.md },
  emptyText: { ...typography.bodyMuted, textAlign: 'center' },
});

export default OrderScreen;