import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ImageProvider } from './src/context/ImageContext';

export default function App() {
  return (
    <AuthProvider>
      <ImageProvider>
        <AppNavigator />
        <StatusBar style="dark" />
      </ImageProvider>
    </AuthProvider>
  );
}
