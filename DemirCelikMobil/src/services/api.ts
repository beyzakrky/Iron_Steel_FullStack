import axios, { AxiosInstance } from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Kendi bilgisayarının IPv4 adresini buraya yaz (Örn: 192.168.1.45)
// Emülatörün bilgisayar kodlarına (localhost'a) erişmesini sağlayan özel Android köprü IP'si
const LOCAL_IP: string = '10.0.2.2';
 
const api: AxiosInstance = axios.create({
  baseURL: `http://${LOCAL_IP}:8080/api`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** 
 * REQUEST INTERCEPTOR 
 * Her giden isteğe, AsyncStorage'da saklanan tokenı otomatik olarak
 * Authorization: Bearer <token> header ı olarak ekler 
 * Bu olmadan backenddenki JwtAuthFilter hiçbir zaman token görmüyor
 */

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

/* 
Backendden ACCESS_DENIED (403) geldiğinde otomatik olarak
kullanıcıya "Direktörden izin iste" seçeneği sunan interceptor.
Herhangi bir ekrandan api.get/post çağırdığımızda otomatik devreye girer. 
Navigation prop'una ihtiyaç duymaz.

*/

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
 
    if (status === 403 && data?.error === 'ACCESS_DENIED') {
      const resource = data.resource as string;
      Alert.alert(
        'Erişim Yetkiniz Yok',
        data.message || 'Bu bölüm için direktörünüzden onay istemeniz gerekiyor.',
        [
          { text: 'Vazgeç', style: 'cancel' },
          {
            text: 'İzin İste',
            onPress: () => requestAccess(resource),
          },
        ]
      );
    }
    return Promise.reject(error);
  }
);

// Belirli bir kaynak için direktöre onay talebi gönder
export const requestAccess = async (resource: string, reason?: string) => {
    console.log('----- RequestAccess çalıştı.');
    console.log('----- İZİN İSTE TIKLANDI ------');
    console.log('resource parametresi:', resource, typeof resource);

    try {
        const res = await api.post('/access-requests', {
            resource,
            reason: reason ||'Mobil uygulama üzerinden otomatik talep',
        });
        console.log('BAŞARILI, backend cevabı:', res.data);
        Alert.alert('Talep Gönderildi', 'Direktörünüz onaylandığında bu bölüme erişebilirsiniz.');
    } catch (e: any) {
        console.log('HATA MESAJI:', e?.message);
        console.log('HATA STATUS', e?.response?.status);
        console.log('HATA DATA:', e?.response?.data);
        console.log('İSTEK YAPILANDIRILMASI (config):', e?.response.data); 
        Alert.alert('Hata', 'Talep gönderilemedi, tekrar deneyin.');
    }
};

export default api;