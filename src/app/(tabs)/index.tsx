import { ScrollView, StyleSheet, View } from "react-native";

import { Greeting } from "@/features/dashboard/components/Greeting";
import { HabitPreview } from "@/features/dashboard/components/HabitPreview";
import { ProgressCard } from "@/features/dashboard/components/ProgressCard";
import { QuickAddButton } from "@/features/dashboard/components/QuickAddButton";
import { SectionHeader } from "@/features/dashboard/components/SectionHeader";
import { TaskPreview } from "@/features/dashboard/components/TaskPreview";

import type { HabitPreviewData } from "@/features/dashboard/components/HabitPreview";
import type { TaskPreviewData } from "@/features/dashboard/components/TaskPreview";

const tasks: TaskPreviewData[] = [
  {
    id: "task-1",
    title: "Study TypeScript",
    completed: false,
    priority: "high",
  },
  {
    id: "task-2",
    title: "Go to the gym",
    completed: false,
    priority: "medium",
  },
  {
    id: "task-3",
    title: "Work on Ritmo",
    completed: false,
    priority: "high",
  },
];

const habits: HabitPreviewData[] = [
  {
    id: "habit-1",
    title: "English",
    completed: true,
    streak: 12,
  },
  {
    id: "habit-2",
    title: "Exercise",
    completed: true,
    streak: 7,
  },
  {
    id: "habit-3",
    title: "Reading",
    completed: false,
    streak: 4,
  },
];

export default function HomeScreen() {
  const completedTasks = tasks.filter((task) => task.completed).length;

  const completedHabits = habits.filter((habit) => habit.completed).length;

  const totalItems = tasks.length + habits.length;

  const completedItems = completedTasks + completedHabits;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Greeting />

        <ProgressCard completed={completedItems} total={totalItems} />

        <View style={styles.section}>
          <SectionHeader title="Today's Tasks" />

          {tasks.map((task) => (
            <TaskPreview key={task.id} task={task} />
          ))}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Today's Habits" />

          {habits.map((habit) => (
            <HabitPreview key={habit.id} habit={habit} />
          ))}
        </View>
      </ScrollView>

      <QuickAddButton
        onPress={() => {
          console.log("Quick add");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F5",
  },

  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 140,
  },

  section: {
    marginBottom: 28,
  },
});
