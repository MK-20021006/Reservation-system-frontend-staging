<template>
  <div class="daily-calendar__reservation">
    <TimeFrameDayRestaurant
      v-for="(reservation, index) in reservations"
      :key="index"
      :data="reservation"
    />
  </div>
</template>

<script lang="ts" setup>
import { getReservationRestaurantByDayAndSeat } from "../../../../composables/reservations/getReservation";
import TimeFrameDayRestaurant from "../../TimeFrame/TimeFrameDayRestaurant.vue";
import { nextTick, onBeforeMount, onMounted, ref, watch } from "vue";
import { drawTimeFrameSeatDailyView } from "../../../../composables/reservations/drawTimeFrame";
import { useReservation } from "../../../../store/useReservation";
import moment from "moment";
import { Appearance } from "../../../../constants";

const reservationStore = useReservation();

type TypeProps = {
  seatId: number;
};
const props = defineProps<TypeProps>();
const emits = defineEmits(["countReservation"]);

const reservations = ref(
  getReservationRestaurantByDayAndSeat(
    moment(reservationStore.getActiveTime),
    props.seatId
  ).reservations.value
);

watch(
  () => [
    props.seatId,
    reservationStore.getActiveTime,
    reservationStore.getAppearance,
    reservationStore.getCrawlSite,
    reservationStore.getIsCallingApi,
  ],
  () => {
    if (reservationStore.getAppearance === Appearance.calendar) {
      reservations.value = getReservationRestaurantByDayAndSeat(
        moment(reservationStore.getActiveTime),
        props.seatId
      ).reservations.value;
      emits(
        "countReservation",
        reservations.value.length,
        reservationStore.getActiveTime,
        props.seatId
      );
      setTimeout(() => {
        drawTimeFrameSeatDailyView(props.seatId);
      }, 300);
    }
  }
);

onBeforeMount(() => {
  emits(
    "countReservation",
    reservations.value.length,
    reservationStore.getActiveTime,
    props.seatId
  );
});

onMounted(() => {
  nextTick(() => {
    drawTimeFrameSeatDailyView(props.seatId);
  });
});
</script>
