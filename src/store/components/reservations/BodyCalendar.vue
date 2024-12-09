<template>
  <div class="body-calendar">
    <template v-if="isDevice">
      <MonthlyCalendarDevice
        v-if="reservationStore.calendar.viewModeDevice === ViewMode.monthly"
        class="body-calendar__view-mode"
      />
      <WeeklyCalendarDevice
        v-else-if="reservationStore.calendar.viewModeDevice === ViewMode.weekly"
        class="body-calendar__view-mode"
      />
      <DailyCalendarDevice
        v-else-if="reservationStore.calendar.viewModeDevice === ViewMode.daily"
        class="body-calendar__view-mode"
      />
    </template>
    <template v-else>
      <MonthlyCalendarSalon
        v-if="
          reservationStore.calendar.viewMode === ViewMode.monthly &&
          GROUP_TYPE_STORE.SAME.includes(storeTypeId)
        "
        class="body-calendar__view-mode"
      />
      <MonthlyCalendarRestaurant
        v-else-if="
          reservationStore.calendar.viewMode === ViewMode.monthly &&
          storeTypeId === TypeStore.RESTAURANT
        "
        class="body-calendar__view-mode"
      />
      <MonthlyCalendarEvent
        v-else-if="
          reservationStore.calendar.viewMode === ViewMode.monthly &&
          storeTypeId === TypeStore.EVENT
        "
        class="body-calendar__view-mode"
      />
      <WeeklyCalendarSalon
        v-else-if="
          reservationStore.calendar.viewMode === ViewMode.weekly &&
          GROUP_TYPE_STORE.SAME.includes(storeTypeId)
        "
        class="body-calendar__view-mode"
      />
      <WeeklyCalendarRestaurant
        v-else-if="
          reservationStore.calendar.viewMode === ViewMode.weekly &&
          storeTypeId === TypeStore.RESTAURANT
        "
        class="body-calendar__view-mode"
      />
      <WeeklyCalendarEvent
        v-else-if="
          reservationStore.calendar.viewMode === ViewMode.weekly &&
          storeTypeId === TypeStore.EVENT
        "
        class="body-calendar__view-mode"
      />
      <DailyCalendarSalon
        v-else-if="
          reservationStore.calendar.viewMode === ViewMode.daily &&
          GROUP_TYPE_STORE.SAME.includes(storeTypeId)
        "
        class="body-calendar__view-mode"
      />
      <DailyCalendarRestaurant
        v-else-if="
          reservationStore.calendar.viewMode === ViewMode.daily &&
          storeTypeId === TypeStore.RESTAURANT
        "
        class="body-calendar__view-mode"
      />
      <DailyCalendarEvent
        v-else-if="
          reservationStore.calendar.viewMode === ViewMode.daily &&
          storeTypeId === TypeStore.EVENT
        "
        class="body-calendar__view-mode"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import MonthlyCalendarSalon from "./Calendar/Monthly/MonthlyCalendarSalon.vue";
import MonthlyCalendarRestaurant from "./Calendar/Monthly/MonthlyCalendarRestaurant.vue";
import MonthlyCalendarEvent from "./Calendar/Monthly/MonthlyCalendarEvent.vue";
import MonthlyCalendarDevice from "./Calendar/Monthly/MonthlyCalendarDevice.vue";
import WeeklyCalendarSalon from "./Calendar/Weekly/WeeklyCalendarSalon.vue";
import WeeklyCalendarRestaurant from "./Calendar/Weekly/WeeklyCalendarRestaurant.vue";
import WeeklyCalendarEvent from "./Calendar/Weekly/WeeklyCalendarEvent.vue";
import WeeklyCalendarDevice from "./Calendar/Weekly/WeeklyCalendarDevice.vue";
import DailyCalendarSalon from "./Calendar/Daily/DailyCalendarSalon.vue";
import DailyCalendarRestaurant from "./Calendar/Daily/DailyCalendarRestaurant.vue";
import DailyCalendarEvent from "./Calendar/Daily/DailyCalendarEvent.vue";
import DailyCalendarDevice from "./Calendar/Daily/DailyCalendarDevice.vue";

import { ViewMode } from "../../constants";
import TypeStore from "../../../shared/constants/category";

import { useReservation } from "../../store/useReservation";
import { useMeStore } from "~/../../src/shared/stores/me";
import { GROUP_TYPE_STORE } from "~/../../src/shared/constants/typeStore";

interface Prop {
  isDevice?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  isDevice: false,
});

const reservationStore = useReservation();
const meStore = useMeStore();

const storeTypeId = meStore.getStoreType;
</script>

<style lang="scss">
.body-calendar {
  height: calc(100% - 34px - 48px);

  &__view-mode {
    height: 100%;
  }
}
</style>
