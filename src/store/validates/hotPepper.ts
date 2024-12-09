import { i18n } from "../../shared/plugins/i18n";

const { t } = i18n.global;

const hotPepperRules = {
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
  account: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("store.user_id"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", {
        field: t("store.user_id"),
      }),
    },
  ],
  password: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("password"),
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

export default hotPepperRules;
