import axios, { AxiosInstance } from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetToLogin } from '../navigation/navigationRef';

const LOCAL_IP: string = '10.0.2.2';

const api: AxiosInstance = axios.create({
  baseURL: `http://${LOCAL_IP}:8080/api`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let sessionExpiredAlertShown = false; // aynı anda birden fazla istek 401 dönerse tek Alert göstermek için

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;

    // ---- Oturum süresi doldu (401) ----
    if (status === 401) {
      await AsyncStorage.removeItem('user_token');
      await AsyncStorage.removeItem('user_role');
      await AsyncStorage.removeItem('user_name');

      if (!sessionExpiredAlertShown) {
        sessionExpiredAlertShown = true;
        Alert.alert('Oturum Süresi Doldu', 'Güvenlik nedeniyle 15 dakika sonra oturum kapanır. Lütfen tekrar giriş yapın.', [
          {
            text: 'Tamam',
            onPress: () => {
              sessionExpiredAlertShown = false;
              resetToLogin();
            },
          },
        ]);
      }
      return Promise.reject(error);
    }

    // ---- Yetki yok, direktör onayı gerekiyor (403 ACCESS_DENIED) ----
    if (status === 403 && data?.error === 'ACCESS_DENIED') {
      const resource = data.resource as string;
      Alert.alert(
        'Erişim Yetkiniz Yok',
        data.message || 'Bu bölüm için direktörünüzden onay istemeniz gerekiyor.',
        [
          { text: 'Vazgeç', style: 'cancel' },
          { text: 'İzin İste', onPress: () => requestAccess(resource) },
        ]
      );
    }

    return Promise.reject(error);
  }
);

export const requestAccess = async (resource: string, reason?: string) => {
  try {
    await api.post('/access-requests', {
      resource,
      reason: reason || 'Mobil uygulama üzerinden otomatik talep',
    });
    Alert.alert('Talep Gönderildi', 'Direktörünüz onayladığında bu bölüme erişebileceksiniz.');
  } catch (e) {
    Alert.alert('Hata', 'Talep gönderilemedi, tekrar deneyin.');
  }
};

export default api;