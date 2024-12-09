import { MAX_LENGTH_NAME } from "../../shared/utils/validate";

import { i18n } from "../../shared/plugins/i18n";

const { t } = i18n.global;

const paymentRules = {
  holder: [
    {
      required: true,
      message: t("validate.required.field", { field: t("full_name_kanji") }),
      trigger: "blur",
    },
    {
      max: MAX_LENGTH_NAME,
      message: t("validate.max.field", {
        max: MAX_LENGTH_NAME,
        field: t("full_name_kanji"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("full_name_kanji") }),
    },
  ],
  number: [
    {
      required: true,
      message: t("validate.required.field", { field: t("booking.card") }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("booking.card") }),
    },
  ],
  dateCard: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("booking.date_expired"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", {
        field: t("booking.date_expired"),
      }),
    },
  ],
  cvv: [
    {
      required: true,
      message: t("validate.required.field", { field: t("booking.cvc") }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("booking.cvc") }),
    },
  ],
};

export default paymentRules;
