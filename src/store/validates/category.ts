import {
  MAX_LENGTH_CATEGORY_NAME,
  MAX_LENGTH_CATEGORY_DESCRIPTION,
} from "../../shared/utils/validate";

import { i18n } from "../../shared/plugins/i18n";
const { t } = i18n.global;

const categoryRules = {
  parent_id: [
    {
      type: "array",
      required: true,
      message: t("validate.required.field", {
        field: t("store.category_title"),
      }),
      trigger: "blur",
    },
  ],
  name: [
    {
      required: true,
      message: t("validate.required.field", {
        field: t("store.item_name"),
      }),
      trigger: "blur",
    },
    {
      max: MAX_LENGTH_CATEGORY_NAME,
      message: t("validate.format.field", {
        max: MAX_LENGTH_CATEGORY_NAME,
        field: t("store.item_name"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", {
        field: t("store.item_name"),
      }),
    },
  ],
  description: [
    {
      max: MAX_LENGTH_CATEGORY_DESCRIPTION,
      message: t("validate.format.field", {
        max: MAX_LENGTH_CATEGORY_DESCRIPTION,
        field: t("description"),
      }),
      trigger: "blur",
    },
  ],
};

export default categoryRules;
