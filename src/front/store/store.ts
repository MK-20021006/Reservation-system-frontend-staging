import moment from "moment";
import { defineStore } from "pinia";
import { FilterStore } from "../models";
import { getCurrentTimeBooking } from "../../shared/utils";
import { useCookie } from "nuxt/app";
import { persistKeys } from "../../shared/constants/persist-key";
import {
  CLASSROOM,
  CONSULTATION,
  MEDIAL_CARE,
  RESTAURANT,
  SALON,
  EVENT,
} from "../../shared/constants/category";

interface UserStoreState {
  headerSearch: FilterStore;
  salon: FilterStore;
  restaurant: FilterStore;
  medical_care: FilterStore;
  classroom: FilterStore;
  consultation: FilterStore;
  event: FilterStore;

  keyword_search_list_store_screen: string | null;
  time_list: string | null;
  min_price: string | null;
  max_price: string | null;
  date_list: string | null;
}

export const useStoreSearch = defineStore("storeSearch", {
  state: () =>
    ({
      headerSearch: {
        keyword_time: getCurrentTimeBooking(),
        keyword_date: moment().format("YYYY-MM-DD"),
        keyword_name: null,
        transportation: null,
        district_id: null,
        conscious_id: null,
        island_id: null,
        village_id: null,
        is_map: null,
      },
      salon: {
        keyword_time: getCurrentTimeBooking(),
        keyword_date: moment().format("YYYY-MM-DD"),
        keyword_name: null,
        transportation: null,
        district_id: null,
        conscious_id: null,
        island_id: null,
        village_id: null,
        is_map: null,
      },
      restaurant: {
        keyword_time: getCurrentTimeBooking(),
        keyword_date: moment().format("YYYY-MM-DD"),
        keyword_name: null,
        transportation: null,
        district_id: null,
        conscious_id: null,
        island_id: null,
        village_id: null,
        is_map: null,
      },
      medical_care: {
        keyword_time: getCurrentTimeBooking(),
        keyword_date: moment().format("YYYY-MM-DD"),
        keyword_name: null,
        transportation: null,
        district_id: null,
        conscious_id: null,
        island_id: null,
        village_id: null,
        is_map: null,
      },
      classroom: {
        keyword_time: getCurrentTimeBooking(),
        keyword_date: moment().format("YYYY-MM-DD"),
        keyword_name: null,
        transportation: null,
        district_id: null,
        conscious_id: null,
        island_id: null,
        village_id: null,
        is_map: null,
      },
      consultation: {
        keyword_time: getCurrentTimeBooking(),
        keyword_date: moment().format("YYYY-MM-DD"),
        keyword_name: null,
        transportation: null,
        district_id: null,
        conscious_id: null,
        island_id: null,
        village_id: null,
        is_map: null,
      },
      event: {
        keyword_time: getCurrentTimeBooking(),
        keyword_date: moment().format("YYYY-MM-DD"),
        keyword_name: null,
        transportation: null,
        district_id: null,
        conscious_id: null,
        island_id: null,
        village_id: null,
        is_map: null,
      },
      keyword_search_list_store_screen: null,
      time_list: null,
      min_price: null,
      max_price: null,
      date_list: null,
    } as UserStoreState),
  actions: {
    /**
     * Handle reset header search
     */
    setHeaderSearch() {
      const menu = Number(useCookie(persistKeys.MENU).value);
      switch (menu) {
        case SALON:
          this.headerSearch = { ...this.salon };
          break;
        case RESTAURANT:
          this.headerSearch = { ...this.restaurant };
          break;
        case MEDIAL_CARE:
          this.headerSearch = { ...this.medical_care };
          break;
        case CLASSROOM:
          this.headerSearch = { ...this.classroom };
          break;
        case CONSULTATION:
          this.headerSearch = { ...this.consultation };
          break;
        case EVENT:
          this.headerSearch = { ...this.event };
          break;
        default:
          this.headerSearch.district_id = null;
          this.headerSearch.conscious_id = null;
          this.headerSearch.island_id = null;
          this.headerSearch.village_id = null;
          this.headerSearch.transportation = null;
          this.headerSearch.keyword_name = null;
          this.headerSearch.is_map = false;
          this.headerSearch.keyword_date = moment().format("YYYY-MM-DD");
          this.headerSearch.keyword_time = getCurrentTimeBooking();
          break;
      }
    },
    /**
     * Cache search with type of store
     */
    cacheSearch() {
      const menu = Number(useCookie(persistKeys.MENU).value);
      switch (menu) {
        case SALON:
          this.salon = { ...this.headerSearch };
          break;
        case RESTAURANT:
          this.restaurant = { ...this.headerSearch };
          break;
        case MEDIAL_CARE:
          this.medical_care = { ...this.headerSearch };
          break;
        case CLASSROOM:
          this.classroom = { ...this.headerSearch };
          break;
        case CONSULTATION:
          this.consultation = { ...this.headerSearch };
          break;
        case EVENT:
          this.event = { ...this.headerSearch };
          break;
      }
    },
  },
});
