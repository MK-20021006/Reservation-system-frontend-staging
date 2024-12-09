import { defineStore } from "pinia";

interface BreadcrumbInterface {
  name?: string;
  title?: string;
  hidden?: boolean;
  children?: unknown;
}

interface BreadcrumbState {
  breadcrumb: BreadcrumbInterface[];
}

export const BreadcrumbStore = defineStore("breadcrumb", {
  state: () =>
    ({
      breadcrumb: [],
    } as BreadcrumbState),
  actions: {
    setBreadcrumb(value: BreadcrumbInterface[]) {
      this.breadcrumb = value;
    },
  },
});
