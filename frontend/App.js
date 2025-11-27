import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavegacao from './src/navigation/AppNavegacao';

export default function App() {
  return (
    <AuthProvider>
      <AppNavegacao />
    </AuthProvider>
  );
}
