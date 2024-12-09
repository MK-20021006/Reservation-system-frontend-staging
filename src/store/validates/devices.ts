import { i18n } from "~/../../src/shared/plugins/i18n";
const { t } = i18n.global;

const deviceRules = {
  name: [
    {
      required: true,
      message: t("validate.required.field", { field: t("device_name") }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("device_name") }),
    },
  ],
  number_booking_device: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("store.device.simultaneous_receptions"),
      }),
      trigger: "blur",
    },
  ],
};

export default deviceRules;
