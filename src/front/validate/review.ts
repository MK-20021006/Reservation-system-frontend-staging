import {
  MAX_LENGTH_NAME_REVIEW,
  MAX_LENGTH_CONTENT_REVIEW,
} from "../../shared/utils/validate";

import { i18n } from "../../shared/plugins/i18n";
const { t } = i18n.global;

const reviewRules = {
  nickname: [
    {
      required: true,
      message: t("validate.required.field", { field: t("nick_name") }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("nick_name") }),
    },
  ],
  gender: [
    {
      required: true,
      message: t("validate.required.field", { field: t("gender") }),
      trigger: "blur",
    },
  ],
  age: [
    {
      required: true,
      message: t("validate.required.field", { field: t("era") }),
      trigger: "blur",
    },
  ],
  title: [
    {
      required: true,
      message: t("validate.required.field", { field: t("title_keyword") }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("title_keyword") }),
    },
  ],
  content: [
    {
      required: true,
      message: t("validate.required.field", { field: t("content") }),
      trigger: "blur",
    },
    {
      max: MAX_LENGTH_CONTENT_REVIEW,
      message: t("validate.max.field", {
        max: MAX_LENGTH_CONTENT_REVIEW,
        field: t("content"),
      }),
      trigger: "blur",
    },
    {
      whitespace: true,
      trigger: "blur",
      message: t("validate.required.field", { field: t("content") }),
    },
  ],
};

export default reviewRules;
