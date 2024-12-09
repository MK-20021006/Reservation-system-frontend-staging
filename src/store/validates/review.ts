import { i18n } from "../../shared/plugins/i18n";
const { t } = i18n.global;

const reviewRules = {
  content: [
    {
      required: true,
      message: t("validate.required.field", { field: t("reply") }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("reply") }),
    },
  ],
};

export default reviewRules;
