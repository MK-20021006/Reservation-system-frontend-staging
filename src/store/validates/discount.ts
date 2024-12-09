import { reactive } from "#imports";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { FEE_TYPE_COUPON } from "~/../../src/shared/constants/coupon";
import { validateDiscount } from "~/../../src/shared/validate/common";

const { t } = i18n.global;

const discountRules = () => {
  const formDiscount = reactive({
    check_discount: true,
    discount_percent: null,
    discount_money: null, //adult
    discount_money_children: null,
    discount_money_man: null,
    discount_money_woman: null,
    fee_type: FEE_TYPE_COUPON.MONEY,
  });
  const formDiscountRules = reactive({
    discount_percent: [
      {
        validator: validateDiscount(formDiscount),
        trigger: "blur",
      },
    ],
    discount_money: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("discount"),
        }),
        trigger: "blur",
      },
    ],
    discount_money_children: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("discount"),
        }),
        trigger: "blur",
      },
    ],
    discount_money_woman: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("discount"),
        }),
        trigger: "blur",
      },
    ],
    discount_money_man: [
      {
        required: true,
        message: t("validate.required.field", {
          field: t("discount"),
        }),
        trigger: "blur",
      },
    ],
  });
  return {
    formDiscount,
    formDiscountRules,
  };
};
export default discountRules;
