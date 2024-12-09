import { i18n } from "../../shared/plugins/i18n";
import {
  MAX_LENGTH_EMAIL,
  REGEX_EMAIL,
  FURIGANA,
  MAX_LENGTH_PHONE_NUMBER,
  MIN_LENGTH_PHONE_NUMBER,
  MAX_LENGTH_POSTAL_CODE,
  MIN_LENGTH_POSTAL_CODE,
} from "~/../../src/shared/utils/validate";
import { reactive } from "vue";
import { validateConfirmEmail } from "~/../../src/shared/validate/common";

const { t } = i18n.global;

export const ruleRegistrationStore = () => {
  const formData = reactive({
    type_store_id: null,
    name: "",
    first_company_name: "",
    last_company_name: "",
    first_company_name_kana: "",
    last_company_name_kana: "",
    company_store: "",
    phone_number: "",
    email: "",
    email_confirm: "",
    postal_code: "",
    address: "",
    address_detail: "",
    inquiry: "",
    isAgree: false,
  });

  const rules = reactive({
    type_store_id: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("store.customer_industry"),
        }),
        trigger: "change",
      },
    ],
    first_company_name: [
      {
        required: true,
        message: t("validate.required.field", { field: t("first_name_kanji") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("first_name_kanji") }),
      },
    ],
    last_company_name: [
      {
        required: true,
        message: t("validate.required.field", { field: t("last_name_kanji") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("last_name_kanji") }),
      },
    ],
    first_company_name_kana: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("sur_name"),
        }),
        trigger: "blur",
      },
      {
        pattern: FURIGANA,
        message: t("validate.furigana.field", { field: t("sur_name") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("sur_name"),
        }),
      },
    ],
    last_company_name_kana: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("may_name"),
        }),
        trigger: "blur",
      },
      {
        pattern: FURIGANA,
        message: t("validate.furigana.field", { field: t("may_name") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("may_name"),
        }),
      },
    ],
    name: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("store_name"),
        }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("store_name"),
        }),
      },
    ],
    phone_number: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("phone_number"),
        }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("phone_number") }),
      },
      {
        max: MAX_LENGTH_PHONE_NUMBER,
        message: t("validate.max.phone_number", {
          max: MAX_LENGTH_PHONE_NUMBER,
          min: MIN_LENGTH_PHONE_NUMBER,
          field: t("phone_number"),
        }),
        trigger: "blur",
      },
      {
        min: MIN_LENGTH_PHONE_NUMBER,
        message: t("validate.min.phone_number", {
          max: MAX_LENGTH_PHONE_NUMBER,
          min: MIN_LENGTH_PHONE_NUMBER,
          field: t("phone_number"),
        }),
        trigger: "blur",
      },
    ],
    email: [
      {
        required: true,
        message: t("validate.required.field", { field: t("email_address") }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_EMAIL,
        message: t("validate.format.field", {
          max: MAX_LENGTH_EMAIL,
          field: t("email_address"),
        }),
        trigger: "blur",
      },
      {
        pattern: REGEX_EMAIL,
        message: t("validate.format.field", { field: t("email_address") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("email_address") }),
      },
    ],
    email_confirm: [
      {
        required: true,
        message: t("validate.required.field", { field: t("email_address") }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_EMAIL,
        message: t("validate.format.field", {
          max: MAX_LENGTH_EMAIL,
          field: t("email_address"),
        }),
        trigger: "blur",
      },
      {
        pattern: REGEX_EMAIL,
        message: t("validate.format.field", { field: t("email_address") }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("email_address") }),
      },
      {
        trigger: "blur",
        validator: validateConfirmEmail(formData),
      },
    ],
    postal_code: [
      {
        max: MAX_LENGTH_POSTAL_CODE,
        message: t("validate.postal_code"),
        trigger: "blur",
      },
      {
        min: MIN_LENGTH_POSTAL_CODE,
        message: t("validate.postal_code"),
        trigger: "blur",
      },
    ],
  });

  return {
    formData,
    rules,
  };
};
