import { ThemeToggle } from "@/components/ThemeToggle";
import { Greeting } from "@/features/dashboard/components/Greeting";
import { HabitsPreview } from "@/features/dashboard/components/HabitsPreview";
import { QuickAddButton } from "@/features/dashboard/components/QuickAddButton";
import { TasksPreview } from "@/features/dashboard/components/TaskPreview";
import { MotivationalQuoteBanner } from "@/features/motivational-quotes/components/MotivationalQuoteBanner";
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
        <MotivationalQuoteBanner />
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
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
});
