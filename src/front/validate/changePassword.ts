import {
  FORMAT_PASSWORD,
  MAX_LENGTH_PASSWORD,
  MIN_LENGTH_PASSWORD,
  SPECIAL_PASSWORD,
} from "../../shared/utils/validate";
import { validateConfirmPassword } from "../../shared/validate/common";
import { i18n } from "../../shared/plugins/i18n";
import { reactive } from "vue";

const { t } = i18n.global;

const changePasswordRules = () => {
  const formData = reactive({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const passwordRules = reactive({
    current_password: [
      {
        required: true,
        message: t("validate.required.field", { field: t("current_password") }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_PASSWORD,
        message: t("validate.max.password", {
          field: t("current_password"),
          min: MIN_LENGTH_PASSWORD,
          max: MAX_LENGTH_PASSWORD,
        }),
        trigger: "blur",
      },
      {
        min: MIN_LENGTH_PASSWORD,
        message: t("validate.min.password", {
          field: t("current_password"),
          min: MIN_LENGTH_PASSWORD,
          max: MAX_LENGTH_PASSWORD,
        }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("current_password") }),
      },
      {
        pattern: SPECIAL_PASSWORD,
        message: t("validate.format.password"),
        trigger: "blur",
      },
      {
        pattern: FORMAT_PASSWORD,
        message: t("validate.format.password"),
        trigger: "blur",
      },
    ],
    password: [
      {
        required: true,
        message: t("validate.required.field", { field: t("new_password") }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_PASSWORD,
        message: t("validate.max.password", {
          field: t("new_password"),
          min: MIN_LENGTH_PASSWORD,
          max: MAX_LENGTH_PASSWORD,
        }),
        trigger: "blur",
      },
      {
        min: MIN_LENGTH_PASSWORD,
        message: t("validate.min.password", {
          field: t("new_password"),
          min: MIN_LENGTH_PASSWORD,
          max: MAX_LENGTH_PASSWORD,
        }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", { field: t("new_password") }),
      },
      {
        pattern: SPECIAL_PASSWORD,
        message: t("validate.format.password"),
        trigger: "blur",
      },
      {
        pattern: FORMAT_PASSWORD,
        message: t("validate.format.password"),
        trigger: "blur",
      },
    ],
    password_confirmation: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("new_password_confirm"),
        }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_PASSWORD,
        message: t("validate.max.password", {
          field: t("new_password_confirm"),
          min: MIN_LENGTH_PASSWORD,
          max: MAX_LENGTH_PASSWORD,
        }),
        trigger: "blur",
      },
      {
        min: MIN_LENGTH_PASSWORD,
        message: t("validate.min.password", {
          field: t("new_password_confirm"),
          min: MIN_LENGTH_PASSWORD,
          max: MAX_LENGTH_PASSWORD,
        }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("new_password_confirm"),
        }),
      },
      {
        trigger: "blur",
        validator: validateConfirmPassword(formData),
      },
      {
        pattern: SPECIAL_PASSWORD,
        message: t("validate.format.password"),
        trigger: "blur",
      },
      {
        pattern: FORMAT_PASSWORD,
        message: t("validate.format.password"),
        trigger: "blur",
      },
    ],
  });
  return {
    formData,
    passwordRules,
  };
};

export default changePasswordRules;
