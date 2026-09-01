import { useTaskStore } from "@/features/tasks/stores/task.store";
import { Tabs } from "expo-router";
import { useEffect } from "react";

export default function TabsLayout() {
  const loadTasks = useTaskStore((state) => state.loadTasks);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
        }}
      />

      <Tabs.Screen
        name="habits"
        options={{
          title: "Habits",
        }}
      />
    </Tabs>
  );
}
