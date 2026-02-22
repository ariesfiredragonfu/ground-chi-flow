/**
 * Auth group layout — simple stack navigator for Login/Signup.
 * Screens in this group are only visible to unauthenticated users.
 */

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
    </Stack>
  );
}
