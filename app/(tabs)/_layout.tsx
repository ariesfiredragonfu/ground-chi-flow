/**
 * Tab navigator layout — tabs at the TOP to avoid Android nav/back button.
 * Uses Material Top Tabs so the tab bar is above the content and above phone software buttons.
 */

import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import type { ParamListBase, TabNavigationState } from '@react-navigation/native';
import type { MaterialTopTabNavigationEventMap } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
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
  );
}
