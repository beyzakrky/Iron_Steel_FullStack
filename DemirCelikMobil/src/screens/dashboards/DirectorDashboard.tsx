import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import HazardStripe from '../../components/HazardStripe';
import DashboardHeader from '../../components/DashboardHeader';
import ModuleGrid from '../../components/ModuleGrid';
import PendingApprovalsPanel from '../../components/PendingApprovalsPanel';
import { ALL_MODULES } from '../../constants/modules';
import { colors, spacing, typography } from '../../theme/theme';
import { requestAccess } from '../../services/api';

type Props = {
  userName: string;
  navigation: any;
  onLogout: () => void;
};

// Direktör zaten tüm kaynaklara erişebilir (backend ResourcePermissions.java ile aynı liste)
const DIRECTOR_RESOURCES = ALL_MODULES.map((m) => m.key);

const DirectorDashboard: React.FC<Props> = ({ userName, navigation, onLogout }) => {
  return (
    <>
      <HazardStripe />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <DashboardHeader userName={userName} role="DIRECTOR" onLogout={onLogout} />

        <PendingApprovalsPanel />

        <Text style={typography.label}>TÜM MODÜLLER</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ReportBuilderScreen')} style={{ marginBottom: spacing.md }}>
          <Text style={{ color: colors.amber, fontWeight: '800' }}> Rapor Oluşturucu </Text>
        </TouchableOpacity>
        <ModuleGrid
          modules={ALL_MODULES}
          allowedResources={DIRECTOR_RESOURCES}
          myRequests={[]}
          navigation={navigation}
          onRequestAccess={() => {}}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg },
});

export default DirectorDashboard;