import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import HazardStripe from '../components/HazardStripe';
import { colors, spacing, radii, typography, shadow } from '../theme/theme';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Eksik Bilgi', 'E-posta ve şifre alanlarını doldurun.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.error) {
        Alert.alert('Giriş Başarısız', response.data.error);
      } else {
        await AsyncStorage.setItem('user_token', response.data.token);
        await AsyncStorage.setItem('user_role', response.data.role);
        await AsyncStorage.setItem('user_name', response.data.name);
        navigation.navigate('DashboardScreen');
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={typography.eyebrow}>SAHA GİRİŞ TERMİNALİ</Text>
            <Text style={styles.brand}>DEMİR ÇELİK</Text>
            <Text style={styles.brandSub}>Saha Satış Platformu</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.rivet} pointerEvents="none" />
            <View style={[styles.rivet, styles.rivetRight]} pointerEvents="none" />

            <Text style={typography.label}>E-posta</Text>
            <TextInput
              style={[styles.input, focusedField === 'email' && styles.inputFocused]}
              placeholder="ornek@sirket.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />

            <Text style={[typography.label, { marginTop: spacing.md }]}>Şifre</Text>
            <TextInput
              style={[styles.input, focusedField === 'password' && styles.inputFocused]}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />

            <TouchableOpacity
              style={[styles.button, submitting && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={submitting}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>
                {submitting ? 'BAĞLANIYOR…' : 'GİRİŞ YAP'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('RegisterScreen')}
          >
            <Text style={styles.registerText}>
              Hesabınız yok mu? <Text style={styles.registerTextAccent}>Saha ekibine katılın →</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  brand: {
    ...typography.display,
    fontSize: 32,
    marginTop: spacing.xs,
    letterSpacing: 2,
  },
  brandSub: {
    ...typography.bodyMuted,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadow,
  },
  rivet: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderLight,
  },
  rivetRight: {
    left: undefined,
    right: spacing.sm,
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
  inputFocused: {
    borderColor: colors.borderFocus,
  },
  button: {
    backgroundColor: colors.amber,
    borderRadius: radii.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.bg,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  registerLink: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  registerText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  registerTextAccent: {
    color: colors.amber,
    fontWeight: '700',
  },
});

export default LoginScreen;