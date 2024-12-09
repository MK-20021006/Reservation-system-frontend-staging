<template>
  <div class="coupon-fee-container">
    <el-form
      ref="_refFormDiscount"
      :model="formDiscount"
      :rules="formDiscountRules"
    >
      <el-radio-group
        v-model="formDiscount.fee_type"
        class="discount-group"
        @change="handleChangeTypeFee"
      >
        <el-form-item>
          <el-radio :label="FEE_TYPE_COUPON.MONEY">
            {{ $t("price") }}
            <span>
              ［　　］{{ $t("yen") }} ({{ $t("tax_include") }}){{
                $t("discount_number_of_people")
              }}</span
            >
          </el-radio>
        </el-form-item>
        <el-form-item>
          <!-- DISCOUNT-MONEY-->
          <div
            v-if="formDiscount.fee_type === FEE_TYPE_COUPON.MONEY"
            class="group-fee"
          >
            <!--          EVENT-->
            <div v-if="typeStore === EVENT" class="group-fee-event">
              <div>
                <div class="label-text mb-10">
                  {{ $t("adult") }}・{{ $t("child") }}
                </div>
                <el-form-item prop="discount_money" :label="$t('adult')">
                  <InputPrice
                    v-model="formDiscount.discount_money"
                    :max-price="MAX_PRICE"
                  />
                  <span>
                    {{ $t("yen") }}({{ $t("tax_include") }}){{
                      $t("discount_number_of_people")
                    }}</span
                  >
                </el-form-item>
                <el-form-item
                  prop="discount_money_children"
                  :label="$t('child')"
                >
                  <InputPrice
                    v-model="formDiscount.discount_money_children"
                    :max-price="MAX_PRICE"
                  />
                  <span>
                    {{ $t("yen") }}({{ $t("tax_include") }}){{
                      $t("discount_number_of_people")
                    }}</span
                  >
                </el-form-item>
              </div>
              <div>
                <div class="label-text mb-10">
                  {{ $t("male") }}・{{ $t("female") }}
                </div>
                <el-form-item prop="discount_money_man" :label="$t('male')"
                  ><InputPrice
                    v-model="formDiscount.discount_money_man"
                    :max-price="MAX_PRICE"
                  /><span>
                    {{ $t("yen") }}({{ $t("tax_include") }}){{
                      $t("discount_number_of_people")
                    }}</span
                  >
                </el-form-item>
                <el-form-item prop="discount_money_woman" :label="$t('female')"
                  ><InputPrice
                    v-model="formDiscount.discount_money_woman"
                    :max-price="MAX_PRICE"
                  />
                  <span>
                    {{ $t("yen") }}({{ $t("tax_include") }}){{
                      $t("discount_number_of_people")
                    }}</span
                  ></el-form-item
                >
              </div>
            </div>
            <!--          NOT EVENT-->
            <template v-else>
              <el-form-item prop="discount_money" :label="$t('adult')"
                ><InputPrice
                  v-model="formDiscount.discount_money"
                  :max-price="MAX_PRICE"
                />
                <span>
                  {{ $t("yen") }}({{ $t("tax_include") }}){{
                    $t("discount_number_of_people")
                  }}</span
                ></el-form-item
              >
              <el-form-item prop="discount_money_children" :label="$t('child')"
                ><InputPrice
                  v-model="formDiscount.discount_money_children"
                  :max-price="MAX_PRICE"
                />
                <span>
                  {{ $t("yen") }}({{ $t("tax_include") }}){{
                    $t("discount_number_of_people")
                  }}</span
                ></el-form-item
              ></template
            >
          </div></el-form-item
        >
        <!--        DISCOUNT-PERCENT-->
        <el-form-item class="discount-percent" prop="discount_percent">
          <el-radio class="percent" :label="FEE_TYPE_COUPON.PERCENT">
            {{ $t("discount") }}
            <InputNumberText
              v-model="formDiscount.discount_percent"
              :disabled="formDiscount.fee_type !== FEE_TYPE_COUPON.PERCENT"
              :precision="PRECISION"
              :max="100"
              :accept-null="true"
            />
            <span>{{ $t("discount_percent") }}</span>
          </el-radio>
        </el-form-item>
      </el-radio-group>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import InputNumberText from "~/../../src/shared/components/input/InputNumberText.vue";
import { ref, toRefs } from "#imports";
import { EVENT } from "~/../../src/shared/constants/category";
import { MAX_PRICE } from "~/../../src/shared/constants";
import InputPrice from "~/../../src/shared/components/input/Price.vue";
import { computed, reactive } from "vue";
import { FEE_TYPE_COUPON } from "~/../../src/shared/constants/coupon";
import { TYPE_FEE } from "~/../../src/shared/constants/event";
import discountRules from "~/../../src/store/validates/discount";

interface Prop {
  typeStore: number;
  formDiscount: object;
}
const { formDiscount, formDiscountRules } = discountRules();

const props = defineProps<Prop>();
const { typeStore } = toRefs(props);
const PRECISION = ref(2);
const _refFormDiscount = ref();
const backupDiscountPercent = ref();
const handleChangeTypeFee = (e) => {
  if (e === FEE_TYPE_COUPON.MONEY) {
    _refFormDiscount.value.clearValidate(["discount_percent"]);
    backupDiscountPercent.value = formDiscount.discount_percent;
    formDiscount.discount_percent = null;
  } else {
    formDiscount.discount_percent = backupDiscountPercent.value || null;
  }
};

defineExpose({
  _refFormDiscount,
  formDiscount,
});
</script>

<style lang="scss" scoped>
:deep(.percent) {
  .el-radio__label {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

:deep(.group-fee) {
  .el-form-item__label {
    width: auto !important;
  }

  .el-input {
    width: 250px;
    margin-right: 10px;
  }
}

:deep(.discount-group) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

:deep(.el-form-item) {
  margin-bottom: 15px;
}

:deep(.discount-percent) {
  margin-top: -15px;
  height: 40px;
}
</style>
