<template>
  <div class="weekly-calendar__reservation">
    <TimeFrameDaySalon
      v-for="(reservation, index) in reservations"
      :key="index"
      :data="reservation"
    />
  </div>
</template>

<script lang="ts" setup>
import { Moment } from "moment";
import { nextTick, onMounted, ref, watch } from "vue";

import { getReservationsSalon } from "../../../../composables/reservations/getReservation";
import TimeFrameDaySalon from "../../TimeFrame/TimeFrameDaySalon.vue";

import { drawTimeFrameWeekly } from "../../../../composables/reservations/drawTimeFrame";
import { useReservation } from "../../../../store/useReservation";
import { Appearance } from "../../../../constants";

type TypeProps = {
  day: Moment;
};
const props = defineProps<TypeProps>();
const reservationStore = useReservation();

const reservations = ref(getReservationsSalon(props.day).reservations.value);

watch(
  () => [
    props.day,
    reservationStore.getAppearance,
    reservationStore.getCrawlSite,
    reservationStore.getIsCallingApi,
  ],
  () => {
    if (reservationStore.getAppearance === Appearance.calendar) {
      reservations.value = getReservationsSalon(props.day).reservations.value;
      setTimeout(() => {
        drawTimeFrameWeekly(props.day);
      }, 300);
    }
  }
);

onMounted(() => {
  nextTick(() => {
    drawTimeFrameWeekly(props.day);
  });
});
</script>
