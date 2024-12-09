import { TypeTime } from "../constants";
import { StoreInterface } from "~/../../src/store/models/store";

export interface DayCalendar {
  type: TypeTime;
  /**
   * time is ISO time string
   */
  time: string;
  isLessToday: boolean;
  isToday: boolean;
}

export interface ReservationRestaurant {
  id: number;
  reservation_id: number;
  seat_id: number;
  seat_number: number;
  start_time: string;
  end_time: string;
  reservation: {
    id: number;
    order_name: string;
    reservation_detail_id: number;
    reservation_detail_type: string;
    detail: {
      id: number;
      number_adult: number;
      number_children: number;
      course_id: number;
      course: {
        id: number;
        name: string;
        payment_type: number;
      };
    };
  };
}

export interface ReservationDevice {
  id: number;
  start_time: string;
  end_time: string;
}

export interface CourseReservation {
  id: number;
  name: string | null;
  payment_type: number | null;
  price: number | null;
  price_children: number | null;
  start_time: number | null;
  stay_time: number | null;
  time_plus: number | null;
}

export interface MenuReservation {
  id: number;
  name: string;
}

export interface MenuDetailsReservation {
  id: number;
  reservation_salon_detail_id: number;
  menu_id: number;
  menu_price: number;
  menu: MenuReservation;
}

export interface ReservationEvent {
  id: number;
  event_time: {
    date: string;
    start: string;
    end: string;
  };
  customer: {
    fullname: string;
  };
  detail: {
    number_adult: string;
    number_children: number;
  };
}

export interface ReservationEventDay {
  id: number;
  date: string;
  end: string;
  name: string;
  start: string;
  total_booking: number;
  total_people: number;
}

export interface ReservationDeviceDay {
  id: number;
  date: string;
  end: string;
  name: string;
  start: string;
  total_booking: number;
  total_people: number;
}

export interface ResultDataStore {
  data: any[];
}

export interface ReservationEventDay {
  id: number;
  event_time: {
    date: string;
    start: string;
    end: string;
  };
  customer: {
    fullname: string;
  };
  detail: {
    number_adult: string;
    number_children: number;
  };
}
export interface ReservationSalon {
  id: number;
  reservation_id: number;
  staff_id: number;
  start_time: string;
  end_time: string;
  reservation: {
    id: number;
    order_name: string;
    reservation_detail_id: number;
    reservation_detail_type: string;
    total_people: null;
    type_user_create: number;
    detail: {
      id: number;
      number_adult: number;
      number_children: number;
      course_id: number;
      course_price: number;
      number_people: number | null;
      request_staff: number;
      staff_fee: number;
      staff_id: number;
      total_menu_fee: number;
      course: CourseReservation | null;
      menu_details: MenuDetailsReservation[] | null;
    };
  };
}

export interface CountReservationType {
  count: number;
  activeTime: string;
}

export interface CountReservationRestaurant extends CountReservationType {
  seatId: number;
}

export interface CountReservationSalon extends CountReservationType {
  staffId: number;
}

export interface CountReservationEvent extends CountReservationType {
  eventId: number;
}

export interface BookingDetail {
  id: number;
  order_time: string;
  order_email: string;
  order_first_name: string;
  order_last_name: string;
  order_memo: string;
  order_name?: string;
  order_phone_number: string;
  store: StoreInterface;
  store_id: number;
  detail: DetailInterface;
  status: number;
  status_payment: number;
  visited_at?: string;
  type_user_create?: number;
  amount: number;
  payment_type: number;
  incurred_amount: number;
  amount_discount: number;
  crawl_site: number;
  crawl_id: number;
  booking_devices: any[];
}

export interface DetailInterface {
  course: {
    id: number;
    name: string;
    payment_type: number;
    price: number;
    price_children: number;
  };
  course_id: number;
  id: number;
  number_adult: number;
  number_children?: number;
  price_adult: number;
  price_children: number;
  seat_type_id: number;
  payment_status: number;
}
