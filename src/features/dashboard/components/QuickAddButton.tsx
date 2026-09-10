import { useAppTheme } from "@/theme/theme";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type QuickAddButtonProps = {
  onCreateTask: () => void;
  onCreateHabit: () => void;
};
export function QuickAddButton({
  onCreateTask,
  onCreateHabit,
}: QuickAddButtonProps) {
  const [open, setOpen] = useState(false);
  const select = (action: () => void) => {
    setOpen(false);
    action();
  };
  const { colors } = useAppTheme();
  return (
    <>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Create task or habit"
        accessibilityState={{ expanded: open }}
        style={[
          styles.button,
          { backgroundColor: colors.primary, shadowColor: colors.shadow },
        ]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.icon, { color: colors.onPrimary }]}>+</Text>
      </TouchableOpacity>
      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setOpen(false)}
            accessibilityRole="button"
            accessibilityLabel="Close create menu"
          />
          <View
            style={[
              styles.menu,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            accessibilityViewIsModal
          >
            <Text
              accessibilityRole="header"
              style={[styles.title, { color: colors.text }]}
            >
              What would you like to add?
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => select(onCreateTask)}
              style={[styles.option, { backgroundColor: colors.primarySoft }]}
            >
              <Text style={[styles.optionTitle, { color: colors.primary }]}>
                Create task
              </Text>
              <Text style={[styles.description, { color: colors.textMuted }]}>
                Something you need to get done.
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => select(onCreateHabit)}
              style={[styles.option, { backgroundColor: colors.primarySoft }]}
            >
              <Text style={[styles.optionTitle, { color: colors.primary }]}>
                Create habit
              </Text>
              <Text style={[styles.description, { color: colors.textMuted }]}>
                A routine you want to repeat.
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setOpen(false)}
              style={styles.cancel}
            >
              <Text style={[styles.optionTitle, { color: colors.textMuted }]}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  menu: {
    width: "100%",
    maxWidth: 400,
    padding: 22,
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
  },
  title: { fontSize: 21, fontWeight: "700", marginBottom: 6 },
  option: { padding: 16, borderRadius: 15, gap: 5 },
  optionTitle: { fontSize: 16, fontWeight: "700" },
  description: { fontSize: 14, lineHeight: 20 },
  cancel: { minHeight: 44, alignItems: "center", justifyContent: "center" },
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
