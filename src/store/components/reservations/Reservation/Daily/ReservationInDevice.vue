<template>
  <div class="daily-calendar__reservation">
    <TimeFrameDayDevice
      v-for="(reservation, index) in reservations"
      :key="index"
      :data="reservation"
    />
  </div>
</template>

<script lang="ts" setup>
import { getReservationDeviceByDailyAndDevice } from "../../../../composables/reservations/getReservation";
import TimeFrameDayDevice from "~/../../src/store/components/reservations/TimeFrame/TimeFrameDayDevice.vue";
import { nextTick, onMounted, ref, watch } from "vue";
import { drawTimeFrameDeviceDailyView } from "../../../../composables/reservations/drawTimeFrame";
import { useReservation } from "../../../../store/useReservation";
import moment from "moment";
import { Appearance } from "../../../../constants";

const reservationStore = useReservation();

const reservations = ref(
  getReservationDeviceByDailyAndDevice(
    moment(reservationStore.getActiveTime),
    reservationStore.getDeviceId
  ).reservations.value
);

watch(
  () => [
    reservationStore.getDeviceId,
    reservationStore.getActiveTime,
    reservationStore.getAppearance,
    reservationStore.getIsCallingApiDevice,
  ],
  () => {
    if (reservationStore.getAppearance === Appearance.calendar) {
      reservations.value = getReservationDeviceByDailyAndDevice(
        moment(reservationStore.getActiveTime),
        reservationStore.getDeviceId
      ).reservations.value;

      setTimeout(() => {
        drawTimeFrameDeviceDailyView();
      }, 300);
    }
  }
);

onMounted(() => {
  nextTick(() => {
    drawTimeFrameDeviceDailyView();
  });
});
</script>
