import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="tasks/new"
        options={{
          title: "New Task",
        }}
      />

      <Stack.Screen
        name="tasks/[id]"
        options={{
          title: "Task",
        }}
      />

      <Stack.Screen
        name="habits/new"
        options={{
          title: "New Habit",
        }}
      />

      <Stack.Screen
        name="habits/[id]"
        options={{
          title: "Habit",
        }}
      />
    </Stack>
  );
}
