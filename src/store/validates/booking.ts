import {
  FORMAT_NUMBER,
  MAX_LENGTH_EMAIL,
  REGEX_EMAIL,
  FURIGANA,
} from "~/../../src/shared/utils/validate";
import { i18n } from "../../shared/plugins/i18n";
import { useMeStore } from "~/../../src/shared/stores/me";
import { RESTAURANT } from "~/../../src/shared/constants/category";
import { reactive } from "vue";

const { t } = i18n.global;
export const bookingRules = () => {
  const meStore = useMeStore();
  const rules = reactive({
    number_adult: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("adult"),
        }),
        trigger: ["blur", "change"],
      },
    ],
    number_children: [
      {
        pattern: FORMAT_NUMBER,
        message: t("validate.format.field", { field: t("child") }),
        trigger: "blur",
      },
    ],
    course_id: [
      {
        required: meStore.typeStore === RESTAURANT,
        message: t("validate.required.field", { field: t("course") }),
        trigger: "change",
      },
    ],
    order_first_name: [
      {
        required: true,
        message: t("validate.required.field", { field: t("first_name_kanji") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("first_name_kanji") }),
      },
    ],
    order_last_name: [
      {
        required: true,
        message: t("validate.required.field", { field: t("last_name_kanji") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("last_name_kanji") }),
      },
    ],
    order_email: [
      {
        max: MAX_LENGTH_EMAIL,
        message: t("validate.max.field", {
          field: t("email_address"),
          max: MAX_LENGTH_EMAIL,
        }),
        trigger: "blur",
      },
      {
        pattern: REGEX_EMAIL,
        message: t("validate.format.field", { field: t("email_address") }),
        trigger: "blur",
      },
    ],
    order_phone_number: [
      {
        required: true,
        message: t("validate.required.field", { field: t("phone_number") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("phone_number") }),
      },
    ],
    event_id: [
      {
        required: true,
        message: t("validate.required.field", { field: t("event") }),
        trigger: "change",
      },
    ],
    order_first_name_kana: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("first_name_hiragana"),
        }),
        trigger: "blur",
      },
      // {
      //   pattern: FURIGANA,
      //   message: t("validate.furigana.field", {
      //     field: t("first_name_hiragana"),
      //   }),
      //   trigger: "blur",
      // },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("first_name_hiragana"),
        }),
      },
    ],
    order_last_name_kana: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("last_name_hiragana"),
        }),
        trigger: "blur",
      },
      // {
      //   pattern: FURIGANA,
      //   message: t("validate.furigana.field", { field: t("last_name_hiragana") }),
      //   trigger: "blur",
      // },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("last_name_hiragana"),
        }),
      },
    ],
  });
  return {
    rules,
  };
};

export const cancelBookingRules = {
  reason: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("store.reason_cancel"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", {
        field: t("store.reason_cancel"),
      }),
    },
  ],
};
