import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      firstName: "First",
      lastName: "Last",
    };
  },
  actions: {
    updateName(name) {
      this.name = name;
    },
  },
  getters: {
    fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
  },
});
