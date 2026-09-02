import { formatCurrentDate } from "@/lib/dates";
import { useAppTheme } from "@/theme/theme";
import { StyleSheet, Text, View } from "react-native";
function getGreeting() {
  const hour = new Date().getHours();
  return hour < 12
    ? "Good morning"
    : hour < 18
      ? "Good afternoon"
      : "Good evening";
}
export function Greeting() {
  const { colors } = useAppTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.greeting, { color: colors.text }]}>
        {getGreeting()}, Jose
      </Text>
      <Text style={[styles.date, { color: colors.textMuted }]}>
        {formatCurrentDate()}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: 24 },
  greeting: { fontSize: 27, fontWeight: "700" },
  date: { marginTop: 6, fontSize: 14 },
});
