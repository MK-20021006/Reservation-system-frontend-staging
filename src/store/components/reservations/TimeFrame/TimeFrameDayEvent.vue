<template>
  <div
    class="time-frame time-frame__event"
    :start-time="`${props.data.date} ${props.data.start}`"
    :end-time="`${props.data.date} ${props.data.end}`"
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
          props.data.total_people
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
            props.data.total_people
          }${t("name_2")}）`
        }}
      </div>
    </div>
    <!-- END Tooltip -->
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from "vue";
import { ReservationEventDay } from "../../../models/reservation";
import { useI18n } from "vue-i18n";
import { Appearance } from "~/../../src/store/constants";
import { useReservation } from "~/../../src/store/store/useReservation";
import { buildQuery } from "~/../../src/shared/utils";
import { useRoute } from "#imports";
import { ViewMode } from "~/../../src/store/constants";

const { t } = useI18n();

type PropsType = {
  data: ReservationEventDay;
};

const route = useRoute();
const reservationStore = useReservation();
const props = defineProps<PropsType>();
const isShowToolTip = ref<boolean>(false);

const handleClick = () => {
  const query =
    "?" +
    buildQuery({
      event_id: reservationStore.getEventId,
      start_time: `${props.data.date} ${props.data.start}`,
      end_time: `${props.data.date} ${props.data.end}`,
    });

  route.query.event_id = reservationStore.getEventId;
  route.query.start_time = `${props.data.date} ${props.data.start}`;
  route.query.end_time = `${props.data.date} ${props.data.end}`;

  nextTick(() => {
    history.replaceState(null, "", `${query}`);
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
