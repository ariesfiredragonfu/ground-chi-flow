/**
 * Root layout — entry point for Expo Router.
 * Wraps the entire app in AuthProvider and handles auth-based redirects.
 *
 * Routing logic:
 *  - User not logged in  → redirect to /(auth)/login
 *  - User logged in      → show /(tabs) (the tab navigator)
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { useFonts } from 'expo-font';

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { hasError: boolean; error: Error | null };

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RootErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <View style={{ flex: 1, backgroundColor: Colors.bg, padding: 24, justifyContent: 'center' }}>
          <Text style={{ color: Colors.error, fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
            Something went wrong
          </Text>
          <Text style={{ color: Colors.textSecondary, fontSize: 14, marginBottom: 16 }}>
            {this.state.error.message}
          </Text>
          <Text style={{ color: Colors.textMuted, fontSize: 12, marginBottom: 24 }}>
            Press F12 → Console for details. Hard refresh (Ctrl+Shift+R) may help.
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: Colors.primary, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, alignSelf: 'flex-start' }}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={{ color: Colors.white, fontWeight: '700' }}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

function RootLayoutNav() {
  const { user, initializing } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Not signed in — push to login
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Signed in but on auth screens — push to app
      router.replace('/(tabs)');
    }
  }, [user, initializing, segments]);

  if (initializing) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({});

  return (
    <RootErrorBoundary>
      <AuthProvider>
        <StatusBar style="light" backgroundColor={Colors.bg} />
        <RootLayoutNav />
      </AuthProvider>
    </RootErrorBoundary>
  );
}
