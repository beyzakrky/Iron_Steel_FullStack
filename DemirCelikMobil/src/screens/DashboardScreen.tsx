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