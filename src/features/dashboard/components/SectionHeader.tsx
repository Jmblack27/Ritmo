import { StyleSheet, Text, View } from "react-native";

type SectionHeaderProps = {
  title: string;
  action?: string;
};

export function SectionHeader({
  title,
  action = "See all",
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.action}>{action}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#181818",
  },

  action: {
    fontSize: 14,
    fontWeight: "600",
    color: "#777777",
  },
});
