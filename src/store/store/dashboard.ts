import { defineStore } from "pinia";

interface DataDashboardState {
  sale_month: {
    start: string | null;
    end: string | null;
  };
  sale_week: {
    start: string | null;
    end: string | null;
  };
  sale_day: {
    start: string | null;
    end: string | null;
  };
  visit_month: {
    start: string | null;
    end: string | null;
  };
  visit_week: {
    start: string | null;
    end: string | null;
  };
  visit_day: {
    start: string | null;
    end: string | null;
  };
  reservation: {
    start: string | null;
    end: string | null;
  };
  mode_visit: string | null;
  mode_sale: string | null;
}
export const DataDashboardStore = defineStore("dataDashboard", {
  state: () =>
    ({
      sale_month: {
        start: null,
        end: null,
      },
      sale_week: {
        start: null,
        end: null,
      },
      sale_day: {
        start: null,
        end: null,
      },
      visit_month: {
        start: null,
        end: null,
      },
      visit_week: {
        start: null,
        end: null,
      },
      visit_day: {
        start: null,
        end: null,
      },
      reservation: {
        start: null,
        end: null,
      },
      mode_visit: null,
      mode_sale: null,
    } as DataDashboardState),
});
