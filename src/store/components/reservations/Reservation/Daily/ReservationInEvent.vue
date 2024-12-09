<template>
  <div class="daily-calendar__reservation">
    <TimeFrameDayEvent
      v-for="(reservation, index) in reservations"
      :key="index"
      :data="reservation"
    />
  </div>
</template>

<script lang="ts" setup>
import { getReservationEventByDailyAndEvent } from "../../../../composables/reservations/getReservation";
import TimeFrameDayEvent from "../../TimeFrame/TimeFrameDayEvent.vue";
import { nextTick, onMounted, ref, watch } from "vue";
import { drawTimeFrameEventDailyView } from "../../../../composables/reservations/drawTimeFrame";
import { useReservation } from "../../../../store/useReservation";
import moment from "moment";
import { Appearance } from "../../../../constants";

const reservationStore = useReservation();

const reservations = ref(
  getReservationEventByDailyAndEvent(
    moment(reservationStore.getActiveTime),
    reservationStore.getEventId
  ).reservations.value
);

watch(
  () => [
    reservationStore.getEventId,
    reservationStore.getActiveTime,
    reservationStore.getAppearance,
    reservationStore.getIsCallingApiEvent,
  ],
  () => {
    if (reservationStore.getAppearance === Appearance.calendar) {
      reservations.value = getReservationEventByDailyAndEvent(
        moment(reservationStore.getActiveTime),
        reservationStore.getEventId
      ).reservations.value;

      setTimeout(() => {
        drawTimeFrameEventDailyView();
      }, 300);
    }
  }
);

onMounted(() => {
  nextTick(() => {
    drawTimeFrameEventDailyView();
  });
});
</script>
