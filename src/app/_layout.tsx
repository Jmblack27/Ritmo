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

const styles = {
  center: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "600" as const,
    marginBottom: 10,
  },

  error: {
    marginTop: 10,
    textAlign: "center" as const,
  },
};
