<template>
  <div class="subscription-container">
    <div class="left">
      <el-form>
        <el-form-item :label="$t('period')">
          <el-date-picker
            :model-value="isCustomerBilling ? data.due_date : data?.month"
            :prefix-icon="IconLock"
            :clearable="false"
            format="YYYY年MM月"
            disabled
          />
        </el-form-item>
      </el-form>
      <div v-if="!isCustomerBilling" class="plan-fee">
        <div class="title-text">{{ $t("admin.booking_fee") }}</div>
        <div class="line"></div>
        <div class="custom-table">
          <el-table class="table-content" :data="tableDataSubscription" border>
            <el-table-column prop="plan" :label="$t('date')">
              <template #default="scope">
                {{ formatDate(scope.row.month, "YYYY年MM月") }}
              </template>
            </el-table-column>
            <el-table-column
              prop="payment_options"
              :label="$t('store.number_of_reservation')"
            >
              <template #default="scope">
                {{ scope.row.number_booking || 0 }}
              </template>
            </el-table-column>
            <el-table-column
              prop="plan_fee"
              :label="$t('booking.fee')"
              align="right"
              header-align="left"
            >
              <template #default="scope">
                {{ priceDisplay(roundPrice(scope.row.booking_fee)) || 0
                }}{{ $t("yen") }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="!isCustomerBilling" class="plan-fee">
        <div class="title-text">{{ $t("booking.plan_fee") }}</div>
        <div class="line"></div>
        <div class="custom-table">
          <el-table class="table-content" :data="tableDataSubscription" border>
            <el-table-column prop="plan" :label="$t('plan')">
              <template #default="scope">
                <span v-if="scope.row.plan_name">
                  {{ $t("plans_" + scope.row.plan_name) }}</span
                >
                <span v-else>{{ $t("plans_Free") }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="payment_options"
              :label="$t('booking.payment_options')"
            >
              <template #default="scope">
                {{
                  scope.row.plan_option === NUMBER_YEAR
                    ? $t("admin.plans.year_time_payment")
                    : $t("admin.plans.monthly_payment")
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="plan_fee"
              :label="$t('booking.fee')"
              align="right"
              header-align="left"
            >
              <template #default="scope">
                <span
                  >{{ priceDisplay(roundPrice(scope.row.plan_fee)) || 0
                  }}{{ $t("yen") }}</span
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="isCustomerBilling" class="plan-fee">
        <div class="title-text">{{ $t("custom_billing") }}</div>
        <div class="line"></div>
        <div class="custom-table">
          <el-table
            v-if="tableCustomerBilling.length > 0"
            class="table-content"
            :data="tableCustomerBilling"
            border
          >
            <el-table-column prop="title" :label="$t('option_name')" />
            <el-table-column prop="date" :label="$t('store.due_date')">
              <template #default="scope">{{
                formatDate(scope.row.date)
              }}</template>
            </el-table-column>
            <el-table-column
              prop="price"
              :label="$t('option_price')"
              align="right"
              header-align="left"
            >
              <template #default="scope">
                {{ priceDisplay(roundPrice(scope.row.price)) || 0
                }}{{ $t("yen") }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="!isCustomerBilling" class="option_fee">
        <div class="title-text">{{ $t("booking.option_fee") }}</div>
        <div class="line"></div>
        <div class="custom-table">
          <el-table class="table-content" :data="tableData" border>
            <el-table-column
              prop="title"
              :label="$t('option')"
            ></el-table-column>
            <el-table-column prop="date" :label="$t('date')" width="180px">
              <template #default="scope">{{
                formatDate(scope.row.date, "YYYY年MM月")
              }}</template>
            </el-table-column>
            <el-table-column
              prop="option_fee"
              :label="$t('booking.fee')"
              align="right"
              header-align="left"
            >
              <template #default="scope">
                {{ priceDisplay(roundPrice(scope.row.price)) || 0
                }}{{ $t("yen") }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="total">
        <div>{{ $t("total") }}</div>
        <div class="display-price">
          {{ priceDisplay(data?.amount) || 0 }}{{ $t("yen") }}
        </div>
      </div>
    </div>
    <div class="right">
      <el-form>
        <el-form-item :label="$t('store.billing_date')">
          <el-date-picker
            :model-value="data?.created_at"
            :prefix-icon="IconLock"
            :clearable="false"
            format="YYYY年MM月DD日"
            disabled
          />
        </el-form-item>
        <el-form-item :label="$t('store.due_date')">
          <el-date-picker
            :model-value="data?.due_date"
            :prefix-icon="IconLock"
            :clearable="false"
            format="YYYY年MM月DD日"
            disabled
          />
        </el-form-item>
        <el-form-item :label="$t('store.date_of_payment')">
          <el-date-picker
            :model-value="data?.paid_at"
            :prefix-icon="IconLock"
            :clearable="false"
            format="YYYY年MM月DD日"
            disabled
          />
        </el-form-item>
        <el-form-item :label="$t('payment_status')">
          <el-select
            :model-value="
              findObj(
                paymentStatusBookingOptions,
                'value',
                data?.payment_status
              )?.label
            "
            placeholder=" "
            disabled
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { formatDate } from "~/../../src/shared/utils/format";
import { toRefs, computed } from "vue";
import priceDisplay, { formatValuePrice } from "~/../../src/shared/utils/price";
import { i18n } from "~/../../src/shared/plugins/i18n";
import IconLock from "~/../../src/admin/components/Icon/Timer.vue";
import { findObj } from "~/../../src/shared/utils";
import { paymentStatusBookingOptions } from "~/../../src/shared/constants";
import { SubscriptionInterface } from "~/../../src/store/models/subscription";
import { NUMBER_YEAR, TYPE_PLAN } from "~/../../src/shared/constants/plan";
import { roundPrice } from "~/../../src/shared/utils";

interface Prop {
  data: SubscriptionInterface;
}
const { t } = i18n.global;
const props = defineProps<Prop>();
const { data } = toRefs(props);

const tableData = computed(() => {
  let array: any = [];
  if (data.value?.contract) {
    data.value.contract?.services?.map((item: any) => {
      array.push({
        title: item.name,
        date: data.value.month,
        price: item.price,
      });
    });
    if (data.value?.contract?.sms_remind_fee) {
      array.push({
        title: t("sms_booking"),
        date: data.value.month,
        price: data.value?.contract?.sms_remind_fee,
      });
    }
    if (data.value?.contract?.sms_pack_price) {
      array.push({
        title: t("sms"),
        date: data.value.month,
        price: data.value?.contract?.sms_pack_price,
      });
    }
  }
  return array;
});

const tableDataSubscription = computed(() => {
  const array = [];
  if (data.value) {
    array.push({
      plan_name: data.value?.contract?.plan_name,
      plan_option: data.value?.contract?.duration,
      plan_fee: data.value?.contract?.contract_actual_payment_amount,
      number_booking: data.value?.contract?.number_booking,
      booking_fee: data.value?.contract?.booking_fee,
      month: data.value?.month,
      duration: data.value?.contract?.duration,
    });
  }
  return array;
});

const isCustomerBilling = computed(() => {
  return data.value?.contract?.type === TYPE_PLAN.CUSTOMER_BILLING;
});

const tableCustomerBilling = computed(() => {
  let array: any = [];
  if (isCustomerBilling.value && data.value?.contract?.options?.length > 0) {
    data.value?.contract?.options.forEach((item: any) => {
      array.push({
        title: item.content,
        date: data.value.due_date,
        price: item.amount,
      });
    });
  }
  return array;
});
</script>
<style lang="scss" scoped>
@use "~/../../src/store/assets/scss/variables" as *;

.subscription-container {
  display: flex;
  gap: 64px;
  padding-bottom: 24px;

  .left {
    .plan-fee {
      margin-bottom: 20px;
    }

    .total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding-left: 16px;
      padding-right: 16px;
      height: 48px;
      background-color: $blue-70;
      font-weight: 700;
      margin-bottom: 10px;

      .display-price {
        font-size: 16px;
        line-height: 26px;
      }
    }
  }

  .left,
  .right {
    width: 50%;

    .el-form {
      .el-form-item {
        :deep(.el-form-item__label) {
          width: 152px;
          justify-content: flex-start;
        }

        :deep(.el-form-item__content) {
          width: calc(100% - 152px);

          .el-input,
          .el-select {
            height: 40px;
            width: 100%;
          }
        }
      }
    }
  }
}

.line {
  margin-top: 15px;
  border-bottom: 1px solid $gray-400;
  margin-bottom: 20px;
}

.title-text {
  font-weight: 700;
}
</style>
