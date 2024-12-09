import {
  MAX_LENGTH_SMS_CODE,
  MIN_LENGTH_SMS_CODE,
} from "../../shared/utils/validate";
import { i18n } from "../../shared/plugins/i18n";

const { t } = i18n.global;
const ruleCode = {
  code: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("front.confirmation_code"),
      }),
      trigger: "blur",
    },
    {
      max: MAX_LENGTH_SMS_CODE,
      message: t("validate.max.field", {
        max: MAX_LENGTH_SMS_CODE,
        field: t("front.confirmation_code"),
      }),
      trigger: "blur",
    },
    {
      min: MIN_LENGTH_SMS_CODE,
      message: t("validate.min.field", {
        min: MIN_LENGTH_SMS_CODE,
        field: t("front.confirmation_code"),
      }),
      trigger: "blur",
    },
  ],
};
export default ruleCode;
