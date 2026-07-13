import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.error) {
        Alert.alert("Giriş Başarısız", response.data.error);
      } else {
        await AsyncStorage.setItem('user_token', response.data.token);
        await AsyncStorage.setItem('user_role', response.data.role);
        await AsyncStorage.setItem('user_name', response.data.name);
        navigation.navigate('DashboardScreen');
      }
    } catch (error) {
  console.error(error); // error değişkenini burada kullanarak uyarıyı siliyoruz
  Alert.alert("Hata", "Backend sunucusuna bağlanılamadı.");
}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Demir Çelik Portal Girişi</Text>
      <TextInput style={styles.input} placeholder="E-posta" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Şifre" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }} onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={{ color: '#007bff' }}>Hesabınız yok mu? Yeni kayıt oluşturun</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default LoginScreen;