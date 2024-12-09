import { reactive } from "#imports";
import {
  MAX_LENGTH_TEXTAREA,
  MAX_LENGTH_COUPON_CODE,
  MIN_LENGTH_COUPON_CODE,
  MAX_LENGTH_NAME_COUPON,
  REGEX_COUPON_CODE,
} from "../../shared/utils/validate";
import { i18n } from "~/../../src/shared/plugins/i18n";
import {
  validateQuantityCoupon,
  validateQuantityCouponCustomer,
} from "~/../../src/shared/validate/common";
import { STATUS_COUPON } from "~/../../src/shared/constants/coupon";
import moment from "moment";

const { t } = i18n.global;

const couponRules = () => {
  const formCoupon = reactive({
    check_discount: true,
    name: null,
    code: null,
    description: null,
    apply_all: true,
    quantity: null,
    infinite_quantity: true,
    infinite_quantity_customer: 1,
    number_used: null,
    start_date: moment().format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
    status: STATUS_COUPON.ENABLE,
    course_apply: [],
    event_apply: [],
    created_at: null,
    updated_at: null,
    quantity_one_customer: null,
  });
  const formCouponRules = reactive({
    name: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("coupon_name"),
        }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_NAME_COUPON,
        message: t("validate.max.field", {
          max: MAX_LENGTH_NAME_COUPON,
          field: t("coupon_name"),
        }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("coupon_name"),
        }),
      },
    ],
    code: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("coupon_code"),
        }),
        trigger: "blur",
      },
      {
        pattern: REGEX_COUPON_CODE,
        message: t("validate.format.coupon_code"),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_COUPON_CODE,
        message: t("validate.max.coupon_code"),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("coupon_code"),
        }),
      },
    ],
    description: [
      {
        max: MAX_LENGTH_TEXTAREA,
        message: t("validate.format.field", {
          max: MAX_LENGTH_TEXTAREA,
          field: t("terms_of_use"),
        }),
        trigger: "blur",
      },
    ],
    status: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("situation_coupon"),
        }),
        trigger: "blur",
      },
    ],
    quantity: [
      {
        trigger: "blur",
        validator: validateQuantityCoupon(formCoupon),
      },
    ],
    quantity_one_customer: [
      {
        trigger: "blur",
        validator: validateQuantityCouponCustomer(formCoupon),
      },
    ],
    start_date: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("store.reception_day"),
        }),
        trigger: "blur",
      },
    ],
    end_date: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("store.reception_day"),
        }),
        trigger: "blur",
      },
    ],
    situation: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("situation_coupon"),
        }),
        trigger: "blur",
      },
    ],
  });
  return {
    formCoupon,
    formCouponRules,
  };
};
export default couponRules;
