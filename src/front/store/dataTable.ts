import { defineStore } from "pinia";
import {
  FilterInvoicesList,
  SortStoreList,
  FilterRate,
} from "~/../../src/front/models";
import { CUSTOMER_PAGINATION } from "~/../../src/shared/constants";
import { FilterBookingList } from "~/../../src/front/models";

interface DataTableState {
  invoiceList: {
    search: FilterInvoicesList | null;
    currentPage: number;
    pageSize: number;
    sort: SortStoreList | null;
  };
  bookingList: {
    search: FilterBookingList | null;
    currentPage: number;
    pageSize: number;
    sort: SortStoreList | null;
  };
  reviewList: {
    currentPage: number;
    pageSize: number;
    search: FilterRate | null;
  };
}
export const DataTableStore = defineStore("dataTable", {
  state: () =>
    ({
      invoiceList: {
        search: null,
        currentPage: 1,
        pageSize: CUSTOMER_PAGINATION.PER_PAGE,
      },
      bookingList: {
        search: null,
        currentPage: 1,
        pageSize: CUSTOMER_PAGINATION.PER_PAGE,
        sort: null,
      },
      reviewList: {
        currentPage: 1,
        pageSize: CUSTOMER_PAGINATION.PER_PAGE,
        search: null,
      },
    } as DataTableState),
});
