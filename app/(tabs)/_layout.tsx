/**
 * Tab navigator layout — tabs at the TOP to avoid Android nav/back button.
 * Uses Material Top Tabs so the tab bar is above the content and above phone software buttons.
 */

import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { useRouter } from 'expo-router';
import type { ParamListBase, TabNavigationState } from '@react-navigation/native';
import type { MaterialTopTabNavigationEventMap } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, PanResponder, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { Colors } from '../../constants/Colors';
import { fetchCoachTts, isBridgeConfigured } from '../../lib/grokBridge';
import { DEFAULT_COACH_VOICE_ID } from '../../constants/coachPreferences';

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const bubblePan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const greetingSoundRef = useRef<Audio.Sound | null>(null);
  const bubblePanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, g) => Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4,
      onPanResponderGrant: () => {
        bubblePan.extractOffset();
      },
      onPanResponderMove: Animated.event([null, { dx: bubblePan.x, dy: bubblePan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        bubblePan.flattenOffset();
      },
      onPanResponderTerminate: () => {
        bubblePan.flattenOffset();
      },
    })
  ).current;

  useEffect(() => {
    const GREETING_KEY = 'coach_voice_greeting_played_v1';
    let cancelled = false;
    (async () => {
      try {
        const seen = await AsyncStorage.getItem(GREETING_KEY);
        if (seen === '1' || !isBridgeConfigured()) return;

        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });
        const b64 = await fetchCoachTts(
          'Hi, welcome to GroundChiFlow. I am your coach and I am here whenever you need me.',
          DEFAULT_COACH_VOICE_ID
        );
        if (cancelled) return;
        const { sound } = await Audio.Sound.createAsync(
          { uri: `data:audio/mpeg;base64,${b64}` },
          { shouldPlay: true }
        );
        greetingSoundRef.current = sound;
        await AsyncStorage.setItem(GREETING_KEY, '1');
      } catch {
        // Non-blocking: web autoplay or network may prevent greeting.
      }
    })();

    return () => {
      cancelled = true;
      if (greetingSoundRef.current) {
        void greetingSoundRef.current.unloadAsync();
        greetingSoundRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <MaterialTopTabs
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarStyle: {
            backgroundColor: Colors.bgCard,
            borderBottomWidth: 1,
            borderBottomColor: Colors.border,
            paddingTop: Math.max(8, insets.top),
          },
          tabBarIndicatorStyle: { backgroundColor: Colors.primary, height: 3 },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600', textTransform: 'none' },
          tabBarItemStyle: { paddingHorizontal: 12 },
        }}
      >
        <MaterialTopTabs.Screen
          name="index"
          options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <Ionicons name="pulse-outline" size={18} color={color} /> }}
        />
        <MaterialTopTabs.Screen
          name="agent"
          options={{ title: 'Coach', tabBarIcon: ({ color }) => <Ionicons name="chatbubbles-outline" size={18} color={color} /> }}
        />
        <MaterialTopTabs.Screen
          name="routines"
          options={{ title: 'Routines', tabBarIcon: ({ color }) => <Ionicons name="body-outline" size={18} color={color} /> }}
        />
        <MaterialTopTabs.Screen
          name="gut-health"
          options={{ title: 'Gut Health', tabBarIcon: ({ color }) => <Ionicons name="nutrition-outline" size={18} color={color} /> }}
        />
        <MaterialTopTabs.Screen
          name="meals"
          options={{ title: 'Meals', tabBarIcon: ({ color }) => <Ionicons name="restaurant-outline" size={18} color={color} /> }}
        />
        <MaterialTopTabs.Screen
          name="blood-work"
          options={{ title: 'Blood Work', tabBarIcon: ({ color }) => <Ionicons name="flask-outline" size={18} color={color} /> }}
        />
        <MaterialTopTabs.Screen
          name="resources"
          options={{ title: 'Resources', tabBarIcon: ({ color }) => <Ionicons name="library-outline" size={18} color={color} /> }}
        />
      </MaterialTopTabs>
      <Animated.View
        style={[
          styles.coachBubbleWrap,
          { transform: [{ translateX: bubblePan.x }, { translateY: bubblePan.y }] },
        ]}
        {...bubblePanResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.coachBubble}
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/agent')}
        >
          <Ionicons name="chatbubbles" size={24} color={Colors.white} />
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  coachBubbleWrap: {
    position: 'absolute',
    right: 18,
    bottom: 22,
    zIndex: 999,
  },
  coachBubble: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${Colors.white}55`,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
