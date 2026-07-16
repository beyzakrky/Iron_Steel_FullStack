/* import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HazardStripe from '../components/HazardStripe';
import { colors, spacing, radii, typography, shadow } from '../theme/theme';

// JWT Token payload tipi
interface TokenPayload {
  sub: string;
  role: 'DIRECTOR' | 'SALES_REP' | 'ASSISTANT' | 'INTERN';
  name: string;
}

const ROLE_META: Record<string, { label: string; color: string }> = {
  DIRECTOR: { label: 'DİREKTÖR', color: colors.amber },
  SALES_REP: { label: 'SATIŞ TEMSİLCİSİ', color: colors.steelBlue },
  ASSISTANT: { label: 'ASİSTAN', color: colors.spark },
  INTERN: { label: 'STAJYER', color: colors.textSecondary },
};

type MenuItem = {
  key: string;
  icon: string;
  title: string;
  subtitle: string;
  roles: string[];
  danger?: boolean;
  onPress?: () => void;
};

const DashboardScreen = ({ navigation }: any) => {
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const checkToken = async () => {
      // 1. Girişte kaydedilen token'ı hafızadan oku
      const token = await AsyncStorage.getItem('user_token');
      if (token) {
        // 2. Token'ın içini çöz (Decode et)
        const decoded = jwtDecode<TokenPayload>(token);
        setUserRole(decoded.role);
        setUserName(decoded.name);
      }
    };
    checkToken();
  }, []);

  // Hangi rolün hangi butonları görebileceğini belirleyen fonksiyon
  const hasAccess = (allowedRoles: string[]) => {
    return allowedRoles.includes(userRole);
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['user_token', 'user_role', 'user_name']);
    navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
  };

  const roleMeta = ROLE_META[userRole] ?? { label: userRole || '—', color: colors.textSecondary };

  const menuItems: MenuItem[] = [
    {
      key: 'customers',
      icon: '👥',
      title: 'Müşteri Cari Kartları',
      subtitle: 'Bakiye, kredi limiti ve şehir bazlı liste',
      roles: ['DIRECTOR', 'SALES_REP', 'ASSISTANT', 'INTERN'],
      onPress: () => navigation.navigate('CustomerScreen'),
    },
    {
      key: 'orders',
      icon: '📦',
      title: 'Yeni Sipariş / Teklif Oluştur',
      subtitle: 'Ürün, ton ve fiyat girişi',
      roles: ['DIRECTOR', 'SALES_REP', 'ASSISTANT'],
    },
    {
      key: 'visits',
      icon: '📍',
      title: 'Müşteri Ziyaret Raporları',
      subtitle: 'Saha ziyaret planlama ve notlar',
      roles: ['DIRECTOR', 'SALES_REP'],
    },
    {
      key: 'risk',
      icon: '💰',
      title: 'Finansal Risk / Tahsilat Analizi',
      subtitle: 'Şirket geneli gecikmiş bakiye raporu',
      roles: ['DIRECTOR'],
      danger: true,
    },
  ];

  return (
    <View style={styles.root}>
      <HazardStripe />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={typography.eyebrow}>SAHA UYGULAMASI</Text>
              <Text style={styles.welcome}>Hoş geldin, {userName || 'Kullanıcı'}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Text style={styles.logoutText}>Çıkış</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.roleBadge, { borderColor: roleMeta.color }]}>
            <View style={[styles.roleDot, { backgroundColor: roleMeta.color }]} />
            <Text style={[styles.roleBadgeText, { color: roleMeta.color }]}>{roleMeta.label}</Text>
          </View>
        </View>

        <Text style={styles.menuTitle}>İşlem Menüsü</Text>

        {menuItems
          .filter((item) => hasAccess(item.roles))
          .map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.menuButton, item.danger && styles.menuButtonDanger]}
              onPress={item.onPress}
              activeOpacity={0.85}
              disabled={!item.onPress}
            >
              <View style={[styles.iconChip, item.danger && styles.iconChipDanger]}>
                <Text style={styles.iconChipText}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuText}>{item.title}</Text>
                <Text style={styles.menuSubtext}>{item.subtitle}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: spacing.lg },
  header: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start' },
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
  menuTitle: { ...typography.label, marginBottom: spacing.sm },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  menuButtonDanger: {
    borderColor: '#4A2A28',
    backgroundColor: '#241A19',
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
  iconChipDanger: { backgroundColor: '#3A211F' },
  iconChipText: { fontSize: 18 },
  menuText: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  menuSubtext: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  chevron: { color: colors.textMuted, fontSize: 22, marginLeft: spacing.sm },
});

export default DashboardScreen;
*/

import React, { useCallback, useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { colors } from '../theme/theme';
import { RequestStatus } from '../components/ModuleGrid';

import DirectorDashboard from './dashboards/DirectorDashboard';
import SalesRepDashboard from './dashboards/SalesRepDashboard';
import InternDashboard from './dashboards/InternDashboard';

interface TokenPayload {
  sub: string;
  role: 'DIRECTOR' | 'SALES_REP' | 'INTERN';
  name: string;
}

const DashboardScreen = ({ navigation }: any) => {
  const [role, setRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [allowedResources, setAllowedResources] = useState<string[]>([]);
  const [myRequests, setMyRequests] = useState<RequestStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPermissions = useCallback(async () => {
    try {
      const [permsRes, requestsRes] = await Promise.all([
        api.get('/me/permissions'),
        api.get('/access-requests/mine'),
      ]);
      setAllowedResources(permsRes.data.resources ?? []);
      setMyRequests(
        (requestsRes.data ?? []).map((r: any) => ({ resource: r.resource, status: r.status }))
      );
    } catch (e) {
      console.error('Yetki bilgisi alınamadı:', e);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem('user_token');
      if (token) {
        const decoded = jwtDecode<TokenPayload>(token);
        console.log('DECODED TOKEN:', decoded); // ← geçici, sonra silinecek
        setRole(decoded.role);
        setUserName(decoded.name);
      }
      await loadPermissions();
      setLoading(false);
    };
    init();
  }, [loadPermissions]);

const handleLogout = async () => {
  await AsyncStorage.removeItem('user_token');
  await AsyncStorage.removeItem('user_role');
  await AsyncStorage.removeItem('user_name');
  navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
};

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.amber} />
      </View>
    );
  }

  // Rolüne göre doğru arayüzü seç. Bilinmeyen/boş rol → en kısıtlı görünüm (Stajyer) gösterilir.
  switch (role) {
    case 'DIRECTOR':
      return <DirectorDashboard userName={userName} navigation={navigation} onLogout={handleLogout} />;
    case 'SALES_REP':
      return (
        <SalesRepDashboard
          userName={userName}
          navigation={navigation}
          onLogout={handleLogout}
          allowedResources={allowedResources}
          myRequests={myRequests}
          onRequestsChanged={loadPermissions}
        />
      );
    default:
      return (
        <InternDashboard
          userName={userName}
          navigation={navigation}
          onLogout={handleLogout}
          allowedResources={allowedResources}
          myRequests={myRequests}
          onRequestsChanged={loadPermissions}
        />
      );
  }
};

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' },
});

export default DashboardScreen;