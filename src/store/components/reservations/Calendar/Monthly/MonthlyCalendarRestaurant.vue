<template>
  <div
    v-loading="!reservationStore.calendar.status.canChangeActiveTime"
    class="monthly-calendar"
  >
    <!-- NAME OF DATE -->
    <div class="day-of-week">
      <div
        v-for="weekday in weekdays"
        :key="weekday.weekday"
        :class="['weekday', weekday.name]"
      >
        {{ $t(weekday.name) }}
      </div>
    </div>
    <!-- END NAME OF DATE -->
    <div class="list-day">
      <el-scrollbar>
        <div
          v-for="(day, index) in daysDisplayOnCalendarMonthly"
          :key="index"
          :class="[
            'day',
            { today: day.isToday },
            { 'is-less-today status-booking-unavailable': day.isLessToday },
            { 'not-current-month': day.type !== TypeTime.currentMonth },
            {
              'status-booking-unavailable':
                (openingTimeStore &&
                  openingTimeStore.length > 0 &&
                  !openingTimeStore.some(
                    (item) =>
                      item.day_of_week === moment(day.time).day() &&
                      moment(reservationStore.getTargetTime, 'HH:mm').isBetween(
                        moment(item.start, 'HH:mm'),
                        moment(item.end, 'HH:mm'),
                        'minute',
                        '[]'
                      )
                  )) ||
                (closingTimeStore &&
                  closingTimeStore.length > 0 &&
                  closingTimeStore.some((item) =>
                    moment(item.day_off).isSame(day.time, 'D')
                  )) ||
                (resultStatusBooking &&
                  resultStatusBooking.length > 0 &&
                  resultStatusBooking.some(
                    (item) =>
                      moment(item.day).isSame(moment(day.time), 'D') &&
                      item.value === CalendarReservationStatus.NotWorking
                  )),
            },
            {
              'status-booking-full':
                day.type === TypeTime.currentMonth &&
                resultStatusBooking &&
                resultStatusBooking.length > 0 &&
                resultStatusBooking.some(
                  (item) =>
                    moment(item.day).isSame(moment(day.time), 'D') &&
                    item.value === CalendarReservationStatus.full
                ),
            },
          ]"
        >
          <div :class="['day__number']">
            {{ moment(day.time).format("DD") }}
          </div>
          <!-- START -->
          <div
            v-if="
              day.type === TypeTime.currentMonth &&
              !(
                (openingTimeStore &&
                  openingTimeStore.length > 0 &&
                  !openingTimeStore.some(
                    (item) =>
                      item.day_of_week === moment(day.time).day() &&
                      moment(reservationStore.getTargetTime, 'HH:mm').isBetween(
                        moment(item.start, 'HH:mm'),
                        moment(item.end, 'HH:mm'),
                        'minute',
                        '[]'
                      )
                  )) ||
                (closingTimeStore &&
                  closingTimeStore.length > 0 &&
                  closingTimeStore.some((item) =>
                    moment(item.day_off).isSame(day.time, 'D')
                  )) ||
                (resultStatusBooking &&
                  resultStatusBooking.length > 0 &&
                  resultStatusBooking.some(
                    (item) =>
                      moment(item.day).isSame(moment(day.time), 'D') &&
                      item.value === CalendarReservationStatus.NotWorking
                  ))
              )
            "
            class="day__content"
          >
            <TimeFrameMonthRestaurant :day="moment(day.time)" />
          </div>
          <!-- END -->
          <!-- START -->
          <div
            v-else-if="day.type === TypeTime.currentMonth"
            class="day__content"
          >
            <TimeFrameMonthRestaurant :day="moment(day.time)" />
          </div>
          <!-- END -->
          <!-- START -->
          <div v-if="day.type === TypeTime.currentMonth" class="day__icon">
            <span
              v-if="
                (openingTimeStore &&
                  openingTimeStore.length > 0 &&
                  !openingTimeStore.some(
                    (item) =>
                      item.day_of_week === moment(day.time).day() &&
                      moment(reservationStore.getTargetTime, 'HH:mm').isBetween(
                        moment(item.start, 'HH:mm'),
                        moment(item.end, 'HH:mm'),
                        'minute',
                        '[]'
                      )
                  )) ||
                (closingTimeStore &&
                  closingTimeStore.length > 0 &&
                  closingTimeStore.some((item) =>
                    moment(item.day_off).isSame(day.time, 'D')
                  )) ||
                (resultStatusBooking &&
                  resultStatusBooking.length > 0 &&
                  resultStatusBooking.some(
                    (item) =>
                      moment(item.day).isSame(moment(day.time), 'D') &&
                      item.value === CalendarReservationStatus.NotWorking
                  ))
              "
            >
              {{ $t("store.off") }}
            </span>
            <IconAvailable
              v-else-if="
                resultStatusBooking &&
                resultStatusBooking.length > 0 &&
                resultStatusBooking.some(
                  (item) =>
                    moment(item.day).isSame(moment(day.time), 'D') &&
                    item.value === CalendarReservationStatus.empty
                )
              "
            />
            <IconFull
              v-else-if="
                resultStatusBooking &&
                resultStatusBooking.length > 0 &&
                resultStatusBooking.some(
                  (item) =>
                    moment(item.day).isSame(moment(day.time), 'D') &&
                    item.value === CalendarReservationStatus.full
                )
              "
            />
          </div>
          <!-- END -->
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, nextTick } from "vue";
import moment from "moment";

import {
  fetchDataStatusBooking,
  useGetCalendarMonthly,
} from "../../../../composables/reservations/getCalendar";

import {
  TypeTime,
  weekdays,
  CalendarReservationStatus,
} from "../../../../constants";
import TimeFrameMonthRestaurant from "../../TimeFrame/TimeFrameMonthRestaurant.vue";
import IconAvailable from "../../../Icon/IconAvailable.vue";
import IconFull from "../../../Icon/IconFull.vue";
// import IconUnavailable from "../../../Icon/IconUnavailable.vue";

import { useReservation } from "../../../../store/useReservation";
import { useMeStore } from "../../../../../shared/stores/me";

const reservationStore = useReservation();
const meStore = useMeStore();

const { daysDisplayOnCalendarMonthly } = useGetCalendarMonthly();
const resultStatusBooking = ref(reservationStore.getStatusBooking);

const openingTimeStore = ref(meStore.getOpeningTimeStore);
const closingTimeStore = ref(meStore.getClosingTimeStore);

watch(
  () => reservationStore.getStatusBooking,
  () => {
    resultStatusBooking.value = reservationStore.getStatusBooking;
  }
);

watch(
  () => meStore.getOpeningTimeStore,
  () => {
    openingTimeStore.value = meStore.getOpeningTimeStore;
  }
);

watch(
  () => meStore.getClosingTimeStore,
  () => {
    closingTimeStore.value = meStore.getClosingTimeStore;
  }
);

onMounted(() => {
  openingTimeStore.value = meStore.getOpeningTimeStore;
  closingTimeStore.value = meStore.getClosingTimeStore;

  nextTick(async () => {
    const resultStatusBooking = await fetchDataStatusBooking(
      reservationStore.getTargetTime
    );
    if (resultStatusBooking) {
      reservationStore.setStatusBooking(resultStatusBooking);
    }
  });
});
</script>

<style lang="scss" scoped>
@use "./styles.scss";
</style>
