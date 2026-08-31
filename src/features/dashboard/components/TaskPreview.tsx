import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTasks } from "../../tasks/hooks/useTasks";

export function TasksPreview() {
  const router = useRouter();

  const { tasks, isLoading, error } = useTasks();
  console.log("TasksPreview tasks:", tasks);
  console.log("error tasks:", error);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading tasks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Unable to load tasks.</Text>
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tasks</Text>

        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No tasks yet</Text>

          <Text style={styles.emptyDescription}>
            Create your first task and start organizing your day.
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => router.push("../tasks/new")}
          >
            <Text style={styles.buttonText}>Create task</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>

        <Pressable onPress={() => router.push("../(tabs)/tasks")}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        {tasks.slice(0, 3).map((task) => (
          <View key={task.id} style={styles.task}>
            <View
              style={[
                styles.checkbox,
                task.completed && styles.checkboxCompleted,
              ]}
            />

            <Text
              style={[styles.taskTitle, task.completed && styles.taskCompleted]}
            >
              {task.title}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  seeAll: {
    fontSize: 14,
    fontWeight: "600",
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderRadius: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },

  emptyDescription: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
  },

  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  buttonText: {
    fontWeight: "600",
  },

  loading: {
    fontSize: 14,
  },

  error: {
    fontSize: 14,
  },

  list: {
    gap: 10,
  },

  task: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 6,
    marginRight: 12,
  },

  checkboxCompleted: {
    opacity: 0.5,
  },

  taskTitle: {
    fontSize: 16,
  },

  taskCompleted: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
});
