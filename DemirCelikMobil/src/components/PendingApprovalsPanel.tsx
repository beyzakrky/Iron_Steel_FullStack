import React, {useCallback, useEffect, useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';
import {colors, spacing, radii, typography, shadow} from '../theme/theme';

interface PendingRequest {
    id: number;
    resource: string;
    reason: string;
    requestedAt: string;
    requester: { username: string; email: string };
}

const RESOURCE_LABELS: Record<string, string> = {
  customers: 'Müşteri Cari Kartları',
  products: 'Ürün Kataloğu',
  orders: 'Sipariş / Teklif',
  campaigns: 'Kampanyalar',
  visits: 'Ziyaret Raporları',
  financial_risk: 'Finansal Risk Analizi',
};
 
const PendingApprovalsPanel: React.FC = () => {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
 
  const load = useCallback(() => {
    setLoading(true);
    api
      .get<PendingRequest[]>('/access-requests/pending')
      .then((res) => setRequests(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
 
  useEffect(() => {
    load();
  }, [load]);
 
  const decide = async (id: number, action: 'approve' | 'reject') => {
    setBusyId(id);
    try {
      await api.put(`/access-requests/${id}/${action}`);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch {
      // sessizce geç, kullanıcı tekrar deneyebilir
    } finally {
      setBusyId(null);
    }
  };
 
  if (loading) {
    return (
      <View style={[styles.panel, styles.center]}>
        <ActivityIndicator color={colors.amber} />
      </View>
    );
  }
 
  if (requests.length === 0) {
    return (
      <View style={styles.panel}>
        <Text style={typography.label}>ONAY BEKLEYEN TALEP</Text>
        <Text style={styles.emptyText}>Şu an bekleyen erişim talebi yok.</Text>
      </View>
    );
  }
 
  return (
    <View style={styles.panel}>
      <View style={styles.panelHeaderRow}>
        <Text style={typography.label}>ONAY BEKLEYEN TALEPLER</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{requests.length}</Text>
        </View>
      </View>
 
      {requests.map((req) => (
        <View key={req.id} style={styles.requestRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.requesterName}>{req.requester?.username ?? 'Bilinmeyen kullanıcı'}</Text>
            <Text style={styles.resourceName}>{RESOURCE_LABELS[req.resource] ?? req.resource}</Text>
            {!!req.reason && <Text style={styles.reasonText}>"{req.reason}"</Text>}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.rejectBtn]}
              disabled={busyId === req.id}
              onPress={() => decide(req.id, 'reject')}
            >
              <Text style={styles.rejectText}>Reddet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.approveBtn]}
              disabled={busyId === req.id}
              onPress={() => decide(req.id, 'approve')}
            >
              <Text style={styles.approveText}>Onayla</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};
 
const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadow,
  },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.lg },
  emptyText: { ...typography.bodyMuted, marginTop: spacing.xs },
  panelHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  countBadge: {
    backgroundColor: colors.amber,
    borderRadius: radii.pill,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: { color: colors.bg, fontSize: 12, fontWeight: '800' },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  requesterName: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' },
  resourceName: { color: colors.steelBlue, fontSize: 12, marginTop: 2 },
  reasonText: { color: colors.textMuted, fontSize: 11, marginTop: 2, fontStyle: 'italic' },
  actions: { flexDirection: 'row', gap: spacing.xs },
  actionBtn: { borderRadius: radii.md, paddingHorizontal: spacing.sm, paddingVertical: 8, marginLeft: spacing.xs },
  rejectBtn: { borderWidth: 1, borderColor: colors.border },
  approveBtn: { backgroundColor: colors.safetyGreen },
  rejectText: { color: colors.textSecondary, fontSize: 12, fontWeight: '700' },
  approveText: { color: colors.bg, fontSize: 12, fontWeight: '800' },
});
 
export default PendingApprovalsPanel;