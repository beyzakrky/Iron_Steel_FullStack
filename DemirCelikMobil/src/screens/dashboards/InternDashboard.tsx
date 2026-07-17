import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import HazardStripe from '../../components/HazardStripe';
import DashboardHeader from '../../components/DashboardHeader';
import ModuleGrid, { RequestStatus } from '../../components/ModuleGrid';
import { ALL_MODULES } from '../../constants/modules';
import { colors, spacing, radii, typography, shadow } from '../../theme/theme';
import { requestAccess } from '../../services/api';

type Props = {
  userName: string;
  navigation: any;
  onLogout: () => void;
  allowedResources: string[];
  myRequests: RequestStatus[];
  onRequestsChanged: () => void;
};

// Stajyerin garantili varsayılan modülü - ResourcePermissions.java 'daki 
// INTERN matrisiyle eşleşir. Sabit tutuluyor ki onaylanan başka bir
// modül geldiğinde bu kartın yeri/anlamı değişmesin.

const HERO_KEY = 'customers';

const InternDashboard: React.FC<Props> = ({
  userName,
  navigation,
  onLogout,
  allowedResources,
  myRequests,
  onRequestsChanged,
}) => {
  // Hero dışındaki tüm modeülleri gösteriyorz.
  // bu sayede onaylanan bir modül grid'den kaybolmuyor, açık/tıklanabilir
  // hale geliyor. Kilitli durumu ModuleGrid içinde, allowedResources'a 
  // bakılarak belirleniyor. 

  const heroModule = ALL_MODULES.find((m) => m.key === HERO_KEY);
  const otherModules = ALL_MODULES.filter((m) => m.key !== HERO_KEY);

  const handleRequestAccess = async (resource: string) => {
    await requestAccess(resource, 'Stajyer ekranından talep edildi');
    onRequestsChanged();
  };

  return (
    <>
      <HazardStripe />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <DashboardHeader userName={userName} role="INTERN" onLogout={onLogout} eyebrow="STAJYER PANELİ" />

 {/* Stajyerin varsayılan modülü, büyük ve öne çıkan bir kart olarak */}
        {heroModule && (
          <TouchableOpacity
            style={styles.heroCard}
            activeOpacity={0.85}
            onPress={() => heroModule.screen && navigation.navigate(heroModule.screen)}
          >
            <Text style={styles.heroIcon}>{heroModule.icon}</Text>
            <Text style={styles.heroTitle}>{heroModule.title}</Text>
            <Text style={styles.heroSubtitle}>{heroModule.subtitle}</Text>
            <Text style={styles.heroCta}>Aç →</Text>
          </TouchableOpacity>
        )}
 
        <Text style={[typography.label, { marginTop: spacing.lg }]}>DİĞER MODÜLLER</Text>
        <Text style={styles.hint}>
          Onaylanan modüller burada otomatik olarak açılır. Kilitli olanlar için "İzin İste" ile talep gönderin.
        </Text>
 
        <ModuleGrid
          modules={otherModules}
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
  heroCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.amber,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadow,
  },
  heroIcon: { fontSize: 32, marginBottom: spacing.xs },
  heroTitle: { ...typography.display, fontSize: 18, textAlign: 'center' },
  heroSubtitle: { ...typography.bodyMuted, textAlign: 'center', marginTop: spacing.xs },
  heroCta: { color: colors.amber, fontWeight: '800', marginTop: spacing.md, fontSize: 13 },
  hint: { ...typography.bodyMuted, marginBottom: spacing.md, marginTop: 2 },
});

export default InternDashboard;