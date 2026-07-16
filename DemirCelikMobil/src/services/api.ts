import axios, { AxiosInstance } from 'axios';
import { Alert} from 'react-native';

// Kendi bilgisayarının IPv4 adresini buraya yaz (Örn: 192.168.1.45)
// Emülatörün bilgisayar kodlarına (localhost'a) erişmesini sağlayan özel Android köprü IP'si
const LOCAL_IP: string = '10.0.2.2';

const api: AxiosInstance = axios.create({
    baseURL: `http://${LOCAL_IP}:8080/api`,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

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

        if(status === 403 && data?.error === 'ACESS_DENIED') {
            const resource = data.resource as string;
            Alert.alert(
                'Erişim Yetkini Yok',
                data.message || 'Bu bölüüm için direktörünüzden onay istemeniz gerekiyor.',
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
    try {
        await api.post('/access-request', {
            resource,
            reason: reason ||'Mobil uygulama üzerinden otomatik talep',
        });
        Alert.alert('Talep Gönderildi', 'Direktörünüz onaylandığında bu bölüme erişebilirsiniz.');
    } catch (e) {
        Alert.alert('Hata', 'Telp gönderilemedi, tekrar deneyin.');
    }
};

export default api;