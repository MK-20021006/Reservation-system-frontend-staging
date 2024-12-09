<template>
  <div class="settlement-amount-container">
    <div class="settlement-title">{{ $t("booking.settlement_amount") }}</div>
    <div class="amount">
      <div class="amount-item">
        <div class="title">
          {{ $t("one_adult", { number: adult }) }}
        </div>
        <div class="price">{{ priceDisplay(adultPrice) }}{{ $t("yen") }}</div>
      </div>
      <div v-if="isShowChildren" class="amount-item">
        <div class="title">{{ $t("one_child", { number: children }) }}</div>
        <div class="price">{{ priceDisplay(childPrice) }}{{ $t("yen") }}</div>
      </div>
      <div v-if="couponName" class="amount-item coupon">
        <div class="title">{{ couponName }}</div>
        <div class="price">-{{ priceDisplay(couponPrice) }}{{ $t("yen") }}</div>
      </div>
      <div v-if="incurredAmount" class="amount-item">
        <div class="title">{{ $t("booking.incurred_amount") }}</div>
        <div class="price">
          {{ priceDisplay(incurredAmount || 0) }}{{ $t("yen") }}
        </div>
      </div>
      <div class="amount-item total">
        <div class="title font-weight-700">{{ $t("total") }}</div>
        <div class="price">
          {{ priceDisplay(totalPriceAfterCoupon) }}{{ $t("yen") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import priceDisplay from "~/../../src/shared/utils/price";
import { computed, onMounted, ref } from "vue";

interface Prop {
  adult: number;
  children: number;
  childPrice: number;
  adultPrice: number;
  total: number;
  isShowChildren: boolean;
  couponName?: string;
  couponPrice?: number;
  hasBookingDraft?: boolean;
  incurredAmount?: number;
  paymentType: number;
}

const props = withDefaults(defineProps<Prop>(), {
  couponName: "",
  couponPrice: 0,
  hasBookingDraft: false,
  incurredAmount: 0,
});

const totalPriceAfterCoupon = computed(() => {
  const totalValue =
    props.total -
    (!props.hasBookingDraft ? props.couponPrice : 0) +
    props.incurredAmount;
  if (totalValue <= 0) return 0;
  return totalValue;
});
</script>

<style scoped lang="scss">
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "~/../../src/front/assets/scss/variables.scss" as *;

.settlement-amount-container {
  background-color: $gray-200;
  padding: 0 16px 20px 16px;
  border-radius: 3px;
  min-width: 170px;

  .settlement-title {
    border-bottom: 1px solid $gray-300;
    height: 38px;
    padding: 8px;
  }

  .amount {
    .amount-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      padding: 8px;
      gap: 20px;

      .title {
        color: $black-80;
      }

      .price {
        font-weight: 700;
      }

      &.total {
        background-color: $red-30;
        border-radius: 3px;
        margin-bottom: 0;

        .title {
          color: $black-80;
        }
      }

      &.coupon {
        .title {
          color: $red-50;
        }

        .price {
          min-width: 80px;
          color: $red-50;
          text-align: right;
          font-weight: 700;
        }
      }
    }
  }
}
</style>
