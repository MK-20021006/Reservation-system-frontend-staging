import {
  MAX_LENGTH_EMAIL,
  MAX_LENGTH_PHONE_NUMBER,
  MIN_LENGTH_PHONE_NUMBER,
  REGEX_EMAIL,
} from "../../shared/utils/validate";

import { i18n } from "../../shared/plugins/i18n";
const { t } = i18n.global;

const contactRules = {
  first_name: [
    {
      required: true,
      message: t("validate.required.field", { field: t("first_name_kanji") }),
      trigger: "blur",
    },
  ],
  last_name: [
    {
      required: true,
      message: t("validate.required.field", { field: t("last_name_kanji") }),
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
  phone_number: [
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
  message: [
    {
      required: true,
      message: t("validate.required.field", { field: t("content") }),
      trigger: "blur",
    },
  ],
};

export default contactRules;
