import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import api from '../services/api';
import HazardStripe from '../components/HazardStripe';
import { colors, spacing, radii, typography, shadow } from '../theme/theme';

interface Visit {
  id: number;
  customer?: { companyName: string };
  salesRep?: { username: string };
  visitDate: string;
  notes: string;
  nextAction: string;
}

const formatDateTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
};

const VisitScreen: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVisits = useCallback((isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    api
      .get<Visit[]>('/visits')
      .then((res) => {
        setVisits(res.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error('Ziyaret verisi çekme hatası:', error);
        setLoading(false);
        setRefreshing(false);
        Alert.alert('Bağlantı Hatası', `Ziyaretler yüklenemedi: ${error.message}`);
      });
  }, []);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  if (loading) {
    return (
      <View style={styles.root}>
        <HazardStripe />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.amber} />
          <Text style={styles.loadingText}>Ziyaret kayıtları yükleniyor…</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <HazardStripe />
      <View style={styles.container}>
        <Text style={typography.eyebrow}>CANLI VERİ</Text>
        <Text style={styles.title}>Ziyaret Raporları</Text>
        <Text style={styles.resultCount}>{visits.length} kayıt listeleniyor</Text>

        <FlatList
          data={visits}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchVisits(true)} tintColor={colors.amber} />
          }
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Henüz ziyaret kaydı yok.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.customerName}>{item.customer?.companyName ?? 'Bilinmeyen müşteri'}</Text>
                <Text style={styles.dateText}>{formatDateTime(item.visitDate)}</Text>
              </View>
              {!!item.salesRep?.username && (
                <Text style={styles.repText}>👤 {item.salesRep.username}</Text>
              )}
              <Text style={styles.notes}>{item.notes}</Text>
              {!!item.nextAction && (
                <View style={styles.actionTag}>
                  <Text style={styles.actionText}>SONRAKİ ADIM: {item.nextAction}</Text>
                </View>
              )}
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
  title: { ...typography.display, fontSize: 22, marginTop: spacing.xs },
  resultCount: { ...typography.bodyMuted, marginTop: spacing.xs, marginBottom: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  customerName: { color: colors.textPrimary, fontSize: 15, fontWeight: '800', flex: 1, marginRight: spacing.sm },
  dateText: { color: colors.textMuted, fontSize: 11 },
  repText: { color: colors.steelBlue, fontSize: 12, marginTop: 4 },
  notes: { color: colors.textSecondary, fontSize: 13, marginTop: spacing.sm, lineHeight: 18 },
  actionTag: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceInput,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  actionText: { color: colors.spark, fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: spacing.xxl },
  loadingText: { ...typography.bodyMuted, marginTop: spacing.md },
  emptyText: { ...typography.bodyMuted, textAlign: 'center' },
});

export default VisitScreen;