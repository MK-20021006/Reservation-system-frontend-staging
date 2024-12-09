import { defineStore } from "pinia";
import { POSITION } from "../../shared/constants/positionBanner";
import { RecommendStoreInterface } from "../models/recommend";
import { NumberStore } from "../constants";
interface RecommendStoreState {
  top: RecommendStoreInterface[];
  bottom: {
    premium: RecommendStoreInterface[];
    standard: RecommendStoreInterface[];
  };
}

export const RecommendStore = defineStore("RecommendStore", {
  state: () =>
    ({
      top: [],
      bottom: {
        premium: [],
        standard: [],
      },
    } as RecommendStoreState),
  getters: {
    getAllRecommendStoreTop: (state: RecommendStoreState) => state.top,
    getAllRecommendStoreBottom: (state: RecommendStoreState) => state.bottom,

    getRecommendStoreTop: (state: RecommendStoreState) => {
      const shuffled = state.top.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, NumberStore.top);
      return selected;
    },

    getRecommendStoreBottom: (state: RecommendStoreState) => state.bottom,
  },
  actions: {
    setRecommendStoreTop(value: RecommendStoreInterface[]) {
      this.top = value;
    },

    setRecommendStoreBottomPremium(value: RecommendStoreInterface[]) {
      this.bottom.premium = value;
    },

    setRecommendStoreBottomStandard(value: RecommendStoreInterface[]) {
      this.bottom.standard = value;
    },

    pushRecommendStoreTop(value: RecommendStoreInterface) {
      if (
        this.top.length <= 0 ||
        !this.top.some((item: RecommendStoreInterface) => item.id === value.id)
      ) {
        this.top.push(value);
      }
    },

    pushRecommendStoreBottomPremium(value: RecommendStoreInterface) {
      if (
        this.bottom.premium.length <= 0 ||
        !this.bottom.premium.some(
          (item: RecommendStoreInterface) => item.id === value.id
        )
      ) {
        this.bottom.premium.push(value);
      }
    },

    pushRecommendStoreBottomStandard(value: RecommendStoreInterface) {
      if (
        this.bottom.standard.length <= 0 ||
        !this.bottom.standard.some(
          (item: RecommendStoreInterface) => item.id === value.id
        )
      ) {
        this.bottom.standard.push(value);
      }
    },
  },
});
