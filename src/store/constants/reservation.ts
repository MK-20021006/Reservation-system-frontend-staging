export const weekdays = [
  {
    name: "sunday",
    weekday: 0,
  },
  {
    name: "monday",
    weekday: 1,
  },
  {
    name: "tuesday",
    weekday: 2,
  },
  {
    name: "wednesday",
    weekday: 3,
  },
  {
    name: "thursday",
    weekday: 4,
  },
  {
    name: "friday",
    weekday: 5,
  },
  {
    name: "saturday",
    weekday: 6,
  },
];

/**
 * Type will compare with display on calendar, not compare with current time
 */
export enum TypeTime {
  previous = "previous",
  current = "current",
  next = "next",
  previousMonth = "previousMonth",
  currentMonth = "currentMonth",
  nextMonth = "nextMonth",
  previousWeek = "previousWeek",
  currentWeek = "currentWeek",
  nextWeek = "nextWeek",
}

export enum Appearance {
  list = "list",
  calendar = "calendar",
}

export enum ViewMode {
  monthly = "monthly",
  weekly = "weekly",
  daily = "daily",
}

export enum CalendarReservationStatus {
  empty = 0,
  almost = 1,
  full = 2,
  NotWorking = 3,
}
