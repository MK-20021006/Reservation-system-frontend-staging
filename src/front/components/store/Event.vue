<template>
  <div class="event">
    <div class="event-photo" @click="handleClickDetail(detailEvent.id)">
      <img
        v-if="detailEvent.model_has_file?.[0]?.file?.url"
        :src="detailEvent.model_has_file?.[0]?.file?.url"
        alt=""
      />
      <img v-else src="../../assets/images/default_store.svg" alt="" />
    </div>
    <div class="event-body">
      <div class="event-body__name" @click="handleClickDetail(detailEvent.id)">
        {{ detailEvent.name }}
      </div>
      <div class="event-body__compare">
        {{ detailEvent.description }}
      </div>
      <div class="event-body__menu">
        <div v-if="detailEvent.number_seats" class="event-body__menu-people">
          <icon-people />
          <span>{{ detailEvent.number_seats }}{{ $t("people") }}</span>
        </div>
        <div class="event-body__menu-time">
          <icon-lock-blue />
          <span>{{ formatDate(detailEvent.start_date) }}</span>
          <span>～{{ formatDate(detailEvent.end_date) }}</span>
        </div>
        <div class="event-body__menu-money">
          <icon-money />
          <template v-if="detailEvent?.price >= detailEvent?.price_children">
            <span class="money">{{
              priceDisplay(detailEvent?.price_children) || 0
            }}</span>
            <span class="money">〜</span>
            <span class="money"
              >{{ priceDisplay(detailEvent?.price) }}{{ $t("yen") }}({{
                $t("tax_include")
              }})</span
            >
          </template>
          <template v-else>
            <span class="money">{{ priceDisplay(detailEvent?.price) }}</span>
            <span class="money">〜</span>
            <span class="money"
              >{{ priceDisplay(detailEvent?.price_children) }}{{ $t("yen") }}({{
                $t("tax_include")
              }})</span
            >
          </template>
        </div>
      </div>
      <div
        v-if="detailEvent?.coupons?.length > 0"
        class="coupon-list-customer coupon-list-customer-bottom"
      >
        <div class="title">{{ $t("coupon") }}:</div>
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
    <div class="event-action">
      <button-red
        :disabled="isDisabled"
        :name="$t('button.add_store')"
        @click="handleClick(detailEvent.id)"
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
      @handle-booking="handleBookingEvent"
      @handle-close="handleCloseDatePicker"
    />
  </div>
</template>

<script lang="ts" setup>
import ButtonRed from "../../../shared/components/button/ButtonRed.vue";
import { defineProps, ref, toRefs } from "vue";
import priceDisplay from "../../../shared/utils/price";
import { EventInterface } from "~/../../src/front/models";
import { formatDate } from "~/../../src/shared/utils/format";
import CouponList from "~/../../src/front/components/modal/Coupon.vue";
import ModalDatepickerEvent from "~/../../src/front/components/modal/DatepickerEvent.vue";

interface Prop {
  detailEvent: EventInterface;
  idEvent?: number;
  typeStore: number;
  loading: boolean;
  isDisabled?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  loading: false,
  isDisabled: false,
});

const { detailEvent, typeStore } = toRefs(props);
const isDisabled = ref(false);
const eventIdBooking = ref<number | null>(null);
const dataCoupon = ref<any[]>([]);
const isShowModalCoupon = ref(false);
const showModalDatePicker = ref(false);
const couponCode = ref<string | null>(null);
const eventBooking = ref<EventInterface | null>(null);

const emits = defineEmits([
  "handleClick",
  "handleDetail",
  "handleClickCouponEvent",
]);

const handleClickDetail = (id: number) => {
  emits("handleDetail", id);
};

const showModalCoupon = (couponList: any[], event: EventInterface) => {
  dataCoupon.value = couponList;
  eventIdBooking.value = event.id;
  isShowModalCoupon.value = true;
  eventBooking.value = event;
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

const handleBookingEvent = ([eventId, dateBooking, eventTimeId]: any) => {
  emits("handleClickCouponEvent", [
    eventId,
    dateBooking,
    eventTimeId,
    couponCode.value,
  ]);
};

const handleClick = (id: number) => {
  emits("handleClick", id);
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.event {
  display: flex;
  width: 100%;
  //border-bottom: 1px solid $grey-small-color;
  //padding: 24px 0;
  flex-wrap: wrap;

  .event-photo {
    cursor: pointer;
    margin-right: 24px;
    width: 25%;

    :hover {
      opacity: 0.5;
    }

    img {
      width: 100%;
      object-fit: cover;
      height: 120px;
    }
  }

  .event-body {
    width: calc(75% - 128px);
    margin-right: 4px;

    .event-body__name {
      color: $black-85;
      font-weight: 600;
      cursor: pointer;
    }

    .event-body__compare {
      color: rgba(0, 0, 0, 0.6);
      white-space: pre-line;
    }

    .event-body__menu {
      display: flex;
      font-size: 12px;
      justify-content: space-between;
      padding: 14px 0 22px;
      flex-wrap: wrap;

      .event-body__menu-people,
      .event-body__menu-time,
      .event-body__menu-money {
        display: flex;
        align-items: center;

        svg {
          margin-right: 5px;
        }
      }

      .event-body__menu-time {
        margin-right: 5px;
      }

      .event-body__menu-money {
        color: $red-color;
        font-size: 12px;

        .money {
          font-size: 12px;
          font-weight: 400;
          margin-right: 5px;
        }

        .text-money {
          font-size: 10px;
        }
      }
    }
  }

  .event-action {
    width: 100px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}

@include res("md-only", $breakpoints-spec) {
  .event {
    .event-photo {
      width: 100%;
      margin-right: 0;

      img {
        width: 100%;
        max-width: 300px;
        object-fit: cover;
        height: 120px;
      }
    }

    .event-body {
      width: 100%;

      .event-body__menu {
        display: flex;
        font-size: 12px;
        justify-content: space-between;
      }
    }

    .event-action {
      display: flex;
      justify-content: flex-start;
    }
  }
}

@include res("sm-only", $breakpoints-spec) {
  .event {
    .event-photo {
      width: 100%;
      margin-bottom: 16px;

      img {
        width: 80%;
        object-fit: cover;
        height: 120px;
      }
    }

    .event-body {
      width: 100%;

      .event-body__menu {
        display: flex;
        font-size: 12px;
        justify-content: space-between;

        .event-body__menu-money {
          color: $red-color;
          font-size: 12px;

          .money {
            font-size: 12px;
            font-weight: 400;
            margin-right: 5px;
          }
        }
      }
    }

    .event-action {
      display: flex;
      justify-content: flex-start;
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .event {
    .event-photo {
      width: 100%;

      img {
        max-width: 240px;
        width: 100%;
        height: 120px;
      }
    }

    .event-body {
      width: 100%;
    }

    .event-action {
      justify-content: flex-start;
    }
  }
}
</style>
