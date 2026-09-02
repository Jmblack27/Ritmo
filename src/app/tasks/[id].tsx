import { useTaskStore } from "@/features/tasks/stores/task.store";
import { useAppTheme } from "@/theme/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
type Priority = "low" | "medium" | "high";
export default function TaskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useAppTheme();
  const { tasks, isLoading, updateTask, toggleTask, deleteTask } =
    useTaskStore();
  const task = tasks.find((item) => item.id === id);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (task) setTitle(task.title);
  }, [task]);
  if (isLoading)
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  if (!task)
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFound, { color: colors.text }]}>
          Task not found
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.primary, fontWeight: "700" }}>
            Go back
          </Text>
        </Pressable>
      </View>
    );
  const run = async (action: () => Promise<unknown>, goBack = false) => {
    if (busy) return;
    try {
      setBusy(true);
      await action();
      if (goBack) router.back();
    } finally {
      setBusy(false);
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.heading}>
        <View>
          <Text style={[styles.kicker, { color: colors.primary }]}>
            TASK DETAILS
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>
            Fine-tune your task
          </Text>
        </View>
        <Pressable
          style={[
            styles.status,
            {
              backgroundColor: task.completed
                ? colors.primarySoft
                : colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() => run(() => toggleTask(task.id))}
        >
          <Text
            style={{
              color: task.completed ? colors.primary : colors.textMuted,
              fontWeight: "700",
            }}
          >
            {task.completed ? "Completed" : "Mark done"}
          </Text>
        </Pressable>
      </View>
      <Text style={[styles.label, { color: colors.text }]}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
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
        disabled={!title.trim() || busy}
        onPress={() =>
          run(() => updateTask(task.id, { title: title.trim() }), true)
        }
        style={[
          styles.save,
          { backgroundColor: colors.primary },
          (!title.trim() || busy) && styles.disabled,
        ]}
      >
        <Text
          style={{ color: colors.onPrimary, fontSize: 16, fontWeight: "700" }}
        >
          {busy ? "Working…" : "Save changes"}
        </Text>
      </Pressable>
      <Pressable
        disabled={busy}
        onPress={() => run(() => deleteTask(task.id), true)}
        style={[styles.delete, { backgroundColor: colors.dangerSoft }]}
      >
        <Text style={{ color: colors.danger, fontWeight: "700" }}>
          Delete task
        </Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, paddingTop: 28 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 18 },
  notFound: { fontSize: 21, fontWeight: "700" },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 34,
    gap: 10,
  },
  kicker: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  title: { fontSize: 25, fontWeight: "700", marginTop: 8 },
  status: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 12,
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
  save: { alignItems: "center", paddingVertical: 16, borderRadius: 15 },
  delete: {
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 12,
  },
  disabled: { opacity: 0.4 },
});
