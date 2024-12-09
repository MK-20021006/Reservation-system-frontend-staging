import { i18n } from "~/../../src/shared/plugins/i18n";
import { reactive } from "vue";
import { validateDateBooking } from "~/../../src/shared/validate/common";

const { t } = i18n.global;

const formSearchRules = (formSearch) => {
  const rules = reactive({
    date: [
      {
        validator: validateDateBooking(formSearch),
        trigger: "change",
      },
    ],
  });
  return { rules };
};

export default formSearchRules;
