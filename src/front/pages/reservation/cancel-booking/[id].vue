<template>
  <Head>
    <Title
      >{{ $t("site_name_title") }}{{ $t("store.cancel_reservation") }}</Title
    >
  </Head>
  <ClientOnly>
    <Teleport to="#breadcrumb">
      <span key="1">
        <StoreBreadCrum :data-title="dataTitle" />
      </span>
    </Teleport>
  </ClientOnly>
  <div v-loading="!bookingDetail" class="content">
    <div class="title text-center">{{ $t("store.cancel_reservation") }}</div>
    <div v-if="bookingDetail" class="cancel-booking">
      <div class="cancel-booking__name">{{ bookingDetail?.store?.name }}</div>
      <div class="cancel-booking__date">
        {{ $t("reservation_date_Time") }}：
        {{ formatDate(bookingDetail?.order_time, "YYYY年MM月DD日 HH:mm") }}
      </div>
      <div class="cancel-booking__category">
        {{ bookingDetail?.detail?.course?.name }}
      </div>
      <el-form
        ref="_refForm"
        :model="formData"
        :rules="validateCancelBooking"
        :inline-message="true"
      >
        <el-row>
          <el-col :span="8" :xs="24" :sm="24" :md="8">
            <div class="label required-field">{{ $t("front.cause") }}</div>
          </el-col>
          <el-col :span="16" :xs="24" :sm="24" :md="16">
            <el-form-item prop="reason" :error="errorForm['reason']?.[0]">
              <el-input
                v-if="isCancelBooking"
                :model-value="bookingDetail?.cancel?.reason"
                :placeholder="$t('placeholder.enter_reason')"
                disabled
              />
              <el-input
                v-else
                v-model="formData.reason"
                :maxlength="MAX_LENGTH_REASON"
                :placeholder="$t('placeholder.enter_reason')"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :xs="24" :sm="24" :md="8">
            <div class="label">{{ $t("memo") }}</div>
          </el-col>
          <el-col :span="16" :xs="24" :sm="24" :md="16">
            <el-form-item prop="memo" :error="errorForm['memo']?.[0]">
              <el-input
                v-if="isCancelBooking"
                :model-value="bookingDetail?.cancel?.memo"
                type="textarea"
                :rows="3"
                disabled
              />
              <el-input
                v-else
                v-model="formData.memo"
                type="textarea"
                :rows="3"
                :maxlength="MAX_LENGTH_TEXTAREA"
                :placeholder="$t('placeholder.enter_memo')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="bookingDetail?.store?.cancellation" class="cancel-policy">
          <el-col :span="8" :xs="24" :sm="24" :md="8">
            <div class="label">{{ $t("cancel_policy") }}</div>
          </el-col>
          <el-col :span="16" :xs="24" :sm="24" :md="16">
            <p class="text-pre-wrap">
              {{ bookingDetail?.store?.cancellation }}
            </p>
          </el-col>
        </el-row>
        <el-row class="fee-cancel">
          <el-col :span="8" :xs="12" :sm="12" :md="8">
            <div class="label">{{ $t("front.fee_cancel_booking") }}</div>
          </el-col>
          <el-col :span="16" :xs="12" :sm="12" :md="16">
            <div class="total">
              <p class="total-label">{{ $t("total") }}:</p>
              <p class="total-price">
                {{ priceDisplay(+feeCancel) }}{{ $t("yen") }}
              </p>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="group-button">
      <el-button
        class="btn-back"
        :disabled="isLoadingAction"
        @click="$router.push({ name: 'reservation' })"
        >{{ $t("front.button.back_to_reservation_list") }}
      </el-button>
      <el-button
        v-if="!isBookingVisited && !isCancelBooking"
        class="btn-cancel-booking"
        type="primary"
        :loading="isLoadingAction"
        @click="cancelBooking(_refForm)"
        >{{ $t("store.cancel_reservation") }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, reactive, ref } from "vue";
import { BookingDetail } from "~/../../src/front/models";
import BookingRequest from "~/../../src/shared/requests/BookingRequest";
import { useRoute, useRouter } from "#imports";
import { formatDate } from "~/../../src/shared/utils";
import {
  MAX_LENGTH_REASON,
  MAX_LENGTH_TEXTAREA,
} from "~/../../src/shared/utils/validate";
import { validateCancelBooking } from "~/../../src/front/validate/booking";
import { FormInstance } from "element-plus";

import { RESERVATION_STATUS } from "~/../../src/shared/constants/reservation";
import {
  messageError,
  messageSuccess,
} from "~/../../src/shared/utils/notification";
import { i18n } from "~/../../src/shared/plugins/i18n";
import scrollToTop from "~/../../src/shared/utils/scroll";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import priceDisplay from "~/../../src/shared/utils/price";

definePageMeta({
  activeSidebar: {
    parentName: "reservation",
  },
  middleware: ["auth"],
});

const { t } = i18n.global;
const _refForm = ref();
const bookingDetail = ref<BookingDetail>(null);
const route = useRoute();
const formData = reactive({
  reason: "",
  memo: "",
});
const errorForm = ref({});
const feeCancel = ref(0);
const isLoadingAction = ref(false);
const isLoading = ref(true);
const router = useRouter();
const dataTitle = reactive([{ name: t("reservations"), path: "" }]);

const isCancelBooking = computed(
  () => bookingDetail.value?.status === RESERVATION_STATUS.CANCEL
);

const isBookingVisited = computed(
  () => bookingDetail.value?.status === RESERVATION_STATUS.VISITED
);

const cancelBooking = async (form: FormInstance | undefined) => {
  if (!form) return;
  errorForm.value = {};
  await form.validate(async (valid) => {
    if (valid) {
      try {
        isLoadingAction.value = true;
        await BookingRequest.cancelBooking(bookingDetail.value?.id, formData);
        messageSuccess(t("success.cancel_booking_success"));
        await router.push({
          name: "reservation-detail-id",
          params: { id: bookingDetail.value.id },
        });
      } catch (e) {
        if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorForm.value = e.response?._data?.errors;
        }
        if (e.response.status === STATUS_CODE.BAD_REQUEST) {
          messageError(e.response?._data?.message);
        }
      } finally {
        isLoadingAction.value = false;
      }
    }
  });
};

onBeforeMount(async () => {
  try {
    if (route.params?.id) {
      bookingDetail.value = (
        await BookingRequest.show<BookingDetail>(+route.params?.id as number)
      )?.data;

      if (isBookingVisited.value || isCancelBooking.value) {
        await router.push({
          name: "reservation-detail-id",
          params: { id: bookingDetail.value.id },
        });
      }
      if (bookingDetail.value) {
        feeCancel.value =
          (
            await BookingRequest.getFeeCancel<number>(
              +route.params?.id as number
            )
          )?.data || 0;
      }
    }
    isLoading.value = false;
  } catch (e) {
    isLoading.value = false;
    await router.push({ name: "reservation" });
  } finally {
    scrollToTop();
  }
});
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.content {
  flex: 1;
  min-width: 0;
  padding: 32px 12.5%;

  .title {
    font-weight: 500;
    font-size: 20px;
    margin-bottom: 36px;
  }

  .cancel-booking {
    &__name {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 16px;
    }

    &__date {
      color: $black-60;
      margin-bottom: 8px;
    }

    &__category {
      margin-bottom: 24px;
    }

    & > .el-row {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .total {
      display: inline-flex;
      font-weight: 700;
      gap: 16px;
      font-size: 16px;
    }

    :deep(.el-form-item) {
      margin-bottom: 20px;
    }

    .cancel-policy {
      margin-bottom: 20px;
    }

    .fee-cancel {
      height: 36px;
      line-height: 36px;

      .total {
        padding-left: 8px;
      }
    }
  }

  .group-button {
    min-width: 0;
    margin-top: 32px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;

    .el-button {
      width: 178px;
      height: 40px;
      margin: 0;

      &.btn-back {
        background-color: #e7e7e7;
        color: $black-80;
      }

      &.btn-cancel-booking {
        background-color: #0052d9;
      }
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .content {
    gap: 16px;
    padding: 24px 5%;

    .cancel-booking {
      & > .el-row {
        & > .el-col:first-child {
          margin-bottom: 16px;
        }
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .content {
    padding: 24px 24px 32px;

    .title {
      margin-bottom: 24px;
    }
  }
}
</style>
