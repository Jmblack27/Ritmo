import { formatCurrentDate } from "@/lib/dates";
import { StyleSheet, Text, View } from "react-native";

type GreetingProps = {
  name: string;
};

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function Greeting() {
  const greeting = getGreeting();
  const date = formatCurrentDate();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{greeting}, Jose 👋</Text>

      <Text style={styles.date}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#181818",
  },

  date: {
    marginTop: 6,
    fontSize: 15,
    color: "#777777",
  },
});
