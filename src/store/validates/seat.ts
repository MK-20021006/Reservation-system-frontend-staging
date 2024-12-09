import {
  MAX_LENGTH_DEFAULT,
  MAX_LENGTH_DEFAULT_TEXTAREA,
} from "../../shared/utils/validate";

import { i18n } from "../../shared/plugins/i18n";
const { t } = i18n.global;

const seatRules = {
  name: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("seat_name"),
      }),
      trigger: "blur",
    },
    {
      max: MAX_LENGTH_DEFAULT,
      message: t("validate.max.field", {
        max: MAX_LENGTH_DEFAULT,
        field: t("seat_name"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", {
        field: t("seat_name"),
      }),
    },
  ],
  type_seat_id: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("category"),
      }),
      trigger: "change",
    },
  ],
  description: [
    {
      max: MAX_LENGTH_DEFAULT_TEXTAREA,
      message: t("validate.max.field", {
        max: MAX_LENGTH_DEFAULT_TEXTAREA,
        field: t("description"),
      }),
      trigger: "blur",
    },
  ],
  min_capacity: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("store.min_capacity"),
      }),
      trigger: "blur",
    },
  ],
  capacity: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("store.max_capacity"),
      }),
      trigger: "blur",
    },
  ],
  quantity: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("store.number_table"),
      }),
      trigger: "blur",
    },
  ],
};

export default seatRules;
