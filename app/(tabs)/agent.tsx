/**
 * In-app health agent tab.
 * Chat UI: user asks about natural health, diet, exercise, meditation, herbs, or app navigation.
 * Uses Grok bridge so API key stays server-side. System prompt: constants/AgentPrompt.ts.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { sendToAgent, isBridgeConfigured } from '../../lib/grokBridge';
import type { ChatMessage } from '../../lib/grokBridge';
import { HEALTH_AGENT_SYSTEM_PROMPT } from '../../constants/AgentPrompt';
import { Colors } from '../../constants/Colors';

type MessageRow = { id: string; role: 'user' | 'assistant'; content: string };

export default function AgentScreen() {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const bridgeOk = isBridgeConfigured();

  useEffect(() => {
    if (messages.length) {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setError(null);

    const userRow: MessageRow = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, userRow]);

    if (!bridgeOk) {
      setError('Agent is not configured. Set EXPO_PUBLIC_GROK_BRIDGE_URL in .env (e.g. https://grok.howell-forge.com).');
      return;
    }

    setLoading(true);

    try {
      const chatHistory: ChatMessage[] = [
        { role: 'system', content: HEALTH_AGENT_SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: text },
      ];

      const reply = await sendToAgent(chatHistory);

      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: 'assistant', content: reply },
      ]);
    } catch (e: unknown) {
      const raw = e instanceof Error ? e.message : 'Something went wrong.';
      const isNetwork =
        typeof raw === 'string' &&
        (raw.toLowerCase().includes('network') ||
          raw.toLowerCase().includes('failed to fetch') ||
          raw.toLowerCase().includes('connection') ||
          raw.toLowerCase().includes('timeout'));
      setError(
        isNetwork
          ? "Can't reach the Coach right now. The app talks to your Grok bridge — on a phone, use the same WiFi as the computer running the bridge, or try the web version of the app. For lab results, use the Blood Work tab → \"Paste lab results\" and paste the text from your paperwork."
          : raw
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Ionicons name="leaf" size={22} color={Colors.primary} />
            <Text style={styles.headerTitle}>Health Coach</Text>
          </View>
          <Text style={styles.headerSub}>
            Ask about diet, exercise, meditation, herbs, or how to use the app.
          </Text>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && !loading && (
            <View style={styles.welcome}>
              <Ionicons name="chatbubbles-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.welcomeTitle}>Ask anything</Text>
              <Text style={styles.welcomeText}>
                Try: “How do I log my blood work?” or “What’s a good morning routine for HRV?”
              </Text>
            </View>
          )}

          {messages.map((m) => (
            <View
              key={m.id}
              style={[styles.bubbleWrap, m.role === 'user' ? styles.bubbleWrapUser : styles.bubbleWrapAssistant]}
            >
              <View style={[styles.bubble, m.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant]}>
                <Text style={[styles.bubbleText, m.role === 'user' && styles.bubbleTextUser]}>{m.content}</Text>
              </View>
            </View>
          ))}

          {loading && (
            <View style={[styles.bubbleWrap, styles.bubbleWrapAssistant]}>
              <View style={styles.bubbleAssistant}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={[styles.bubbleText, styles.loadingText]}>Thinking…</Text>
              </View>
            </View>
          )}

          {error ? (
            <View style={styles.errorWrap}>
              <Ionicons name="alert-circle-outline" size={18} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </ScrollView>

        {/* Input row */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask about health or the app…"
            placeholderTextColor={Colors.textMuted}
            value={input}
            onChangeText={(t) => { setInput(t); setError(null); }}
            multiline
            maxLength={2000}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || loading}
          >
            <Ionicons name="send" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  flex: { flex: 1 },

  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bgCard,
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  headerSub: { fontSize: 13, color: Colors.textSecondary },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 24 },

  welcome: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  welcomeTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginTop: 16 },
  welcomeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },

  bubbleWrap: { marginBottom: 12 },
  bubbleWrapUser: { alignItems: 'flex-end' },
  bubbleWrapAssistant: { alignItems: 'flex-start' },

  bubble: {
    maxWidth: '88%',
    borderRadius: 16,
    padding: 14,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
  },
  bubbleAssistant: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bubbleText: { fontSize: 15, color: Colors.textPrimary, lineHeight: 22 },
  bubbleTextUser: { color: Colors.white },
  loadingText: { color: Colors.textSecondary, marginLeft: 4 },

  errorWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3D1515',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    gap: 8,
  },
  errorText: { flex: 1, fontSize: 13, color: Colors.error },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    backgroundColor: Colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: Colors.bgCardLight,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: { opacity: 0.5 },
});
