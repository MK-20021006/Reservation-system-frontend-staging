<template>
  <div class="booking-confirm">
    <Head>
      <Title
        >{{ $t("site_name_title") }}{{ $t("front.reservation_input") }}</Title
      >
    </Head>
    <el-row>
      <el-col :span="12" :md="12" :sm="24" :xs="24">
        <!--ORDER TIME-->
        <el-row>
          <el-col :span="24">
            <div class="label">{{ $t("reservation_date_Time") }}</div>
          </el-col>
          <!--          RESTAURANT SALON-->
          <el-col
            v-if="!GROUP_TYPE_STORE.EVENT.includes(formData.typeStore)"
            :span="24"
          >
            <ClientOnly>
              <el-date-picker
                :model-value="formData.order_time"
                :prefix-icon="IconDateTimePicker"
                type="datetime"
                format="YYYY年MM月DD日 HH:mm:ss"
                :editable="false"
                disabled
              />
            </ClientOnly>
          </el-col>
          <!--          EVENT-->
          <el-col v-else :span="24">
            <el-row class="event-date">
              <el-col :span="12" :md="12" :sm="24" :xs="24">
                <ClientOnly>
                  <el-date-picker
                    :model-value="eventProp?.item?.date"
                    :prefix-icon="IconDateTimePicker"
                    type="datetime"
                    format="YYYY年MM月DD日"
                    :editable="false"
                    disabled
                  />
                </ClientOnly>
              </el-col>
              <el-col :span="2" :md="2" :sm="0" :xs="0" />
              <el-col :span="10" :md="10" :sm="24" :xs="24">
                <ClientOnly>
                  <el-input
                    :value="
                      getLabelTime(eventProp?.item?.start, eventProp?.item?.end)
                    "
                    :prefix-icon="IconDateTimePicker"
                    type="datetime"
                    format="YYYY年MM月DD日"
                    :editable="false"
                    disabled
                  />
                </ClientOnly>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!--END ORDER TIME-->
        <!--STORE NAME-->
        <el-row>
          <el-col :span="24">
            <div class="label">{{ $t("store_name") }}</div>
          </el-col>
          <el-col :span="24" class="link">
            <LazyNuxtLink
              :to="{ name: 'store-id', params: { id: store.code } }"
              target="_blank"
            >
              {{ store?.name }}
            </LazyNuxtLink>
          </el-col>
        </el-row>
        <!--END STORE NAME-->
        <!--STORE ADDRESS-->
        <el-row>
          <el-col :span="24">
            <div class="label">{{ $t("store_address") }}</div>
          </el-col>
          <el-col :span="24">
            <el-input
              type="textarea"
              :rows="3"
              :model-value="
                `${store?.address || ''} ${store?.address_detail || ''}`.trim()
              "
              disabled
            />
          </el-col>
        </el-row>
        <!--END STORE ADDRESS-->
        <!--NUMBER RESERVATION RESTAURANT-->
        <el-row v-if="PEOPLE_STORE_BOOKING.includes(formData.typeStore)">
          <el-col :span="24">
            <div class="label">{{ $t("number_reservation") }}</div>
          </el-col>
          <el-col :span="24">
            <el-row>
              <el-col :span="12">
                <el-row>
                  <el-form-item :label="$t('adult')" class="number-people">
                    <el-input
                      class="input-number"
                      :readonly="true"
                      :model-value="formData.number_adult"
                      :placeholder="$t('one_people')"
                      disabled
                    />
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col v-if="formData.number_children" :span="12">
                <el-row>
                  <el-form-item :label="$t('child')" class="number-people">
                    <el-input
                      class="input-number"
                      :readonly="true"
                      :model-value="formData.number_children || 0"
                      :placeholder="$t('one_people')"
                      disabled
                    />
                  </el-form-item>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!--END NUMBER RESERVATION-->
        <!--NUMBER RESERVATION EVENT-->
        <el-row v-if="GROUP_TYPE_STORE.EVENT.includes(formData.typeStore)">
          <el-col :span="24">
            <div class="label">{{ $t("number_reservation") }}</div>
          </el-col>
          <el-col :span="24">
            <el-row>
              <el-col v-if="formData.number_adult" :span="12">
                <el-row>
                  <el-form-item
                    :label="getLabelTypeFee(eventProp?.event?.fee_type, true)"
                    class="number-people"
                  >
                    <el-input
                      class="input-number"
                      :readonly="true"
                      :model-value="formData.number_adult"
                      :placeholder="$t('one_people')"
                      disabled
                    />
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col v-if="formData.number_children" :span="12">
                <el-row>
                  <el-form-item
                    :label="getLabelTypeFee(eventProp?.event?.fee_type, false)"
                    class="number-people"
                  >
                    <el-input
                      class="input-number"
                      :readonly="true"
                      :model-value="formData.number_children || 0"
                      :placeholder="$t('one_people')"
                      disabled
                    />
                  </el-form-item>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!--END NUMBER RESERVATION-->
        <!--STAFF NAME-->
        <el-row
          v-if="STAFF_STORE_BOOKING.includes(formData.typeStore) && staff"
        >
          <el-col :span="24">
            <div class="label">{{ $t("staff_nomination") }}</div>
          </el-col>
          <el-col :span="24">
            <el-input :model-value="staff?.name || ''" disabled />
          </el-col>
        </el-row>
        <!--END STAFF NAME-->
        <!--COUPON CODE-->
        <el-row
          v-if="COUPON_STORE_BOOKING.includes(formData.typeStore) && coupon"
        >
          <el-col :span="24">
            <div class="label">{{ $t("coupon_code") }}</div>
          </el-col>
          <el-col :span="24">
            <el-input :model-value="coupon.code || ''" disabled />
          </el-col>
        </el-row>
        <!--END COUPON CODE-->
      </el-col>
      <el-col :span="12" :md="12" :sm="24" :xs="24" class="section-right">
        <!--COURSE NAME-->
        <el-row
          v-if="COURSE_STORE_BOOKING.includes(formData.typeStore) && course"
        >
          <el-col :span="24">
            <div class="label">
              {{ formData.typeStore !== SALON ? $t("course") : $t("coupon") }}
            </div>
          </el-col>
          <el-col :span="24">
            <el-input readonly :model-value="course.name" disabled />
          </el-col>
        </el-row>
        <!--END COURSE NAME-->
        <!--EVENT NAME-->
        <el-row
          v-if="GROUP_TYPE_STORE.EVENT.includes(formData.typeStore) && course"
        >
          <el-col :span="24">
            <div class="label">{{ $t("event") }}</div>
          </el-col>
          <el-col :span="24">
            <el-input readonly :model-value="eventProp?.event?.name" disabled />
          </el-col>
        </el-row>
        <!--END EVENT NAME-->
        <!--INFORMATION PRICE-->
        <!--FOR RESTAURANT-->
        <settlement-amount
          v-if="SEAT_STORE_BOOKING.includes(formData.typeStore)"
          class="settlement-amount-content"
          :adult="formData.number_adult || 0"
          :children="formData.number_children || 0"
          :adult-price="priceAdult"
          :child-price="priceChildren"
          :total="totalPriceBeforeCoupon || 0"
          :is-show-children="!!formData.number_children"
          :coupon-name="coupon?.name"
          :coupon-price="couponPrice"
          :payment-type="formData.payment_type"
        />
        <!--END FOR RESTAURANT-->
        <!--FOR SALON-->
        <settlement-menu
          v-if="MENU_STORE_BOOKING.includes(formData.typeStore)"
          class="settlement-amount-content"
          :menu-list="formData.arrMenuSelected"
          :course="course"
          :staff="staff"
        />
        <settlement-event
          v-if="GROUP_TYPE_STORE.EVENT.includes(formData.typeStore)"
          class="settlement-amount-content"
          :adult="formData.number_adult || 0"
          :children="formData.number_children || 0"
          :adult-price="priceAdult"
          :child-price="priceChildren"
          :total="totalPriceBeforeCoupon || 0"
          :is-show-children="!!formData.number_children"
          :event-name="eventProp?.event?.name"
          :coupon-name="coupon?.name"
          :coupon-price="couponPrice"
          :fee-type="eventProp?.event?.fee_type"
          :payment-type="formData.payment_type"
        />
        <!--END FOR SALON-->
        <!-- END INFORMATION PRICE-->
        <!--USER NAME-->
        <el-row class="info-user">
          <el-col>
            <div-block :label="'full_name_kanji_new'">
              <template #form-item>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item prop="name" class="mb-0">
                      <el-input
                        :model-value="formData?.order_first_name"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="mb-0">
                      <InputPhone
                        :model-value="formData?.order_last_name"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
            </div-block>
          </el-col>
          <el-col>
            <div-block :label="'full_name_furigana'">
              <template #form-item>
                <el-row :gutter="24">
                  <el-col :span="12">
                    <el-form-item prop="name" class="mb-0">
                      <el-input
                        :model-value="formData?.order_first_name_kana"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="mb-0">
                      <el-input
                        :model-value="formData?.order_last_name_kana"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
            </div-block>
          </el-col>
        </el-row>
        <!--END USER NAME-->
        <!--USER PHONE NUMBER-->
        <el-row>
          <el-col :span="24">
            <div class="label">{{ $t("phone_number") }}</div>
          </el-col>
          <el-col :span="24">
            <el-input
              readonly
              :model-value="formData.order_phone_number"
              disabled
            />
          </el-col>
        </el-row>
        <!--END USER PHONE NUMBER-->
        <!--USER EMAIL-->
        <el-row>
          <el-col :span="24">
            <div class="label">{{ $t("email_address") }}</div>
          </el-col>
          <el-col :span="24">
            <el-input readonly :model-value="formData.order_email" disabled />
          </el-col>
        </el-row>
        <!--END USER EMAIL-->
        <!--START REMIND -->
        <el-row>
          <el-col :span="24">
            <div class="label">{{ $t("remind") }}</div>
          </el-col>
          <el-col :span="24">
            <el-select
              class="w-100"
              placeholder=""
              :model-value="formData.remind"
              disabled
            >
              <el-option
                v-for="item in dataRemind"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-col>
        </el-row>
        <!--END REMIND-->
        <!--PAYMENT METHOD-->
        <el-row>
          <el-col :span="24">
            <div class="label">{{ $t("payment_method") }}</div>
          </el-col>
          <el-col :span="24">
            <el-select
              class="w-100"
              placeholder=""
              :model-value="formData.payment_type"
              disabled
            >
              <el-option
                v-for="item in PaymentMethod"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>
        <!--PAYMENT METHOD-->
      </el-col>
    </el-row>
    <div class="group-button d-flex justify-content-center">
      <ButtonGray
        width="136px"
        :name="$t('button.back')"
        :disabled="isLoading"
        @click="handleBack"
      />
      <ButtonBlue
        :loading="isLoading"
        width="136px"
        :name="$t('button.confirm')"
        @on-click="handleConfirm"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconDateTimePicker from "~/../../src/front/components/Icon/DateTimePicker.vue";
import SettlementAmount from "~/../../src/front/components/common/SettlementAmount.vue";
import SettlementMenu from "~/../../src/front/components/pages/booking/SettlementMenu.vue";
import SettlementEvent from "~/../../src/front/components/pages/booking/SettlementEvent.vue";
import { computed, ref, toRefs } from "vue";
import { PAYMENT_TYPE, PaymentMethod } from "~/../../src/shared/constants";
import ButtonBlue from "../../../../shared/components/button/ButtonBlue.vue";
import ButtonGray from "../../../../shared/components/button/ButtonGray.vue";
import { onMounted } from "#imports";
import scrollToTop from "~/../../src/shared/utils/scroll";
import {
  PEOPLE_STORE_BOOKING,
  COURSE_STORE_BOOKING,
  SEAT_STORE_BOOKING,
  STAFF_STORE_BOOKING,
  MENU_STORE_BOOKING,
  COUPON_STORE_BOOKING,
  GROUP_TYPE_STORE,
} from "~/../../src/shared/constants/typeStore";
import { StaffInterface, CouponInterface } from "~/../../src/shared/models";
import { Course, DetailStore, FormReservation } from "~/../../src/front/models";
import {
  RESTAURANT,
  SALON,
  EVENT,
} from "~/../../src/shared/constants/category";
import DivBlock from "~/../../src/front/components/common/DivBlock.vue";
import InputPhone from "~/../../src/shared/components/input/Phone.vue";
import { totalPriceBooking, getLabelTime } from "~/../../src/shared/utils";
import { roundPrice } from "~/../../src/shared/utils";
import { dataRemind } from "~/../../src/shared/constants/booking";
import { TYPE_FEE, getLabelTypeFee } from "~/../../src/shared/constants/event";
import { FEE_TYPE_COUPON } from "~/../../src/shared/constants/coupon";

interface Prop {
  formData: FormReservation;
  course: Course;
  store: DetailStore;
  staff?: StaffInterface | null;
  coupon?: CouponInterface | null;
  eventProp?: any;
}

const props = withDefaults(defineProps<Prop>(), {
  staff: null,
  coupon: null,
  eventProp: null,
});

const emits = defineEmits(["previousScreen", "confirmPayment", "payment"]);

const { staff, formData, course, store, coupon, eventProp } = toRefs(props);
const isLoading = ref(false);

const priceAdult = computed(() => {
  return formData?.value?.price_adult * (formData.value.number_adult || 0);
});

const priceChildren = computed(() => {
  return (
    formData?.value?.price_children * (formData.value.number_children || 0)
  );
});

const totalPriceBeforeCoupon = computed(() => {
  const typeStore = Number(formData.value.typeStore);
  let data = {};
  if (typeStore === RESTAURANT) {
    data = {
      priceAdult: priceAdult.value,
      priceChildren: priceChildren.value,
    };
    return totalPriceBooking(typeStore, data);
  } else if (GROUP_TYPE_STORE.SAME.includes(typeStore)) {
    data = {
      arrMenu: formData.value?.arrMenuSelected || [],
      staff_fee: staff.value?.fee || 0,
      course_price: course.value?.price || 0,
    };
    return totalPriceBooking(typeStore, data);
  } else {
    data = {
      priceAdult: priceAdult.value,
      priceChildren: priceChildren.value,
    };
    return totalPriceBooking(typeStore, data);
  }
  return 0;
});

const couponPrice = computed(() => {
  if (coupon?.value) {
    if (coupon.value.fee_type === FEE_TYPE_COUPON.MONEY) {
      if (formData.value.typeStore === RESTAURANT) {
        return (
          Number(coupon.value.discount_money || 0) *
            Number(formData.value.number_adult || 0) +
          Number(coupon.value.discount_money_children) *
            Number(formData.value.number_children || 0)
        );
      } else if (formData.value.typeStore === EVENT) {
        if (eventProp?.value?.event?.fee_type === TYPE_FEE.AGE) {
          return (
            Number(coupon.value.discount_money || 0) *
              Number(formData.value.number_adult || 0) +
            Number(coupon.value.discount_money_children) *
              Number(formData.value.number_children || 0)
          );
        } else {
          return (
            Number(coupon.value.discount_money_man || 0) *
              Number(formData.value.number_adult || 0) +
            Number(coupon.value.discount_money_woman) *
              Number(formData.value.number_children || 0)
          );
        }
      }
    } else if (
      coupon.value.fee_type === FEE_TYPE_COUPON.PERCENT &&
      coupon.value.discount_percent
    ) {
      return roundPrice(
        (totalPriceBeforeCoupon.value * coupon.value.discount_percent) / 100
      );
    }
  }
  return 0;
});

const handleBack = () => {
  emits("previousScreen", formData);
};

const handleConfirm = () => {
  if (
    [PAYMENT_TYPE.CARD, PAYMENT_TYPE.CONTACTLESS].includes(
      formData.value.payment_type
    )
  ) {
    emits("confirmPayment", formDataBookingWithTypeStore());
  } else {
    emits("payment", formDataBookingWithTypeStore());
  }
};

const formDataBookingWithTypeStore = () => {
  if (formData.value.typeStore === RESTAURANT) {
    return {
      ...formData.value,
      price_adult: course.value.price,
      price_children: course.value.price_children,
      amount:
        totalPriceBeforeCoupon.value - (couponPrice.value || 0) <= 0
          ? 0
          : totalPriceBeforeCoupon.value - (couponPrice.value || 0),
      store_name: store.value.name,
      course_name: course.value.name,
      coupon_price: coupon?.value ? couponPrice.value : 0,
    };
  } else if (GROUP_TYPE_STORE.SAME.includes(formData.value.typeStore)) {
    const arrId = formData.value.arrMenuSelected.map((item) => item.id);
    return {
      ...formData.value,
      amount: totalPriceBeforeCoupon.value,
      menu_ids: arrId,
    };
  } else {
    return {
      ...formData.value,
      price_adult: eventProp?.value?.event?.price,
      price_children: eventProp?.value?.event?.price_children,
      amount:
        totalPriceBeforeCoupon.value - (couponPrice.value || 0) <= 0
          ? 0
          : totalPriceBeforeCoupon.value - (couponPrice.value || 0),
      store_name: store.value.name,
      eventName: eventProp?.value?.event?.name,
      coupon_price: coupon?.value ? couponPrice.value : 0,
      fee_type: eventProp?.value?.event?.fee_type,
    };
  }
};

onMounted(() => {
  scrollToTop();
});
defineExpose({
  isLoading,
});
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.booking-confirm {
  .w-100 {
    width: 100%;
  }

  .settlement-amount-content {
    margin-bottom: 24px;
  }

  :deep(.el-input) {
    height: 40px;
  }
  .number-people {
    :deep(.el-form-item__label) {
      height: 40px;
      line-height: 40px;
    }
  }

  :deep(.input-number) {
    .el-input__wrapper {
      width: 95px;
    }
  }

  & > .el-row {
    width: 100%;
    margin: 0 auto;

    & > .el-col {
      &:first-child {
        padding-right: 32px;
      }

      &:last-child {
        padding-left: 32px;
      }

      & > .el-row {
        margin-bottom: 24px;

        &:last-child {
          margin-bottom: 0;
        }

        & > .el-col:first-child {
          margin-bottom: 8px;
        }
      }
    }
  }

  .el-row.info-user {
    margin-right: -20px;
    margin-left: -20px;

    & > .el-col {
      padding-right: 20px;
      padding-left: 20px;
    }
  }

  .link a {
    color: #0066cc;
    line-height: 32px;
  }

  :deep(.el-date-editor.el-input) {
    --el-date-editor-width: 100%;

    .el-input__wrapper {
      flex-direction: row-reverse;
      padding-right: 0;
    }
  }

  :deep(.el-input-number) {
    width: 125px;
  }
}

.group-button {
  gap: 16px;
  margin-top: 32px;

  .el-button {
    margin: 0;
  }
}

@include res("laptop-and-down", $custom-breakpoints-spec) {
  .booking-confirm {
    & > .el-row {
      & > .el-col {
        &:first-child {
          padding-right: 16px;
        }

        &:last-child {
          padding-left: 16px;
        }
      }
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .booking-confirm {
    .section-right {
      margin-top: 24px;
    }
    & > .el-row {
      & > .el-col {
        &:first-child {
          padding-right: 0;
        }

        &:last-child {
          padding-left: 0;
        }
      }
    }
  }

  .event-date {
    gap: 10px;
  }
}

@include res("xs-only", $breakpoints-spec) {
  .booking-confirm {
    & > .el-row {
      width: 100%;
      margin-right: 0;
      margin-left: 0;

      & > .el-col {
        padding-right: 0;
        padding-left: 0;
      }
    }
  }

  .event-date {
    gap: 10px;
  }
}
</style>
