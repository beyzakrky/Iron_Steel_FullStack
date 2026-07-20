import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import api from '../services/api';
import HazardStripe from '../components/HazardStripe';
import { colors, spacing, radii, typography, shadow } from '../theme/theme';

interface RiskRow {
  customerId: number;
  companyName: string;
  city: string;
  totalDebt: number;
  overdueDebt: number;
  creditLimit: number;
  daysSinceLastOrder: number;
  daysSincePayment: number;
  riskScore: number;
  riskLevel: 'DÜŞÜK' | 'ORTA' | 'YÜKSEK';
}

const LEVEL_COLOR: Record<string, string> = {
  DÜŞÜK: colors.safetyGreen,
  ORTA: colors.spark,
  YÜKSEK: colors.dangerRed,
};

const formatMoney = (v: number) => v.toLocaleString('tr-TR', { maximumFractionDigits: 0 });

const FinancialRiskScreen: React.FC = () => {
  const [rows, setRows] = useState<RiskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRisk = useCallback((isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    api
      .get<RiskRow[]>('/risk-analysis')
      .then((res) => {
        setRows(res.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        if (error?.response?.status !== 403) {
          Alert.alert('Bağlantı Hatası', `Risk analizi yüklenemedi: ${error.message}`);
        }
      });
  }, []);

  useEffect(() => {
    fetchRisk();
  }, [fetchRisk]);

  const counts = rows.reduce(
    (acc, r) => {
      acc[r.riskLevel] = (acc[r.riskLevel] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const totalOverdue = rows.reduce((sum, r) => sum + r.overdueDebt, 0);

  if (loading) {
    return (
      <View style={styles.root}>
        <HazardStripe />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.amber} />
          <Text style={styles.loadingText}>Risk analizi hesaplanıyor…</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <HazardStripe />
      <View style={styles.container}>
        <Text style={typography.eyebrow}>SADECE DİREKTÖR</Text>
        <Text style={styles.title}>Finansal Risk Analizi</Text>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderColor: colors.dangerRed }]}>
            <Text style={[styles.summaryValue, { color: colors.dangerRed }]}>{counts.YÜKSEK ?? 0}</Text>
            <Text style={styles.summaryLabel}>YÜKSEK RİSK</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: colors.spark }]}>
            <Text style={[styles.summaryValue, { color: colors.spark }]}>{counts.ORTA ?? 0}</Text>
            <Text style={styles.summaryLabel}>ORTA RİSK</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: colors.safetyGreen }]}>
            <Text style={[styles.summaryValue, { color: colors.safetyGreen }]}>{counts.DÜŞÜK ?? 0}</Text>
            <Text style={styles.summaryLabel}>DÜŞÜK RİSK</Text>
          </View>
        </View>

        <View style={styles.totalCard}>
          <Text style={typography.label}>TOPLAM GECİKMİŞ BAKİYE</Text>
          <Text style={styles.totalValue}>{formatMoney(totalOverdue)} ₺</Text>
        </View>

        <FlatList
          data={rows}
          keyExtractor={(item) => item.customerId.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchRisk(true)} tintColor={colors.amber} />
          }
          contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: spacing.xl }}
          renderItem={({ item }) => {
            const levelColor = LEVEL_COLOR[item.riskLevel];
            return (
              <View style={styles.card}>
                <View style={[styles.riskBar, { backgroundColor: levelColor }]} />
                <View style={styles.cardBody}>
                  <View style={styles.row}>
                    <Text style={styles.companyName}>{item.companyName}</Text>
                    <View style={[styles.levelTag, { borderColor: levelColor }]}>
                      <Text style={[styles.levelText, { color: levelColor }]}>{item.riskLevel}</Text>
                    </View>
                  </View>
                  <Text style={styles.cityText}>📍 {item.city}</Text>

                  <View style={styles.scoreRow}>
                    <Text style={styles.scoreLabel}>Risk Skoru</Text>
                    <Text style={[styles.scoreValue, { color: levelColor }]}>{item.riskScore.toFixed(1)}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailText}>Gecikmiş: {formatMoney(item.overdueDebt)} ₺</Text>
                    <Text style={styles.detailText}>Limit: {formatMoney(item.creditLimit)} ₺</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailText}>
                      Son sipariş: {item.daysSinceLastOrder < 0 ? 'hiç yok' : `${item.daysSinceLastOrder} gün önce`}
                    </Text>
                    <Text style={styles.detailText}>
                      Son ödeme: {item.daysSincePayment < 0 ? 'hiç yok' : `${item.daysSincePayment} gün önce`}
                    </Text>
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
  summaryRow: { flexDirection: 'row', gap: spacing.sm },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.sm,
    alignItems: 'center',
    ...shadow,
  },
  summaryValue: { fontSize: 22, fontWeight: '800' },
  summaryLabel: { fontSize: 9, fontWeight: '700', color: colors.textSecondary, marginTop: 2, letterSpacing: 0.5 },
  totalCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
    ...shadow,
  },
  totalValue: { ...typography.display, fontSize: 24, marginTop: spacing.xs, color: colors.dangerRed },
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
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  companyName: { color: colors.textPrimary, fontSize: 15, fontWeight: '800', flex: 1, marginRight: spacing.sm },
  levelTag: { borderWidth: 1, borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  levelText: { fontSize: 10, fontWeight: '800' },
  cityText: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  scoreLabel: { color: colors.textSecondary, fontSize: 12 },
  scoreValue: { ...typography.mono, fontSize: 20, fontWeight: '800' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  detailText: { ...typography.mono, color: colors.textMuted, fontSize: 11 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: spacing.xxl },
  loadingText: { ...typography.bodyMuted, marginTop: spacing.md },
});

export default FinancialRiskScreen;