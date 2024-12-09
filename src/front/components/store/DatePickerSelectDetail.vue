<template>
  <div v-loading="loading" class="custom-date-picker">
    <div class="calendar">
      <client-only>
        <el-date-picker
          v-model="activeDate"
          value-format="YYYYMMDD"
          type="date"
          :teleported="false"
          :disabled-date="disableDate"
          class="input-date-picker"
          popper-class="custom-popper-date"
          :clearable="false"
          :editable="false"
        />
      </client-only>
    </div>
    <div class="footer-select">
      <div v-if="typeStore === RESTAURANT" class="quantity">
        <span class="label-select">{{ $t("number_of_people") }}</span>
        <InputNumber
          v-model="people"
          class="custom-input-number"
          :max="maxPeople"
          :placeholder="$t('number_of_people')"
        />
      </div>
      <div class="time-slot">
        <span class="label-select">{{ $t("front.store_time_search") }}</span>
        <ClientOnly>
          <el-select
            ref="_refSelect"
            v-model="time"
            class="flex-1"
            placeholder="08:00"
            :teleported="false"
            name="test"
          >
            <el-option
              v-for="(timeValue, key) in dataRangerChange"
              :key="key"
              :value="timeValue.id"
              :label="timeValue.label"
            />
          </el-select>
        </ClientOnly>
      </div>
      <div class="reserve">
        <button-red
          :disabled="disabledBooking"
          :name="$t('button.add_store')"
          @click="handleClick"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted, watch, nextTick, computed } from "vue";
import ButtonRed from "../../../shared/components/button/ButtonRed.vue";
import InputNumber from "../../../shared/components/input/InputNumber.vue";
import moment from "moment";
import { MAX_PEOPLE } from "~/../../src/shared/constants";
import { RESTAURANT, SALON } from "~/../../src/shared/constants/category";
import { getTimeArray, getCurrentTimeBooking } from "~/../../src/shared/utils";
import { OpeningTime } from "~/../../src/front/models";
import bookingGuestRequest from "~/../../src/shared/requests/front/booking";
import { messageError } from "~/../../src/shared/utils/notification";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";

const emits = defineEmits(["handleClick"]);
interface Prop {
  maxPeople?: number;
  minPeople?: number;
  closingTime?: any;
  openTime: OpeningTime[];
  typeStore?: number;
  courseOpenTime?: OpeningTime[];
  idStore: number | null;
  staffId: number | null;
  courseId: number | null;
  menuId: number | null;
}
const props = withDefaults(defineProps<Prop>(), {
  maxPeople: MAX_PEOPLE,
  minPeople: 0,
  closingTime: [],
  openTime: () => [],
  courseOpenTime: () => [],
  typeStore: RESTAURANT,
  idStore: null,
  staffId: null,
  courseId: null,
  menuId: null,
});

const {
  minPeople,
  openTime,
  closingTime,
  typeStore,
  courseOpenTime,
  idStore,
  staffId,
  courseId,
  menuId,
} = toRefs(props);

const activeDate = ref("");
const people = ref("");
const time = ref("");
const timeRanger = ref<string[]>([]);
const minTime = ref("");
const _refSelect = ref(null);
const disabledBooking = ref(false);
const loading = ref(false);

const dataRangerChange = computed(() => {
  const arr: any[] = [];
  timeRanger.value.filter((item) => {
    if (item < minTime.value) {
      arr.push({
        id: item,
        label: "× " + item,
      });
    } else {
      arr.push({
        id: item,
        label: "○ " + item,
      });
    }
  });
  return arr;
});

const handleClick = () => {
  checkDisabledBooking();
};

const getDayActive = async () => {
  let check = false;
  let weekDayNumber = moment().weekday();
  let day = moment().format("YYYY-MM-DD");
  while (!check) {
    if (openTime.value.length === 0) {
      check = true;
    } else {
      const checkCloseTime = closingTime.value?.some(
        (item) => item.day_off === day
      );
      const checkOpeningTime = openTime.value?.some(
        (item) => item.day_of_week === weekDayNumber
      );
      if (!checkCloseTime && checkOpeningTime) {
        activeDate.value = moment(day).format("YYYYMMDD");
        check = true;
      } else {
        if (
          moment(day)
            .add(1, "days")
            .isAfter(moment().add(2, "month").endOf("month"))
        ) {
          check = true;
        }
        weekDayNumber = moment(day).add(1, "days").weekday();
        day = moment(day).add(1, "days").format("YYYY-MM-DD");
      }
    }
  }
};

const disableDate = (date: string) => {
  const weekDayNumber = moment(date).weekday();
  return (
    moment(date).add(1, "day") < moment() ||
    moment(date) > moment().add(2, "month").endOf("month") ||
    closingTime.value?.some(
      (item) => item.day_off === moment(date).format("YYYY-MM-DD")
    ) ||
    !openTime.value?.some((item) => item.day_of_week === weekDayNumber)
  );
};

const getTimeDateSelected = (date: string) => {
  const dayOfWeekSelected = moment(date).weekday();
  timeRanger.value = [];

  openTime.value.forEach((item) => {
    if (item.day_of_week === dayOfWeekSelected) {
      timeRanger.value = timeRanger.value
        .concat(getTimeArray(item.start, item.end, 15, "minutes"))
        .sort();
    }
  });
};

watch(activeDate, (value) => {
  changeDatePicker(value);
});

const changeDatePicker = (value: string) => {
  minTime.value = "";
  getTimeDateSelected(value);
  if (moment(value).format("YYYY/MM/DD") === moment().format("YYYY/MM/DD")) {
    minTime.value = getCurrentTimeBooking();
    const indexFirst = timeRanger.value.findIndex((item) => {
      return moment(item, "HH:mm").isSameOrAfter(
        moment(minTime.value, "HH:mm")
      );
    });
    if (indexFirst !== -1) {
      time.value = timeRanger.value[indexFirst];
    } else {
      time.value = timeRanger.value[timeRanger.value.length - 1];
    }
  } else {
    time.value = timeRanger.value?.[0];
  }
};

const checkDisabledBooking = async () => {
  try {
    loading.value = true;
    let response = null;
    if (!courseId.value && !menuId.value && !staffId.value) {
      response = await bookingGuestRequest.checkBooking<number>({
        store_id: idStore.value,
        date_booking: moment(activeDate.value).format("YYYY-MM-DD"),
        time_booking: time.value,
        number_people: people.value ? people.value : null,
      });
    } else {
      const dataMenu = menuId.value ? [menuId.value] : [];
      const store_time =
        moment(activeDate.value).format("YYYY-MM-DD") + " " + time.value;
      response = await bookingGuestRequest.checkBookingDetail<number>({
        store_id: idStore.value,
        order_time: moment(store_time).format("YYYY-MM-DD HH:mm"),
        number_people: people.value ? people.value : null,
        staff_id: staffId.value,
        course_id: courseId.value,
        menu_ids: dataMenu,
      });
    }
    if (
      typeStore.value === RESTAURANT &&
      ((people.value && Number(people.value) > Number(response.data)) ||
        !response.data)
    ) {
      messageError("errors.restaurant_not_enough_course");
    } else if (typeStore.value === SALON && !response.data) {
      messageError("errors.salon_not_enough_staff");
    } else {
      emits("handleClick", activeDate.value, people.value, time.value);
    }
  } catch (error: any) {
    if (error.response?.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
      messageError(error.response?._data.message);
    }
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await getDayActive();
});
</script>

<style scoped lang="scss">
@use "../../assets/scss/variables.scss" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

:deep(.label-option) {
  font-size: 18px;
  align-items: center;
  margin-right: 3px;
}

:deep(.input-date-picker) {
  display: none;
}

:deep(.custom-popper-date) {
  color: red;
  position: unset !important;
  display: block !important;
  background: unset !important;
  box-shadow: unset !important;
  border: unset !important;
  z-index: unset !important;

  .el-date-picker {
    width: 100%;

    .el-picker-panel__body-wrapper {
      .el-picker-panel__body {
        .el-date-picker__header {
          margin: 0;

          .el-date-picker__header-label {
            cursor: unset;
          }
        }

        .el-picker-panel__content {
          width: 100%;
          margin: 0;
          padding: 5px;

          .el-date-table {
            tr {
              th {
                color: $black-color;
              }
            }

            .el-date-table__row {
              .available {
                .el-date-table-cell {
                  color: $black-200;
                }
              }

              .current {
                .el-date-table-cell {
                  .el-date-table-cell__text {
                    background: $blue;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .el-popper__arrow {
    display: none;
  }
}

.custom-date-picker {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px;
  background: $white-color;

  .calendar {
    width: 100%;
  }

  .footer-select {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 10px 0;

    .quantity,
    .time-slot {
      display: flex;
      align-items: center;

      .label-select {
        color: #292c38;
        width: 62px;
        font-size: 14px;
        font-weight: 500;
      }

      .el-select {
        width: calc(100% - 62px);

        :deep(.el-input) {
          height: 40px;
        }

        :deep(.el-input__prefix) {
          display: none;
        }
      }

      .custom-input-number {
        width: calc(100% - 62px);
      }
    }

    .reserve {
      .el-button {
        width: 100%;
        font-weight: 400;
        font-size: 14px;
      }
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .custom-date-picker {
    top: 175px;
  }
}

@include res("sm-only", $breakpoints-spec) {
  .custom-date-picker {
    padding: 20px 5px;
  }
}
</style>
