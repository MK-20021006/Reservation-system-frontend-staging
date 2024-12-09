import IconDashboard from "~/../../src/store/components/Icon/Dashboard.vue";
import IconStore from "~/../../src/store/components/Icon/Store.vue";
import IconUser from "~/../../src/store/components/Icon/User.vue";
import IconCalendar from "~/../../src/store/components/Icon/IconCalendar.vue";
import IconExternal from "~/../../src/store/components/Icon/IconExternal.vue";
import IconPayment from "~/../../src/store/components/Icon/IconPayment.vue";
import IconNotice from "~/../../src/store/components/Icon/Notice.vue";
import IconDolar from "~/../../src/store/components/Icon/IconDolar.vue";
import UserSearch from "~/../../src/shared/components/icon/UserSearch.vue";
import IconMessageSidebar from "~/../../src/admin/components/Icon/MessageSidebar.vue";
import IconReview from "~/../../src/store/components/Icon/Review.vue";
import IconPlan from "~/../../src/store/components/Icon/IconPlan.vue";
import IconRevenue from "~/../../src/store/components/Icon/Revenue.vue";
import IconZoom from "~/../../src/store/components/Icon/IconZoom.vue";
import IconJobData from "~/../../src/store/components/Icon/JobData.vue";
import { i18n } from "../../shared/plugins/i18n";
import {
  RESTAURANT,
  SALON,
  EVENT,
  CONSULTATION,
  CLASSROOM,
  MEDIAL_CARE,
} from "~/../../src/shared/constants/category";
import IconGoogle from "~/../../src/store/components/Icon/GoogleSidebar.vue";

const { t } = i18n.global;
export const storeRouters = [
  {
    name: "index",
    icon: IconDashboard,
    title: t("dashboard"),
  },
  {
    icon: IconStore,
    title: t("store.store_setting"),
    name: "store",
    children: [
      {
        name: "store-basic",
        title: t("store.basic_info"),
      },
      // {
      //   name: "store-company",
      //   title: t("store.company_setting"),
      // },
      {
        name: "store-category",
        title: t("store.list_category"),
        typeStore: [RESTAURANT, SALON, CONSULTATION, CLASSROOM, MEDIAL_CARE],
        children: [
          {
            name: "store-category-create",
            title: t("store.category_create"),
            hidden: true,
          },
          {
            name: "store-category-edit-id",
            title: t("store.category_edit"),
            hidden: true,
          },
        ],
      },
      {
        name: "store-course",
        title: t("title_screen.coupon_management"),
        typeStore: [SALON],
        children: [
          {
            name: "store-course-create",
            title: t("title_screen.create_new_coupon"),
            hidden: true,
          },
          {
            name: "store-course-edit-id",
            title: t("title_screen.edit_coupon"),
            hidden: true,
          },
        ],
      },
      {
        name: "store-course",
        title: t("store.course_management"),
        typeStore: [RESTAURANT, CONSULTATION, CLASSROOM, MEDIAL_CARE],
        children: [
          {
            name: "store-course-create",
            title: t("store.course_create"),
            hidden: true,
          },
          {
            name: "store-course-edit-id",
            title: t("store.course_edit"),
            hidden: true,
          },
        ],
      },
      {
        name: "store-menu",
        title: t("store.menu_setting"),
        typeStore: [RESTAURANT, SALON, CONSULTATION, CLASSROOM, MEDIAL_CARE],
        children: [
          {
            name: "store-menu-create",
            title: t("store.menu_create"),
            hidden: true,
          },
          {
            name: "store-menu-edit-id",
            title: t("store.menu_edit"),
            hidden: true,
          },
        ],
      },
      {
        name: "store-seat",
        title: t("store.seat_management"),
        typeStore: [RESTAURANT],
        children: [
          {
            name: "store-seat-create",
            title: t("title_screen.new_seat"),
            hidden: true,
          },
          {
            name: "store-seat-edit-id",
            title: t("title_screen.seat_detail"),
            hidden: true,
          },
        ],
      },
      {
        name: "store-event",
        title: t("store.event_management"),
        typeStore: [EVENT],
        children: [
          {
            name: "store-event-create",
            title: t("title_screen.create_event"),
            hidden: true,
          },
          {
            name: "store-event-edit-id",
            title: t("title_screen.edit_event"),
            hidden: true,
          },
        ],
      },
      {
        name: "store-coupon",
        title: t("title_screen.coupon_management"),
        typeStore: [RESTAURANT, EVENT],
        children: [
          {
            name: "store-coupon-create",
            title: t("title_screen.create_new_coupon"),
            hidden: true,
          },
          {
            name: "store-coupon-edit-id",
            title: t("title_screen.edit_coupon"),
            hidden: true,
          },
        ],
      },
      {
        name: "store-staff",
        title: t("store.staff_management"),
        typeStore: [SALON, CONSULTATION, CLASSROOM, MEDIAL_CARE],
        children: [
          {
            name: "store-staff-create",
            title: t("title_screen.create_staff"),
            hidden: true,
          },
          {
            name: "store-staff-edit-id",
            title: t("title_screen.detail_staff"),
            hidden: true,
          },
        ],
      },
      {
        name: "store-device",
        title: t("store.device.title_screen"),
        typeStore: [SALON, CONSULTATION, CLASSROOM, MEDIAL_CARE],
        children: [
          {
            name: "store-device-create",
            title: t("title_screen.create_device"),
            hidden: true,
          },
          {
            name: "store-device-detail-id",
            title: t("title_screen.detail_device"),
            hidden: true,
          },
        ],
      },
    ],
  },
  {
    name: "customer",
    icon: IconUser,
    title: t("title_screen.customer_list"),
    children: [
      {
        name: "customer-detail-id",
        title: t("title_screen.detail_customer"),
        hidden: true,
      },
      {
        name: "customer-create",
        title: t("title_screen.detail_customer"),
        hidden: true,
      },
    ],
  },
  {
    name: "notice",
    icon: IconNotice,
    title: t("title_screen.notices"),
  },
  {
    name: "reviews",
    icon: IconReview,
    title: t("title_screen.review_customer"),
  },
  {
    name: "change-password",
    hidden: true,
    title: t("title_screen.change_password"),
  },
  {
    name: "plan",
    icon: IconPlan,
    title: t("title_screen.plan_setting"),
  },
  {
    name: "reservation",
    icon: IconCalendar,
    title: t("reservations"),
    children: [
      {
        name: "reservation-create",
        title: t("title_screen.reservation_create"),
        hidden: true,
      },
      {
        name: "reservation-detail-id",
        title: t("title_screen.reservation_detail"),
        hidden: true,
      },
    ],
  },
  {
    name: "invoices",
    icon: IconDolar,
    title: t("store.sales_management"),
    children: [
      {
        name: "invoices-edit-id",
        title: t("title_screen.details_revenue"),
        hidden: true,
      },
    ],
  },
  {
    name: "messages",
    icon: IconMessageSidebar,
    title: t("title_screen.list_message_store"),
    children: [
      {
        name: "messages-create",
        title: t("title_screen.create_message_store"),
        hidden: true,
      },
      {
        name: "messages-detail-id",
        title: t("title_screen.message_detail_store"),
        hidden: true,
      },
    ],
  },
  {
    name: "external-site",
    icon: IconExternal,
    title: t("store.external_site_linkage_setting"),
    settingSite: true,
  },
  {
    name: "connect-google",
    icon: IconGoogle,
    title: t("store.google_linkage_settings"),
    typeStore: [RESTAURANT],
    settingGoogle: true,
  },
  {
    name: "recruitment-information-setting",
    icon: UserSearch,
    title: t("recruitment_information_setting"),
    haveRecruitment: true,
    children: [
      {
        name: "recruitment-information-setting-create",
        title: t("title_screen.create_recruitment"),
        hidden: true,
      },
      {
        name: "recruitment-information-setting-edit-id",
        title: t("title_screen.edit_recruitment"),
        hidden: true,
      },
    ],
  },
  {
    name: "connect-zoom",
    icon: IconZoom,
    title: t("store.zoom_linkage_settings"),
    typeStore: [EVENT],
    settingZoom: true,
  },
  {
    name: "payment-setting",
    icon: IconPayment,
    title: t("store.payment_setting"),
  },
  {
    name: "revenue",
    icon: IconRevenue,
    title: t("title_screen.list_revenue_store"),
    children: [
      {
        name: "revenue-detail-id",
        title: t("store.revenue"),
        hidden: true,
      },
    ],
  },
  {
    name: "job-data",
    icon: IconJobData,
    title: t("title_screen.jod_data_store"),
    typeStore: [RESTAURANT, SALON],
  },
];
