import { StyleSheet, Text, TouchableOpacity } from "react-native";

type QuickAddButtonProps = {
  onPress: () => void;
};

export function QuickAddButton({ onPress }: QuickAddButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",

    right: 24,
    bottom: 90,

    width: 60,
    height: 60,

    borderRadius: 30,

    backgroundColor: "#181818",

    alignItems: "center",
    justifyContent: "center",

    elevation: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  icon: {
    color: "#FFFFFF",

    fontSize: 30,
    fontWeight: "300",

    marginTop: -3,
  },
});
