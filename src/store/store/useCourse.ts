import { defineStore } from "pinia";
import { FilterCourseList, SortCourseList } from "~/../../src/store/models";

interface CourseTableState {
  courseList: {
    search: FilterCourseList;
    currentPage?: number;
    pageSize?: number;
    sort: SortCourseList;
  };
}

export const CourseStore = defineStore("courseTable", {
  state: () =>
    ({
      courseList: {
        search: null,
      },
    } as CourseTableState),

  actions: {
    setCourseList(filerData: FilterCourseList) {
      this.courseList = filerData;
    },
  },
});
