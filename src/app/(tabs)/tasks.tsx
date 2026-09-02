import { useTaskStore } from "@/features/tasks/stores/task.store";
import { useAppTheme } from "@/theme/theme";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
export default function TasksScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { tasks, isLoading, error, deleteTask, toggleTask } = useTaskStore();
  if (isLoading)
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  if (error)
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.danger }}>{error.message}</Text>
      </View>
    );
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Tasks</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Create task"
          style={[styles.add, { backgroundColor: colors.primary }]}
          onPress={() => router.push("../tasks/new")}
        >
          <Text style={[styles.plus, { color: colors.onPrimary }]}>+</Text>
        </Pressable>
      </View>
      {!tasks.length ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>✓</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Nothing on your list
          </Text>
          <Text style={[styles.emptyCopy, { color: colors.textMuted }]}>
            Make space for what matters today.
          </Text>
          <Pressable
            style={[styles.create, { backgroundColor: colors.primary }]}
            onPress={() => router.push("../tasks/new")}
          >
            <Text style={{ color: colors.onPrimary, fontWeight: "700" }}>
              Create task
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.task,
                { backgroundColor: colors.surface, borderColor: colors.border },
                pressed && styles.pressed,
              ]}
              onPress={() => router.push(`../tasks/${item.id}`)}
            >
              <Pressable
                accessibilityLabel={
                  item.completed ? "Mark incomplete" : "Mark complete"
                }
                style={[
                  styles.checkbox,
                  { borderColor: colors.border },
                  item.completed && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => toggleTask(item.id)}
              >
                {item.completed && (
                  <Text style={{ color: colors.onPrimary, fontWeight: "800" }}>
                    ✓
                  </Text>
                )}
              </Pressable>
              <View style={styles.taskContent}>
                <Text
                  style={[
                    styles.taskTitle,
                    { color: colors.text },
                    item.completed && styles.done,
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={[styles.priority, { color: colors.textMuted }]}>
                  Medium priority
                </Text>
              </View>
              <Pressable hitSlop={10} onPress={() => deleteTask(item.id)}>
                <Text style={[styles.delete, { color: colors.danger }]}>
                  Delete
                </Text>
              </Pressable>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 58 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: { fontSize: 32, fontWeight: "700" },
  subtitle: { marginTop: 4 },
  add: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  plus: { fontSize: 28, marginTop: -2 },
  list: { gap: 10, paddingBottom: 30 },
  task: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderRadius: 17,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: "600" },
  priority: { marginTop: 4, fontSize: 12 },
  done: { textDecorationLine: "line-through", opacity: 0.5 },
  delete: { fontSize: 12, fontWeight: "600" },
  pressed: { opacity: 0.7 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  emptyIcon: { fontSize: 32, marginBottom: 14 },
  emptyTitle: { fontSize: 21, fontWeight: "700" },
  emptyCopy: { marginTop: 8, marginBottom: 22 },
  create: { paddingHorizontal: 20, paddingVertical: 13, borderRadius: 12 },
});
