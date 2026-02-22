/**
 * Root layout — entry point for Expo Router.
 * Wraps the entire app in AuthProvider and handles auth-based redirects.
 *
 * Routing logic:
 *  - User not logged in  → redirect to /(auth)/login
 *  - User logged in      → show /(tabs) (the tab navigator)
 */

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/Colors';
import { useFonts } from 'expo-font';

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Not signed in — push to login
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Signed in but on auth screens — push to app
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  if (loading) {
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
  // Load any custom fonts here if needed in the future
  const [fontsLoaded] = useFonts({});

  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor={Colors.bg} />
      <RootLayoutNav />
    </AuthProvider>
  );
}
