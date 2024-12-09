import { i18n } from "../../shared/plugins/i18n";
import {
  REGEX_EMAIL,
  MAX_LENGTH_EMAIL,
  MAX_LENGTH_PASSWORD,
  MIN_LENGTH_PASSWORD,
} from "../../shared/utils/validate";

const { t } = i18n.global;

const googleRules = {
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
  password: [
    {
      required: true,
      message: t("validate.required.field", { field: t("password") }),
      trigger: "blur",
    },
    {
      max: MAX_LENGTH_PASSWORD,
      message: t("validate.max.password", {
        field: t("password"),
        min: MIN_LENGTH_PASSWORD,
        max: MAX_LENGTH_PASSWORD,
      }),
      trigger: "blur",
    },
    {
      min: MIN_LENGTH_PASSWORD,
      message: t("validate.min.password", {
        field: t("password"),
        min: MIN_LENGTH_PASSWORD,
        max: MAX_LENGTH_PASSWORD,
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("password") }),
    },
  ],
};

export default googleRules;
