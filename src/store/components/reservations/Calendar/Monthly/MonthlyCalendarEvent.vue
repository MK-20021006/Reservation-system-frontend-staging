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
                resultStatusBooking &&
                resultStatusBooking.length > 0 &&
                resultStatusBooking.some(
                  (item) =>
                    moment(item.day).isSame(moment(day.time), 'D') &&
                    item.value === CalendarReservationStatus.NotWorking
                ),
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
                resultStatusBooking &&
                resultStatusBooking.length > 0 &&
                resultStatusBooking.some(
                  (item) =>
                    moment(item.day).isSame(moment(day.time), 'D') &&
                    item.value === CalendarReservationStatus.NotWorking
                )
              )
            "
            class="day__content"
          >
            <TimeFrameMonthEvent :day="moment(day.time)" />
          </div>
          <!-- END -->
          <!-- START -->
          <div
            v-else-if="day.type === TypeTime.currentMonth && day.isLessToday"
            class="day__content"
          >
            <TimeFrameMonthEvent :day="moment(day.time)" />
          </div>
          <!-- END -->
          <!-- START -->
          <div v-if="day.type === TypeTime.currentMonth" class="day__icon">
            <span
              v-if="
                resultStatusBooking &&
                resultStatusBooking.length > 0 &&
                resultStatusBooking.some(
                  (item) =>
                    moment(item.day).isSame(moment(day.time), 'D') &&
                    item.value === CalendarReservationStatus.NotWorking
                )
              "
              class="off"
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
import { ref, watch } from "vue";
import moment from "moment";
import { useGetCalendarMonthly } from "../../../../composables/reservations/getCalendar";
import {
  TypeTime,
  weekdays,
  CalendarReservationStatus,
} from "../../../../constants";
import TimeFrameMonthEvent from "../../TimeFrame/TimeFrameMonthEvent.vue";
import IconAvailable from "../../../Icon/IconAvailable.vue";
import IconFull from "../../../Icon/IconFull.vue";
import { useReservation } from "../../../../store/useReservation";
const reservationStore = useReservation();

const { daysDisplayOnCalendarMonthly } = useGetCalendarMonthly();
const resultStatusBooking = ref(reservationStore.getStatusBookingEvent);

watch(
  () => reservationStore.getStatusBookingEvent,
  () => {
    resultStatusBooking.value = reservationStore.getStatusBookingEvent;
  }
);
</script>

<style lang="scss" scoped>
@use "./styles.scss";
</style>
