import moment from "moment";
import seatRequest from "../../../shared/requests/SeatRequest";
import staffRequest from "../../../shared/requests/StaffRequest";
import storeRequest from "../../../shared/requests/StoreRequest";
import { useMeStore } from "~/../../src/shared/stores/me";
import { Seat, ReservationInDay, AvailableSeatInDay } from "../../models";
import { StaffInterface } from "~/../../src/shared/models";
import eventRequest from "~/../../src/shared/requests/EventRequest";

export const getSeatOfStore = async () => {
  const meStore = useMeStore();
  const storeId = meStore.getStoreId;

  if (storeId) {
    const result = await seatRequest.getAllByStore<Seat[]>(storeId, true);
    if (result && result.data) {
      return { seat: result.data };
    }
  }
};

export const getStaffOfStore = async () => {
  const meStore = useMeStore();
  const storeId = meStore.getStoreId;

  if (storeId) {
    const result = await staffRequest.getAllStaffByStore<StaffInterface[]>(
      storeId
    );
    if (result && result.data) {
      return { staff: result.data };
    }
  }
};

export const getEventOfStore = async () => {
  const meStore = useMeStore();
  const storeId = meStore.getStoreId;
  if (storeId) {
    const result = await eventRequest.getAllEventByStore<any[]>(storeId);
    if (result && result.data) {
      return { event: result.data };
    }
  }
};

export const getReservationInDay = async (
  storeId: number,
  day: string = moment().format("YYYY-MM-DD"),
  crawlSite?: number | null
) => {
  const result = await storeRequest.getReservationInDay<ReservationInDay[]>(
    storeId,
    day,
    crawlSite
  );
  if (result && result.data) {
    return { reservations: result.data };
  }
};

export const getAvailableSeatInDay = async (
  storeId: number,
  day: string = moment().format("YYYY-MM-DD"),
  crawlSite?: number | null
) => {
  const result = await storeRequest.getAvailableSeatInDay<AvailableSeatInDay[]>(
    storeId,
    day,
    crawlSite
  );
  if (result && result.data) {
    return { availableSeat: result.data };
  }
};

export const getAvailableStaffInDay = async (
  storeId: number,
  day: string = moment().format("YYYY-MM-DD")
) => {
  const result = await storeRequest.getAvailableStaffInDay<
    AvailableSeatInDay[]
  >(storeId, day);
  if (result && result.data) {
    return { availableStaff: result.data };
  }
};
