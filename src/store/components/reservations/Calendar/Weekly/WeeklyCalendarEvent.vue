<template>
  <div
    v-loading="!reservationStore.calendar.status.canChangeActiveTime"
    class="weekly-calendar"
  >
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
      <div class="day-in-week">
        <div
          v-for="(day, index) in daysDisplayOnCalendarWeekly"
          :key="index"
          :class="['day']"
          :day="moment(day.time).format('YYYY-MM-DD')"
        >
          <div :class="['day__title']">
            <div class="day__title__date">
              {{ moment(day.time).format(dateFormat) }}
            </div>
            <div class="day__title__weekday">
              {{ `${moment(day.time).format("ddd")}${t("day_of_week")}` }}
            </div>
            <div class="day__title__count">
              <CountReservationEventInDay :day="moment(day.time)" />
            </div>
          </div>
          <div v-for="hour in hoursInDay" :key="hour" :class="['day__hour']">
            <div class="part part__first"></div>
            <div class="part part__second"></div>
          </div>
          <ReservationInDayEvent :day="moment(day.time)" />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import moment from "moment";
import "moment/dist/locale/ja";

import CountReservationEventInDay from "../../Content/CountReservationEventInDay.vue";
import ReservationInDayEvent from "../../Reservation/Weekly/ReservationInDayEvent.vue";

import {
  calculatorHoursInDay,
  useGetCalendarWeekly,
} from "../../../../composables/reservations/getCalendar";
import { useReservation } from "../../../../../store/store/useReservation";

moment.locale("ja");

const { t } = useI18n();
const dateFormat = "YYYY/MM/DD";
const reservationStore = useReservation();

const { daysDisplayOnCalendarWeekly } = useGetCalendarWeekly();
const { hoursInDay } = calculatorHoursInDay();
</script>

<style lang="scss" scoped src="./styles.scss"></style>
