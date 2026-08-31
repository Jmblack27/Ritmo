import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTasks } from "../../features/tasks/hooks/useTasks";

type Priority = "low" | "medium" | "high";

export default function TaskDetailScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  const { tasks, isLoading, updateTask, toggleTask, deleteTask } = useTasks();

  const task = tasks.find((item) => item.id === id);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setPriority(task.priority);
    }
  }, [task]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFoundTitle}>Task not found</Text>

        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const handleSave = async () => {
    if (!title.trim() || isSaving) {
      return;
    }

    try {
      setIsSaving(true);

      await updateTask(task.id, {
        title: title.trim(),
        priority,
      });

      router.back();
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async () => {
    await toggleTask(task);
  };

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);

      await deleteTask(task.id);

      router.back();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Task",
        }}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Edit task</Text>

        <Pressable onPress={handleToggle}>
          <Text style={styles.completeButton}>
            {task.completed ? "Mark incomplete" : "Complete"}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Title</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholder="Task title"
      />

      <Text style={styles.label}>Priority</Text>

      <View style={styles.priorityContainer}>
        {(["low", "medium", "high"] as const).map((value) => (
          <Pressable
            key={value}
            style={[
              styles.priorityButton,
              priority === value && styles.priorityButtonSelected,
            ]}
            onPress={() => setPriority(value)}
          >
            <Text style={styles.priorityText}>{value}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[
            styles.saveButton,
            (!title.trim() || isSaving) && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={!title.trim() || isSaving}
        >
          <Text style={styles.buttonText}>
            {isSaving ? "Saving..." : "Save changes"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={isDeleting}
        >
          <Text style={styles.deleteText}>
            {isDeleting ? "Deleting..." : "Delete task"}
          </Text>
        </Pressable>
      </View>
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
    padding: 20,
  },

  notFoundTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
  },

  completeButton: {
    fontSize: 14,
    fontWeight: "600",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 24,
  },

  priorityContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 32,
  },

  priorityButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
  },

  priorityButtonSelected: {
    opacity: 0.6,
  },

  priorityText: {
    textTransform: "capitalize",
  },

  actions: {
    gap: 12,
  },

  saveButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.4,
  },

  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  deleteButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  deleteText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
