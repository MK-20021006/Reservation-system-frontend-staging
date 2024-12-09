import { defineStore } from "pinia";
import { DataRankingStore, OrderBy, Period } from "../models";

interface RankingStoreState {
  access: {
    dailyRanking: DataRankingStore[];
    weeklyRanking: DataRankingStore[];
    monthlyRanking: DataRankingStore[];
  };
  booking: {
    dailyRanking: DataRankingStore[];
    weeklyRanking: DataRankingStore[];
    monthlyRanking: DataRankingStore[];
  };
}

export const useRankingStore = defineStore("rankingStore", {
  state: () =>
    ({
      access: {
        dailyRanking: [],
        weeklyRanking: [],
        monthlyRanking: [],
      },
      booking: {
        dailyRanking: [],
        weeklyRanking: [],
        monthlyRanking: [],
      },
    } as RankingStoreState),
  getters: {
    getRankingStore(state: RankingStoreState) {
      return (criteria: OrderBy, period: Period) => {
        if (criteria === OrderBy.access) return this.getAccessRanking(period);
        return this.getBookingRanking(period);
      };
    },

    getAccessRanking: (state: RankingStoreState) => (period: Period) => {
      if (period === Period.day) return state.access.dailyRanking;
      if (period === Period.week) return state.access.weeklyRanking;
      if (period === Period.month) return state.access.monthlyRanking;
    },

    getBookingRanking: (state: RankingStoreState) => (period: Period) => {
      if (period === Period.day) return state.booking.dailyRanking;
      if (period === Period.week) return state.booking.weeklyRanking;
      if (period === Period.month) return state.booking.monthlyRanking;
    },
  },
  actions: {
    setRanking(
      value: DataRankingStore[],
      criteria: OrderBy,
      period: Period
    ): void {
      if (criteria === OrderBy.access)
        return this.setAccessRanking(value, period);
      if (criteria === OrderBy.booking)
        return this.setBookingRanking(value, period);
    },

    setAccessRanking(value: DataRankingStore[], period: Period) {
      if (period === Period.day) {
        this.access.dailyRanking = value;
      } else if (period === Period.week) {
        this.access.weeklyRanking = value;
      } else if (period === Period.month) {
        this.access.monthlyRanking = value;
      }
    },

    setBookingRanking(value: DataRankingStore[], period: Period) {
      if (period === Period.day) {
        this.booking.dailyRanking = value;
      } else if (period === Period.week) {
        this.booking.weeklyRanking = value;
      } else if (period === Period.month) {
        this.booking.monthlyRanking = value;
      }
    },

    pushRanking(
      value: DataRankingStore,
      criteria: OrderBy,
      period: Period
    ): void {
      if (criteria === OrderBy.access)
        return this.pushAccessRanking(value, period);
      if (criteria === OrderBy.booking)
        return this.pushBookingRanking(value, period);
    },

    pushAccessRanking(value: DataRankingStore, period: Period) {
      if (period === Period.day) {
        if (
          this.access.dailyRanking.length <= 0 ||
          !this.access.dailyRanking.some(
            (item: DataRankingStore) => item.store_id === value.store_id
          )
        ) {
          this.access.dailyRanking.push(value);
        }
      } else if (period === Period.week) {
        if (
          this.access.weeklyRanking.length <= 0 ||
          !this.access.weeklyRanking.some(
            (item: DataRankingStore) => item.store_id === value.store_id
          )
        ) {
          this.access.weeklyRanking.push(value);
        }
      } else if (period === Period.month) {
        if (
          this.access.monthlyRanking.length <= 0 ||
          !this.access.monthlyRanking.some(
            (item: DataRankingStore) => item.store_id === value.store_id
          )
        ) {
          this.access.monthlyRanking.push(value);
        }
      }
    },

    pushBookingRanking(value: DataRankingStore, period: Period) {
      if (period === Period.day) {
        if (
          this.booking.dailyRanking.length <= 0 ||
          !this.booking.dailyRanking.some(
            (item: DataRankingStore) => item.store_id === value.store_id
          )
        ) {
          this.booking.dailyRanking.push(value);
        }
      } else if (period === Period.week) {
        if (
          this.booking.weeklyRanking.length <= 0 ||
          !this.booking.weeklyRanking.some(
            (item: DataRankingStore) => item.store_id === value.store_id
          )
        ) {
          this.booking.weeklyRanking.push(value);
        }
      } else if (period === Period.month) {
        if (
          this.booking.monthlyRanking.length <= 0 ||
          !this.booking.monthlyRanking.some(
            (item: DataRankingStore) => item.store_id === value.store_id
          )
        ) {
          this.booking.monthlyRanking.push(value);
        }
      }
    },
  },
});
