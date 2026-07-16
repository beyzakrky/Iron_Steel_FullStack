import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radii, typography, shadow } from '../theme/theme';

const ROLE_META: Record<string, { label: string; color: string }> = {
  DIRECTOR: { label: 'DİREKTÖR', color: colors.amber },
  SALES_REP: { label: 'SATIŞ TEMSİLCİSİ', color: colors.steelBlue },
  INTERN: { label: 'STAJYER', color: colors.textSecondary },
};

type Props = {
  userName: string;
  role: string;
  onLogout: () => void;
  eyebrow?: string;
};

const DashboardHeader: React.FC<Props> = ({ userName, role, onLogout, eyebrow }) => {
  const meta = ROLE_META[role] ?? { label: role || '—', color: colors.textSecondary };

  return (
    <View style={styles.header}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={typography.eyebrow}>{eyebrow ?? 'SAHA UYGULAMASI'}</Text>
          <Text style={styles.welcome}>Hoş geldin, {userName || 'Kullanıcı'}</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Çıkış</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.roleBadge, { borderColor: meta.color }]}>
        <View style={[styles.roleDot, { backgroundColor: meta.color }]} />
        <Text style={[styles.roleBadgeText, { color: meta.color }]}>{meta.label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  welcome: { ...typography.display, fontSize: 20, marginTop: spacing.xs },
  logoutBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  logoutText: { color: colors.textSecondary, fontSize: 12, fontWeight: '700' },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    marginTop: spacing.md,
  },
  roleDot: { width: 6, height: 6, borderRadius: 3, marginRight: spacing.xs },
  roleBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
});

export default DashboardHeader;