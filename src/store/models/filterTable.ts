export interface FilterSeatList {
  id: number | null;
  name: string;
  type_seat_id: number | null;
  type: number | null;
}

export interface FilterStaffList {
  id: number | null;
  name: string;
  positions: number | null;
}

export interface FilterRevenueList {
  keyword: number | null;
  course_name: string;

  positions: number | null;
}

export interface FilterInvoicesList {
  id?: number;
  reservation_code?: string;
  start_date?: string;
  payment_type?: number;
  end_date?: string;
  start_order?: string;
  end_order?: string;
  course_name: string;
}
export interface FilterCouponsList {
  id?: number;
  name?: string;
  course_name?: string;
  created_at?: string;
}

export interface FilterEventList {
  name?: string;
  publish?: string;
  reservation_type?: number;
}

export interface FilterBookingList {
  status: number | null;
}

export interface SortList {
  order_by: string;
  direct: string;
}

export interface FilterCustomersList {
  id: number;
  email: string;
  fullname: string;
  phone_number: string;
  login_type: number;
  last_login: string;
  status: number;
  created_at: string;
}

export interface FilterSubscriptionList {
  payment_status: number | null;
  start_month: Date;
  end_month: Date;
  start_due_date: Date;
  end_due_date: Date;
}

export interface FilterRecruimenList {
  keyword: string;
  start_date: string;
  end_date: string;
  status: number;
}

export interface FilterDeviceList {
  name: string;
  status: string;
}
