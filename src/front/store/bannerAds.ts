import { defineStore } from "pinia";
import { POSITION } from "../../shared/constants/positionBanner";
import { BannerAds } from "../models";

interface BannerAdsState {
  banner: BannerAds[];
}

export const BannerAdsStore = defineStore("BannerAds", {
  state: () =>
    ({
      banner: [],
    } as BannerAdsState),
  getters: {
    isEmptyBannerData: (state: BannerAdsState) =>
      state.banner.length > 0 ? false : true,
    getBannerSmall: (state: BannerAdsState) =>
      state.banner
        .filter((item) => item.position === POSITION.TOP)
        .sort((a, b) => {
          return a.index - b.index;
        }),
    getBannerLarge: (state: BannerAdsState) =>
      state.banner
        .filter((item) => item.position === POSITION.CENTER)
        .sort((a, b) => {
          return a.index - b.index;
        }),
  },
  actions: {
    setBanner(value: BannerAds[]) {
      this.banner = value;
    },

    pushBanner(value: BannerAds) {
      if (
        this.banner.length <= 0 ||
        !this.banner.some((item: BannerAds) => item.id === value.id)
      ) {
        this.banner.push(value);
      }
    },
  },
});
