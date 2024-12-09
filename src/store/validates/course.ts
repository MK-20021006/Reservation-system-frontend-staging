import {
  MAX_DAY_SUBMIT,
  MAX_LENGTH_DEFAULT,
  MAX_LENGTH_DEFAULT_TEXTAREA,
  MAX_LENGTH_COURSE_ITEM,
} from "../../shared/utils/validate";

import {
  validatePriceChildrenCourse,
  validatePriceCourse,
} from "~/../../src/shared/validate/common";

import { i18n } from "../../shared/plugins/i18n";
import { reactive } from "vue";
import { validateConfirmStartEndTime } from "../../shared/validate/common";
import {
  STATUS_TYPE,
  RESERVATION_TYPE,
  ACCEPTED_CHILDREN,
  COURSE_TYPE,
  STATUS_IS_SETTING_CANCEL,
  HAS_CHECK_TIME_PER,
  TIME_DEFAULT_SETTING,
  DAY_DEFAULT_SETTING,
} from "~/../../src/shared/constants/reservation";
import { SALON } from "~/../../src/shared/constants/category";

const { t } = i18n.global;

const courseRules = (isSalon: boolean) => {
  const formCourse = reactive({
    store_id: null,
    name: "",
    contents: "",
    min_capacity: null,
    start_time: "08:00",
    end_time: "17:00",
    image: [],
    max_capacity: null,
    product_number: null,
    day_works: [],
    payment_type: RESERVATION_TYPE.TENTATIVE,
    price: null,
    price_children: null,
    stay_time: null,
    created_at: "",
    updated_at: "",
    status: STATUS_TYPE.PUBLIC,
    hour: null,
    minute: null,
    hour_reservation: null,
    day_reservation: DAY_DEFAULT_SETTING,
    minute_reservation: null,
    accepted_children: ACCEPTED_CHILDREN.NONE,
    apply_all_staff: true,
    staff_ids: [],
    course_type: COURSE_TYPE.GENERALLY,
    tag: [],
    is_setting_cancel: STATUS_IS_SETTING_CANCEL.FALSE,
    has_time_per: HAS_CHECK_TIME_PER.TRUE,
  });

  const formCourseRules = reactive({
    status: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("store.publication_status"),
        }),
        trigger: "blur",
      },
    ],
    name: [
      {
        required: true,
        message: t("validate.required.field", {
          field: !isSalon ? t("store.course_name") : t("coupon_name"),
        }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_DEFAULT,
        message: t("validate.format.field", {
          max: MAX_LENGTH_DEFAULT,
          field: t("store.course_name"),
        }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("store.course_name"),
        }),
      },
    ],
    price: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("unit_price"),
        }),
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validatePriceCourse(formCourse),
      },
    ],
    price_children: [
      {
        trigger: "blur",
        validator: validatePriceChildrenCourse(formCourse),
        message: t("validate.required.field", {
          field: t("price_children"),
        }),
      },
    ],
    product_number: [
      {
        type: "number",
        required: true,
        message: t("validate.required.field", {
          field: t("store.number_of_item"),
        }),
        trigger: "blur",
      },
      {
        type: "number",
        max: MAX_LENGTH_COURSE_ITEM,
        message: t("validate.format.field", {
          max: MAX_LENGTH_COURSE_ITEM,
          field: t("store.number_of_item"),
        }),
        trigger: "blur",
      },
      {
        type: "number",
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("store.number_of_item"),
        }),
      },
    ],
    payment_type: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("reservation_type"),
        }),
        trigger: "blur",
      },
    ],
    accepted_children: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("accepted_children"),
        }),
        trigger: "blur",
      },
    ],
    amStartEndTime: [
      {
        required: true,
        trigger: "blur",
        validator: validateConfirmStartEndTime(formCourse),
      },
    ],
    contents: [
      {
        max: MAX_LENGTH_DEFAULT_TEXTAREA,
        message: t("validate.format.field", {
          max: MAX_LENGTH_DEFAULT_TEXTAREA,
          field: t("description"),
        }),
        trigger: "blur",
      },
    ],
    day_works: [
      {
        type: "array",
        required: true,
        message: t("validate.required.field", {
          field: t("store.reception_day"),
        }),
        trigger: "blur",
      },
      {
        type: "array",
        max: MAX_DAY_SUBMIT,
        message: t("validate.format.field", {
          max: MAX_DAY_SUBMIT,
          field: t("store.reception_day"),
        }),
        trigger: "blur",
      },
    ],
  });

  return {
    formCourse,
    formCourseRules,
  };
};

export default courseRules;
