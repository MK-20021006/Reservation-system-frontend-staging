<template>
  <div class="payment-information-container">
    <Head>
      <Title
        >{{ $t("site_name_title")
        }}{{ $t("title_screen.payment_information") }}</Title
      >
    </Head>
    <div class="payment-content">
      <settlement-amount
        v-if="SEAT_STORE_BOOKING.includes(formData.typeStore)"
        class="settlement-amount-content"
        :adult="formData.number_adult || 0"
        :children="formData.number_children || 0"
        :adult-price="priceAdult"
        :child-price="priceChildren"
        :total="bookingDraft.amount || 0"
        :is-show-children="!!formData.number_children"
        :coupon-name="bookingDraft?.coupon_name"
        :coupon-price="couponPrice"
        :has-booking-draft="true"
        :payment-type="formData.payment_type"
      />
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
        :total="bookingDraft.amount || 0"
        :event-name="bookingDraft?.detail?.event?.name"
        :coupon-name="bookingDraft?.coupon_name"
        :coupon-price="couponPrice"
        :fee-type="bookingDraft?.detail?.event?.fee_type"
        :payment-type="formData.payment_type"
        :has-booking-draft="true"
      />
      <div class="card-information">
        <div class="title">{{ $t("booking.payment_method") }}</div>
        <div class="card-list">
          <VisaCard class="card-icon" />
          <MasterCard class="card-icon" />
          <JCBCard class="card-icon" />
          <AmericanExpressCard class="card-icon" />
          <DinnerClubCard class="card-icon" />
        </div>
        <div id="checkout">
          <div v-if="errorCard" class="block-error">
            <p class="error-validate">
              {{ errorCard }}
            </p>
          </div>
          <div v-loading="isLoadingIframe">
            <iframe
              id="iframe-payment"
              :src="`/reservation/payment?order_email=${formData.order_email}&amount=${amountBooking}&payment_type=${getTypeBooking}&bookingId=${formData.bookingId}&storeId=${store.id}&typePayment=${bookingDraft.payment_type}`"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="group-button">
      <button-gray
        :name="$t('button.back')"
        :width="'108px'"
        :disabled="isLoading || isLoadingDeleteBooking"
        @click="handleBack"
      />
      <button-blue
        :loading="isLoading"
        :disabled="isLoadingDeleteBooking"
        :name="$t('button.settlement')"
        :width="'108px'"
        @click="submitForm()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import VisaCard from "~/../../src/front/components/Icon/VisaCard.vue";
import MasterCard from "~/../../src/front/components/Icon/MasterCard.vue";
import JCBCard from "~/../../src/front/components/Icon/JCBCard.vue";
import AmericanExpressCard from "~/../../src/front/components/Icon/AmericanExpressCard.vue";
import DinnerClubCard from "~/../../src/front/components/Icon/DinnerClubCard.vue";
import ButtonGray from "~/../../src/shared/components/button/ButtonGray.vue";
import ButtonBlue from "~/../../src/shared/components/button/ButtonBlue.vue";
import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  toRefs,
} from "vue";
import SettlementAmount from "~/../../src/front/components/common/SettlementAmount.vue";
import SettlementMenu from "~/../../src/front/components/pages/booking/SettlementMenu.vue";
import SettlementEvent from "~/../../src/front/components/pages/booking/SettlementEvent.vue";
import { BookingDetail, FormReservation } from "~/../../src/front/models";
import {
  messageError,
  warningChangePrice,
  customMessageErrorRow,
} from "~/../../src/shared/utils/notification";
import scrollToTop from "~/../../src/shared/utils/scroll";
import { ERROR_CODE } from "~/../../src/shared/constants";
import { i18n } from "~/../../src/shared/plugins/i18n";
import {
  MENU_STORE_BOOKING,
  SEAT_STORE_BOOKING,
  GROUP_TYPE_STORE,
} from "~/../../src/shared/constants/typeStore";
import { StaffInterface } from "~/../../src/shared/models";
import { RESERVATION_TYPE } from "~/../../src/shared/constants/reservation";
import { PAYMENT_TYPE } from "~/../../src/shared/constants";
import { BOOKING_MIN_PRICE_CONTACTLESS } from "~/../../src/shared/constants/booking";

interface Prop {
  formData: FormReservation;
  course: any;
  store: any;
  isLoadingDeleteBooking?: boolean;
  bookingDraft: BookingDetail;
  staff?: StaffInterface | null;
  eventProp?: any;
}

const props = withDefaults(defineProps<Prop>(), {
  errorCard: null,
  isLoadingDeleteBooking: false,
  staff: null,
  eventProp: null,
});

const { formData, course, store, bookingDraft, eventProp } = toRefs(props);
const emits = defineEmits(["previousScreenConfirm", "success"]);

const { t } = i18n.global;
const isLoading = ref(false);
const tokenUnivapay = ref(null);
const heightElement = ref("");
const errorCard = ref(null);
const isLoadingIframe = ref(true);

const amountBooking = computed(() => {
  return Number(bookingDraft.value?.payment_type) ===
    PAYMENT_TYPE.CONTACTLESS && !bookingDraft.value.amount
    ? BOOKING_MIN_PRICE_CONTACTLESS
    : bookingDraft.value.amount;
});

const getTypeBooking = computed(() => {
  if (bookingDraft.value?.payment_type === PAYMENT_TYPE.CONTACTLESS) {
    return RESERVATION_TYPE.TENTATIVE;
  } else {
    if (GROUP_TYPE_STORE.SAME.includes(store.value.model_has_type.type_id)) {
      return bookingDraft.value?.type_course;
    } else if (
      GROUP_TYPE_STORE.EVENT.includes(store.value.model_has_type.type_id)
    ) {
      return bookingDraft.value?.type_course;
    }
    return course.value.payment_type;
  }
});

const priceAdult = computed(() => {
  if (
    !GROUP_TYPE_STORE.EVENT.includes(
      bookingDraft.value?.store?.model_has_type?.type_id
    )
  ) {
    if (bookingDraft.value.detail.course.price !== formData.value.price_adult) {
      return (
        bookingDraft.value.detail.course.price *
        (formData.value.number_adult || 0)
      );
    }
    return formData.value.price_adult * (formData.value.number_adult || 0);
  } else {
    if (bookingDraft.value.detail.event.price !== formData.value.price_adult) {
      return (
        bookingDraft.value.detail.event.price *
        (formData.value.number_adult || 0)
      );
    }
    return formData.value.price_adult * (formData.value.number_adult || 0);
  }
});

const priceChildren = computed(() => {
  if (
    !GROUP_TYPE_STORE.EVENT.includes(
      bookingDraft.value?.store?.model_has_type?.type_id
    )
  ) {
    if (
      bookingDraft.value.detail.course.price_children !==
      formData.value.price_children
    ) {
      return formData.value.price_children * (formData.value.number_adult || 0);
    }
    return (
      formData.value.price_children * (formData.value.number_children || 0)
    );
  } else {
    if (
      bookingDraft.value.detail.event.price_children !==
      formData.value.price_children
    ) {
      return (
        bookingDraft.value.detail.event.price_children *
        (formData.value.number_adult || 0)
      );
    }
    return (
      formData.value.price_children * (formData.value.number_children || 0)
    );
  }
});

const couponPrice = computed(() => {
  if (bookingDraft.value) {
    return bookingDraft.value.amount_discount || 0;
  }
  return 0;
});

const totalPriceAfterCoupon = () => {
  return formData.value.amount || 0;
};

const submitForm = async () => {
  const iFrame = document.getElementById("iframe-payment");
  const a = iFrame.contentWindow.document.querySelector("#action-button");
  isLoading.value = true;
  if (a) {
    errorCard.value = null;
    a.click();
  }
};

defineExpose({
  isLoading,
  tokenUnivapay,
});

const handleBack = () => {
  const iframe = document.getElementById("iframe-payment");
  if (iframe) {
    iframe.src = "";
    iframe.contentWindow.location.reload(true);
  }
  emits("previousScreenConfirm");
};

const handlePayment = (data: any) => {
  if (data.type === "payment.error") {
    isLoading.value = false;
    if (data.data) {
      // error:  Code: UNKNOWN_ERROR, HttpCode: undefined, Errors: -> error network
      if (data.data?.includes("UNKNOWN_ERROR")) {
        messageError("errors.network");
      } else if (data.data?.includes(ERROR_CODE.CARD_LOCKED)) {
        //error: Code: CARD_LOCKED, HttpCode: 403, Errors: -> error card lock
        errorCard.value = t("univapay.card_locked");
      } else if (data.data === ERROR_CODE.CHARGE_AMOUNT_TOO_HIGH) {
        customMessageErrorRow(
          "errors.charge_amount_limit",
          "errors.charge_amount_limit_footer"
        );
      } else if (data.data === ERROR_CODE.BOOKING_DELETE) {
        messageError("errors.booking_draft_delete");
      } else if (data.data === ERROR_CODE.ERROR_VALIDATE_BOOKING) {
        messageError("errors.booking_validate_payment");
      } else {
        errorCard.value = data.data;
      }
    }
  } else if (data.type === "payment.success") {
    emits("success", formData.value);
  }
  if (data.type === "height.univapay") {
    heightElement.value = `${data.data}px`;
  }
  if (data.type === "loadingCompleted") {
    isLoadingIframe.value = !data.data;
  }
};

onBeforeMount(() => {
  scrollToTop();
});

onMounted(() => {
  if (bookingDraft.value.amount !== totalPriceAfterCoupon()) {
    warningChangePrice();
  }
  window.addEventListener(
    "message",
    (event) => {
      handlePayment(event.data);
    },
    false
  );
});

onBeforeUnmount(() => {
  window.removeEventListener(
    "message",
    (event) => {
      handlePayment(event.data);
    },
    false
  );
});
</script>

<style scoped lang="scss">
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.credit-card {
  display: flex;
}

#iframe-payment {
  width: 100%;
  //TODO
  height: v-bind(heightElement);
  //height: 100%;
}

.payment-information-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;

  .title {
    font-size: 20px;
    font-weight: 500;
    padding: 0 5px;
  }

  .block-error {
    margin-bottom: 12px;
  }

  .payment-content {
    padding: 32px 0;
    display: flex;
    justify-content: space-between;
    gap: 32px 64px;
    width: 100%;
    align-items: flex-start;

    .settlement-amount-content {
      width: 50%;
      max-width: 400px;
    }

    .card-information {
      padding: 32px 35px 16px 35px;
      width: 50%;
      background-color: $gray-400;
      border-radius: 6px;
      border: 1px solid $gray-300;
      max-width: 400px;

      .title {
        font-size: 14px;
        font-weight: 700;
      }

      .card-list {
        padding: 16px 5px 24px 5px;
        display: flex;
        justify-content: space-between;
        gap: 8px;

        .card-icon {
          width: 50px;
          height: 32px;
        }
      }

      .div-block {
        .label-text {
          line-height: 22px;
          height: 22px;
          padding-bottom: 8px;
          font-size: 12px;
        }

        &.date-cvc {
          justify-content: space-between;
          gap: 10px;
        }

        .cvc-input {
          position: relative;

          .help-icon {
            position: absolute;
            right: 8px;
          }
        }

        .card-number {
          position: relative;

          .visa-card {
            position: absolute;
            left: 8px;
            width: 31px;
            height: 22px;
          }
        }
      }

      .el-form-item {
        margin-bottom: 24px;
      }
    }
  }

  :deep(.input-text) {
    height: 40px;
  }
}

@include res("laptop-and-down", $custom-breakpoints-spec) {
  .payment-information-container {
    .payment-content {
      gap: 32px 24px;
      width: 100%;

      .card-information {
        padding: 32px 27px 8px 27px;
      }
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .payment-information-container {
    .payment-content {
      flex-direction: column;
      padding: 24px 0;
      gap: 24px 0;
      width: 100%;

      .settlement-amount-content {
        width: 100%;
        max-width: unset;
      }

      .card-information {
        padding: 32px 19px 8px 19px;
        width: 100%;
        max-width: unset;

        .div-block {
          &.date-cvc {
            gap: 10px;
          }

          .date-expired,
          .cvc {
            width: 50%;
          }
        }
      }
    }
  }
}
</style>
