<template>
  <div
    v-loading="isLoading || reservationStore.getIsCallingApiEvent"
    class="daily-calendar"
  >
    <el-scrollbar>
      <div class="hours-in-day">
        <div class="hour hour__title">
          {{ $t("time") }}
        </div>
        <div
          v-for="hour in hoursInDay"
          :key="hour"
          :class="['hour', 'hour__value']"
        >
          {{ hour }}
        </div>
      </div>
      <!-- START Show event on left sidebar -->
      <div class="list-event">
        <div class="event event__title">
          <div class="event__name">{{ currentNameEvent }}</div>
          <div class="event__count-reservation">
            {{
              `${t("reserve_2")}：${totalBooking} ${t(
                "group"
              )}（${totalPeople}${t("name_2")}）`
            }}
          </div>
        </div>
        <div
          v-for="hour in hoursInDay"
          :key="hour"
          :class="['event', 'event__value']"
        >
          <template v-for="part in [0, 1, 2, 3]" :key="`part__${part}`">
            <div :class="`part part__${part}`"></div>
          </template>
        </div>
        <ReservationInEvent />
      </div>
      <!-- END Show staff on left sidebar -->
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import moment from "moment";
import "moment/dist/locale/ja";
import { watch, onBeforeMount, ref } from "vue";
import ReservationInEvent from "../../Reservation/Daily/ReservationInEvent.vue";
import { calculatorHoursInDay } from "../../../../composables/reservations/getCalendar";
import { useReservation } from "../../../../store/useReservation";
import { useMeStore } from "~/../../src/shared/stores/me";

moment.locale("ja");

const reservationStore = useReservation();
const meStore = useMeStore();
const { t } = useI18n();
const dataEventInDay = ref({});
const totalBooking = ref(0);
const totalPeople = ref(0);
const { hoursInDay } = calculatorHoursInDay();
const isLoading = ref<boolean>(false);
const currentNameEvent = ref("");
const storeId = meStore.getStoreId;

watch(
  () => [
    reservationStore.getActiveTime,
    reservationStore.getEventId,
    reservationStore.getIsCallingApiEvent,
  ],
  async () => {
    await getData();
  }
);

const getData = async () => {
  isLoading.value = true;

  if (storeId) {
    const dayCurrent = reservationStore.getActiveTime;
    dataEventInDay.value = reservationStore.countTotalEvent(dayCurrent);
    if (dataEventInDay.value) {
      totalBooking.value = dataEventInDay.value.reservationCount;
      totalPeople.value = dataEventInDay.value.peopleCount;
    }
    currentNameEvent.value = reservationStore.getCurrentEvent.name;
  }
  isLoading.value = false;
};

onBeforeMount(async () => {
  await getData();
});
</script>

<style lang="scss" scoped>
@use "./style.scss";
@use "../../../../assets/scss/variables.scss";

.daily-calendar {
  width: 100%;

  .el-scrollbar {
    :deep() {
      .el-scrollbar__wrap {
        .el-scrollbar__view {
          position: relative;

          .list-event {
            $minHeightStaff: 152px;
            background-color: white;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            width: 100%;
            min-height: $minHeightStaff;
            position: relative;

            .event {
              background-color: white;
              flex-grow: 1;
              flex-shrink: 1;
              width: 170px;
              height: 100%;

              &__title {
                min-height: $minHeightStaff;
                min-width: style.$widthFirstColumn;
                padding: style.$paddingFirstColumn;
                border: 1px solid variables.$border-color;
                font-size: 14px;
                background-color: variables.$gray-500;
                z-index: 2;

                .event__name {
                  font-weight: 700;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  margin-bottom: 10px;
                }
              }

              &__value {
                display: flex;
                min-height: $minHeightStaff;
                min-width: calc(style.$minWidthMinuteSpace * 4);
                text-align: center;

                .part {
                  border: 1px solid variables.$border-color;
                  min-width: 46px;
                  min-height: $minHeightStaff;
                  width: 50%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
              }

              &:first-child {
                position: sticky;
                left: 0px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
