import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';

// Veritabanından gelecek müşteri verisinin tipini (Interface) tanımlıyoruz
interface Customer {
    id: number;
    companyName: string;
    city: string;
    totalDebt: number;
}

const CustomerScreen: React.FC = () => {
    // TypeScript'e bu state'in bir Customer dizisi tutacağını söylüyoruz
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
        api.get<Customer[]>('/customers')
            .then(response => {
                setCustomers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Veri çekme hatası:", error);
                setLoading(false);
                // HATAYI EKRANA BASALIM:
                Alert.alert("Bağlantı Hatası", `Backend'e erişilemedi: ${error.message}`);
            });
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Demir Çelik Müşteri Listesi</Text>
            <FlatList
                data={customers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.companyName}>{item.companyName}</Text>
                        <Text style={styles.text}>Şehir: {item.city}</Text>
                        <Text style={styles.debt}>Toplam Borç: {item.totalDebt} USD</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, elevation: 2 },
    companyName: { fontSize: 18, fontWeight: 'bold', color: '#007bff' },
    text: { color: '#555', marginTop: 2 },
    debt: { fontWeight: 'bold', marginTop: 5, color: '#dc3545' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});



export default CustomerScreen;

