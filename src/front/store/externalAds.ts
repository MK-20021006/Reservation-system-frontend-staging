import { defineStore } from "pinia";
import { IAds } from "../models";

interface ExternalAdsState {
  ads: IAds[];
}

export const ExternalAdsStore = defineStore("ExternalAds", {
  state: () =>
    ({
      ads: [],
    } as ExternalAdsState),
  getters: {
    isEmptyData: (state: ExternalAdsState) =>
      state.ads.length > 0 ? false : true,
    getAds: (state: ExternalAdsState) => (position?: number[]) =>
      position
        ? state.ads.filter((item) => position.includes(item.position))
        : state.ads,
  },
  actions: {
    setAds(value: IAds[]) {
      this.ads = value;
    },

    pushAds(value: IAds) {
      if (
        this.ads.length <= 0 ||
        !this.ads.some((item: IAds) => item.id === value.id)
      ) {
        this.ads.push(value);
      }
    },
  },
});
