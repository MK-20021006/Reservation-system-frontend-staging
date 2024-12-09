<template>
  <div class="weekly-calendar__reservation">
    <TimeFrameDay
      v-for="(reservation, index) in reservations"
      :key="index"
      :data="reservation"
    />
  </div>
</template>

<script lang="ts" setup>
import { Moment } from "moment";
import { nextTick, onMounted, ref, watch } from "vue";

import { getReservationsRestaurant } from "../../../../composables/reservations/getReservation";
import TimeFrameDay from "../../TimeFrame/TimeFrameDayRestaurant.vue";

import { drawTimeFrameWeekly } from "../../../../composables/reservations/drawTimeFrame";
import { useReservation } from "../../../../store/useReservation";
import { Appearance } from "../../../../constants";

type TypeProps = {
  day: Moment;
};
const props = defineProps<TypeProps>();
const reservationStore = useReservation();

const reservations = ref(
  getReservationsRestaurant(props.day).reservations.value
);

watch(
  () => [
    props.day,
    reservationStore.getAppearance,
    reservationStore.getCrawlSite,
    reservationStore.getIsCallingApi,
  ],
  () => {
    if (reservationStore.getAppearance === Appearance.calendar) {
      reservations.value = getReservationsRestaurant(
        props.day
      ).reservations.value;
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
