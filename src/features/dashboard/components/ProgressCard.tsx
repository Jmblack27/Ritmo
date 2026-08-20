import { StyleSheet, Text, View } from "react-native";

type ProgressCardProps = {
  completed: number;
  total: number;
};

export function ProgressCard({ completed, total }: ProgressCardProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Today's progress</Text>

      <Text style={styles.percentage}>{percentage}%</Text>

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progress,
            {
              width: `${percentage}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.description}>
        {completed} of {total} completed
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555555",
  },

  percentage: {
    marginTop: 12,
    fontSize: 42,
    fontWeight: "700",
    color: "#181818",
  },

  progressBackground: {
    height: 8,
    marginTop: 12,

    backgroundColor: "#E8E8E5",

    borderRadius: 4,
    overflow: "hidden",
  },

  progress: {
    height: "100%",

    backgroundColor: "#181818",

    borderRadius: 4,
  },

  description: {
    marginTop: 10,

    fontSize: 14,
    color: "#777777",
  },
});
