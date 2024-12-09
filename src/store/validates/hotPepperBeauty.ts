import { WEBSITE_FORMAT } from "~/../../src/shared/utils/validate";
import { i18n } from "~/../../src/shared/plugins/i18n";

const { t } = i18n.global;

const hotPepperBeautyRules = {
  identity_from_mail: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("name_store"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("name_store") }),
    },
  ],
};

export default hotPepperBeautyRules;
