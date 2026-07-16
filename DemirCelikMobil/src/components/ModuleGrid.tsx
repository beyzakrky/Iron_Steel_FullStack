import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radii, shadow } from '../theme/theme';
import { ModuleDef } from '../constants/modules';

export interface RequestStatus {
  resource: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

type Props = {
  modules: ModuleDef[];
  allowedResources: string[];
  myRequests: RequestStatus[];
  navigation: any;
  onRequestAccess: (resource: string) => void;
};

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  PENDING: { text: 'ONAY BEKLİYOR', color: colors.spark },
  APPROVED: { text: 'ONAYLANDI', color: colors.safetyGreen },
  REJECTED: { text: 'REDDEDİLDİ', color: colors.dangerRed },
};

const ModuleGrid: React.FC<Props> = ({ modules, allowedResources, myRequests, navigation, onRequestAccess }) => {
  const latestRequestFor = (resource: string) =>
    myRequests.find((r) => r.resource === resource);

  return (
    <View>
      {modules.map((mod) => {
        const unlocked = allowedResources.includes(mod.key);
        const pendingOrDecided = latestRequestFor(mod.key);

        if (unlocked) {
          return (
            <TouchableOpacity
              key={mod.key}
              style={styles.card}
              activeOpacity={0.85}
              disabled={!mod.screen}
              onPress={() => mod.screen && navigation.navigate(mod.screen)}
            >
              <View style={styles.iconChip}>
                <Text style={styles.iconText}>{mod.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{mod.title}</Text>
                <Text style={styles.subtitle}>{mod.subtitle}</Text>
              </View>
              {mod.screen ? (
                <Text style={styles.chevron}>›</Text>
              ) : (
                <Text style={styles.soonTag}>YAKINDA</Text>
              )}
            </TouchableOpacity>
          );
        }

        // --- Kilitli modül ---
        return (
          <View key={mod.key} style={[styles.card, styles.cardLocked]}>
            <View style={[styles.iconChip, styles.iconChipLocked]}>
              <Text style={styles.iconText}>🔒</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.titleLocked}>{mod.title}</Text>
              <Text style={styles.subtitle}>{mod.subtitle}</Text>
            </View>

            {pendingOrDecided ? (
              <View
                style={[
                  styles.statusPill,
                  { borderColor: STATUS_LABEL[pendingOrDecided.status].color },
                ]}
              >
                <Text style={{ color: STATUS_LABEL[pendingOrDecided.status].color, fontSize: 10, fontWeight: '800' }}>
                  {STATUS_LABEL[pendingOrDecided.status].text}
                </Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.requestBtn} onPress={() => onRequestAccess(mod.key)}>
                <Text style={styles.requestBtnText}>İzin İste</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow,
  },
  cardLocked: {
    backgroundColor: colors.surfaceInput,
    opacity: 0.9,
  },
  iconChip: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconChipLocked: { backgroundColor: '#2A2E32' },
  iconText: { fontSize: 18 },
  title: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  titleLocked: { color: colors.textSecondary, fontSize: 15, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  chevron: { color: colors.textMuted, fontSize: 22, marginLeft: spacing.sm },
  soonTag: { color: colors.textMuted, fontSize: 10, fontWeight: '700' },
  requestBtn: {
    borderWidth: 1,
    borderColor: colors.amber,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  requestBtnText: { color: colors.amber, fontSize: 11, fontWeight: '800' },
  statusPill: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
});

export default ModuleGrid;