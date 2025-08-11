import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuthStatus, useCurrentUser } from './hooks/useAuth';
import MainLayout from './Layout/MainLayout/MainLayout';
import Login from './pages/login/Login';
import { queryClient } from './lib/queryClient';
import { RBACProvider } from './components/RBAC/RBACProvider';
import './App.css';

function AppContent() {
  const { data: isAuthenticated, isLoading } = useAuthStatus();
  const { data: user } = useCurrentUser();

  console.log('🚀 App render - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'user:', user);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ADCGMIS...</p>
        </div>
      </div>
    );
  }

  return (
    <RBACProvider>
      {isAuthenticated ? (
        <MainLayout />
      ) : (
        <Login />
      )}
    </RBACProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
