import { ref, watch } from "vue";
import { useReservation } from "../../store/useReservation";
import { TypeTime, ViewMode } from "../../constants";
import moment, { Moment } from "moment";
import {
  DayCalendar,
  ReservationRestaurant,
  ReservationSalon,
  ReservationDevice,
  ReservationEvent,
} from "~/../../src/store/models/reservation";
import { DATE_FORMAT } from "~/../../src/shared/constants";
import ReservationCalendarRequest from "../../../shared/requests/ReservationCalendarRequest";
import StoreRequest from "../../../shared/requests/StoreRequest";
import { useMeStore } from "~/../../src/shared/stores/me";
import { ReservationEventDay, ResultDataStore } from "~/../../src/store/models";
import TypeStore from "~/../../src/shared/constants/category";

const resultDataStore = ref<ResultDataStore>([]);
/**
 * Build calendar monthly
 */
export const useBuildCalendarMonthly = () => {
  const reservationStore = useReservation();
  reservationStore.resetDaysDisplayOnCalendar(ViewMode.monthly);
  const calendarType = "month";

  const firstDayCurrentMonth = moment(reservationStore.getActiveTime).startOf(
    calendarType
  );
  const lastDayCurrentMonth = moment(reservationStore.getActiveTime).endOf(
    calendarType
  );

  for (
    let i = firstDayCurrentMonth.clone();
    i.isBefore(lastDayCurrentMonth.clone());
    i.add(1, "days")
  ) {
    const today = moment(moment().format(DATE_FORMAT));
    const pointer = moment(moment(i).format(DATE_FORMAT));
    const diff = today.diff(pointer);

    const day: DayCalendar = {
      type: TypeTime.currentMonth,
      time: i.toISOString(),
      isLessToday: diff > 0,
      isToday: diff === 0,
    };

    reservationStore.pushDaysDisplayOnCalendar(day, ViewMode.monthly);
  }

  const orderStartDayOnCalendar = moment(reservationStore.getActiveTime)
    .startOf("month")
    .day();
  // Add day of preview month from sunday to previous first day of current month
  for (let i = 1; i <= orderStartDayOnCalendar; i++) {
    reservationStore.unshiftDaysDisplayOnCalendar({
      type: TypeTime.previousMonth,
      time: firstDayCurrentMonth.clone().subtract(i, "days").toISOString(),
      isLessToday:
        moment(
          firstDayCurrentMonth.clone().subtract(i, "days").format(DATE_FORMAT)
        ).diff(moment().format(DATE_FORMAT)) < 0,
      isToday: false,
    } as DayCalendar);
  }

  // Add day of next month from next last day of current month to saturday
  const orderEndDayOnCalendar = moment(reservationStore.getActiveTime)
    .endOf("month")
    .day();
  const daysNeedAdd = 6 - orderEndDayOnCalendar;
  if (daysNeedAdd) {
    for (let i = 1; i <= daysNeedAdd; i++) {
      const day: DayCalendar = {
        type: TypeTime.nextMonth,
        time: lastDayCurrentMonth.clone().add(i, "days").toISOString(),
        isLessToday:
          moment(
            lastDayCurrentMonth.clone().add(i, "days").format(DATE_FORMAT)
          ).diff(moment().format(DATE_FORMAT)) < 0,
        isToday: false,
      };

      reservationStore.pushDaysDisplayOnCalendar(day, ViewMode.monthly);
    }
  }
};

/**
 * Get calendar monthly
 *
 * @returns
 */
export const useGetCalendarMonthly = () => {
  const reservationStore = useReservation();
  useBuildCalendarMonthly();

  watch(
    () => reservationStore.getActiveTime,
    () => {
      useBuildCalendarMonthly();
    }
  );

  const daysDisplayOnCalendarMonthly = ref(
    reservationStore.getDaysDisplayOnCalendar(ViewMode.monthly)
  );

  watch(
    () => reservationStore.getDaysDisplayOnCalendar(ViewMode.monthly),
    () => {
      daysDisplayOnCalendarMonthly.value =
        reservationStore.getDaysDisplayOnCalendar(ViewMode.monthly);
    }
  );

  return { daysDisplayOnCalendarMonthly };
};

/**
 * Build calendar weekly
 */
export const useBuildCalendarWeekly = () => {
  const reservationStore = useReservation();
  reservationStore.resetDaysDisplayOnCalendar(ViewMode.weekly);

  const calendarType = "week";

  const firstDayCurrentWeek = moment(reservationStore.getActiveTime).startOf(
    calendarType
  );
  const lastDayCurrentWeek = moment(reservationStore.getActiveTime).endOf(
    calendarType
  );

  for (
    let i = firstDayCurrentWeek.clone();
    i.isBefore(lastDayCurrentWeek.clone());
    i.add(1, "days")
  ) {
    const today = moment(moment().format(DATE_FORMAT));
    const pointer = moment(moment(i).format(DATE_FORMAT));
    const diff = today.diff(pointer);

    const day: DayCalendar = {
      type: TypeTime.currentWeek,
      time: i.toISOString(),
      isLessToday: diff > 0,
      isToday: diff === 0,
    };
    reservationStore.pushDaysDisplayOnCalendar(day, ViewMode.weekly);
  }
};

/**
 * Get calendar weekly
 *
 * @returns
 */
export const useGetCalendarWeekly = () => {
  const reservationStore = useReservation();
  useBuildCalendarWeekly();

  watch(
    () => [
      reservationStore.getActiveTime,
      reservationStore.getCrawlSite,
      reservationStore.getIsCallingApi,
    ],
    () => {
      useBuildCalendarWeekly();
    }
  );

  const daysDisplayOnCalendarWeekly = ref(
    reservationStore.getDaysDisplayOnCalendar(ViewMode.weekly)
  );
  watch(
    () => reservationStore.getDaysDisplayOnCalendar(ViewMode.weekly),
    () =>
      (daysDisplayOnCalendarWeekly.value =
        reservationStore.getDaysDisplayOnCalendar(ViewMode.weekly))
  );

  return { daysDisplayOnCalendarWeekly };
};

/**
 * Calculator hours in day
 *
 * @returns
 */
export const calculatorHoursInDay = () => {
  const formatHours = "HH:mm";
  const hoursInDay = ref<string[]>([]);

  for (
    let i = moment().startOf("day");
    i.isSameOrBefore(moment().endOf("day"));
    i.add(1, "hour")
  ) {
    hoursInDay.value.push(i.format(formatHours));
  }

  return { hoursInDay };
};

/**
 * Fetch data reservation restaurant calendar
 *
 * @param forceFetch
 * @param fromDate
 * @param toDate
 * @param getAll
 */
export const fetchDataReservationRestaurantCalendar = async (
  forceFetch = false,
  fromDate?: string,
  toDate?: string,
  getAll = true
) => {
  const reservationStore = useReservation();

  reservationStore.setCanChangeActiveTime(false);
  reservationStore.setIsCallingApi(true);

  const formatDateQuery = "YYYY-MM-DD";

  const timeActive = reservationStore.getActiveTime;

  const query = {
    fromDate: fromDate
      ? moment(fromDate)
      : moment(timeActive).subtract(1, "month").startOf("month"),
    toDate: toDate
      ? moment(toDate)
      : moment(timeActive).add(1, "month").endOf("month"),
  };

  const result =
    await ReservationCalendarRequest.fetchRestaurant<ReservationRestaurant>(
      query.fromDate.format(formatDateQuery),
      query.toDate.format(formatDateQuery),
      getAll,
      reservationStore.getCrawlSite
    );
  if (result && result.data && result.data.length > 0) {
    if (forceFetch) {
      reservationStore.setReservationRestaurant([]);
    }
    reservationStore.setReservationRestaurant(result.data);
    // result.data.forEach((item) => {
    //   if (moment(item.end_time).isAfter(moment(item.start_time), "D")) {
    //     // COMPLETE: Check if start time to end time of item in 2 day, we must break it to 2 reservation
    //     const temp = {
    //       ...item,
    //     };
    //     while (moment(temp.end_time).isAfter(moment(temp.start_time), "D")) {
    //       reservationStore.pushReservationRestaurant({
    //         ...temp,
    //         end_time: moment(temp.start_time)
    //           .endOf("day")
    //           .format("YYYY-MM-DD HH:mm:ss"),
    //       });
    //       temp.start_time = moment(temp.start_time)
    //         .add(1, "day")
    //         .startOf("D")
    //         .format("YYYY-MM-DD");
    //     }
    //
    //     // COMPLETE: Add last segment reservation
    //     reservationStore.pushReservationRestaurant({
    //       ...temp,
    //     });
    //   } else if (moment(item.end_time).isSame(moment(item.start_time), "D")) {
    //     reservationStore.pushReservationRestaurant(item);
    //   }
    // });
  } else {
    reservationStore.setReservationRestaurant([]);
  }

  reservationStore.setCanChangeActiveTime(true);
  reservationStore.setIsCallingApi(false);
};

/**
 * Fetch data reservation device calendar
 *
 * @param forceFetch
 * @param typeStoreId
 * @param fromDate
 * @param toDate
 * @param getAll
 */
export const fetchDataReservationDeviceCalendar = async (
  deviceId: number,
  forceFetch = false,
  typeStoreId?: number,
  fromDate?: string,
  toDate?: string,
  getAll = true
) => {
  const reservationStore = useReservation();

  reservationStore.setCanChangeActiveTime(false);
  reservationStore.setIsCallingApiDevice(true);

  const formatDateQuery = "YYYY-MM-DD";
  const timeActive = reservationStore.getActiveTime;

  const query = {
    fromDate: fromDate
      ? moment(fromDate)
      : moment(timeActive).subtract(1, "month").startOf("month"),
    toDate: toDate
      ? moment(toDate)
      : moment(timeActive).add(1, "month").endOf("month"),
  };

  resultDataStore.value =
    await ReservationCalendarRequest.fetchDevice<ReservationDevice>(
      deviceId,
      query.fromDate.format(formatDateQuery),
      query.toDate.format(formatDateQuery),
      getAll
    );

  if (
    resultDataStore.value &&
    resultDataStore.value.data &&
    resultDataStore.value.data.length > 0
  ) {
    if (forceFetch) {
      reservationStore.setReservationDevice([]);
    }
    reservationStore.setReservationDevice(resultDataStore.value.data);
  } else {
    reservationStore.setReservationDevice([]);
  }

  const deviceBookingDay =
    await ReservationCalendarRequest.fetchDeviceDay<ReservationEventDay>(
      deviceId,
      query.fromDate.format(formatDateQuery),
      query.toDate.format(formatDateQuery),
      getAll
    );

  if (
    deviceBookingDay &&
    deviceBookingDay.data &&
    deviceBookingDay.data.length > 0
  ) {
    if (forceFetch) {
      reservationStore.setReservationDeviceDay([]);
    }
    reservationStore.setReservationDeviceDay(deviceBookingDay.data);
  } else {
    reservationStore.setReservationDeviceDay([]);
  }
  reservationStore.setIsCallingApiDevice(false);
  reservationStore.setCanChangeActiveTime(true);
};

/**
 * Fetch data reservation salon calendar
 *
 * @param forceFetch
 * @param typeStoreId
 * @param fromDate
 * @param toDate
 * @param getAll
 */
export const fetchDataReservationCommonCalendar = async (
  forceFetch = false,
  typeStoreId?: number,
  fromDate?: string,
  toDate?: string,
  getAll = true
) => {
  const reservationStore = useReservation();
  reservationStore.setIsCallingApi(true);

  reservationStore.setCanChangeActiveTime(false);

  const formatDateQuery = "YYYY-MM-DD";

  const timeActive = reservationStore.getActiveTime;

  const query = {
    fromDate: fromDate
      ? moment(fromDate)
      : moment(timeActive).subtract(1, "month").startOf("month"),
    toDate: toDate
      ? moment(toDate)
      : moment(timeActive).add(1, "month").endOf("month"),
  };

  if (typeStoreId === TypeStore.SALON) {
    resultDataStore.value =
      await ReservationCalendarRequest.fetchSalon<ReservationSalon>(
        query.fromDate.format(formatDateQuery),
        query.toDate.format(formatDateQuery),
        getAll,
        reservationStore.getCrawlSite
      );
  } else if (typeStoreId === TypeStore.MEDIAL_CARE) {
    resultDataStore.value =
      await ReservationCalendarRequest.fetchMedialCare<ReservationSalon>(
        query.fromDate.format(formatDateQuery),
        query.toDate.format(formatDateQuery),
        getAll,
        reservationStore.getCrawlSite
      );
  } else if (typeStoreId === TypeStore.CONSULTATION) {
    resultDataStore.value =
      await ReservationCalendarRequest.fetchConsultation<ReservationSalon>(
        query.fromDate.format(formatDateQuery),
        query.toDate.format(formatDateQuery),
        getAll,
        reservationStore.getCrawlSite
      );
  } else if (typeStoreId === TypeStore.CLASSROOM) {
    resultDataStore.value =
      await ReservationCalendarRequest.fetchClassroom<ReservationSalon>(
        query.fromDate.format(formatDateQuery),
        query.toDate.format(formatDateQuery),
        getAll,
        reservationStore.getCrawlSite
      );
  }

  if (
    resultDataStore.value &&
    resultDataStore.value.data &&
    resultDataStore.value.data.length > 0
  ) {
    if (forceFetch) {
      reservationStore.setReservationSalon([]);
    }
    reservationStore.setReservationSalon(resultDataStore.value.data);
  } else {
    reservationStore.setReservationSalon([]);
  }
  reservationStore.setIsCallingApi(false);

  reservationStore.setCanChangeActiveTime(true);
};

/**
 * Fetch data reservation event calendar
 * @param eventId
 * @param forceFetch
 * @param fromDate
 * @param toDate
 * @param getAll
 */
export const fetchDataReservationEventCalendar = async (
  eventId?: number,
  forceFetch = false,
  fromDate?: string,
  toDate?: string,
  getAll = true
) => {
  const reservationStore = useReservation();

  reservationStore.setCanChangeActiveTime(false);
  reservationStore.setIsCallingApiEvent(true);

  const formatDateQuery = "YYYY-MM-DD";

  const timeActive = reservationStore.getActiveTime;

  const query = {
    fromDate: fromDate
      ? moment(fromDate)
      : moment(timeActive).subtract(1, "month").startOf("month"),
    toDate: toDate
      ? moment(toDate)
      : moment(timeActive).add(1, "month").endOf("month"),
  };

  const result = await ReservationCalendarRequest.fetchEvent<ReservationEvent>(
    eventId,
    query.fromDate.format(formatDateQuery),
    query.toDate.format(formatDateQuery),
    getAll
  );

  if (result && result.data && result.data.length > 0) {
    if (forceFetch) {
      reservationStore.setReservationEvent([]);
    }
    reservationStore.setReservationEvent(result.data);
  } else {
    reservationStore.setReservationEvent([]);
  }

  const eventBookingDay =
    await ReservationCalendarRequest.fetchEventDay<ReservationEventDay>(
      eventId,
      query.fromDate.format(formatDateQuery),
      query.toDate.format(formatDateQuery),
      getAll
    );

  if (
    eventBookingDay &&
    eventBookingDay.data &&
    eventBookingDay.data.length > 0
  ) {
    if (forceFetch) {
      reservationStore.setReservationEventDay([]);
    }
    reservationStore.setReservationEventDay(eventBookingDay.data);
  } else {
    reservationStore.setReservationEventDay([]);
  }
  reservationStore.setIsCallingApiEvent(false);
  reservationStore.setCanChangeActiveTime(true);
};

/**
 * Fetch data status booking
 *
 * @param timeTarget
 * @param storeId
 * @param fromDate
 * @param toDate
 * @returns
 */
export const fetchDataStatusBooking = async (
  timeTarget: string,
  storeId?: number,
  fromDate?: string,
  toDate?: string
) => {
  const formatDateQuery = "YYYY-MM-DD";
  const meStore = useMeStore();
  const reservationStore = useReservation();

  if (!meStore.getStoreId) throw new Error("Can't get store ID from pinia");

  const query = {
    fromDate: fromDate
      ? moment(fromDate)
      : getTimeStartDaysDisplayOnCalendar() || moment(),
    toDate: toDate
      ? moment(toDate)
      : getTimeEndDaysDisplayOnCalendar() || moment(),
  };

  const result = await StoreRequest.getStatusBooking<{
    data: { day: string; value: number }[];
  }>(
    storeId ?? meStore.getStoreId,
    query.fromDate.format(formatDateQuery),
    query.toDate.format(formatDateQuery),
    timeTarget,
    reservationStore.getCrawlSite
  );

  if (
    result &&
    result.data &&
    result.data.data &&
    result.data.data.length > 0
  ) {
    return result.data.data;
  }
};

/**
 * Fetch data status booking device
 *
 * @param timeTarget
 * @param storeId
 * @param fromDate
 * @param toDate
 * @returns
 */
export const fetchDataStatusBookingDevice = async (
  deviceId: number,
  timeTarget: string,
  storeId?: number,
  fromDate?: string,
  toDate?: string
) => {
  const formatDateQuery = "YYYY-MM-DD";
  const meStore = useMeStore();
  if (!meStore.getStoreId) throw new Error("Can't get store ID from pinia");

  const query = {
    fromDate: fromDate
      ? moment(fromDate)
      : getTimeStartDaysDisplayOnCalendar() || moment(),
    toDate: toDate
      ? moment(toDate)
      : getTimeEndDaysDisplayOnCalendar() || moment(),
  };

  const result = await StoreRequest.getStatusBookingDevice<{
    data: { day: string; value: number }[];
  }>(
    deviceId,
    storeId ?? meStore.getStoreId,
    query.fromDate.format(formatDateQuery),
    query.toDate.format(formatDateQuery),
    timeTarget
  );

  if (
    result &&
    result.data &&
    result.data.data &&
    result.data.data.length > 0
  ) {
    return result.data.data;
  }
};

/**
 * Fetch data status booking
 * @param eventId
 * @param timeTarget
 * @param storeId
 * @param fromDate
 * @param toDate
 * @returns
 */
export const fetchDataStatusBookingEvent = async (
  eventId?: number,
  timeTarget?: string,
  storeId?: number,
  fromDate?: string,
  toDate?: string
) => {
  const formatDateQuery = "YYYY-MM-DD";
  const meStore = useMeStore();

  if (!meStore.getStoreId) throw new Error("Can't get store ID from pinia");

  const query = {
    fromDate: fromDate
      ? moment(fromDate)
      : getTimeStartDaysDisplayOnCalendar() || moment(),
    toDate: toDate
      ? moment(toDate)
      : getTimeEndDaysDisplayOnCalendar() || moment(),
  };

  const result = await StoreRequest.getStatusBookingEvent<{
    data: { day: string; value: number }[];
  }>(
    eventId,
    storeId ?? meStore.getStoreId,
    query.fromDate.format(formatDateQuery),
    query.toDate.format(formatDateQuery),
    timeTarget
  );

  if (
    result &&
    result.data &&
    result.data.data &&
    result.data.data.length > 0
  ) {
    return result.data.data;
  }
};

/**
 * Get time start day display on calendar
 *
 * @returns
 */
export const getTimeStartDaysDisplayOnCalendar = (): Moment | undefined => {
  const reservationStore = useReservation();
  const dayCalendar = reservationStore.getDaysDisplayOnCalendar();

  if (dayCalendar && dayCalendar.length > 0) {
    const firstDate = dayCalendar[0].time;

    return moment().set({
      year: moment(firstDate).year(),
      month: moment(firstDate).month(),
      date: moment(firstDate).date(),
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  }
};

/**
 * Get time end day display on calendar
 *
 * @returns
 */
export const getTimeEndDaysDisplayOnCalendar = (): Moment | undefined => {
  const reservationStore = useReservation();
  const dayCalendar = reservationStore.getDaysDisplayOnCalendar();

  if (dayCalendar && dayCalendar.length > 0) {
    const lastDate = dayCalendar[dayCalendar.length - 1].time;
    return moment().set({
      year: moment(lastDate).year(),
      month: moment(lastDate).month(),
      date: moment(lastDate).date(),
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 0,
    });
  }
};
