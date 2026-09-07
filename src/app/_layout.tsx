import { ThemeProvider, useAppTheme } from "@/theme/theme";
import * as Notifications from "expo-notifications";
import { type Href, Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

function useNotificationNavigation() {
  useEffect(() => {
    const openNotification = (notification: Notifications.Notification) => {
      const url = notification.request.content.data?.url;

      if (typeof url === "string" && /^\/habits\/[^/]+$/.test(url)) {
        router.push(url as Href);
      }
    };

    const lastResponse = Notifications.getLastNotificationResponse();
    if (lastResponse) {
      openNotification(lastResponse.notification);
      Notifications.clearLastNotificationResponse();
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => openNotification(response.notification),
    );

    return () => subscription.remove();
  }, []);
}
export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedNavigation />
    </ThemeProvider>
  );
}
function ThemedNavigation() {
  useNotificationNavigation();
  const { mode, colors } = useAppTheme();
  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="tasks/new" options={{ title: "New Task" }} />
        <Stack.Screen name="tasks/[id]" options={{ title: "Task" }} />
        <Stack.Screen name="habits/new" options={{ title: "New Habit" }} />
        <Stack.Screen name="habits/[id]" options={{ title: "Habit" }} />
      </Stack>
    </>
  );
}
