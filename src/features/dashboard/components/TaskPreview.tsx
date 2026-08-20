import { StyleSheet, Text, View } from "react-native";

export type TaskPreviewData = {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
};

type TaskPreviewProps = {
  task: TaskPreviewData;
};

export function TaskPreview({ task }: TaskPreviewProps) {
  return (
    <View style={styles.container}>
      <View
        style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
      >
        {task.completed && <Text style={styles.check}>✓</Text>}
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.completedTitle]}>
          {task.title}
        </Text>

        <Text style={styles.priority}>{task.priority}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderRadius: 14,

    padding: 16,

    marginBottom: 8,
  },

  checkbox: {
    width: 22,
    height: 22,

    borderRadius: 11,

    borderWidth: 1.5,
    borderColor: "#CCCCCC",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  checkboxCompleted: {
    backgroundColor: "#181818",
    borderColor: "#181818",
  },

  check: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    color: "#222222",
  },

  completedTitle: {
    color: "#999999",
    textDecorationLine: "line-through",
  },

  priority: {
    marginTop: 4,

    fontSize: 12,
    color: "#999999",

    textTransform: "capitalize",
  },
});
