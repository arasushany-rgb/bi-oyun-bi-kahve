import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

// Public Screens
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import PlayAreaScreen from '../screens/PlayAreaScreen';
import CafeScreen from '../screens/CafeScreen';
import WorkshopsScreen from '../screens/WorkshopsScreen';
import BirthdayScreen from '../screens/BirthdayScreen';
import ReservationFormScreen from '../screens/ReservationFormScreen';
import WomensWorkshopScreen from '../screens/WomensWorkshopScreen';
import WomensWorkshopReservationScreen from '../screens/WomensWorkshopReservationScreen';

// Customer Screens
import CustomerProfileScreen from '../screens/Customer/CustomerProfileScreen';
import PurchasePackageScreen from '../screens/Customer/PurchasePackageScreen';
import WorkshopReservationScreen from '../screens/Customer/WorkshopReservationScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import AdminSettingsScreen from '../screens/Admin/AdminSettingsScreen';
import CustomerDetailScreen from '../screens/Admin/CustomerDetailScreen';
import LiveEditorScreen from '../screens/Admin/LiveEditorScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? (user.role === 'admin' ? 'AdminDashboard' : 'CustomerProfile') : 'Splash'}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFFDE7' },
        }}
      >
        {/* Auth Screens - Her zaman erişilebilir */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Public Screens - Her zaman erişilebilir */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PlayArea" component={PlayAreaScreen} />
        <Stack.Screen name="Cafe" component={CafeScreen} />
        <Stack.Screen name="Workshops" component={WorkshopsScreen} />
        <Stack.Screen name="WomensWorkshop" component={WomensWorkshopScreen} />
        <Stack.Screen name="WomensWorkshopReservation" component={WomensWorkshopReservationScreen} />
        <Stack.Screen name="Birthday" component={BirthdayScreen} />
        <Stack.Screen name="ReservationForm" component={ReservationFormScreen} />

        {/* Customer Screens */}
        {user && user.role === 'customer' && (
          <>
            <Stack.Screen name="CustomerProfile" component={CustomerProfileScreen} />
            <Stack.Screen name="PurchasePackage" component={PurchasePackageScreen} />
            <Stack.Screen name="WorkshopReservation" component={WorkshopReservationScreen} />
          </>
        )}

        {/* Admin Screens */}
        {user && user.role === 'admin' && (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} />
            <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} />
            <Stack.Screen name="LiveEditor" component={LiveEditorScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
