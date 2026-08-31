import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTasks } from "../../features/tasks/hooks/useTasks";

export default function TasksScreen() {
  const router = useRouter();

  const { tasks, isLoading, error, toggleTask, deleteTask } = useTasks();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Tasks</Text>

          <Text style={styles.subtitle}>
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </Text>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => router.push("../tasks/new")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No tasks yet</Text>

          <Text style={styles.emptyDescription}>
            Create a task to start organizing your day.
          </Text>

          <Pressable
            style={styles.createButton}
            onPress={() => router.push("../tasks/new")}
          >
            <Text style={styles.createButtonText}>Create task</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.task}>
              <Pressable
                style={[
                  styles.checkbox,
                  item.completed && styles.checkboxCompleted,
                ]}
                onPress={() => toggleTask(item)}
              >
                {item.completed && <Text style={styles.checkmark}>✓</Text>}
              </Pressable>

              <Pressable
                style={styles.taskContent}
                onPress={() => router.push(`../tasks/${item.id}`)}
              >
                <Text
                  style={[
                    styles.taskTitle,
                    item.completed && styles.completedTitle,
                  ]}
                >
                  {item.title}
                </Text>

                <Text style={styles.priority}>{item.priority}</Text>
              </Pressable>

              <Pressable onPress={() => deleteTask(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 4,
    opacity: 0.6,
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    fontSize: 28,
  },

  list: {
    gap: 12,
    paddingBottom: 24,
  },

  task: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  checkboxCompleted: {
    opacity: 0.6,
  },

  checkmark: {
    fontSize: 14,
    fontWeight: "700",
  },

  taskContent: {
    flex: 1,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: "500",
  },

  completedTitle: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },

  priority: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.5,
    textTransform: "capitalize",
  },

  delete: {
    fontSize: 12,
    opacity: 0.6,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
  },

  emptyDescription: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
    opacity: 0.6,
  },

  createButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  createButtonText: {
    fontWeight: "600",
  },

  error: {
    textAlign: "center",
  },
});
