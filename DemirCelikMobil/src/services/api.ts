import axios, { AxiosInstance } from 'axios';

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

export default api;