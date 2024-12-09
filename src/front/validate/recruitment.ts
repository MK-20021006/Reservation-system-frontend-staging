import { i18n } from "../../shared/plugins/i18n";
import {
  MAX_LENGTH_EMAIL,
  MAX_LENGTH_FIRST_NAME,
  MAX_LENGTH_LAST_NAME,
  MAX_LENGTH_PHONE_NUMBER,
  MIN_LENGTH_PHONE_NUMBER,
  REGEX_EMAIL,
} from "~/../../src/shared/utils/validate";
const { t } = i18n.global;

const recruitmentRules = {
  first_name: [
    {
      required: true,
      message: t("validate.required.field", { field: t("first_name_kanji") }),
      trigger: "blur",
    },
    {
      max: MAX_LENGTH_FIRST_NAME,
      message: t("validate.max.field", {
        max: MAX_LENGTH_FIRST_NAME,
        field: t("first_name_kanji"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("first_name_kanji") }),
    },
  ],
  last_name: [
    {
      required: true,
      message: t("validate.required.field", { field: t("last_name_kanji") }),
      trigger: "blur",
    },
    {
      max: MAX_LENGTH_LAST_NAME,
      message: t("validate.max.field", {
        max: MAX_LENGTH_LAST_NAME,
        field: t("last_name_kanji"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("last_name_kanji") }),
    },
  ],
  gender: [
    {
      required: true,
      message: t("validate.required.field", { field: t("gender") }),
      trigger: "blur",
    },
  ],
  birthday: [
    {
      required: true,
      message: t("validate.required.field", { field: t("birth_day") }),
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: t("validate.required.field", { field: t("email_address") }),
      trigger: "blur",
    },
    {
      max: MAX_LENGTH_EMAIL,
      message: t("validate.max.field", {
        max: MAX_LENGTH_EMAIL,
        field: t("email_address"),
      }),
      trigger: "blur",
    },
    {
      pattern: REGEX_EMAIL,
      message: t("validate.format.field", { field: t("email_address") }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("email_address") }),
    },
  ],
  phone: [
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
    {
      max: MAX_LENGTH_PHONE_NUMBER,
      message: t("validate.max.phone_number", {
        max: MAX_LENGTH_PHONE_NUMBER,
        min: MIN_LENGTH_PHONE_NUMBER,
        field: t("phone_number"),
      }),
      trigger: "blur",
    },
    {
      min: MIN_LENGTH_PHONE_NUMBER,
      message: t("validate.min.phone_number", {
        max: MAX_LENGTH_PHONE_NUMBER,
        min: MIN_LENGTH_PHONE_NUMBER,
        field: t("phone_number"),
      }),
      trigger: "blur",
    },
  ],
  position: [
    {
      required: true,
      message: t("validate.required.field", { field: t("occupation") }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("occupation") }),
    },
  ],
};

export default recruitmentRules;
