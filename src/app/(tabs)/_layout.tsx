import { useHabitStore } from "@/features/habits/stores/habit.store";
import { useTaskStore } from "@/features/tasks/stores/task.store";
import { useAppTheme } from "@/theme/theme";
import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const loadHabits = useHabitStore((state) => state.loadHabits);
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadTasks();
    loadHabits();
  }, [loadHabits, loadTasks]);

  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64 + bottomPadding,
          paddingTop: 4,
          paddingBottom: bottomPadding,
          elevation: 0,
        },
        tabBarItemStyle: styles.tabItem,
        tabBarIconStyle: styles.icon,
        tabBarLabelStyle: styles.label,
      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <SymbolView name={{ ios: focused ? "house.fill" : "house", android: "home" }} size={25} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, focused }) => (
            <SymbolView name={{ ios: focused ? "checklist.checked" : "checklist", android: focused ? "task_alt" : "checklist" }} size={25} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: "Habits",
          tabBarIcon: ({ color, focused }) => (
            <SymbolView name={{ ios: focused ? "repeat.circle.fill" : "repeat.circle", android: focused ? "routine" : "event_repeat" }} size={25} tintColor={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: { paddingVertical: 2 },
  icon: { transform: [{ translateY: -2 }] },
  label: { fontSize: 11, fontWeight: "600", marginTop: 2 },
});
