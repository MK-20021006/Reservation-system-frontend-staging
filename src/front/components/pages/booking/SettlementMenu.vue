<template>
  <div class="settlement-amount-container">
    <div class="settlement-title">{{ $t("booking.settlement_amount") }}</div>
    <div ref="_refElement" class="amount">
      <!--PRICE COURSE-->
      <div v-if="course?.name" class="amount-item">
        <div class="title">{{ course.name }}</div>
        <div class="price">
          {{ priceDisplay(course.price || 0) }}{{ $t("yen") }}
        </div>
      </div>
      <!--END PRICE COURSE-->
      <!--PRICE MENU-->
      <div v-for="item in menuList" :key="item.id" class="amount-item">
        <div class="title">{{ item.name }}</div>
        <div class="price">
          {{ priceDisplay(item.price || 0) }}{{ $t("yen") }}
        </div>
      </div>
      <!--END PRICE MENU-->
      <!--PRICE STAFF-->
      <div v-if="staff" class="amount-item">
        <div class="title">{{ staff.name }}</div>
        <div class="price">
          {{ requestStaff === 0 ? 0 : priceDisplay(staff.fee || 0)
          }}{{ $t("yen") }}
        </div>
      </div>
      <!--END PRICE STAFF-->
      <div v-if="incurredAmount" class="amount-item">
        <div class="title">{{ $t("booking.incurred_amount") }}</div>
        <div class="price">
          {{ priceDisplay(incurredAmount || 0) }}{{ $t("yen") }}
        </div>
      </div>
      <div class="amount-item total">
        <div class="title font-weight-700">{{ $t("total") }}</div>
        <div class="price">{{ priceDisplay(totalPrice) }}{{ $t("yen") }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import priceDisplay from "~/../../src/shared/utils/price";
import { computed, onMounted, ref, toRefs } from "vue";
import { MenuInterface, StaffInterface } from "~/../../src/shared/models";
import { Course } from "~/../../src/front/models";
import { totalPriceBooking } from "~/../../src/shared/utils";
import { SALON } from "~/../../src/shared/constants/category";

interface Prop {
  menuList: MenuInterface[];
  staff: StaffInterface | null;
  course: Course | null;
  requestStaff?: number;
  incurredAmount?: number;
}
const props = withDefaults(defineProps<Prop>(), {
  requestStaff: 1,
  incurredAmount: 0,
});
const { menuList, staff, course, requestStaff, incurredAmount } = toRefs(props);
const _refElement = ref();
const height = ref("");

const totalPrice = computed(() => {
  const data = {
    arrMenu: menuList.value,
    staff_fee: staff.value?.fee || 0,
    course_price: course.value?.price || 0,
  };
  if (requestStaff.value === 0) {
    data.staff_fee = 0;
  }
  return totalPriceBooking(SALON, data) + incurredAmount.value || 0;
});

onMounted(() => {
  height.value = _refElement.value.clientHeight + 38 + 20 + "px";
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
  height: v-bind(height);

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
      padding: 5px 8px;
      gap: 20px;

      .title {
        color: $black-80;
      }

      .price {
        font-weight: 700;
        min-width: 80px;
        text-align: right;
      }

      &.total {
        background-color: $red-30;
        border-radius: 3px;
        margin-bottom: 0;

        .title {
          color: $black-80;
        }
      }
    }
  }
}
@include res("sm-and-down", $breakpoints-spec) {
  .settlement-amount-container {
    height: auto;
  }
}
</style>
