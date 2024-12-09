import { defineStore } from "pinia";

export const userStore = defineStore("userStore", {
  state: () => ({
    user: {},
    role: {},
    store: {},
  }),

  actions: {
    setUserList(user) {
      this.user = user;
    },
  },
});
