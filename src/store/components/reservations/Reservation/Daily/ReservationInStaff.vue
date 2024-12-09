<template>
  <div class="daily-calendar__reservation">
    <TimeFrameDaySalon
      v-for="(reservation, index) in reservations"
      :key="index"
      :data="reservation"
    />
  </div>
</template>

<script lang="ts" setup>
import { getReservationSalonByDayAndStaff } from "../../../../composables/reservations/getReservation";
import TimeFrameDaySalon from "../../TimeFrame/TimeFrameDaySalon.vue";
import { nextTick, onBeforeMount, onMounted, ref, watch } from "vue";
import { drawTimeFrameStaffDailyView } from "../../../../composables/reservations/drawTimeFrame";
import { useReservation } from "../../../../store/useReservation";
import moment from "moment";
import { Appearance } from "../../../../constants";

const reservationStore = useReservation();

type TypeProps = {
  staffId: number;
};
const props = defineProps<TypeProps>();
const emits = defineEmits(["countReservation"]);

const reservations = ref(
  getReservationSalonByDayAndStaff(
    moment(reservationStore.getActiveTime),
    props.staffId
  ).reservations.value
);

watch(
  () => [
    props.staffId,
    reservationStore.getActiveTime,
    reservationStore.getAppearance,
    reservationStore.getCrawlSite,
    reservationStore.getIsCallingApi,
  ],
  () => {
    if (reservationStore.getAppearance === Appearance.calendar) {
      reservations.value = getReservationSalonByDayAndStaff(
        moment(reservationStore.getActiveTime),
        props.staffId
      ).reservations.value;
      emits(
        "countReservation",
        reservations.value.length,
        reservationStore.getActiveTime,
        props.staffId
      );
      setTimeout(() => {
        drawTimeFrameStaffDailyView(props.staffId);
      }, 300);
    }
  }
);

onBeforeMount(() => {
  emits(
    "countReservation",
    reservations.value.length,
    reservationStore.getActiveTime,
    props.staffId
  );
});

onMounted(() => {
  nextTick(() => {
    drawTimeFrameStaffDailyView(props.staffId);
  });
});
</script>
