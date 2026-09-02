import { useAppTheme } from "@/theme/theme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
export function QuickAddButton({ onPress }: { onPress: () => void }) {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity
      accessibilityLabel="Create task"
      style={[
        styles.button,
        { backgroundColor: colors.primary, shadowColor: colors.shadow },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.icon, { color: colors.onPrimary }]}>+</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 24,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 7,
  },
  icon: { fontSize: 31, fontWeight: "300", marginTop: -3 },
});
