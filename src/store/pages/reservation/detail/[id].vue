<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.reservation_detail") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.reservation_detail") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <FormBooking ref="_refForm" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <template
            v-if="
              _refForm?.checkNotCrawler ||
              (!_refForm?.checkNotCrawler && _refForm?.checkHotPepperBeauty) ||
              (!_refForm?.checkNotCrawler && _refForm?.checkCrawlGoogle)
            "
          >
            <ButtonDefault
              :name="$t('button.back')"
              :disabled="_refForm?.isLoadingSave || _refForm?.isLoadingApprove"
              @click="$router.push({ name: 'reservation' })"
            />
            <div class="btn-right">
              <ButtonBlue
                v-if="
                  _refForm?.bookingDetail &&
                  !_refForm?.isBookingVisited &&
                  _refForm?.isCustomerPaid &&
                  !_refForm?.checkHotPepperBeauty
                "
                :name="$t('booking.visited')"
                :loading="_refForm?.isLoadingVisited"
                @click="handleVisitedBooking"
              />
              <ButtonLightBlue
                v-if="
                  (!_refForm?.isBookingWaiting &&
                    !_refForm?.isBookingCanceled &&
                    _refForm?.bookingDetail &&
                    !(
                      _refForm?.isCustomerUnPaid &&
                      _refForm?.isPaymentContactless &&
                      _refForm.isBookingCompleted
                    )) ||
                  _refForm?.checkHotPepperBeauty
                "
                :name="$t('button.save')"
                :loading="_refForm?.isLoadingSave"
                :disabled="
                  _refForm?.isLoadingApprove ||
                  _refForm?.isLoadingVisited ||
                  _refForm?.isLoadingCheckCoupon
                "
                @click="handleSave"
              />
              <ButtonGray
                v-if="
                  (_refForm?.isBookingWaiting ||
                    _refForm?.isBookingCompleted) &&
                  !(_refForm?.isCustomerUnPaid && _refForm?.isPaymentCard) &&
                  !_refForm?.checkHotPepperBeauty
                "
                :name="$t('store.cancel_reservation')"
                width="138px"
                :disabled="
                  _refForm?.isLoadingSave || _refForm?.isLoadingApprove
                "
                @click="handleCancel"
              />
              <ButtonGreen
                v-if="
                  _refForm?.isCustomerUnPaid &&
                  _refForm?.isPaymentContactless &&
                  _refForm.isBookingCompleted &&
                  !_refForm?.checkHotPepperBeauty
                "
                :name="$t('button.decision')"
                width="138px"
                :loading="_refForm?.isLoadingRefund"
                @click="handleRefund"
              />
            </div>
          </template>
          <template v-else
            ><ButtonDefault
              :name="$t('button.back')"
              :disabled="_refForm?.isLoadingSave || _refForm?.isLoadingApprove"
              @click="$router.push({ name: 'reservation' })"
            />
          </template>
        </div>
      </div>
    </template>
  </ListScreenComponent>
  <!--Dialog cancel booking-->
  <CancelBooking
    v-model:dialog="dialogVisible"
    v-model:reason="reason"
    v-model:memo="memo"
    :is-loading-confirm="isLoadingCancel"
    :is-loading-cancel-as-user="isLoadingCancelAsUser"
    :error-form="errorsForm"
    :is-user-create="isUserCreateBooking"
    @confirm="handleConfirmCancel"
    @cancel-as-user="handleConfirmCancel(true)"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import useHavePermission from "~/../../src/shared/composables/useHavePermission";
import { Permission } from "~/../../src/shared/constants/permission";
import ButtonGray from "~/../../src/shared/components/button/ButtonGray.vue";
import ButtonDefault from "~/../../src/shared/components/button/ButtonDefault.vue";
import ButtonLightBlue from "~/../../src/shared/components/button/ButtonLightBlue.vue";
import CancelBooking from "~/../../src/shared/components/modal/CancelBooking.vue";
import ButtonGreen from "~/../../src/shared/components/button/ButtonGreen.vue";
import BookingRequest from "~/../../src/shared/requests/BookingRequest";
import { useMeStore } from "~/../../src/shared/stores/me";
import { useRoute, useRouter } from "#imports";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import ButtonBlue from "~/../../src/shared/components/button/ButtonBlue.vue";
import {
  messageError,
  messageSuccess,
} from "~/../../src/shared/utils/notification";

useHavePermission(Permission.ReservationCreate);

const route = useRoute();
const router = useRouter();

const _refForm = ref();
const dialogVisible = ref(false);
const reason = ref("");
const memo = ref("");
const isLoadingCancel = ref(false);
const isLoadingCancelAsUser = ref(false);
const errorsForm = ref({});
const meStore = useMeStore();

const handleCancel = async () => {
  dialogVisible.value = true;
};

const handleRefund = async () => {
  await _refForm.value.handleRefundBooking();
};

const handleConfirmCancel = async (asUser = false) => {
  asUser
    ? (isLoadingCancelAsUser.value = true)
    : (isLoadingCancel.value = true);
  try {
    const formData = {
      reason: reason.value,
      memo: memo.value,
      customer_request: false,
    };

    if (asUser) {
      formData.customer_request = true;
    }
    await BookingRequest.cancelBooking(+route.params?.id, formData);
    messageSuccess("success.cancel_booking_success");
    await meStore.updateTotalWaiting();
    await router.push({ name: "reservation" });
  } catch (e: any) {
    if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      errorsForm.value = e.data.errors;
    }
    if (e.response.status === STATUS_CODE.BAD_REQUEST) {
      messageError(e.response?._data?.message);
    }

    if (e.response.status === STATUS_CODE.BAD_REQUEST) {
      messageError(e.response?._data?.message);
    }

    if (e.response.status === STATUS_CODE.NOT_FOUND) {
      await router.push({ name: "reservation" });
    }
  } finally {
    isLoadingCancel.value = false;
    isLoadingCancelAsUser.value = false;
  }
};

const isUserCreateBooking = computed(
  () => _refForm.value?.isCustomerCreateBooking
);

const handleSave = async () => {
  await _refForm.value.handleUpdateBooking();
};

const handleVisitedBooking = async () => {
  await _refForm.value.handleVisitedBooking();
};
</script>

<style lang="scss" scoped>
.footer {
  .btn-right {
    .el-button + .el-button {
      margin-left: 15px;
    }
  }
}
</style>
