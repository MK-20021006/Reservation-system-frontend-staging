<template>
  <div class="detail-event">
    <div class="detail-event__header">
      <div class="detail-event__header-image">
        <TopHeaderMb
          v-if="device === DevicesEnum.MOBILE_DEVICE"
          :data="detailEvent.images"
        />
        <SliderImageDetail
          v-else
          :data="detailEvent.images"
        ></SliderImageDetail>
      </div>
    </div>
    <div class="detail-event__body">
      <div class="table-cell">
        <div class="detail-event__body-title">
          {{ $t("event_name") }}
        </div>
        <div class="detail-event__body-content">
          {{ detailEvent?.name }}
        </div>
      </div>
      <div class="table-cell">
        <div class="detail-event__body-title">
          {{ $t("front.event_fee") }}
        </div>
        <div class="detail-event__body-content money">
          <div>
            {{ getLabelTypeFee(detailEvent?.fee_type, true) }}:
            {{ priceDisplay(detailEvent?.price) }}{{ $t("yen") }}({{
              $t("tax_include")
            }})
          </div>
          <div>
            {{ getLabelTypeFee(detailEvent?.fee_type) }}:
            {{ priceDisplay(detailEvent?.price_children) }}{{ $t("yen") }}({{
              $t("tax_include")
            }})
          </div>
        </div>
      </div>
      <div class="table-cell">
        <div class="detail-event__body-title">
          {{ $t("valid_period") }}
        </div>
        <div class="detail-event__body-content">
          {{ formatDate(detailEvent?.start_date) }}〜{{
            formatDate(detailEvent?.end_date)
          }}
        </div>
      </div>
      <div class="table-cell">
        <div class="detail-event__body-title">
          {{ $t("number_of_seat") }}
        </div>
        <div class="detail-event__body-content">
          {{ detailEvent?.number_seats }} {{ $t("seat_menu") }}
        </div>
      </div>
      <div class="table-cell">
        <div class="detail-event__body-title">
          {{ $t("place") }}
        </div>
        <div class="detail-event__body-content">
          {{ detailEvent?.place }}
        </div>
      </div>
      <div class="table-cell">
        <div class="detail-event__body-title">
          {{ $t("overview") }}
        </div>
        <div class="detail-event__body-content">
          {{ detailEvent?.description }}
        </div>
      </div>
      <div v-if="detailEvent?.coupons?.length > 0" class="table-cell">
        <div class="detail-event__body-title">
          {{ $t("title_screen.list_coupon") }}
        </div>
        <div class="detail-event__body-content">
          <div class="coupon-list-customer">
            <div
              v-for="coupon in detailEvent.coupons"
              :key="coupon.id"
              class="coupon ellipsis"
              @click="showModalCoupon(detailEvent.coupons, detailEvent)"
            >
              {{ coupon.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="show-date-picker">
      <common-event-date-picker
        v-if="detailEvent?.id"
        :event-id="detailEvent.id"
        @handle-booking="handleBooking"
      />
    </div>
    <coupon-list
      v-if="isShowModalCoupon"
      :dialog-visible="isShowModalCoupon"
      :data="dataCoupon"
      :event="eventBooking"
      :title="$t('coupon')"
      @handle-click="handleCoupon"
      @handle-close="handleCloseCoupon"
    />
    <ModalDatepickerEvent
      v-if="showModalDatePicker && eventIdBooking"
      :dialog-visible="showModalDatePicker"
      :event-id="eventIdBooking"
      :event="eventBooking"
      @handle-booking="handleBookingEvent"
      @handle-close="handleCloseDatePicker"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref, toRefs } from "vue";
import priceDisplay from "../../../shared/utils/price";
import { EventInterface } from "~/../../src/front/models";
import { formatDate } from "~/../../src/shared/utils";
import { getLabelTypeFee } from "~/../../src/shared/constants/event";
import SliderImageDetail from "~/../../src/front/components/store/SliderImageDetail.vue";
import { useDeviceStore } from "~/../../src/front/store/device";
import { DevicesEnum } from "~/../../src/shared/constants";
import TopHeaderMb from "~/../../src/front/components/store/TopHeaderMb.vue";
import CouponList from "~/../../src/front/components/modal/Coupon.vue";
import ModalDatepickerEvent from "~/../../src/front/components/modal/DatepickerEvent.vue";

interface Prop {
  detailEvent?: EventInterface;
}

const props = defineProps<Prop>();
const { detailEvent } = toRefs(props);
const eventIdBooking = ref<number | null>(null);
const eventBooking = ref<EventInterface | null>(null);
const dataCoupon = ref<any[]>([]);
const isShowModalCoupon = ref(false);
const showModalDatePicker = ref(false);
const couponCode = ref<string | null>(null);

const emits = defineEmits([
  "handleBooking",
  "handleClickCouponEvent",
  "handleBookingCoupon",
]);

const handleBooking = ([event_id, date, start_time, end_time]: [
  number,
  string,
  string,
  string
]) => {
  emits("handleBooking", [event_id, date, start_time, end_time]);
};

const showModalCoupon = (couponList: any[], event: EventInterface) => {
  dataCoupon.value = couponList;
  eventIdBooking.value = event.id;
  eventBooking.value = event;
  isShowModalCoupon.value = true;
};

const handleCoupon = (code: string) => {
  couponCode.value = code;
  showModalDatePicker.value = true;
  isShowModalCoupon.value = false;
};

const handleCloseCoupon = () => {
  dataCoupon.value = [];
  eventIdBooking.value = null;
  eventBooking.value = null;
  isShowModalCoupon.value = false;
};

const handleCloseDatePicker = () => {
  showModalDatePicker.value = false;
  isShowModalCoupon.value = false;
};

const handleBookingEvent = ([event_id, date_booking, event_time_id]: any) => {
  emits("handleClickCouponEvent", [
    event_id,
    date_booking,
    event_time_id,
    couponCode.value,
  ]);
};

const deviceTable = useDeviceStore();
const device = computed(() => {
  return deviceTable.device;
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.detail-event {
  .detail-event__header {
    display: flex;
    margin-bottom: 16px;

    .detail-event__header-image {
      width: 100%;

      img {
        width: 100%;
        object-fit: cover;
      }
    }

    .detail-event__header-content {
      .name {
        font-weight: bold;
      }

      .content {
        white-space: pre-line;
      }
    }
  }

  .detail-event__body {
    .table-cell {
      display: flex;
      border-top: 1px solid $border-table;

      &:last-child {
        border-bottom: 1px solid $border-table;
      }

      .detail-event__body-title {
        display: flex;
        align-items: flex-start;
        width: 155px;
        padding: 12px;
        background-color: $grey-low-color;
      }

      .detail-event__body-content {
        padding: 12px;
        white-space: pre-line;
        width: calc(100% - 155px);
      }

      .money {
        font-weight: bold;
        color: $btn-red;
        font-size: 16px;
      }
    }
  }

  .detail-event__footer {
    display: flex;
    width: 100%;
    justify-content: center;
    margin: 24px 0;

    button {
      width: 224px;
    }
  }

  .show-date-picker {
    margin-top: 24px;
  }
}

@include res("xs-only", $breakpoints-spec) {
  .detail-event {
    padding: 0 16px;

    .detail-event__header {
      display: flex;
      margin-bottom: 16px;
      flex-wrap: wrap;

      .detail-event__header-image {
        width: 100%;
        margin-right: 0;

        img {
          width: 100%;
          height: 260px;
          object-fit: cover;
        }
      }

      .detail-event__header-content {
        .name {
          font-weight: bold;
        }

        .content {
          white-space: pre-line;
        }
      }
    }

    .detail-event__body {
      .table-cell {
        display: flex;
        border-top: 1px solid $border-table;

        &:last-child {
          border-bottom: 1px solid $border-table;
        }

        .detail-event__body-title {
          display: flex;
          align-items: flex-start;
          width: 155px;
          padding: 12px;
          background-color: $grey-low-color;
        }

        .detail-event__body-content {
          padding: 12px;
          white-space: pre-line;
          width: calc(100% - 155px);
        }

        .money {
          font-weight: bold;
          color: $btn-red;
          font-size: 16px;
        }
      }
    }

    :deep(.smail-image) {
      display: none;
    }

    :deep(.el-carousel) {
      height: 200px !important;

      .el-carousel__container {
        height: 200px !important;

        .el-carousel__item {
          height: 200px;

          img {
            height: 200px;
          }
        }
      }
    }
  }
}
</style>
