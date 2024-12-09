import {
  MAX_LENGTH_EMAIL,
  MAX_LENGTH_FIRST_NAME,
  MAX_LENGTH_PHONE_NUMBER,
  MAX_LENGTH_POSTAL_CODE,
  MIN_LENGTH_PHONE_NUMBER,
  MIN_LENGTH_POSTAL_CODE,
  FURIGANA,
  WEBSITE_URL,
  REGEX_EMAIL,
} from "../../shared/utils/validate";

import { i18n } from "../../shared/plugins/i18n";
const { t } = i18n.global;

const introductionRules = {
  name: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("name_store"),
      }),
      trigger: "blur",
    },
    {
      max: MAX_LENGTH_FIRST_NAME,
      message: t("validate.max.field", {
        max: MAX_LENGTH_FIRST_NAME,
        field: t("name_store"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", {
        field: t("name_store"),
      }),
    },
  ],
  name_furigana: [
    {
      max: MAX_LENGTH_FIRST_NAME,
      message: t("validate.max.field", {
        max: MAX_LENGTH_FIRST_NAME,
        field: t("store_name_furigana"),
      }),
      trigger: "blur",
    },
    {
      pattern: FURIGANA,
      message: t("validate.furigana.field", {
        field: t("store_name_furigana"),
      }),
      trigger: "blur",
    },
  ],
  home_page: [
    {
      pattern: WEBSITE_URL,
      message: t("validate.format.field", { field: t("home_page") }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", {
        field: t("home_page"),
      }),
    },
  ],
  email: [
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
  ],
  phone_number: [
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
  postal_code: [
    {
      max: MAX_LENGTH_POSTAL_CODE,
      message: t("validate.postal_code"),
      trigger: "blur",
    },
    {
      min: MIN_LENGTH_POSTAL_CODE,
      message: t("validate.postal_code"),
      trigger: "blur",
    },
  ],
  address: [
    {
      required: true,
      message: t("validate.required.field", { field: t("address") }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("address") }),
    },
  ],
  tag: [
    {
      required: true,
      message: t("validate.required.field", { field: t("genre") }),
      trigger: "blur",
    },
  ],
  address_detail: [
    {
      required: true,
      message: t("validate.required.field", { field: t("address") }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("address") }),
    },
  ],
};

export default introductionRules;
