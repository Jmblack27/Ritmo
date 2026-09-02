import { useHabitStore } from "@/features/habits/stores/habit.store";
import { useAppTheme } from "@/theme/theme";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const frequencyLabels = { daily: "Every day", weekdays: "Monday to Friday", weekends: "Weekends" } as const;

export default function HabitsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { habits, isLoading, error, toggleHabit } = useHabitStore();

  if (isLoading) {
    return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} /></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Habits</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {habits.length} {habits.length === 1 ? "habit" : "habits"}
          </Text>
        </View>
        <Pressable accessibilityLabel="Create habit" style={[styles.add, { backgroundColor: colors.primary }]} onPress={() => router.push("../habits/new")}>
          <Text style={[styles.plus, { color: colors.onPrimary }]}>+</Text>
        </Pressable>
      </View>

      {error && <Text style={[styles.error, { color: colors.danger, backgroundColor: colors.dangerSoft }]}>{error.message}</Text>}

      {!habits.length ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>↻</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Create your first rhythm</Text>
          <Text style={[styles.emptyCopy, { color: colors.textMuted }]}>Small habits build more intentional days.</Text>
          <Pressable style={[styles.create, { backgroundColor: colors.primary }]} onPress={() => router.push("../habits/new")}>
            <Text style={{ color: colors.onPrimary, fontWeight: "700" }}>Create habit</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`../habits/${item.id}`)}
              style={({ pressed }) => [styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}
            >
              <Pressable
                accessibilityLabel={item.completedToday ? "Unmark today’s habit" : "Complete today’s habit"}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: item.completedToday }}
                onPress={() => toggleHabit(item.id)}
                style={[styles.check, { borderColor: colors.border }, item.completedToday && { backgroundColor: colors.primary, borderColor: colors.primary }]}
              >
                {item.completedToday && <Text style={{ color: colors.onPrimary, fontWeight: "800" }}>✓</Text>}
              </Pressable>
              <View style={styles.content}>
                <Text style={[styles.habitName, { color: colors.text }, item.completedToday && styles.completed]}>{item.name}</Text>
                <Text style={[styles.meta, { color: colors.textMuted }]}>{frequencyLabels[item.frequency]} · 🔥 {item.streak} {item.streak === 1 ? "day" : "days"}</Text>
              </View>
              <Text style={{ color: colors.textMuted, fontSize: 22 }}>›</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 58 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  title: { fontSize: 32, fontWeight: "700" },
  subtitle: { marginTop: 4 },
  add: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  plus: { fontSize: 28, marginTop: -2 },
  error: { padding: 12, borderRadius: 12, marginBottom: 12, textAlign: "center" },
  list: { gap: 10, paddingBottom: 30 },
  card: { minHeight: 76, flexDirection: "row", alignItems: "center", padding: 15, borderWidth: 1, borderRadius: 17 },
  check: { width: 28, height: 28, borderWidth: 2, borderRadius: 9, alignItems: "center", justifyContent: "center", marginRight: 13 },
  content: { flex: 1 },
  habitName: { fontSize: 16, fontWeight: "600" },
  meta: { marginTop: 5, fontSize: 12 },
  completed: { textDecorationLine: "line-through", opacity: 0.55 },
  pressed: { opacity: 0.7 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, paddingBottom: 80 },
  emptyIcon: { fontSize: 38, marginBottom: 14 },
  emptyTitle: { fontSize: 21, fontWeight: "700" },
  emptyCopy: { marginTop: 8, marginBottom: 22, textAlign: "center", lineHeight: 20 },
  create: { paddingHorizontal: 20, paddingVertical: 13, borderRadius: 12 },
});
