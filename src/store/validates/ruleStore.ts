import {
  FURIGANA,
  MAX_LENGTH_EMAIL,
  REGEX_EMAIL,
  WEBSITE_URL,
  MAX_LENGTH_PHONE_NUMBER,
  MIN_LENGTH_PHONE_NUMBER,
  MAX_LENGTH_POSTAL_CODE,
  MIN_LENGTH_POSTAL_CODE,
} from "~/../../src/shared/utils/validate";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { SPECIAL_AGENT_CODE } from "~/../../src/shared/utils/validate";

const { t } = i18n.global;

export const ruleStore = {
  name: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("store_name"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("store_name") }),
    },
  ],
  type_store_id: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("industry"),
      }),
      trigger: "change",
    },
  ],
  first_company_name: [
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
  last_company_name: [
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
  first_company_name_kana: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("sur_name"),
      }),
      trigger: "blur",
    },
    {
      pattern: FURIGANA,
      message: t("validate.furigana.field", { field: t("sur_name") }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", {
        field: t("sur_name"),
      }),
    },
  ],
  last_company_name_kana: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("may_name"),
      }),
      trigger: "blur",
    },
    {
      pattern: FURIGANA,
      message: t("validate.furigana.field", { field: t("may_name") }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", {
        field: t("may_name"),
      }),
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
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("email_address") }),
    },
  ],
  email_for_notification_reception: [
    {
      required: true,
      message: t("validate.required.field", {
        field: `${t("email_address")} (${t("receive_notice")}) `,
      }),
      trigger: "blur",
    },
    {
      max: MAX_LENGTH_EMAIL,
      message: t("validate.max.field", {
        field: `${t("email_address")} (${t("receive_notice")}) `,
        max: MAX_LENGTH_EMAIL,
      }),
      trigger: "blur",
    },
    {
      pattern: REGEX_EMAIL,
      message: t("validate.format.field", {
        field: `${t("email_address")} (${t("receive_notice")}) `,
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", {
        field: `${t("email_address")} (${t("receive_notice")}) `,
      }),
    },
  ],
  phone_number: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("phone_number"),
      }),
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
  operational_manager_first_name: [
    {
      pattern: FURIGANA,
      message: t("validate.furigana.field", { field: t("sur_name") }),
      trigger: "blur",
    },
  ],
  operational_manager_last_name: [
    {
      pattern: FURIGANA,
      message: t("validate.furigana.field", { field: t("may_name") }),
      trigger: "blur",
    },
  ],
  image_id: [
    {
      required: true,
      message: t("validate.required.field", { field: t("image") }),
      trigger: "blur",
    },
  ],
  link_google_map: [
    {
      pattern: WEBSITE_URL,
      message: t("validate.format.field", { field: t("google_map_link") }),
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
  postal_code: [
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("postal_code") }),
    },
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
  agent_code: [
    {
      pattern: SPECIAL_AGENT_CODE,
      message: t("validate.format.agent_code"),
      trigger: "blur",
    },
  ],
};
