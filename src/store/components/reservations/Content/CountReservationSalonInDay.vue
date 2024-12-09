<template>
  {{
    `${t("reserve_2")}：${data.reservationCount} ${t("group")} (${
      data.peopleCount
    }${t("name_2")})`
  }}
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { Moment } from "moment";
import { useReservation } from "../../../store/useReservation";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const reservationStore = useReservation();

type PropsType = {
  day: Moment;
};

const props = defineProps<PropsType>();

const data = ref(reservationStore.countTotalSalon(props.day));

watch(
  () => reservationStore.countTotalSalon(props.day),
  () => {
    data.value = reservationStore.countTotalSalon(props.day);
  }
);
</script>
