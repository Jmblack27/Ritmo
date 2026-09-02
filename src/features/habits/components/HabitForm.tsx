import { useAppTheme } from "@/theme/theme";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { HabitFrequency } from "../types/habits.types";

type HabitFormProps = {
  name: string;
  description: string;
  frequency: HabitFrequency;
  submitLabel: string;
  busy: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onFrequencyChange: (value: HabitFrequency) => void;
  onSubmit: () => void;
};

const frequencies: { value: HabitFrequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
];

export function HabitForm({
  name,
  description,
  frequency,
  submitLabel,
  busy,
  onNameChange,
  onDescriptionChange,
  onFrequencyChange,
  onSubmit,
}: HabitFormProps) {
  const { colors } = useAppTheme();
  const disabled = !name.trim() || busy;

  return (
    <>
      <Text style={[styles.label, { color: colors.text }]}>Name</Text>
      <TextInput
        value={name}
        onChangeText={onNameChange}
        placeholder="e.g. Drink water"
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.primary}
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      />

      <Text style={[styles.label, { color: colors.text }]}>Optional description</Text>
      <TextInput
        value={description}
        onChangeText={onDescriptionChange}
        placeholder="Add a note or a goal"
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.primary}
        multiline
        textAlignVertical="top"
        style={[
          styles.input,
          styles.description,
          { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      />

      <Text style={[styles.label, { color: colors.text }]}>Frequency</Text>
      <View style={styles.frequencies}>
        {frequencies.map((item) => {
          const selected = frequency === item.value;
          return (
            <Pressable
              key={item.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onFrequencyChange(item.value)}
              style={[
                styles.frequency,
                {
                  backgroundColor: selected ? colors.primarySoft : colors.surface,
                  borderColor: selected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={{ color: selected ? colors.primary : colors.textMuted, fontWeight: "600", textAlign: "center" }}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onSubmit}
        style={[
          styles.submit,
          { backgroundColor: colors.primary },
          disabled && styles.disabled,
        ]}
      >
        <Text style={[styles.submitText, { color: colors.onPrimary }]}>
          {busy ? "Saving…" : submitLabel}
        </Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: "700", marginBottom: 9 },
  input: { borderWidth: 1, borderRadius: 15, paddingHorizontal: 16, paddingVertical: 15, fontSize: 16, marginBottom: 24 },
  description: { minHeight: 94 },
  frequencies: { flexDirection: "row", gap: 8, marginBottom: 32 },
  frequency: { flex: 1, minHeight: 48, paddingHorizontal: 8, alignItems: "center", justifyContent: "center", borderWidth: 1, borderRadius: 12 },
  submit: { alignItems: "center", paddingVertical: 16, borderRadius: 15 },
  submitText: { fontSize: 16, fontWeight: "700" },
  disabled: { opacity: 0.4 },
});
