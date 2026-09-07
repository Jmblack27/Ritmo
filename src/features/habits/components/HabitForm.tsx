import { useAppTheme } from "@/theme/theme";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { Weekday } from "../types/habits.types";
import { WEEKDAYS } from "../types/habits.types";

type HabitFormProps = {
  name: string;
  description: string;
  scheduleDays: Weekday[];
  scheduleTime: string;
  submitLabel: string;
  busy: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onScheduleDaysChange: (value: Weekday[]) => void;
  onScheduleTimeChange: (value: string) => void;
  onSubmit: () => void;
};

const dayLabels: Record<Weekday, string> = {
  mon: "M",
  tue: "T",
  wed: "W",
  thu: "T",
  fri: "F",
  sat: "S",
  sun: "S",
};

const hourOptions = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0"),
);
const minuteOptions = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0"),
);

export function HabitForm({
  name,
  description,
  scheduleDays,
  scheduleTime,
  submitLabel,
  busy,
  onNameChange,
  onDescriptionChange,
  onScheduleDaysChange,
  onScheduleTimeChange,
  onSubmit,
}: HabitFormProps) {
  const { colors } = useAppTheme();
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [draftHour, setDraftHour] = useState("08");
  const [draftMinute, setDraftMinute] = useState("00");
  const disabled = !name.trim() || !scheduleDays.length || busy;

  const toggleDay = (day: Weekday) => {
    const next = scheduleDays.includes(day)
      ? scheduleDays.filter((value) => value !== day)
      : WEEKDAYS.filter((value) => [...scheduleDays, day].includes(value));
    onScheduleDaysChange(next);
  };

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
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      />

      <Text style={[styles.label, { color: colors.text }]}>
        Optional description
      </Text>
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
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      />

      <Text style={[styles.label, { color: colors.text }]}>Days</Text>
      <Text style={[styles.hint, { color: colors.textMuted }]}>
        Choose at least one day
      </Text>
      <View style={styles.days}>
        {WEEKDAYS.map((day) => {
          const selected = scheduleDays.includes(day);
          return (
            <Pressable
              key={day}
              accessibilityLabel={
                {
                  mon: "Monday",
                  tue: "Tuesday",
                  wed: "Wednesday",
                  thu: "Thursday",
                  fri: "Friday",
                  sat: "Saturday",
                  sun: "Sunday",
                }[day]
              }
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              onPress={() => toggleDay(day)}
              style={[
                styles.day,
                {
                  backgroundColor: selected
                    ? colors.primarySoft
                    : colors.surface,
                  borderColor: selected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={{
                  color: selected ? colors.primary : colors.textMuted,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                {dayLabels[day]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.label, { color: colors.text }]}>Time</Text>
      <Text style={[styles.notificationHint, { color: colors.textMuted }]}>
        You’ll get a reminder 10 minutes before and an alert at this time.
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Scheduled time ${scheduleTime}`}
        onPress={() => {
          const [hour, minute] = scheduleTime.split(":");
          setDraftHour(hourOptions.includes(hour) ? hour : "08");
          setDraftMinute(minuteOptions.includes(minute) ? minute : "00");
          setTimePickerOpen(true);
        }}
        style={[
          styles.timeButton,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={styles.clock}>◷</Text>
        <Text style={[styles.timeText, { color: colors.text }]}>
          {scheduleTime}
        </Text>
        <Text style={{ color: colors.primary, fontWeight: "700" }}>Change</Text>
      </Pressable>

      <Modal
        visible={timePickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setTimePickerOpen(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setTimePickerOpen(false)}
        >
          <Pressable
            style={[styles.timeSheet, { backgroundColor: colors.surface }]}
            onPress={(event) => event.stopPropagation()}
          >
            <Text style={[styles.timeTitle, { color: colors.text }]}>
              Choose a time
            </Text>
            <Text style={[styles.timePreview, { color: colors.text }]}>
              {draftHour}:{draftMinute}
            </Text>
            <View style={styles.timeColumns}>
              {[
                {
                  label: "Hour",
                  options: hourOptions,
                  value: draftHour,
                  onChange: setDraftHour,
                },
                {
                  label: "Minute",
                  options: minuteOptions,
                  value: draftMinute,
                  onChange: setDraftMinute,
                },
              ].map(({ label, options, value, onChange }) => (
                <View key={label} style={styles.timeColumn}>
                  <Text
                    style={[
                      styles.timeColumnLabel,
                      { color: colors.textMuted },
                    ]}
                  >
                    {label}
                  </Text>
                  <FlatList
                    data={options}
                    extraData={value}
                    keyExtractor={(item) => item}
                    initialScrollIndex={Math.max(0, options.indexOf(value) - 2)}
                    getItemLayout={(_, index) => ({
                      length: 52,
                      offset: 52 * index,
                      index,
                    })}
                    renderItem={({ item }) => {
                      const selected = item === value;
                      return (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`${label} ${item}`}
                          accessibilityState={{ selected }}
                          onPress={() => onChange(item)}
                          style={[
                            styles.timeOption,
                            {
                              backgroundColor: selected
                                ? colors.primarySoft
                                : colors.surface,
                              borderColor: selected
                                ? colors.primary
                                : colors.border,
                            },
                          ]}
                        >
                          <Text
                            style={{
                              color: selected ? colors.primary : colors.text,
                              fontWeight: "600",
                            }}
                          >
                            {item}
                          </Text>
                        </Pressable>
                      );
                    }}
                  />
                </View>
              ))}
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                onScheduleTimeChange(`${draftHour}:${draftMinute}`);
                setTimePickerOpen(false);
              }}
              style={[styles.submit, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.submitText, { color: colors.onPrimary }]}>
                Confirm time
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setTimePickerOpen(false)}
              style={styles.cancel}
            >
              <Text style={{ color: colors.primary, fontWeight: "700" }}>
                Cancel
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

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
  input: {
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    marginBottom: 24,
  },
  description: { minHeight: 94 },
  hint: { fontSize: 12, marginTop: -4, marginBottom: 12 },
  days: { flexDirection: "row", gap: 7, marginBottom: 24 },
  day: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
  },
  notificationHint: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: -3,
    marginBottom: 11,
  },
  timeButton: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  clock: { fontSize: 24 },
  timeText: { flex: 1, fontSize: 18, fontWeight: "700" },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  timeSheet: { maxHeight: "72%", borderRadius: 22, padding: 18 },
  timeTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  timePreview: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  timeColumns: {
    flexDirection: "row",
    gap: 16,
    height: 260,
    flexShrink: 1,
    marginBottom: 16,
  },
  timeColumn: { flex: 1 },
  timeColumnLabel: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  timeOption: {
    height: 44,
    margin: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
  },
  cancel: { alignItems: "center", paddingTop: 16, paddingBottom: 4 },
  submit: { alignItems: "center", paddingVertical: 16, borderRadius: 15 },
  submitText: { fontSize: 16, fontWeight: "700" },
  disabled: { opacity: 0.4 },
});
