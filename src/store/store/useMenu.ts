import { defineStore } from "pinia";
import { FilterMenuList, SortMenuList } from "~/../../src/store/models";

interface MenuTableState {
  menuList: {
    search: FilterMenuList;
    currentPage?: number;
    pageSize?: number;
    sort: SortMenuList;
  };
}

export const menuStore = defineStore("menuTable", {
  state: () =>
    ({
      menuList: {
        search: null,
      },
    } as MenuTableState),

  actions: {
    setMenuList(filerData: FilterMenuList) {
      this.menuList = filerData;
    },
  },
});
