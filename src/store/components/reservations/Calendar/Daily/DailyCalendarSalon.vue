<template>
  <div v-loading="isLoading" class="daily-calendar">
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
      <div class="number_of_reversion">
        <div class="number number__title">
          {{ $t("number_of_reservations") }}
        </div>
        <div
          v-for="hour in hoursInDay"
          :key="hour"
          :class="['number', 'number__value']"
        >
          <template v-for="part in [0, 1, 2, 3]" :key="`part__${part}`">
            <div
              :class="`part part__${part}`"
              :hour="getMomentPart(hour, part)"
            >
              <span>
                {{
                  reservationInDay
                    ? reservationInDay
                        .filter(
                          (item) => item.time === getMomentPart(hour, part)
                        )
                        .at(0)?.value
                    : 0
                }}
              </span>
            </div>
          </template>
        </div>
      </div>

      <!-- START Number of available reservation on top -->
      <div class="number_of_available_reservation">
        <div class="number number__title">
          {{ $t("number_of_available_reservation") }}
        </div>
        <div
          v-for="hour in hoursInDay"
          :key="hour"
          :class="['number', 'number__value']"
        >
          <template v-for="part in [0, 1, 2, 3]" :key="`part__${part}`">
            <div
              :class="`part part__${part}`"
              :hour="getMomentPart(hour, part)"
            >
              <span>
                {{
                  availableStaffInDay
                    ? availableStaffInDay
                        .filter(
                          (item) => item.time === getMomentPart(hour, part)
                        )
                        .at(0)?.value
                    : 0
                }}
              </span>
            </div>
          </template>
        </div>
      </div>
      <!-- END Number of available reservation on top -->

      <!-- START Show staff on left sidebar -->
      <div
        v-for="(staff, index) in staffData"
        :key="index"
        class="list-staff"
        :staff-id="staff.id"
      >
        <div class="staff staff__title">
          <div class="staff__name">
            {{ staff.name }}
          </div>
          <div class="staff__count-reservation">
            {{
              `
              ${t("reserve_2")}：
              ${
                arrCountReservationSalon
                  .filter(
                    (item) =>
                      item.activeTime === reservationStore.getActiveTime &&
                      item.staffId === staff.id
                  )
                  .at(0)?.count || 0
              }
              ${t("group")}
                `
            }}
          </div>
        </div>
        <div
          v-for="hour in hoursInDay"
          :key="hour"
          :class="['staff', 'staff__value']"
        >
          <template v-for="part in [0, 1, 2, 3]" :key="`part__${part}`">
            <div :class="`part part__${part}`"></div>
          </template>
        </div>
        <ReservationInStaff
          :staff-id="staff.id"
          @count-reservation="handleCountReservationSalon"
        />
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

import ReservationInStaff from "../../Reservation/Daily/ReservationInStaff.vue";

import { calculatorHoursInDay } from "../../../../composables/reservations/getCalendar";
import {
  getReservationInDay,
  getAvailableStaffInDay,
  getStaffOfStore,
} from "../../../../composables/reservations/getStore";

import {
  AvailableStaffInDay,
  ReservationInDay,
  CountReservationSalon,
} from "../../../../models";
import { StaffInterface } from "../../../../../shared/models";

import { useReservation } from "../../../../store/useReservation";
import { useMeStore } from "../../../../../shared/stores/me";
import { getMomentPart } from "./mixin";

moment.locale("ja");

const reservationStore = useReservation();
const meStore = useMeStore();
const { t } = useI18n();

const { hoursInDay } = calculatorHoursInDay();

const reservationInDay = ref<ReservationInDay[]>();

const isLoading = ref<boolean>(false);

const staffData = ref<StaffInterface[]>();
const availableStaffInDay = ref<AvailableStaffInDay[]>();

const storeId = meStore.getStoreId;

const arrCountReservationSalon = ref<CountReservationSalon[]>([]);

const handleCountReservationSalon = (
  count: number,
  activeTime: string,
  staffId: number
) => {
  arrCountReservationSalon.value.push({
    count,
    activeTime,
    staffId,
  });
};

watch(
  () => reservationStore.getActiveTime,
  async () => {
    await getData();
  }
);

const getData = async () => {
  isLoading.value = true;

  if (storeId) {
    const reservationData = await getReservationInDay(
      storeId,
      reservationStore.getActiveTime
    );
    if (reservationData) {
      reservationInDay.value = reservationData.reservations;
    }

    const staffOfStoreData = await getStaffOfStore();
    if (staffOfStoreData) {
      staffData.value = staffOfStoreData.staff;
    }

    const availableStaffData = await getAvailableStaffInDay(
      storeId,
      reservationStore.getActiveTime
    );

    if (availableStaffData) {
      availableStaffInDay.value = availableStaffData.availableStaff;
    }
  }
  isLoading.value = false;
};

watch(
  () => reservationStore.getCrawlSite,
  async () => {
    await getData();
  }
);

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

          .list-staff {
            $minHeightStaff: 152px;
            background-color: white;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            width: 100%;
            min-height: $minHeightStaff;
            position: relative;

            .staff {
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

                .staff__name {
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
