import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import HazardStripe from '../../components/HazardStripe';
import DashboardHeader from '../../components/DashboardHeader';
import ModuleGrid, { RequestStatus } from '../../components/ModuleGrid';
import { ALL_MODULES } from '../../constants/modules';
import { colors, spacing, typography } from '../../theme/theme';
import { requestAccess } from '../../services/api';

type Props = {
  userName: string;
  navigation: any;
  onLogout: () => void;
  allowedResources: string[]; // /api/me/permissions'dan gelir
  myRequests: RequestStatus[]; // /api/access-requests/mine'dan gelir
  onRequestsChanged: () => void; // izin istendikten sonra listeyi yenilemek için
};

const SalesRepDashboard: React.FC<Props> = ({
  userName,
  navigation,
  onLogout,
  allowedResources,
  myRequests,
  onRequestsChanged,
}) => {
  const handleRequestAccess = async (resource: string) => {
    await requestAccess(resource, 'Satış temsilcisi ekranından talep edildi');
    onRequestsChanged();
  };

  return (
    <>
      <HazardStripe />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <DashboardHeader userName={userName} role="SALES_REP" onLogout={onLogout} />

        <Text style={typography.label}>MODÜLLER</Text>
        <Text style={styles.hint}>
          Kilitli modüller için "İzin İste" ile direktörünüze onay talebi gönderebilirsiniz.
        </Text>

        <ModuleGrid
          modules={ALL_MODULES}
          allowedResources={allowedResources}
          myRequests={myRequests}
          navigation={navigation}
          onRequestAccess={handleRequestAccess}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg },
  hint: { ...typography.bodyMuted, marginBottom: spacing.md, marginTop: 2 },
});

export default SalesRepDashboard;