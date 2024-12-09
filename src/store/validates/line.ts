import { i18n } from "../../shared/plugins/i18n";
const { t } = i18n.global;

const lineRules = {
  channel_id: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("store.chanel_id"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("store.chanel_id") }),
    },
  ],
  secret: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("store.channel_secret"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", {
        field: t("store.channel_secret"),
      }),
    },
  ],
  access_token: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("store.access_token"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("store.access_token") }),
    },
  ],
};

export default lineRules;
