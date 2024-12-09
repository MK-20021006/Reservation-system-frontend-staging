import { ref, watch } from "vue";
import { useReservation } from "../../store/useReservation";
import { Moment } from "moment";

export const getReservationsRestaurant = (day?: Moment) => {
  const reservationStore = useReservation();
  const reservations = ref(reservationStore.getReservationRestaurant(day));

  watch(
    () => day,
    () => {
      reservations.value = reservationStore.getReservationRestaurant(day);
    }
  );

  return { reservations };
};

export const getReservationsSalon = (day?: Moment) => {
  const reservationStore = useReservation();
  const reservations = ref(reservationStore.getReservationSalon(day));

  watch(
    () => day,
    () => {
      reservations.value = reservationStore.getReservationSalon(day);
    }
  );

  return { reservations };
};

export const getReservationsEvent = (day?: Moment) => {
  const reservationStore = useReservation();
  const reservations = ref(reservationStore.getReservationEvent(day));

  watch(
    () => day,
    () => {
      reservations.value = reservationStore.getReservationEvent(day);
    }
  );

  return { reservations };
};

export const getReservationsEventDay = (day?: Moment) => {
  const reservationStore = useReservation();
  const reservations = ref(reservationStore.getReservationEventDay(day));

  watch(
    () => day,
    () => {
      reservations.value = reservationStore.getReservationEventDay(day);
    }
  );

  return { reservations };
};

export const getReservationsDeviceDay = (day?: Moment) => {
  const reservationStore = useReservation();
  const reservations = ref(reservationStore.getReservationDeviceDay(day));

  watch(
    () => day,
    () => {
      reservations.value = reservationStore.getReservationDeviceDay(day);
    }
  );

  return { reservations };
};

export const getReservationRestaurantByDayAndSeat = (
  day: Moment,
  seatId: number
) => {
  const reservationStore = useReservation();
  const reservations = ref(
    reservationStore.getReservationRestaurantByDayAndSeat(day, seatId)
  );

  watch(
    () => seatId,
    () => {
      reservations.value =
        reservationStore.getReservationRestaurantByDayAndSeat(day, seatId);
    }
  );

  return { reservations };
};

export const getReservationEventByDailyAndEvent = (
  day: Moment,
  eventId: number
) => {
  const reservationStore = useReservation();
  const reservations = ref(
    reservationStore.getReservationEventByDailyAndEvent(day)
  );

  watch(
    () => eventId,
    () => {
      reservations.value =
        reservationStore.getReservationEventByDailyAndEvent(day);
    }
  );

  return { reservations };
};

export const getReservationDeviceByDailyAndDevice = (
  day: Moment,
  deviceId: number
) => {
  const reservationStore = useReservation();
  const reservations = ref(
    reservationStore.getReservationDeviceByDailyAndDevice(day)
  );

  watch(
    () => deviceId,
    () => {
      reservations.value =
        reservationStore.getReservationDeviceByDailyAndDevice(day);
    }
  );

  return { reservations };
};

export const getReservationSalonByDayAndStaff = (
  day: Moment,
  staffId: number
) => {
  const reservationStore = useReservation();
  const reservations = ref(
    reservationStore.getReservationByDayAndStaff(day, staffId)
  );

  watch(
    () => staffId,
    () => {
      reservations.value = reservationStore.getReservationByDayAndStaff(
        day,
        staffId
      );
    }
  );

  return { reservations };
};
