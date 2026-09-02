import { ThemeToggle } from "@/components/ThemeToggle";
import { Greeting } from "@/features/dashboard/components/Greeting";
import { HabitsPreview } from "@/features/dashboard/components/HabitsPreview";
import { QuickAddButton } from "@/features/dashboard/components/QuickAddButton";
import { TasksPreview } from "@/features/dashboard/components/TaskPreview";
import { useAppTheme } from "@/theme/theme";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
export default function HomeScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.top}>
          <Greeting />
          <ThemeToggle />
        </View>
        <View style={[styles.hero, { backgroundColor: colors.primarySoft }]}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>
            TODAY'S FOCUS
          </Text>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            Small steps, steady rhythm.
          </Text>
          <Text style={[styles.heroCopy, { color: colors.textMuted }]}>
            Choose what matters and make a little progress.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Today's tasks
          </Text>
          <TasksPreview />
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Today's habits
          </Text>
          <HabitsPreview />
        </View>
      </ScrollView>
      <QuickAddButton onPress={() => router.push("../tasks/new")} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 22, paddingTop: 58, paddingBottom: 140 },
  top: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  hero: { marginTop: 10, borderRadius: 24, padding: 22, marginBottom: 30 },
  eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  heroTitle: { fontSize: 25, lineHeight: 31, fontWeight: "700", marginTop: 12 },
  heroCopy: { fontSize: 14, lineHeight: 21, marginTop: 8, maxWidth: 290 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
});
