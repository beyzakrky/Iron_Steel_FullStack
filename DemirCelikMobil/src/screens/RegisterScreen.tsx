import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import api from '../services/api';
import HazardStripe from '../components/HazardStripe';
import { colors, spacing, radii, typography, shadow } from '../theme/theme';

const ROLES: { value: string; label: string; desc: string }[] = [
  { value: 'DIRECTOR', label: 'Direktör', desc: 'Tüm modüllere ve finansal risk raporlarına erişim' },
  { value: 'SALES_REP', label: 'Satış Temsilcisi', desc: 'Müşteri, sipariş ve ziyaret modülleri' },
  { value: 'INTERN', label: 'Stajyer', desc: 'Sadece müşteri cari kartlarını görüntüleme' },
];

const RegisterScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('INTERN'); // Varsayılan stajyer
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await api.post('/auth/register', { username, email, password, role });
      if (response.data.error) {
        Alert.alert('Hata', response.data.error);
      } else {
        Alert.alert('Başarılı', 'Kayıt oldunuz! Giriş ekranına yönlendiriliyorsunuz.');
        navigation.navigate('LoginScreen');
      }
    } catch (error) {
      console.error(error); // error değişkenini burada kullanarak uyarıyı siliyoruz
      Alert.alert('Hata', 'Backend sunucusuna bağlanılamadı.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <HazardStripe />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={typography.eyebrow}>YENİ SAHA KAYDI</Text>
            <Text style={styles.title}>Satış Temsilcisi Kaydı</Text>
          </View>

          <View style={styles.card}>
            <Text style={typography.label}>Ad Soyad</Text>
            <TextInput
              style={styles.input}
              placeholder="Ör. Ahmet Yıldırım"
              placeholderTextColor={colors.textMuted}
              value={username}
              onChangeText={setUsername}
            />

            <Text style={[typography.label, { marginTop: spacing.md }]}>E-posta</Text>
            <TextInput
              style={styles.input}
              placeholder="ornek@sirket.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={[typography.label, { marginTop: spacing.md }]}>Şifre</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Text style={[typography.label, { marginTop: spacing.lg, marginBottom: spacing.sm }]}>
              Rol Seçimi (Test Amaçlı)
            </Text>
            <View style={styles.roleList}>
              {ROLES.map((r) => {
                const active = role === r.value;
                return (
                  <TouchableOpacity
                    key={r.value}
                    style={[styles.roleRow, active && styles.roleRowActive]}
                    onPress={() => setRole(r.value)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.roleIcon}>{r.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.roleLabel, active && styles.roleLabelActive]}>{r.label}</Text>
                      <Text style={styles.roleDesc}>{r.desc}</Text>
                    </View>
                    <View style={[styles.radio, active && styles.radioActive]} />
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.button, submitting && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={submitting}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>
                {submitting ? 'OLUŞTURULUYOR…' : 'HESAP OLUŞTUR'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { flexGrow: 1, padding: spacing.lg, paddingTop: spacing.xl },
  header: { marginBottom: spacing.lg },
  title: { ...typography.display, fontSize: 22, marginTop: spacing.xs },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadow,
  },
  input: {
    backgroundColor: colors.surfaceInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginTop: spacing.xs,
    color: colors.textPrimary,
    fontSize: 15,
  },
  roleList: { gap: spacing.sm },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  roleRowActive: {
    borderColor: colors.amber,
    backgroundColor: '#2A2118',
  },
  roleIcon: { fontSize: 20, marginRight: spacing.sm },
  roleLabel: { color: colors.textPrimary, fontWeight: '700', fontSize: 14 },
  roleLabelActive: { color: colors.amber },
  roleDesc: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  radioActive: {
    borderColor: colors.amber,
    backgroundColor: colors.amber,
  },
  button: {
    backgroundColor: colors.amber,
    borderRadius: radii.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.bg, fontSize: 15, fontWeight: '800', letterSpacing: 1 },
});

export default RegisterScreen;