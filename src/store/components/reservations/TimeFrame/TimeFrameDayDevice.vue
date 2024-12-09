<template>
  <div
    class="time-frame time-frame__device"
    :start-time="props.data.start"
    :end-time="props.data.end"
    @click="handleClick"
    @mouseover="() => (isShowToolTip = true)"
    @mouseleave="() => (isShowToolTip = false)"
  >
    <div class="user-name">
      {{ props.data.name }}
    </div>
    <div class="total-booking">
      {{
        `${t("reserve_2")}：${props.data.total_booking} ${t("group")}（${
          props.data.total_booking
        }${t("name_2")}）`
      }}
    </div>
    <!-- START Tooltip -->
    <div v-show="isShowToolTip" class="tooltip">
      <div class="user-name">
        {{ props.data.name }}
      </div>
      <div class="total-booking">
        {{
          `${t("reserve_2")}：${props.data.total_booking} ${t("group")}（${
            props.data.total_booking
          }${t("name_2")}）`
        }}
      </div>
    </div>
    <!-- END Tooltip -->
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ReservationDeviceDay } from "../../../models/reservation";
import { useI18n } from "vue-i18n";
import { Appearance } from "~/../../src/store/constants";
import { useReservation } from "~/../../src/store/store/useReservation";
import { useRouter } from "#imports";
import { ViewMode } from "~/../../src/store/constants";

const { t } = useI18n();

type PropsType = {
  data: ReservationDeviceDay;
};

const router = useRouter();
const reservationStore = useReservation();
const props = defineProps<PropsType>();
const isShowToolTip = ref<boolean>(false);

const handleClick = async () => {
  await router.push({
    name: "reservation",
    query: {
      device_id: reservationStore.getDeviceId,
    },
  });

  reservationStore.setAppearance(Appearance.list);
  reservationStore.setViewMode(ViewMode.daily);
  reservationStore.setActiveTime(props.data.date);
};
</script>

<style lang="scss" scoped>
@use "./day.scss";

.time-frame {
  height: 80px;

  .user-name {
    padding-top: 15px;
  }

  .total-booking {
    padding-bottom: 15px;
  }
}
</style>
