export interface SortStoreList {
  order_by: string;
  direct: string;
}

export interface FilterInvoicesList {
  id: number;
  status: number;
}

export interface FilterBookingList {
  status: number | null;
  key_search: string;
}

export interface FilterRate {
  star: number | null;
}
