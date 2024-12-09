import {
  MAX_LENGTH_DEFAULT,
  MAX_LENGTH_DEFAULT_TEXTAREA,
  MAX_LENGTH_EMAIL,
  MAX_WORK_YEAR,
  MIN_WORK_YEAR,
} from "../../shared/utils/validate";
import { i18n } from "../../shared/plugins/i18n";
const { t } = i18n.global;

export const staffRules = {
  name: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("full_name"),
      }),
      trigger: "blur",
    },
    {
      max: MAX_LENGTH_DEFAULT,
      message: t("validate.format.field", {
        max: MAX_LENGTH_DEFAULT,
        field: t("full_name"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("full_name") }),
    },
  ],
  fee: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("store.nomination_fee"),
      }),
      trigger: "blur",
    },
  ],
};
