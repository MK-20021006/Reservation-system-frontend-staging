import { i18n } from "../../shared/plugins/i18n";
import {
  REGEX_EMAIL,
  MAX_LENGTH_EMAIL,
  MAX_LENGTH_PHONE_NUMBER,
  MAX_LENGTH_FIRST_NAME,
  MAX_LENGTH_LAST_NAME,
  MIN_LENGTH_PHONE_NUMBER,
  FURIGANA,
} from "../../shared/utils/validate";

const { t } = i18n.global;

const forgotPasswordRules = {
  email: [
    {
      required: true,
      message: t("validate.required.field", { field: t("email_address") }),
      trigger: "blur",
    },
    {
      max: MAX_LENGTH_EMAIL,
      message: t("validate.format.field", {
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
  first_name_kana: [
    {
      required: true,
      message: t("validate.required.field", { field: t("first_name_kanji") }),
      trigger: "blur",
    },
    {
      pattern: FURIGANA,
      message: t("validate.furigana.field", { field: t("first_name_kanji") }),
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
  last_name_kana: [
    {
      required: true,
      message: t("validate.required.field", { field: t("last_name_kanji") }),
      trigger: "blur",
    },
    {
      pattern: FURIGANA,
      message: t("validate.furigana.field", { field: t("last_name_kanji") }),
      trigger: "blur",
    },
    {
      max: MAX_LENGTH_LAST_NAME,
      message: t("validate.max.field", {
        max: MAX_LENGTH_LAST_NAME,
        field: t("first_name_kanji"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("last_name_kanji") }),
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
  birth_day: [
    {
      required: true,
      message: t("validate.required.field", { field: t("birthday") }),
      trigger: "blur",
    },
  ],
};

export default forgotPasswordRules;
