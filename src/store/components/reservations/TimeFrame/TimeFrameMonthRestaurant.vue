<template>
  <span class="time-frame-month" @click="handleClick">
    {{
      `${t("reserve_2")}：${data.reservationCount} ${t("group")}（${
        data.peopleCount
      }${t("name_2")}）`
    }}
  </span>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { Moment } from "moment";
import { useReservation } from "../../../store/useReservation";
import { useI18n } from "vue-i18n";
import { ViewMode } from "../../../constants";

const { t } = useI18n();
const reservationStore = useReservation();

type PropsType = {
  day: Moment;
};

const props = defineProps<PropsType>();

const data = ref(reservationStore.countTotalRestaurant(props.day));

watch(
  () => reservationStore.countTotalRestaurant(props.day),
  () => {
    data.value = reservationStore.countTotalRestaurant(props.day);
  }
);

const handleClick = () => {
  reservationStore.setViewMode(ViewMode.daily);
  reservationStore.setActiveTime(props.day.format("YYYY-MM-DD"));
};
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables.scss";

.time-frame-month {
  background-color: #1a76d2;
  color: variables.$white-color;
  border-radius: 2px;
  padding: 6px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
</style>
