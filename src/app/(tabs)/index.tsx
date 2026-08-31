import { ScrollView, StyleSheet, View } from "react-native";

import { Greeting } from "@/features/dashboard/components/Greeting";
import { QuickAddButton } from "@/features/dashboard/components/QuickAddButton";
import { SectionHeader } from "@/features/dashboard/components/SectionHeader";
import { TasksPreview } from "@/features/dashboard/components/TaskPreview";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Greeting />

        {/* <ProgressCard completed={completedItems} total={totalItems} /> */}

        <View style={styles.section}>
          <SectionHeader title="Today's Tasks" />
          <TasksPreview />
        </View>

        {/* <View style={styles.section}>
          <SectionHeader title="Today's Habits" />

          {habits.map((habit) => (
            <HabitPreview key={habit.id} habit={habit} />
          ))}
        </View> */}
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
