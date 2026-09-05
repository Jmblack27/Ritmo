import { HabitForm } from "@/features/habits/components/HabitForm";
import { useHabitStore } from "@/features/habits/stores/habit.store";
import type { Weekday } from "@/features/habits/types/habits.types";
import { WEEKDAYS } from "@/features/habits/types/habits.types";
import { useAppTheme } from "@/theme/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function NewHabitScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const createHabit = useHabitStore((state) => state.createHabit);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [scheduleDays, setScheduleDays] = useState<Weekday[]>([...WEEKDAYS]);
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!name.trim() || busy) return;
    try {
      setBusy(true);
      await createHabit({ name, description, scheduleDays, scheduleTime });
      router.back();
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.kicker, { color: colors.primary }]}>
        BUILD YOUR RHYTHM
      </Text>
      <Text style={[styles.title, { color: colors.text }]}>
        What do you want to repeat?
      </Text>
      <HabitForm
        name={name}
        description={description}
        scheduleDays={scheduleDays}
        scheduleTime={scheduleTime}
        submitLabel="Create habit"
        busy={busy}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onScheduleDaysChange={setScheduleDays}
        onScheduleTimeChange={setScheduleTime}
        onSubmit={submit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 22, paddingTop: 32, paddingBottom: 40 },
  kicker: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  title: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 34,
  },
});
