import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

// JWT Token payload tipi
interface TokenPayload {
  sub: string;
  role: 'DIRECTOR' | 'SALES_REP' | 'ASSISTANT' | 'INTERN';
  name: string;
}

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Hoş Geldin, {userName}</Text>
        <Text style={styles.roleBadge}>Yetki: {userRole}</Text>
      </View>

      <Text style={styles.menuTitle}>İşlem Menüsü</Text>

      {/* 1. Müşteri Listesi: HERKES görebilir */}
      {hasAccess(['DIRECTOR', 'SALES_REP', 'ASSISTANT', 'INTERN']) && (
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('CustomerScreen')}>
          <Text style={styles.menuText}>👥 Müşteri Cari Kartları</Text>
        </TouchableOpacity>
      )}

      {/* 2. Sipariş Giriş Modülü: Stajyer GÖREMEZ */}
      {hasAccess(['DIRECTOR', 'SALES_REP', 'ASSISTANT']) && (
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>📦 Yeni Sipariş / Teklif Oluştur</Text>
        </TouchableOpacity>
      )}

      {/* 3. Müşteri Ziyaret Planlama (Visits): Sadece Satışçı ve Direktör görebilir */}
      {hasAccess(['DIRECTOR', 'SALES_REP']) && (
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>📍 Müşteri Ziyaret Raporları</Text>
        </TouchableOpacity>
      )}

      {/* 4. Finansal Risk Raporu (Payments/Debt): Sadece Direktör görebilir */}
      {hasAccess(['DIRECTOR']) && (
        <TouchableOpacity style={[styles.menuButton, styles.riskButton]}>
          <Text style={styles.menuText}>💰 Şirket Finansal Risk / Tahsilat Analizi</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  header: { padding: 20, backgroundColor: '#007bff', borderRadius: 12, marginBottom: 25 },
  welcome: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  roleBadge: { color: '#e0e0e0', marginTop: 5, fontStyle: 'italic' },
  menuTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  menuButton: { backgroundColor: '#fff', padding: 18, borderRadius: 10, marginBottom: 12, elevation: 2 },
  riskButton: { borderColor: '#dc3545', borderWidth: 1 },
  menuText: { fontSize: 16, fontWeight: '600', color: '#495057' }
});

export default DashboardScreen;