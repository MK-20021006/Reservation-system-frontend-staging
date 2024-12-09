import {
  FORMAT_PASSWORD,
  MAX_LENGTH_PASSWORD,
  MIN_LENGTH_PASSWORD,
  SPECIAL_PASSWORD,
} from "../../shared/utils/validate";
import { i18n } from "../../shared/plugins/i18n";
import { reactive } from "vue";
import { validateConfirmPassword } from "../../shared/validate/common";
import { ROLES } from "~/../../src/shared/constants/roles";

const { t } = i18n.global;

const resetPasswordRules = () => {
  const formData = reactive({
    password: "",
    password_confirmation: "",
    role_type: ROLES.CUSTOMER,
  });

  const rules = reactive({
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
        trigger: "blur",
        message: t("validate.format.password"),
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
    rules,
  };
};

export default resetPasswordRules;
