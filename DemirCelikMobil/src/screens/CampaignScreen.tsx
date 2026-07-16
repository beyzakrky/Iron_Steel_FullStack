import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import api from '../services/api';
import HazardStripe from '../components/HazardStripe';
import { colors, spacing, radii, typography, shadow } from '../theme/theme';

interface Campaign {
  id: number;
  title: string;
  description: string;
  discountRate: number;
  startDate: string;
  endDate: string;
}

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('tr-TR');
  } catch {
    return iso;
  }
};

const isActive = (start: string, end: string) => {
  const now = new Date();
  return now >= new Date(start) && now <= new Date(end);
};

const CampaignScreen: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCampaigns = useCallback((isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    api
      .get<Campaign[]>('/campaigns')
      .then((res) => {
        setCampaigns(res.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error('Kampanya verisi çekme hatası:', error);
        setLoading(false);
        setRefreshing(false);
        Alert.alert('Bağlantı Hatası', `Kampanyalar yüklenemedi: ${error.message}`);
      });
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  if (loading) {
    return (
      <View style={styles.root}>
        <HazardStripe />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.amber} />
          <Text style={styles.loadingText}>Kampanyalar yükleniyor…</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <HazardStripe />
      <View style={styles.container}>
        <Text style={typography.eyebrow}>CANLI VERİ</Text>
        <Text style={styles.title}>Kampanyalar</Text>
        <Text style={styles.resultCount}>{campaigns.length} kampanya listeleniyor</Text>

        <FlatList
          data={campaigns}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchCampaigns(true)} tintColor={colors.amber} />
          }
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Şu an aktif kampanya yok.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const active = isActive(item.startDate, item.endDate);
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.campaignTitle}>{item.title}</Text>
                  <View style={[styles.discountBadge]}>
                    <Text style={styles.discountText}>%{item.discountRate}</Text>
                  </View>
                </View>
                <Text style={styles.description}>{item.description}</Text>
                <View style={styles.footerRow}>
                  <Text style={styles.dateRange}>
                    {formatDate(item.startDate)} – {formatDate(item.endDate)}
                  </Text>
                  <View style={[styles.statusTag, { backgroundColor: active ? '#1F3327' : '#2A2E32' }]}>
                    <Text style={[styles.statusText, { color: active ? colors.safetyGreen : colors.textMuted }]}>
                      {active ? 'AKTİF' : 'SÜRESİ DOLDU'}
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
  title: { ...typography.display, fontSize: 22, marginTop: spacing.xs },
  resultCount: { ...typography.bodyMuted, marginTop: spacing.xs, marginBottom: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.amber,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  campaignTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '800', flex: 1, marginRight: spacing.sm },
  discountBadge: {
    backgroundColor: colors.amber,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  discountText: { color: colors.bg, fontSize: 13, fontWeight: '800' },
  description: { color: colors.textSecondary, fontSize: 13, marginTop: spacing.xs, lineHeight: 18 },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  dateRange: { ...typography.mono, fontSize: 11, color: colors.textMuted },
  statusTag: { borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: spacing.xxl },
  loadingText: { ...typography.bodyMuted, marginTop: spacing.md },
  emptyText: { ...typography.bodyMuted, textAlign: 'center' },
});

export default CampaignScreen;