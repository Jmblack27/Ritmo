import { useTaskStore } from "@/features/tasks/stores/task.store";
import { useAppTheme } from "@/theme/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
export default function NewTaskScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const createTask = useTaskStore((state) => state.createTask);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    if (!title.trim() || saving) return;
    try {
      setSaving(true);
      await createTask({ title: title.trim() });
      router.back();
    } finally {
      setSaving(false);
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.kicker, { color: colors.primary }]}>
        PLAN YOUR NEXT MOVE
      </Text>
      <Text style={[styles.title, { color: colors.text }]}>
        What needs your attention?
      </Text>
      <Text style={[styles.label, { color: colors.text }]}>Task title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Finish the project brief"
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.primary}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        autoFocus
      />
      <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
      <View style={styles.priorities}>
        {(["low", "medium", "high"] as const).map((value) => (
          <Pressable
            key={value}
            onPress={() => setPriority(value)}
            style={[
              styles.priority,
              {
                backgroundColor:
                  priority === value ? colors.primarySoft : colors.surface,
                borderColor:
                  priority === value ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={{
                color: priority === value ? colors.primary : colors.textMuted,
                fontWeight: "600",
                textTransform: "capitalize",
              }}
            >
              {value}
            </Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        disabled={!title.trim() || saving}
        onPress={submit}
        style={[
          styles.button,
          { backgroundColor: colors.primary },
          (!title.trim() || saving) && styles.disabled,
        ]}
      >
        <Text style={[styles.buttonText, { color: colors.onPrimary }]}>
          {saving ? "Creating…" : "Create task"}
        </Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, paddingTop: 32 },
  kicker: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  title: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 34,
  },
  label: { fontSize: 14, fontWeight: "700", marginBottom: 9 },
  input: {
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    marginBottom: 26,
  },
  priorities: { flexDirection: "row", gap: 9, marginBottom: 34 },
  priority: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  button: { alignItems: "center", paddingVertical: 16, borderRadius: 15 },
  buttonText: { fontSize: 16, fontWeight: "700" },
  disabled: { opacity: 0.4 },
});
