/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

/* import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import CustomerScreen from './src/screens/CustomerScreen';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <CustomerScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default App;
*/

import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';   
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import CustomerScreen from './src/screens/CustomerScreen';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#14171A" />   {/* ← EKLE */}
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: '#1C2126' },   // ← EKLE (isteğe bağlı, header'ı tema ile uyumlu yapar)
          headerTintColor: '#ECEFF1',                     // ← EKLE
        }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Giriş Yap' }} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ title: 'Kayıt Ol' }} />
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} options={{ title: 'Ana Panel', headerLeft: () => null }} />
        <Stack.Screen name="CustomerScreen" component={CustomerScreen} options={{ title: 'Müşteri Listesi' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;