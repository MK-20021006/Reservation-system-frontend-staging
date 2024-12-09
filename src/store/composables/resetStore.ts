import { useMeStore } from "~/../../src/shared/stores/me";
import { useAuthStore } from "~/../../src/store/store/store";
import { BreadcrumbStore } from "~/../../src/store/store/breadcrumb";
import { categoryStore } from "~/../../src/store/store/useCategory";
import { DataTableStore } from "~/../../src/store/store/dataTable";
import { CourseStore } from "~/../../src/store/store/useCourse";
import { menuStore } from "~/../../src/store/store/useMenu";
import { userStore } from "~/../../src/store/store/user";
import { useReservation } from "~/../../src/store/store/useReservation";
import { DataDashboardStore } from "~/../../src/store/store/dashboard";

const useStore = {
  useMeStore,
  useAuthStore,
  BreadcrumbStore,
  DataTableStore,
  categoryStore,
  CourseStore,
  menuStore,
  userStore,
  useReservation,
  DataDashboardStore,
};

export default function () {
  const stores = Object.keys(useStore) as Array<keyof typeof useStore>;
  stores.forEach((store) => {
    const state = useStore[store]();
    state.$reset();
  });
}
