<template>
  <div v-loading="isLoading" class="daily-calendar">
    <el-scrollbar>
      <div class="hours-in-day">
        <div class="hour hour__title">
          {{ $t("time") }}
        </div>
        <div
          v-for="hour in hoursInDay"
          :key="hour"
          :class="['hour', 'hour__value']"
        >
          {{ hour }}
        </div>
      </div>
      <div class="number_of_reversion">
        <div class="number number__title">
          {{ $t("number_of_reservations") }}
        </div>
        <div
          v-for="hour in hoursInDay"
          :key="hour"
          :class="['number', 'number__value']"
        >
          <template v-for="part in [0, 1, 2, 3]" :key="`part__${part}`">
            <div
              class="part part__first"
              :hour="getMomentPart(hour, part)"
              :class="{
                'check-data': checkDataNumberBookingAndSeat(hour, part),
              }"
              @mouseover="changeTooltipSeat(getMomentPart(hour, part))"
              @mouseleave="removeTooltip"
            >
              <span>
                {{
                  reservationInDay
                    ? reservationInDay
                        .filter(
                          (item) => item.time === getMomentPart(hour, part)
                        )
                        .at(0)?.value
                    : 0
                }}
              </span>
              <span
                v-if="checkDataNumberBookingAndSeat(hour, part)"
                v-show="tooltipSeat === getMomentPart(hour, part)"
                class="tooltip-data"
                >{{ $t("booking_bigger_seat") }}</span
              >
            </div>
          </template>
        </div>
      </div>

      <!-- START Number of available reservation on top -->
      <div class="number_of_available_reservation">
        <div class="number number__title">
          {{ t("number_of_available_reservation") }}
        </div>
        <div
          v-for="hour in hoursInDay"
          :key="hour"
          :class="['number', 'number__value']"
        >
          <template v-for="part in [0, 1, 2, 3]" :key="`part__${part}`">
            <div
              :class="[
                'part',
                { 'check-data': checkDataNumberBookingAndSeat(hour, part) },
                `part__${part}`,
              ]"
              :hour="getMomentPart(hour, part)"
              @mouseover="changeTooltipBooking(getMomentPart(hour, part))"
              @mouseleave="removeTooltip"
            >
              <span>
                {{
                  availableSeatInDay
                    ? availableSeatInDay
                        .filter(
                          (item) => item.time === getMomentPart(hour, part)
                        )
                        .at(0)?.value
                    : 0
                }}
              </span>
              <span
                v-if="checkDataNumberBookingAndSeat(hour, part)"
                v-show="tooltipBooking === getMomentPart(hour, part)"
                class="tooltip-data"
                >{{ $t("booking_bigger_seat") }}</span
              >
            </div>
          </template>
        </div>
      </div>
      <!-- END Number of available reservation on top -->

      <!-- START Show seat in left sidebar -->
      <div
        v-for="(seat, index) in seatData"
        :key="index"
        class="list-seats"
        :seat-id="seat.id"
      >
        <div class="seat seat__title">
          <div class="seat__name">
            {{ seat.name }}
          </div>
          <div class="seat__count-reservation">
            {{
              `
              ${$t("reserve_2")}：
              ${
                arrCountReservationRestaurant
                  .filter(
                    (item) =>
                      item.activeTime === reservationStore.getActiveTime &&
                      item.seatId === seat.id
                  )
                  .at(0)?.count || 0
              }
              ${$t("group")}
                `
            }}
          </div>
          <div
            v-for="site in getDataCrawl(seat)"
            :key="site"
            class="seat__type_crawl"
          >
            <div class="seat__name_crawl">{{ site?.name }}</div>
            <div class="site__name-crawl">
              {{ site?.name_site ? "(" + $t(site?.name_site) + ")" : "" }}
            </div>
          </div>
        </div>
        <div
          v-for="hour in hoursInDay"
          :key="hour"
          :class="['seat', 'seat__value']"
        >
          <template v-for="part in [0, 1, 2, 3]" :key="`part__${part}`">
            <div :class="`part part__${part}`"></div>
          </template>
        </div>
        <ReservationInSeat
          :seat-id="seat.id"
          @count-reservation="handleCountReservationRestaurant"
        />
      </div>
      <!-- END Show seat on left sidebar -->
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import moment from "moment";
import "moment/dist/locale/ja";
import { watch, onBeforeMount, ref } from "vue";

import { calculatorHoursInDay } from "../../../../composables/reservations/getCalendar";
import {
  getReservationInDay,
  getSeatOfStore,
  getAvailableSeatInDay,
} from "../../../../composables/reservations/getStore";
import {
  AvailableSeatInDay,
  ReservationInDay,
  Seat,
  CountReservationRestaurant,
} from "../../../../models";

import ReservationInSeat from "../../Reservation/Daily/ReservationInSeat.vue";
import { useReservation } from "../../../../store/useReservation";
import { useMeStore } from "../../../../../shared/stores/me";

import { getMomentPart } from "./mixin";

moment.locale("ja");

const reservationStore = useReservation();
const meStore = useMeStore();
const { t } = useI18n();

const { hoursInDay } = calculatorHoursInDay();

const reservationInDay = ref<ReservationInDay[]>();

const isLoading = ref<boolean>(false);

const seatData = ref<Seat[]>();
const availableSeatInDay = ref<AvailableSeatInDay[]>();

const storeId = meStore.getStoreId;

const arrCountReservationRestaurant = ref<CountReservationRestaurant[]>([]);
const tooltipBooking = ref();
const tooltipSeat = ref();

const checkDataNumberBookingAndSeat = (hour: string, part: number) => {
  if (reservationInDay.value && reservationInDay.value?.length > 0) {
    return (
      Number(
        reservationInDay.value
          .filter((item: any) => item.time === getMomentPart(hour, part))
          .at(0)?.value
      ) >
      Number(
        reservationInDay.value
          .filter((item: any) => item.time === getMomentPart(hour, part))
          .at(0)?.total
      )
    );
  }
  return false;
};

const changeTooltipSeat = (hour: string) => {
  tooltipSeat.value = hour;
};

const changeTooltipBooking = (hour: string) => {
  tooltipBooking.value = hour;
};

const removeTooltip = () => {
  tooltipSeat.value = "";
  tooltipBooking.value = "";
};

const handleCountReservationRestaurant = (
  count: number,
  activeTime: string,
  seatId: number
) => {
  const obj = arrCountReservationRestaurant.value.find(
    (item) => item.seatId === seatId
  );
  if (obj) {
    obj.count = count;
    obj.activeTime = activeTime;
  } else {
    arrCountReservationRestaurant.value.push({
      count,
      activeTime,
      seatId,
    });
  }
};

watch(
  () => reservationStore.getActiveTime,
  async () => {
    await getData();
  }
);

watch(
  () => reservationStore.getCrawlSite,
  async () => {
    await getData();
  }
);

const getData = async () => {
  isLoading.value = true;
  if (storeId) {
    const reservationData = await getReservationInDay(
      storeId,
      reservationStore.getActiveTime,
      reservationStore.getCrawlSite
    );
    if (reservationData) {
      reservationInDay.value = reservationData.reservations;
    }

    const seatOfStoreData = await getSeatOfStore();
    if (seatOfStoreData) {
      seatData.value = seatOfStoreData.seat;
    }

    const availableSeatData = await getAvailableSeatInDay(
      storeId,
      reservationStore.getActiveTime,
      reservationStore.getCrawlSite
    );
    if (availableSeatData) {
      availableSeatInDay.value = availableSeatData.availableSeat;
    }
  }
  isLoading.value = false;
};

const getDataCrawl = (data: any) => {
  const arr = [];
  if (data && data.map_seat_tabelog) {
    arr.push({
      name: data.map_seat_tabelog.name,
      name_site: "eating_log",
    });
  }
  if (data && data.map_seat_gurunavi) {
    arr.push({
      name: data.map_seat_gurunavi.name,
      name_site: "store.gurunavi",
    });
  }
  if (data && data.map_seat_hotpepper) {
    arr.push({
      name: data.map_seat_hotpepper.name,
      name_site: "store.hot_pepper_gourmet",
    });
  }
  return arr;
};

onBeforeMount(async () => {
  await getData();
});
</script>

<style lang="scss" scoped>
@use "./style.scss";
@use "../../../../assets/scss/variables.scss";

.daily-calendar {
  width: 100%;

  .el-scrollbar {
    :deep() {
      .el-scrollbar__wrap {
        .el-scrollbar__view {
          position: relative;

          .list-seats {
            $minHeightSeat: 152px;
            background-color: white;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            width: 100%;
            min-height: $minHeightSeat;
            position: relative;

            .seat {
              background-color: white;
              flex-grow: 1;
              flex-shrink: 1;
              width: 170px;
              height: 100%;

              &__title {
                min-height: $minHeightSeat;
                min-width: style.$widthFirstColumn;
                padding: style.$paddingFirstColumn;
                border: 1px solid variables.$border-color;
                font-size: 14px;
                background-color: variables.$gray-500;
                z-index: 2;

                .seat__name {
                  font-weight: 700;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  margin-bottom: 10px;
                }

                .seat__type_crawl {
                  .seat__name_crawl {
                    font-weight: 700;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                }
              }

              &__value {
                display: flex;
                min-height: $minHeightSeat;
                min-width: calc(style.$minWidthMinuteSpace * 4);
                text-align: center;

                .part {
                  border: 1px solid variables.$border-color;
                  min-width: 46px;
                  min-height: $minHeightSeat;
                  width: 50%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
              }

              &:first-child {
                position: sticky;
                left: 0px;
              }
            }
          }
        }
      }
    }
  }
}

:deep(.check-data) {
  color: #db0720;
  cursor: pointer;
  position: relative;

  .tooltip-data {
    padding: 8px;
    position: absolute;
    color: #000000cc;
    background-color: #f8e5e7;
    border-radius: 4px;
    top: 0;
    right: 0;
    min-width: 200px;
    font-size: 12px;
    z-index: 9999;

    &::before {
      content: "";
      width: 0;
      height: 0;
      border-radius: 4px;
      position: absolute;
      top: 4px;
    }

    &.left {
      left: 0px;
      transform: translate(-105%, 5%);

      &::before {
        border-top: 5px solid transparent;
        border-right: none;
        border-bottom: 5px solid transparent;
        border-left: 10px solid #f8e5e7;

        right: -9px;
      }
    }

    &.right {
      right: 0px;
      transform: translate(105%, 5%);

      &::before {
        border-top: 5px solid transparent;
        border-right: 10px solid #f8e5e7;
        border-bottom: 5px solid transparent;
        border-left: none;
        left: -9px;
      }
    }
  }
}
</style>
