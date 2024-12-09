import { reactive } from "vue";
import { i18n } from "../../shared/plugins/i18n";
import {
  RESERVATION_TYPE,
  STATUS_TYPE,
  STATUS_IS_SETTING_CANCEL,
  HAS_CHECK_TIME_PER,
  TIME_DEFAULT_SETTING,
  DAY_DEFAULT_SETTING,
} from "~/../../src/shared/constants/reservation";
import {
  MAX_LENGTH_EVENT_NAME,
  WEBSITE_URL,
} from "~/../../src/shared/utils/validate";
import { TYPE_FEE } from "~/../../src/shared/constants/event";

const { t } = i18n.global;

const eventRules = () => {
  const formEvent = reactive({
    name: null,
    description: null,
    image_ids: [],
    number_seats: null,
    price: "",
    price_children: "",
    price_adult: "",
    price_child: "",
    price_male: "",
    price_female: "",
    start_date: [Date, Date],
    end_date: null,
    opening_time: "08:00",
    closing_time: "17:00",
    opening_times: [],
    closing_times: [],
    fee_type: TYPE_FEE.SEX,
    reservation_type: RESERVATION_TYPE.TENTATIVE,
    place: null,
    online_link: null,
    published: STATUS_TYPE.PUBLIC,
    is_setting_cancel: STATUS_IS_SETTING_CANCEL.FALSE,
    minute_reservation: null,
    hour_reservation: null,
    day_reservation: DAY_DEFAULT_SETTING,
    has_time_per: HAS_CHECK_TIME_PER.TRUE,
  });
  const formRuleEvent = reactive({
    name: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("event"),
        }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_EVENT_NAME,
        message: t("validate.format.field", {
          max: MAX_LENGTH_EVENT_NAME,
          field: t("event"),
        }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("event"),
        }),
      },
    ],
    number_seats: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("reservable_number"),
        }),
        trigger: "blur",
      },
    ],
    price_adult: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("booking.fee"),
        }),
        trigger: "blur",
      },
    ],
    price_child: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("booking.fee"),
        }),
        trigger: "blur",
      },
    ],
    price_male: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("booking.fee"),
        }),
        trigger: "blur",
      },
    ],
    price_female: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("booking.fee"),
        }),
        trigger: "blur",
      },
    ],
    online_link: [
      {
        pattern: WEBSITE_URL,
        message: t("validate.format.field", { field: t("online_link") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("online_link"),
        }),
      },
    ],
  });

  return {
    formEvent,
    formRuleEvent,
  };
};

export default eventRules;
