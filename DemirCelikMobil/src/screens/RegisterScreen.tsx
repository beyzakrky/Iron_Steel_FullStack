import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../services/api';

const RegisterScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('INTERN'); // Varsayılan stajyer

  const handleRegister = async () => {
    try {
      const response = await api.post('/auth/register', { username, email, password, role });
      if (response.data.error) {
        Alert.alert("Hata", response.data.error);
      } else {
        Alert.alert("Başarılı", "Kayıt oldunuz! Giriş ekranına yönlendiriliyorsunuz.");
        navigation.navigate('LoginScreen');
      }
    } catch (error) {
  console.error(error); // error değişkenini burada kullanarak uyarıyı siliyoruz
  Alert.alert("Hata", "Backend sunucusuna bağlanılamadı.");
}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yeni Satış Temsilcisi Kaydı</Text>
      <TextInput style={styles.input} placeholder="Ad Soyad" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="E-posta" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Şifre" secureTextEntry value={password} onChangeText={setPassword} />
      
      <Text style={styles.label}>Rol Seçimi (Test Amaçlı):</Text>
      <View style={styles.roleContainer}>
        {['DIRECTOR', 'SALES_REP', 'INTERN'].map((r) => (
          <TouchableOpacity key={r} style={[styles.roleButton, role === r && styles.roleActive]} onPress={() => setRole(r)}>
            <Text style={{ color: role === r ? '#fff' : '#333' }}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Hesap Oluştur</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 25, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 15 },
  label: { fontWeight: 'bold', marginBottom: 10 },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  roleButton: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, flex: 1, alignItems: 'center', marginHorizontal: 2 },
  roleActive: { backgroundColor: '#007bff', borderColor: '#007bff' },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default RegisterScreen;