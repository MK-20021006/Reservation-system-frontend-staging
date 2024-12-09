import { defineStore } from "pinia";
import TypeRequest from "../../shared/requests/TypeRequest";

interface TypeStore {
  id: number;
  name: string;
}

interface TypeStoreState {
  type: TypeStore[];
}

export const useTypeStore = defineStore("typeStore", {
  state: () =>
    ({
      type: [],
    } as TypeStoreState),
  actions: {
    async updateType() {
      const res = await TypeRequest.getAllType("store");
      if (res.data) {
        this.type = res.data;
      }
    },
    clear() {
      this.type = [];
    },
  },
  persist: true,
});
