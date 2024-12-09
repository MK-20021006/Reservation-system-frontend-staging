import { StoreInterface } from "~/../../src/front/models/store";

export interface FormReservation {
  store_id: number;
  course_id: number;
  seat_type_id: number;
  type_reservation_id: number;
  reservation_code?: string;
  number_adult?: number;
  number_children?: number;
  order_first_name: string;
  order_last_name: string;
  order_email: string;
  order_phone_number: string;
  order_time: string;
  payment_type: number;
  order_memo?: string;
  note?: string;
  cancel_policy?: string;
  price_adult?: number;
  price_children?: number;
  amount?: number;
  bookingId?: number;
  typeStore?: number;
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
  created_at: string;
  cancel?: {
    memo?: string;
    reason?: string;
  };
  amount: number;
  type_course: number;
  amount_discount: number;
}

export interface DetailInterface {
  course?: {
    id: number;
    name: string;
    payment_type: number;
    price: number;
    price_children: number;
  };
  staff?: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    fee: number;
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
