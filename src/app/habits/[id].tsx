import { HabitForm } from "@/features/habits/components/HabitForm";
import { isScheduledToday } from "@/features/habits/lib/schedule";
import { useHabitStore } from "@/features/habits/stores/habit.store";
import type { Weekday } from "@/features/habits/types/habits.types";
import { WEEKDAYS } from "@/features/habits/types/habits.types";
import { useAppTheme } from "@/theme/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HabitDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useAppTheme();
  const { habits, isLoading, loadHabits, updateHabit, deleteHabit, toggleHabit } =
    useHabitStore();
  const habit = habits.find((item) => item.id === id);
  const scheduledToday = habit ? isScheduledToday(habit.scheduleDays) : false;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [scheduleDays, setScheduleDays] = useState<Weekday[]>([...WEEKDAYS]);
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!habit) void loadHabits();
  }, [habit, loadHabits]);

  useEffect(() => {
    if (!habit) return;
    setName(habit.name);
    setDescription(habit.description ?? "");
    setScheduleDays(habit.scheduleDays);
    setScheduleTime(habit.scheduleTime);
  }, [habit]);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!habit) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFound, { color: colors.text }]}>
          Habit not found
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.primary, fontWeight: "700" }}>
            Go back
          </Text>
        </Pressable>
      </View>
    );
  }

  const run = async (action: () => Promise<unknown>, goBack = false) => {
    if (busy) return;
    try {
      setBusy(true);
      await action();
      if (goBack) router.back();
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert("Delete habit", `Delete “${habit.name}” and all its history?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => void run(() => deleteHabit(habit.id), true),
      },
    ]);
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.heading}>
        <View style={styles.headingText}>
          <Text style={[styles.kicker, { color: colors.primary }]}>
            HABIT DETAILS
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>
            Keep your rhythm
          </Text>
        </View>
        <Pressable
          disabled={busy || !scheduledToday}
          onPress={() => run(() => toggleHabit(habit.id))}
          style={[
            styles.status,
            {
              backgroundColor: habit.completedToday
                ? colors.primarySoft
                : colors.surface,
              borderColor: habit.completedToday
                ? colors.primary
                : colors.border,
            },
          ]}
        >
          <Text
            style={{
              color: habit.completedToday ? colors.primary : colors.textMuted,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            {habit.completedToday
              ? "Done today ✓"
              : scheduledToday
                ? "Mark today"
                : "Not today"}
          </Text>
        </Pressable>
      </View>

      <View style={[styles.streak, { backgroundColor: colors.primarySoft }]}>
        <Text style={styles.flame}>🔥</Text>
        <View>
          <Text style={[styles.streakNumber, { color: colors.text }]}>
            {habit.streak} {habit.streak === 1 ? "day" : "days"}
          </Text>
          <Text style={[styles.streakLabel, { color: colors.textMuted }]}>
            Current streak
          </Text>
        </View>
      </View>

      <HabitForm
        name={name}
        description={description}
        scheduleDays={scheduleDays}
        scheduleTime={scheduleTime}
        submitLabel="Save changes"
        busy={busy}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onScheduleDaysChange={setScheduleDays}
        onScheduleTimeChange={setScheduleTime}
        onSubmit={() =>
          run(
            () =>
              updateHabit(habit.id, {
                name,
                description,
                scheduleDays,
                scheduleTime,
              }),
            true,
          )
        }
      />

      <Pressable
        disabled={busy}
        onPress={confirmDelete}
        style={[styles.delete, { backgroundColor: colors.dangerSoft }]}
      >
        <Text style={{ color: colors.danger, fontWeight: "700" }}>
          Delete habit
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 22, paddingTop: 28, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 18 },
  notFound: { fontSize: 21, fontWeight: "700" },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 22,
  },
  headingText: { flex: 1 },
  kicker: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  title: { fontSize: 25, fontWeight: "700", marginTop: 8 },
  status: {
    maxWidth: 108,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderRadius: 12,
  },
  streak: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 17,
    padding: 16,
    marginBottom: 28,
  },
  flame: { fontSize: 27 },
  streakNumber: { fontSize: 18, fontWeight: "700" },
  streakLabel: { fontSize: 12, marginTop: 2 },
  delete: {
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 12,
  },
});
