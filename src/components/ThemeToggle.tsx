import { useAppTheme } from "@/theme/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";
export function ThemeToggle() {
  const { mode, colors, toggleMode } = useAppTheme();
  const isDark = mode === "dark";
  return (
    <Pressable
      accessibilityLabel={`Switch to ${isDark ? "light" : "dark"} mode`}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      onPress={toggleMode}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.icon}>{isDark ? "☾" : "☀"}</Text>
      <View>
        <Text style={[styles.label, { color: colors.textMuted }]}>
          Appearance
        </Text>
        <Text style={[styles.mode, { color: colors.text }]}>
          {isDark ? "Dark" : "Light"}
        </Text>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderRadius: 16,
  },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  icon: { fontSize: 20 },
  label: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  mode: { marginTop: 1, fontSize: 13, fontWeight: "700" },
});
