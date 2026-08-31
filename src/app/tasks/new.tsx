import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useTasks } from "../../features/tasks/hooks/useTasks";

export default function NewTaskScreen() {
  const router = useRouter();

  const { createTask } = useTasks();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || isSaving) {
      return;
    }

    try {
      setIsSaving(true);

      await createTask({
        title,
        completed: false,
        priority,
      });

      router.back();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New task</Text>

      <Text style={styles.label}>Title</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="What do you need to do?"
        style={styles.input}
        autoFocus
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

      <Pressable
        style={[
          styles.createButton,
          (!title.trim() || isSaving) && styles.createButtonDisabled,
        ]}
        onPress={handleCreate}
        disabled={!title.trim() || isSaving}
      >
        <Text style={styles.createButtonText}>
          {isSaving ? "Creating..." : "Create task"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 32,
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
    marginBottom: 24,
    fontSize: 16,
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

  createButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  createButtonDisabled: {
    opacity: 0.4,
  },

  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
