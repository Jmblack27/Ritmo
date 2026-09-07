import { isScheduledToday } from "@/features/habits/lib/schedule";
import { useHabitStore } from "@/features/habits/stores/habit.store";
import { useAppTheme } from "@/theme/theme";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function HabitsPreview() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { habits, isLoading, error, toggleHabit } = useHabitStore();
  const todaysHabits = habits
    .filter((habit) => isScheduledToday(habit.scheduleDays))
    .sort((first, second) => {
      if (first.completedToday !== second.completedToday) {
        return Number(first.completedToday) - Number(second.completedToday);
      }

      return first.scheduleTime.localeCompare(second.scheduleTime);
    });

  if (isLoading || error) {
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={{ color: error ? colors.danger : colors.textMuted }}>
          {error ? "Unable to load habits." : "Loading habits…"}
        </Text>
      </View>
    );
  }

  if (!habits.length) {
    return (
      <Pressable
        onPress={() => router.push("../habits/new")}
        style={[
          styles.card,
          styles.empty,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          Start a new rhythm
        </Text>
        <Text style={[styles.emptyCopy, { color: colors.textMuted }]}>
          Create a small habit you can repeat.
        </Text>
        <Text style={{ color: colors.primary, fontWeight: "700" }}>
          Create habit
        </Text>
      </Pressable>
    );
  }

  if (!todaysHabits.length) {
    return (
      <View
        style={[
          styles.card,
          styles.empty,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          All clear today
        </Text>
        <Text style={[styles.emptyCopy, { color: colors.textMuted }]}>
          No habits are scheduled for today.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {todaysHabits.map((habit) => (
        <Pressable
          key={habit.id}
          onPress={() => router.push(`../habits/${habit.id}`)}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        >
          <Pressable
            onPress={() => toggleHabit(habit.id)}
            style={[
              styles.check,
              { borderColor: colors.border },
              habit.completedToday && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
          >
            {habit.completedToday && (
              <Text style={{ color: colors.onPrimary, fontWeight: "800" }}>
                ✓
              </Text>
            )}
          </Pressable>
          <View style={styles.content}>
            <Text
              numberOfLines={1}
              style={[
                styles.name,
                { color: colors.text },
                habit.completedToday && styles.done,
              ]}
            >
              {habit.name}
            </Text>
            <Text style={[styles.streak, { color: colors.textMuted }]}>
              {habit.scheduleTime} · 🔥 {habit.streak}{" "}
              {habit.streak === 1 ? "day" : "days"}
            </Text>
          </View>
          <Text style={{ color: colors.textMuted }}>›</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 20, padding: 8 },
  empty: { alignItems: "center", padding: 25 },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptyCopy: {
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 14,
  },
  row: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  check: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: { flex: 1 },
  name: { fontSize: 16 },
  streak: { fontSize: 11, marginTop: 3 },
  done: { textDecorationLine: "line-through", opacity: 0.5 },
  pressed: { opacity: 0.6 },
});
