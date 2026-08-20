import { StyleSheet, Text, View } from "react-native";

export type HabitPreviewData = {
  id: string;
  title: string;
  completed: boolean;
  streak: number;
};

type HabitPreviewProps = {
  habit: HabitPreviewData;
};

export function HabitPreview({ habit }: HabitPreviewProps) {
  return (
    <View style={styles.container}>
      <View
        style={[styles.checkbox, habit.completed && styles.checkboxCompleted]}
      >
        {habit.completed && <Text style={styles.check}>✓</Text>}
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, habit.completed && styles.completedTitle]}>
          {habit.title}
        </Text>

        <Text style={styles.streak}>🔥 {habit.streak} day streak</Text>
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

  streak: {
    marginTop: 4,

    fontSize: 12,
    color: "#999999",
  },
});
