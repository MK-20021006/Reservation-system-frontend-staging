import { defineStore } from "pinia";
import {
  SortList,
  FilterBookingList,
  FilterRevenueList,
  FilterSeatList,
  FilterStaffList,
  FilterInvoicesList,
  FilterCustomersList,
  FilterEventList,
  FilterCouponsList,
  FilterSubscriptionList,
  FilterRecruimenList,
  FilterDeviceList,
} from "~/../../src/store/models";
import { STORE_PAGINATION } from "~/../../src/shared/constants";

interface DataTableState {
  seatList: {
    search: FilterSeatList | null;
    currentPage: number;
    pageSize: number;
    sort: SortList | null;
  };
  staffList: {
    search: FilterStaffList | null;
    currentPage: number;
    pageSize: number;
    sort: SortList | null;
  };
  revenueList: {
    search: FilterRevenueList | null;
    currentPage: number;
    pageSize: number;
    sort: SortList | null;
  };
  bookingList: {
    search: FilterBookingList | null;
    currentPage: number;
    pageSize: number;
    sort: SortList | null;
  };
  customerList: {
    search: FilterCustomersList | null;
    currentPage: number;
    pageSize: number;
    sort: SortList | null;
  };
  invoiceList: {
    search: FilterInvoicesList | null;
    currentPage: number;
    pageSize: number;
    sort: SortList | null;
  };
  eventList: {
    search: FilterEventList | null;
    currentPage: number;
    pageSize: number;
    sort: SortList | null;
  };
  couponList: {
    search: FilterCouponsList | null;
    currentPage: number;
    pageSize: number;
    sort: SortList | null;
  };
  subscriptionList: {
    search: FilterSubscriptionList | null;
    currentPage: number;
    pageSize: number;
    sort: SortList | null;
  };
  recruitmentList: {
    search: FilterRecruimenList | null;
    currentPage: number;
    pageSize: number;
    sort: SortList | null;
  };
  deviceList: {
    search: FilterDeviceList | null;
    currentPage: number;
    pageSize: number;
    sort: SortList | null;
  };
  bookingCrawl: {
    start_date: string;
    end_date: string;
  };
}
export const DataTableStore = defineStore("dataTable", {
  state: () =>
    ({
      seatList: {
        search: null,
        currentPage: 1,
        pageSize: STORE_PAGINATION.PER_PAGE,
      },
      staffList: {
        search: null,
        currentPage: 1,
        pageSize: STORE_PAGINATION.PER_PAGE,
      },
      bookingList: {
        search: null,
        currentPage: 1,
        pageSize: STORE_PAGINATION.PER_PAGE,
      },
      invoiceList: {
        search: null,
        currentPage: 1,
        pageSize: STORE_PAGINATION.PER_PAGE,
      },
      customerList: {
        search: null,
        currentPage: 1,
        pageSize: STORE_PAGINATION.PER_PAGE,
        sort: null,
      },
      couponList: {
        search: null,
        currentPage: 1,
        pageSize: STORE_PAGINATION.PER_PAGE,
        sort: null,
      },
      eventList: {
        search: null,
        currentPage: 1,
        pageSize: STORE_PAGINATION.PER_PAGE,
        sort: null,
      },
      subscriptionList: {
        search: null,
        currentPage: 1,
        pageSize: STORE_PAGINATION.PER_PAGE,
        sort: null,
      },
      recruitmentList: {
        search: null,
        currentPage: 1,
        pageSize: STORE_PAGINATION.PER_PAGE,
        sort: null,
      },
      deviceList: {
        search: null,
        currentPage: 1,
        pageSize: STORE_PAGINATION.PER_PAGE,
        sort: null,
      },
      bookingCrawl: {
        start_date: "",
        end_date: "",
      },
    } as DataTableState),
  actions: {
    setFilterSearchStoreList(filerData: FilterSeatList) {
      this.seatList.search = filerData;
    },
  },
});
