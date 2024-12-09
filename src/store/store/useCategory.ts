import { defineStore } from "pinia";
import { SortCategoryList, FilterCategoryList } from "~/../../src/store/models";

interface CategoryTableState {
  categoryList: {
    search: FilterCategoryList;
    currentPage?: number;
    pageSize?: number;
    sort: SortCategoryList;
  };
}

export const categoryStore = defineStore("categoryTable", {
  state: () =>
    ({
      categoryList: {
        search: null,
      },
    } as CategoryTableState),

  actions: {
    setCategoryList(filerData: FilterCategoryList) {
      this.categoryList = filerData;
    },
  },
});
