import type { Weekday } from "../types/habits.types";

const JS_WEEKDAYS: readonly Weekday[] = [
  "sun", "mon", "tue", "wed", "thu", "fri", "sat",
];

export function isScheduledToday(days: Weekday[], date = new Date()) {
  return days.includes(JS_WEEKDAYS[date.getDay()]);
}
