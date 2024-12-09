import { defineStore } from "pinia";
import { Store, StoreStepActive } from "../models";

interface UserStoreState {
  user: Store | null;
  stepActive: {
    has_course_public: boolean;
    is_setting_payment: boolean;
    has_event_public: boolean;
  };
}

export const useAuthStore = defineStore("store", {
  state: () =>
    ({
      user: null,
      stepActive: {
        has_course_public: false,
        is_setting_payment: false,
        has_event_public: false,
      },
    } as UserStoreState),
  actions: {
    setStepStore(step: StoreStepActive) {
      this.stepActive.has_course_public = step.has_course_public;
      this.stepActive.is_setting_payment = step.is_setting_payment;
      this.stepActive.has_event_public = step.has_event_public;
    },
  },
});
