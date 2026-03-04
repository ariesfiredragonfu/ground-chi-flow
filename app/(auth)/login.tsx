/**
 * Login / Signup screen
 *
 * Toggles between sign-in and sign-up modes.
 * Uses Firebase Auth via AuthContext (email + password).
 *
 * For production:
 *  - Add Google/Apple OAuth using expo-auth-session
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors';
import { HERO_BANNER } from '../../constants/DisclaimerResources';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const { signIn, signUp, loading, error, clearError, resetPassword, skipAuth } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    clearError();

    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        Alert.alert('Password Mismatch', 'Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        Alert.alert('Weak Password', 'Password must be at least 6 characters.');
        return;
      }
      await signUp(email.trim(), password);
    } else {
      await signIn(email.trim(), password);
    }
  };

  const toggleMode = () => {
    clearError();
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    setPassword('');
    setConfirmPassword('');
  };

  const handleForgotPassword = async () => {
    clearError();
    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      Alert.alert(
        'Enter your email',
        'Type your email address in the box above, then tap Forgot password? again.'
      );
      return;
    }
    try {
      await resetPassword(emailTrimmed);
      Alert.alert(
        'Check your email',
        'If an account exists for that address, we sent a link to reset your password. Check your inbox and spam folder.'
      );
    } catch {
      // Error already set in context
    }
  };

  const handleSkip = () => {
    clearError();
    skipAuth();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo / Brand */}
          <View style={styles.brandRow}>
            <Ionicons name="leaf-outline" size={40} color={Colors.primary} />
            <Text style={styles.brandName}>GroundChiFlow</Text>
          </View>
          <Text style={styles.tagline}>
            {HERO_BANNER.headline}
          </Text>
          <Text style={styles.taglineSub}>
            Nervous system · Breathwork · Gut · Nutrition · Longevity
          </Text>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </Text>

            {/* Skip for now — top of card so always visible on web */}
            <TouchableOpacity onPress={handleSkip} style={styles.skipRow}>
              <Text style={styles.skipText}>Skip for now</Text>
              <Text style={styles.skipSub}>Use the app without signing in. Data stays on this device.</Text>
            </TouchableOpacity>

            {/* Error message */}
            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Confirm password (signup only) */}
            {mode === 'signup' && (
              <>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="lock-closed-outline" size={18} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={Colors.textMuted}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                  />
                </View>
              </>
            )}

            {/* Submit button */}
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.btnText}>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Forgot password (login only) */}
            {mode === 'login' && (
              <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotRow}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            {/* Toggle mode */}
            <TouchableOpacity onPress={toggleMode} style={styles.toggleRow}>
              <Text style={styles.toggleText}>
                {mode === 'login'
                  ? "Don't have an account? "
                  : 'Already have an account? '}
                <Text style={styles.toggleLink}>
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            Your data stays private. 🔒
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    textAlign: 'center',
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  taglineSub: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 32,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3D1515',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    gap: 6,
  },
  errorText: { color: Colors.error, fontSize: 13, flex: 1 },
  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCardLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  forgotRow: { marginTop: 12, alignItems: 'center' },
  forgotText: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
  toggleRow: { marginTop: 16, alignItems: 'center' },
  toggleText: { color: Colors.textSecondary, fontSize: 14 },
  toggleLink: { color: Colors.primary, fontWeight: '700' },
  skipRow: { marginTop: 24, alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: Colors.border, borderRadius: 12 },
  skipText: { color: Colors.primary, fontSize: 16, fontWeight: '700' },
  skipSub: { color: Colors.textSecondary, fontSize: 12, marginTop: 4, textAlign: 'center' },
  footer: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 24,
  },
});
