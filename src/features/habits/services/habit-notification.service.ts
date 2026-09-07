import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { Habit, Weekday } from "../types/habits.types";

const CHANNEL_ID = "habit-reminders-system-v4";
const REMINDER_MINUTES = 10;

const expoWeekdays: Record<Weekday, number> = {
  sun: 1,
  mon: 2,
  tue: 3,
  wed: 4,
  thu: 5,
  fri: 6,
  sat: 7,
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function ensurePermission(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Habit reminders",
      description: "Reminders for your scheduled habits",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 180, 250],
      lightColor: "#236B4A",
    });
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

function parseTime(value: string): { hour: number; minute: number } {
  const [hour, minute] = value.split(":").map(Number);
  return { hour, minute };
}

function reminderTrigger(day: Weekday, time: string) {
  const { hour, minute } = parseTime(time);
  const totalMinutes = hour * 60 + minute - REMINDER_MINUTES;
  const wrapsToPreviousDay = totalMinutes < 0;
  const normalizedMinutes = (totalMinutes + 24 * 60) % (24 * 60);
  let weekday = expoWeekdays[day];

  if (wrapsToPreviousDay) {
    weekday = weekday === 1 ? 7 : weekday - 1;
  }

  return {
    type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
    weekday,
    hour: Math.floor(normalizedMinutes / 60),
    minute: normalizedMinutes % 60,
    channelId: CHANNEL_ID,
  } as const;
}

function scheduledTrigger(day: Weekday, time: string) {
  const { hour, minute } = parseTime(time);
  return {
    type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
    weekday: expoWeekdays[day],
    hour,
    minute,
    channelId: CHANNEL_ID,
  } as const;
}

export async function cancelHabitNotifications(habitId: string): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const matches = scheduled.filter(
    (notification) => notification.content.data?.habitId === habitId,
  );
  await Promise.all(
    matches.map((notification) =>
      Notifications.cancelScheduledNotificationAsync(notification.identifier),
    ),
  );
}

export async function scheduleHabitNotifications(habit: Habit): Promise<boolean> {
  await cancelHabitNotifications(habit.id);

  if (!(await ensurePermission())) return false;

  for (const day of habit.scheduleDays) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${habit.name} starts in 10 minutes`,
        body: "Get ready to keep your rhythm going.",
        sound: "default",
        data: {
          habitId: habit.id,
          kind: "habit-reminder",
          url: `/habits/${habit.id}`,
        },
      },
      trigger: reminderTrigger(day, habit.scheduleTime),
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time for ${habit.name}`,
        body: habit.description || "A small action now keeps your streak alive.",
        sound: "default",
        data: {
          habitId: habit.id,
          kind: "habit-start",
          url: `/habits/${habit.id}`,
        },
      },
      trigger: scheduledTrigger(day, habit.scheduleTime),
    });
  }

  return true;
}
