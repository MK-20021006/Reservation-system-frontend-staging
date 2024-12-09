import { defineStore } from "pinia";
import moment, { Moment } from "moment";

import { DATE_FORMAT, TIME_FORMAT } from "~/../../src/shared/constants/index";
import { ViewMode, Appearance } from "../constants";
import {
  DayCalendar,
  ReservationRestaurant,
  ReservationSalon,
  ReservationEvent,
  ReservationEventDay,
  ReservationDevice,
  ReservationDeviceDay,
} from "~/../../src/store/models/reservation";
import { getCurrentTimeBooking } from "~/../../src/shared/utils/date";

type ReservationState = {
  appearance: Appearance;
  appearanceDevice: Appearance;
  calendar: {
    /**
     * activeTime: string | format: YYYY-MM-DD
     */
    activeTime: string;
    /**
     * targetTime: string | format: HH:mm
     */
    targetTime: string;
    /**
     * targetTimeDevice: string | format: HH:mm
     */
    targetTimeDevice: string;
    /**
     * listEvent: array | format: []
     */
    eventId: number;
    deviceId: number;
    isCallingApi: boolean;
    isCallingApiDevice: boolean;
    listEvent: any[];
    listDevice: any[];
    eventCurrent: any[];
    deviceCurrent: any[];
    status: {
      booking: { day: string; value: number }[];
      canChangeActiveTime: boolean;
    };
    statusEvent: {
      booking: { day: string; value: number }[];
      canChangeActiveTime: boolean;
    };
    statusDevice: {
      booking: { day: string; value: number }[];
      canChangeActiveTime: boolean;
    };
    viewMode: ViewMode;
    viewModeDevice: ViewMode;
    daysDisplayOnCalendar: {
      monthly: DayCalendar[];
      weekly: DayCalendar[];
      daily: DayCalendar[];
    };
    crawlSite: number | null;
  };
  reservationRestaurant: ReservationRestaurant[];
  reservationSalon: ReservationSalon[];
  reservationDevice: ReservationDevice[];
  reservationDeviceDay: ReservationDeviceDay[];
  reservationEvent: ReservationEvent[];
  reservationEventDay: ReservationEventDay[];
};

export const useReservation = defineStore("reservation", {
  state: () =>
    ({
      appearance: Appearance.calendar,
      appearanceDevice: Appearance.calendar,
      calendar: {
        activeTime: moment().format(DATE_FORMAT),
        targetTime: getCurrentTimeBooking(),
        targetTimeDevice: getCurrentTimeBooking(),
        eventId: 0,
        deviceId: 0,
        isCallingApi: false,
        isCallingApiDevice: false,
        listEvent: [],
        listDevice: [],
        eventCurrent: [],
        deviceCurrent: [],
        status: {
          booking: [],
          canChangeActiveTime: true,
        },
        statusEvent: {
          booking: [],
          canChangeActiveTime: true,
        },
        statusDevice: {
          booking: [],
          canChangeActiveTime: true,
        },
        viewMode: ViewMode.monthly,
        viewModeDevice: ViewMode.monthly,
        daysDisplayOnCalendar: {
          monthly: [],
          weekly: [],
          daily: [],
        },
        crawlSite: null,
      },
      reservationRestaurant: [],
      reservationSalon: [],
      reservationDevice: [],
      reservationDeviceDay: [],
      reservationEvent: [],
      reservationEventDay: [],
    } as ReservationState),
  getters: {
    getActiveTime: (state: ReservationState) => state.calendar.activeTime,
    getTargetTime: (state: ReservationState) => state.calendar.targetTime,
    getTargetTimeDevice: (state: ReservationState) =>
      state.calendar.targetTimeDevice,
    getIsCallingApiEvent: (state: ReservationState) =>
      state.calendar.isCallingApi,
    getIsCallingApiDevice: (state: ReservationState) =>
      state.calendar.isCallingApiDevice,
    getIsCallingApi: (state: ReservationState) => state.calendar.isCallingApi,
    getEventId: (state: ReservationState) => state.calendar.eventId,
    getDeviceId: (state: ReservationState) => state.calendar.deviceId,
    getCurrentEvent: (state: ReservationState) => state.calendar.eventCurrent,
    getCurrentDevice: (state: ReservationState) => state.calendar.deviceCurrent,
    getListEvent: (state: ReservationState) => state.calendar.listEvent,
    getListDevice: (state: ReservationState) => state.calendar.listDevice,
    getStatusBooking: (state: ReservationState) =>
      state.calendar.status.booking,
    getStatusBookingEvent: (state: ReservationState) =>
      state.calendar.statusEvent.booking,
    getStatusBookingDevice: (state: ReservationState) =>
      state.calendar.statusDevice.booking,
    getCanChangeActiveTime: (state: ReservationState) =>
      state.calendar.statusEvent.canChangeActiveTime,
    getAppearance: (state: ReservationState) => state.appearance,
    getAppearanceDevice: (state: ReservationState) => state.appearanceDevice,
    getViewMode: (state: ReservationState) => state.calendar.viewMode,
    getViewModeDevice: (state: ReservationState) =>
      state.calendar.viewModeDevice,
    getDaysDisplayOnCalendar:
      (state: ReservationState) => (viewMode?: ViewMode) => {
        const viewModeCondition = viewMode || state.calendar.viewMode;
        if (viewModeCondition === ViewMode.monthly) {
          return state.calendar.daysDisplayOnCalendar.monthly;
        } else if (viewModeCondition === ViewMode.weekly) {
          return state.calendar.daysDisplayOnCalendar.weekly;
        } else if (viewModeCondition === ViewMode.daily) {
          return state.calendar.daysDisplayOnCalendar.daily;
        }
      },
    getReservationSalon: (state: ReservationState) => (day?: Moment) => {
      if (day) {
        return state.reservationSalon.filter((item) =>
          moment(item.start_time).isSame(day, "D")
        );
      } else {
        return state.reservationSalon;
      }
    },
    getReservationRestaurant: (state: ReservationState) => (day?: Moment) => {
      if (day) {
        return state.reservationRestaurant.filter((item) =>
          moment(item.start_time).isSame(day, "D")
        );
      } else {
        return state.reservationRestaurant;
      }
    },
    getReservationEvent: (state: ReservationState) => (day?: Moment) => {
      if (day) {
        return state.reservationEvent.filter((item) => {
          return moment(item.event_time?.date, "YYYY-MM-DD HH:mm:ss").isSame(
            day,
            "D"
          );
        });
      } else {
        return state.reservationEvent;
      }
    },
    getReservationEventDay: (state: ReservationState) => (day?: Moment) => {
      if (day) {
        return state.reservationEventDay.filter((item) => {
          return moment(item.date, "YYYY-MM-DD").isSame(
            day.format("YYYY-MM-DD")
          );
        });
      } else {
        return state.reservationEventDay;
      }
    },
    getReservationDeviceDay: (state: ReservationState) => (day?: Moment) => {
      if (day) {
        return state.reservationDeviceDay.filter((item) => {
          return moment(item.start, "YYYY-MM-DD").isSame(
            day.format("YYYY-MM-DD")
          );
        });
      } else {
        return state.reservationDeviceDay;
      }
    },
    getReservationRestaurantByDayAndSeat:
      (state: ReservationState) => (day: Moment, seatId: number) => {
        return state.reservationRestaurant.filter(
          (item) =>
            moment(item.start_time).isSame(day, "D") && item.seat_id === seatId
        );
      },
    getReservationEventByDayAndEvent:
      (state: ReservationState) => (day: Moment) => {
        return state.reservationEvent.filter((item) => {
          return moment(item.event_time?.date, "YYYY-MM-DD HH:mm:ss").isSame(
            day,
            "D"
          );
        });
      },
    getReservationEventByDailyAndEvent:
      (state: ReservationState) => (day: Moment) => {
        return state.reservationEventDay.filter((item) => {
          return moment(item.date, "YYYY-MM-DD").isSame(
            day.format("YYYY-MM-DD")
          );
        });
      },
    getReservationDeviceByDailyAndDevice:
      (state: ReservationState) => (day: Moment) => {
        return state.reservationDeviceDay.filter((item) => {
          return moment(item.start, "YYYY-MM-DD").isSame(
            day.format("YYYY-MM-DD")
          );
        });
      },
    getReservationByDayAndStaff:
      (state: ReservationState) => (day: Moment, staffId: number) => {
        return state.reservationSalon.filter(
          (item) =>
            moment(item.start_time).isSame(day, "D") &&
            item.staff_id === staffId
        );
      },
    countTotalRestaurant: (state: ReservationState) => (day: Moment) => {
      let reservationCount = 0;
      let peopleCount = 0;
      state.reservationRestaurant.forEach((item) => {
        if (moment(item.start_time).isSame(day, "D")) {
          reservationCount++;
          peopleCount =
            peopleCount +
            item.reservation?.detail?.number_adult +
            item.reservation?.detail?.number_children;
        }
      });
      return {
        reservationCount,
        peopleCount,
      };
    },
    countTotalSalon: (state: ReservationState) => (day: Moment) => {
      let reservationCount = 0;
      let peopleCount = 0;
      state.reservationSalon.forEach((item) => {
        if (moment(item.start_time).isSame(day, "D")) {
          reservationCount++;
          peopleCount += Number(item.reservation?.detail?.number_people);
        }
      });
      return {
        reservationCount,
        peopleCount,
      };
    },
    countTotalEvent: (state: ReservationState) => (day: Moment) => {
      let reservationCount = 0;
      let peopleCount = 0;
      state.reservationEvent.forEach((item) => {
        const totalPeople =
          Number(item.detail?.number_adult) +
          Number(item.detail?.number_children);
        if (
          moment(item.event_time?.date, "YYYY-MM-DD HH:mm:ss").isSame(day, "D")
        ) {
          reservationCount++;
          peopleCount += totalPeople;
        }
      });
      return {
        reservationCount,
        peopleCount,
      };
    },
    countTotalDevice: (state: ReservationState) => (day: Moment) => {
      let reservationCount = 0;
      let peopleCount = 0;
      state.reservationDevice.forEach((item) => {
        if (moment(item.end, "YYYY-MM-DD HH:mm:ss").isSame(day, "D")) {
          reservationCount++;
          peopleCount++;
        }
      });
      return {
        reservationCount,
        peopleCount,
      };
    },
    getCrawlSite: (state: ReservationState) => state.calendar.crawlSite,
  },
  actions: {
    /**
     *
     * @param date date with type = "YYYY-MM-DD"
     */
    setActiveTime(date = moment().format(DATE_FORMAT)) {
      this.calendar.activeTime = date;
    },
    /**
     *
     * @param time time with type = "HH:mm"
     */
    setTargetTime(time = moment().format(TIME_FORMAT)) {
      this.calendar.targetTime = time;
    },
    setTargetTimeDevice(time = moment().format(TIME_FORMAT)) {
      this.calendar.targetTimeDevice = time;
    },
    setIsCallingApiEvent(value: boolean) {
      this.calendar.isCallingApi = value;
    },
    setIsCallingApiDevice(value: boolean) {
      this.calendar.isCallingApiDevice = value;
    },
    setIsCallingApi(value: boolean) {
      this.calendar.isCallingApi = value;
    },
    setAppearance(value = Appearance.list): void {
      this.appearance = value;
    },
    setAppearanceDevice(value = Appearance.list): void {
      this.appearanceDevice = value;
    },
    setViewMode(viewMode = ViewMode.monthly): void {
      this.calendar.viewMode = viewMode;
    },
    setViewModeDevice(viewMode = ViewMode.monthly): void {
      this.calendar.viewModeDevice = viewMode;
    },
    setStatusBooking(data: { day: string; value: number }[]): void {
      this.calendar.status.booking = data;
    },
    setStatusBookingDevice(data: { day: string; value: number }[]): void {
      this.calendar.statusDevice.booking = data;
    },
    setStatusBookingEvent(data: { day: string; value: number }[]): void {
      this.calendar.statusEvent.booking = data;
    },
    setListEvent(data: any): void {
      this.calendar.listEvent = data;
    },
    setListDevice(data: any): void {
      this.calendar.listDevice = data;
    },
    setCanChangeActiveTime(value: boolean): void {
      this.calendar.status.canChangeActiveTime = value;
    },
    setCurrentEvent(data: any): void {
      this.calendar.eventCurrent = data;
    },
    setCurrentDevice(data: any): void {
      this.calendar.deviceCurrent = data;
    },
    setEventId(value: number): void {
      this.calendar.eventId = value;
    },
    setDeviceId(value: number): void {
      this.calendar.deviceId = value;
    },
    resetDaysDisplayOnCalendar(viewMode?: ViewMode): void {
      const viewModeCondition =
        viewMode || this.calendar.viewMode || this.calendar.viewModeDevice;
      if (viewModeCondition === ViewMode.monthly) {
        this.calendar.daysDisplayOnCalendar.monthly = [];
      } else if (viewModeCondition === ViewMode.weekly) {
        this.calendar.daysDisplayOnCalendar.weekly = [];
      } else if (viewModeCondition === ViewMode.daily) {
        this.calendar.daysDisplayOnCalendar.daily = [];
      }
    },
    pushDaysDisplayOnCalendar(item: DayCalendar, viewMode?: ViewMode): void {
      const viewModeCondition =
        viewMode || this.calendar.viewMode || this.calendar.viewModeDevice;

      if (viewModeCondition === ViewMode.monthly) {
        this.calendar.daysDisplayOnCalendar.monthly.push(item);
      } else if (viewModeCondition === ViewMode.weekly) {
        this.calendar.daysDisplayOnCalendar.weekly.push(item);
      } else if (viewModeCondition === ViewMode.daily) {
        this.calendar.daysDisplayOnCalendar.daily.push(item);
      }
    },
    unshiftDaysDisplayOnCalendar(item: DayCalendar, viewMode?: ViewMode): void {
      const viewModeCondition =
        viewMode || this.calendar.viewMode || this.calendar.viewModeDevice;

      if (viewModeCondition === ViewMode.monthly) {
        this.calendar.daysDisplayOnCalendar.monthly.unshift(item);
      } else if (viewModeCondition === ViewMode.weekly) {
        this.calendar.daysDisplayOnCalendar.weekly.unshift(item);
      } else if (viewModeCondition === ViewMode.daily) {
        this.calendar.daysDisplayOnCalendar.daily.unshift(item);
      }
    },
    setReservationRestaurant(data: ReservationRestaurant[]) {
      this.reservationRestaurant = data;
    },
    setReservationSalon(data: ReservationSalon[]) {
      this.reservationSalon = data;
    },
    setReservationDevice(data: ReservationDevice[]) {
      this.reservationDevice = data;
    },
    setReservationEvent(data: ReservationEvent[]) {
      this.reservationEvent = data;
    },
    setReservationEventDay(data: ReservationEventDay[]) {
      this.reservationEventDay = data;
    },
    setReservationDeviceDay(data: ReservationEventDay[]) {
      this.reservationDeviceDay = data;
    },
    pushReservationRestaurant(value: ReservationRestaurant) {
      if (
        this.reservationRestaurant.length <= 0 ||
        !this.reservationRestaurant.some(
          (item: ReservationRestaurant) =>
            item.id === value.id &&
            item.start_time === value.start_time &&
            item.end_time === value.end_time
        )
      ) {
        this.reservationRestaurant.push(value);
      }
    },
    pushReservationSalon(value: ReservationSalon) {
      if (
        this.reservationSalon.length <= 0 ||
        !this.reservationSalon.some(
          (item: ReservationSalon) =>
            item.id === value.id &&
            item.start_time === value.start_time &&
            item.end_time === value.end_time
        )
      ) {
        this.reservationSalon.push(value);
      }
    },
    getDateRanger() {
      const formatDate = "YYYY-MM-DD HH:mm:ss";
      switch (this.calendar.viewMode) {
        case ViewMode.monthly:
          return [
            moment(this.calendar.activeTime)
              .startOf("month")
              .format(formatDate),
            moment(this.calendar.activeTime).endOf("month").format(formatDate),
          ];
        case ViewMode.weekly:
          return [
            moment(this.calendar.activeTime).startOf("week").format(formatDate),
            moment(this.calendar.activeTime).endOf("week").format(formatDate),
          ];
        case ViewMode.daily:
          return [
            moment(this.calendar.activeTime).startOf("day").format(formatDate),
            moment(this.calendar.activeTime).endOf("day").format(formatDate),
          ];
        default:
          return ["", ""];
      }
    },
    setCrawlSite(value: number) {
      this.calendar.crawlSite = value;
    },
  },
});
