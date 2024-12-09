import {
  MAX_LENGTH_MENU_NAME,
  MAX_LENGTH_MENU_DESCRIPTION,
  MAX_LENGTH_MENU_IMAGE,
} from "../../shared/utils/validate";

import { i18n } from "../../shared/plugins/i18n";
import { reactive } from "vue";
import { validateConfirmPrice } from "../../shared/validate/common";
const { t } = i18n.global;
import { ACTIVE, INACTIVE } from "~/../../src/shared/constants";
import {
  RESERVATION_TYPE,
  STATUS_IS_SETTING_CANCEL,
  HAS_CHECK_TIME_PER,
  TIME_DEFAULT_SETTING,
  DAY_DEFAULT_SETTING,
} from "~/../../src/shared/constants/reservation";

const formMenuRules = (type = null) => {
  const formMenu = reactive({
    name: "",
    description: "",
    status: ACTIVE,
    created_at: "",
    updated_at: "",
    store_id: null,
    price: null,
    price_status: INACTIVE,
    image: [],
    product_category_id: null,
    minute: null,
    hour: null,
    booking_type: RESERVATION_TYPE.TENTATIVE,
    apply_all_staff: true,
    staff_ids: [],
    is_setting_cancel: STATUS_IS_SETTING_CANCEL.FALSE,
    minute_reservation: null,
    hour_reservation: null,
    has_time_per: HAS_CHECK_TIME_PER.TRUE,
    day_reservation: DAY_DEFAULT_SETTING,
  });

  const menuRules = {
    product_category_id: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("category"),
        }),
        trigger: "blur",
      },
    ],
    price: [
      {
        required: true,
        trigger: "change",
        validator: validateConfirmPrice(formMenu),
      },
      {
        required: true,
        trigger: "blur",
        validator: validateConfirmPrice(formMenu),
      },
    ],
    booking_type: [
      {
        required: true,
        trigger: "change",
        message: t("validate.required.field", {
          field: t("reservation_type"),
        }),
      },
    ],
    name: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("store.menu_title"),
        }),
        trigger: "blur",
      },
      {
        max: MAX_LENGTH_MENU_NAME,
        message: t("validate.format.field", {
          max: MAX_LENGTH_MENU_NAME,
          field: t("store.menu_title"),
        }),
        trigger: "blur",
      },
      {
        whitespace: true,
        trigger: "blur",
        message: t("validate.required.field", {
          field: t("store.menu_title"),
        }),
      },
    ],
    description: [
      {
        max: MAX_LENGTH_MENU_DESCRIPTION,
        message: t("validate.format.field", {
          max: MAX_LENGTH_MENU_DESCRIPTION,
          field: t("description"),
        }),
        trigger: "blur",
      },
    ],
  };

  return {
    formMenu,
    menuRules,
  };
};

export default formMenuRules;
