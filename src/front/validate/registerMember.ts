import { reactive } from "vue";
import {
  MAX_LENGTH_EMAIL,
  MAX_LENGTH_PASSWORD,
  MIN_LENGTH_PASSWORD,
  MIN_LENGTH_PHONE_NUMBER,
  MAX_LENGTH_PHONE_NUMBER,
  REGEX_EMAIL,
  MAX_LENGTH_FIRST_NAME,
  FURIGANA,
  MAX_LENGTH_LAST_NAME,
  MAX_LENGTH_POSTAL_CODE,
  MIN_LENGTH_POSTAL_CODE,
  FORMAT_PASSWORD,
  SPECIAL_PASSWORD,
} from "../../shared/utils/validate";
import { i18n } from "../../shared/plugins/i18n";
import { ROLES } from "../../shared/constants/roles";
import { validateConfirmPassword } from "../../shared/validate/common";
import { GENDER } from "~/../../src/shared/constants/user";

const { t } = i18n.global;
const registerMemberRules = () => {
  const formRegister = reactive({
    role_type: ROLES.CUSTOMER,
    first_name_kana: "",
    last_name_kana: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    password_confirmation: "",
    postal_code: "",
    address: "",
    address_detail: "",
    birth_day: "",
    gender: GENDER.OTHER,
    sns_type: "",
    sns_id: "",
  });
  const rules = {
    first_name_kana: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("first_name_hiragana"),
        }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_FIRST_NAME,
        message: t("validate.max.field", {
          max: MAX_LENGTH_FIRST_NAME,
          field: t("first_name_hiragana"),
        }),
        trigger: "blur",
      },
      // {
      //   pattern: FURIGANA,
      //   message: t("validate.furigana.field", { field: t("sur_name") }),
      //   trigger: "blur",
      // },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("first_name_hiragana"),
        }),
      },
    ],
    last_name_kana: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("last_name_hiragana"),
        }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_LAST_NAME,
        message: t("validate.max.field", {
          max: MAX_LENGTH_LAST_NAME,
          field: t("last_name_hiragana"),
        }),
        trigger: "blur",
      },
      // {
      //   pattern: FURIGANA,
      //   message: t("validate.furigana.field", { field: t("may_name") }),
      //   trigger: "blur",
      // },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("last_name_hiragana"),
        }),
      },
    ],
    first_name: [
      {
        required: true,
        message: t("validate.required.field", { field: t("first_name_kanji") }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_FIRST_NAME,
        message: t("validate.max.field", {
          max: MAX_LENGTH_FIRST_NAME,
          field: t("first_name_kanji"),
        }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("first_name_kanji") }),
      },
    ],
    last_name: [
      {
        required: true,
        message: t("validate.required.field", { field: t("last_name_kanji") }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_LAST_NAME,
        message: t("validate.max.field", {
          max: MAX_LENGTH_LAST_NAME,
          field: t("last_name_kanji"),
        }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("last_name_kanji") }),
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
        message: t("validate.max.field", {
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
    phone_number: [
      {
        required: true,
        message: t("validate.required.field", { field: t("phone_number") }),
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
    postal_code: [
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("postal_code") }),
      },
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
    gender: [
      {
        required: true,
        message: t("validate.required.field", { field: t("gender") }),
        trigger: "blur",
      },
    ],
    birth_day: [
      {
        required: true,
        message: t("validate.required.field", { field: t("birthday") }),
        trigger: "blur",
      },
    ],
    password: [
      {
        required: true,
        message: t("validate.required.field", { field: t("password") }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_PASSWORD,
        message: t("validate.max.password", {
          field: t("password"),
          min: MIN_LENGTH_PASSWORD,
          max: MAX_LENGTH_PASSWORD,
        }),
        trigger: "blur",
      },
      {
        min: MIN_LENGTH_PASSWORD,
        message: t("validate.min.password", {
          field: t("password"),
          min: MIN_LENGTH_PASSWORD,
          max: MAX_LENGTH_PASSWORD,
        }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("password") }),
      },
      {
        pattern: SPECIAL_PASSWORD,
        message: t("validate.format.password"),
        trigger: "blur",
      },
      {
        pattern: FORMAT_PASSWORD,
        trigger: "blur",
        message: t("validate.format.password"),
      },
    ],
    password_confirmation: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("re_password"),
        }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_PASSWORD,
        message: t("validate.max.password", {
          field: t("re_password"),
          min: MIN_LENGTH_PASSWORD,
          max: MAX_LENGTH_PASSWORD,
        }),
        trigger: "blur",
      },
      {
        min: MIN_LENGTH_PASSWORD,
        message: t("validate.min.password", {
          field: t("re_password"),
          min: MIN_LENGTH_PASSWORD,
          max: MAX_LENGTH_PASSWORD,
        }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("re_password"),
        }),
      },
      {
        trigger: "blur",
        validator: validateConfirmPassword(formRegister),
      },
      {
        pattern: SPECIAL_PASSWORD,
        message: t("validate.format.password"),
        trigger: "blur",
      },
      {
        pattern: FORMAT_PASSWORD,
        trigger: "blur",
        message: t("validate.format.password"),
      },
    ],
  };
  return {
    formRegister,
    rules,
  };
};

export default registerMemberRules;
