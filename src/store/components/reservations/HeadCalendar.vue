<template>
  <div class="head-calendar">
    <div v-if="!isHiddenTime" class="head-calendar__left">
      <el-button @click="() => setToday()">
        {{ t("today") }}
      </el-button>
      <client-only
        v-if="[RESTAURANT, SALON].includes(meStore.typeStore) && isBooking"
      >
        <el-select
          v-model="crawlSite"
          placeholder=""
          :default-first-option="true"
          :disabled="isCallingApi"
          @change="handleChangeCrawlSite"
        >
          <el-option :value="null" :label="$t('all')"></el-option>
          <el-option
            v-for="item in dataTypeCrawler"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </client-only>
    </div>
    <div v-if="!isHiddenTime" class="head-calendar__center">
      <div class="wrap-date">
        <ClientOnly>
          <el-button
            :icon="ArrowLeftBold"
            class="btn-change prev"
            :disabled="isCallingApi || !reservationStore.getCanChangeActiveTime"
            @click="prevActiveDay()"
          >
          </el-button>

          <el-date-picker
            v-model="activeTime"
            :type="typeDatePicker"
            :editable="false"
            :clearable="false"
            :format="formatTime"
            :disabled="isCallingApi || !reservationStore.getCanChangeActiveTime"
          />
          <el-button
            :icon="ArrowRightBold"
            class="btn-change next"
            :disabled="isCallingApi || !reservationStore.getCanChangeActiveTime"
            @click="nextActiveDay()"
          >
          </el-button>
        </ClientOnly>
      </div>
    </div>
    <div v-if="!isHiddenTime" class="head-calendar__right">
      <div
        v-if="
          reservationStore.getAppearance === Appearance.calendar &&
          storeTypeId === TypeStore.EVENT
        "
        class="select-event"
      >
        <ClientOnly>
          <el-select
            v-model="eventId"
            :disabled="
              isCallingApi ||
              !reservationStore.getCanChangeActiveTime ||
              !reservationStore.getEventId
            "
            :teleported="false"
            @change="clickEvent"
          >
            <el-option
              v-for="item in eventOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </ClientOnly>
      </div>
      <div
        v-if="
          reservationStore.getAppearanceDevice === Appearance.calendar &&
          isDevice
        "
        class="select-device"
      >
        <ClientOnly>
          <el-select
            v-model="deviceId"
            :teleported="false"
            @change="clickDevice"
          >
            <el-option
              v-for="item in deviceOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </ClientOnly>
      </div>
      <div
        :class="[
          {
            'target-time-event': storeTypeId === TypeStore.EVENT,
          },
          {
            'target-time-device': isDevice,
          },
          {
            'target-time': storeTypeId !== TypeStore.EVENT || !isDevice,
          },
        ]"
      >
        <ClientOnly>
          <el-time-select
            v-if="
              reservationStore.getAppearance === Appearance.calendar &&
              reservationStore.getViewMode === ViewMode.monthly &&
              storeTypeId !== TypeStore.EVENT &&
              !isDevice
            "
            v-model="targetTime"
            start="00:00"
            step="00:15"
            end="23:45"
            :editable="false"
            :clearable="false"
            :disabled="isCallingApi || !reservationStore.getCanChangeActiveTime"
          />

          <el-time-select
            v-else-if="
              reservationStore.getAppearanceDevice === Appearance.calendar &&
              reservationStore.getViewModeDevice === ViewMode.monthly &&
              isDevice
            "
            v-model="targetTimeDevice"
            start="00:00"
            step="00:15"
            end="23:45"
            :editable="false"
            :clearable="false"
            :disabled="isCallingApi || !reservationStore.getCanChangeActiveTime"
          />

          <el-select
            v-else-if="
              reservationStore.getAppearance === Appearance.calendar &&
              reservationStore.getViewMode === ViewMode.monthly &&
              !isDevice
            "
            v-model="targetTime"
            :disabled="
              isCallingApi ||
              !reservationStore.getCanChangeActiveTime ||
              !reservationStore.getEventId
            "
          >
            <el-option
              v-for="item in openingTimes"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </ClientOnly>
      </div>
      <div v-if="!isHiddenTime">
        <div v-if="isDevice" class="wrap-toggle">
          <el-button
            :class="[{ active: viewModeDevice === ViewMode.monthly }]"
            :disabled="isCallingApi || !reservationStore.getCanChangeActiveTime"
            @click="changeViewModeDevice(ViewMode.monthly)"
          >
            {{ t("monthly") }}
          </el-button>
          <div class="separator"></div>
          <el-button
            :class="[{ active: viewModeDevice === ViewMode.weekly }]"
            :disabled="isCallingApi || !reservationStore.getCanChangeActiveTime"
            @click="changeViewModeDevice(ViewMode.weekly)"
          >
            {{ t("weekly") }}
          </el-button>
          <div class="separator"></div>
          <el-button
            :class="[{ active: viewModeDevice === ViewMode.daily }]"
            :disabled="isCallingApi || !reservationStore.getCanChangeActiveTime"
            @click="changeViewModeDevice(ViewMode.daily)"
          >
            {{ t("daily") }}
          </el-button>
        </div>
        <div v-else class="wrap-toggle">
          <el-button
            :class="[{ active: viewMode === ViewMode.monthly }]"
            :disabled="isCallingApi || !reservationStore.getCanChangeActiveTime"
            @click="changeViewMode(ViewMode.monthly)"
          >
            {{ t("monthly") }}
          </el-button>
          <div class="separator"></div>
          <el-button
            :class="[{ active: viewMode === ViewMode.weekly }]"
            :disabled="isCallingApi || !reservationStore.getCanChangeActiveTime"
            @click="changeViewMode(ViewMode.weekly)"
          >
            {{ t("weekly") }}
          </el-button>
          <div class="separator"></div>
          <el-button
            :class="[{ active: viewMode === ViewMode.daily }]"
            :disabled="isCallingApi || !reservationStore.getCanChangeActiveTime"
            @click="changeViewMode(ViewMode.daily)"
          >
            {{ t("daily") }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IDatePickerType } from "element-plus/es/components/date-picker/src/date-picker.type";
import { computed, onBeforeMount, onMounted, ref, toRefs, watch } from "vue";
import { useI18n } from "vue-i18n";
import moment from "moment";
import { ArrowLeftBold, ArrowRightBold } from "@element-plus/icons-vue";
import { useReservation } from "../../store/useReservation";
import { useMeStore } from "~/../../src/shared/stores/me";
import { Appearance, ViewMode } from "../../constants";
import TypeStore, {
  RESTAURANT,
  SALON,
  EVENT,
} from "../../../shared/constants/category";
import { DATE_FORMAT } from "~/../../src/shared/constants/index";
import EventRequest from "~/../../src/shared/requests/EventRequest";
import DeviceRequest from "~/../../src/shared/requests/DeviceRequest";
import { STATUS_TYPE } from "~/../../src/shared/constants/reservation";
import { EventInterface } from "~/../../src/store/models/event";
import { Device } from "~/../../src/store/models/device";
import { buildQuery } from "~/../../src/shared/utils";
import {
  fetchDataReservationRestaurantCalendar,
  fetchDataReservationCommonCalendar,
  fetchDataReservationEventCalendar,
  fetchDataStatusBooking,
  fetchDataStatusBookingEvent,
  fetchDataReservationDeviceCalendar,
  fetchDataStatusBookingDevice,
} from "../../composables/reservations/getCalendar";
import {
  DATA_CRAWLER_SITE,
  SITE_TYPE_GOOGLE,
  SITE_TYPE_HOTPEPPER_BEAUTY,
  SITE_TYPE_SYSTEM,
} from "~/../../src/shared/constants/siteCrawl";
import { GROUP_TYPE_STORE } from "~/../../src/shared/constants/typeStore";
import { useRoute } from "#imports";

interface Prop {
  isCallingApi?: boolean;
  isDevice?: boolean;
  isHiddenTime?: boolean;
  isBooking?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  isCallingApi: false,
  isDevice: false,
  isHiddenTime: false,
  isBooking: false,
});

const { isCallingApi, isDevice } = toRefs(props);
const { t } = useI18n();
const meStore = useMeStore();
const reservationStore = useReservation();
const activeTime = ref<string>(reservationStore.getActiveTime);
const targetTime = ref<string>(reservationStore.getTargetTime);
const targetTimeDevice = ref<string>(reservationStore.getTargetTimeDevice);
const crawlSite = ref<number | null>(reservationStore.getCrawlSite);
const typeDatePicker = ref<IDatePickerType | undefined>("month");
const viewMode = ref<ViewMode>(reservationStore.getViewMode);
const viewModeDevice = ref<ViewMode>(reservationStore.getViewModeDevice);
const FORMAT_MONTH = "YYYY年MM月";
const FORMAT_DAY = "YYYY年MM月DD日";
const formatTime = ref<string>(FORMAT_MONTH);
const isLoading = ref<boolean>(true);
const storeTypeId = meStore.getStoreType;
const eventId = ref(null);
const deviceId = ref(null);
const openingTimes = ref([]);
const deviceOptions = ref<Device[]>([]);
const arrOpenTimeChild = ref([]);
const arrOpenTimeParent = ref([]);
const route = useRoute();
const eventOptions = ref<EventInterface[]>([]);
const setToday = (date = moment().format(DATE_FORMAT)) => {
  reservationStore.setActiveTime(date);
};

const prevActiveDay = () => {
  // COMPLETE: Handle when spam button
  if (isCallingApi.value || !reservationStore.getCanChangeActiveTime) {
    return;
  }
  let prev = "";
  if (viewMode.value === ViewMode.monthly) {
    prev = moment(reservationStore.getActiveTime)
      .subtract(1, "month")
      .format(DATE_FORMAT);
  } else if (viewMode.value === ViewMode.weekly) {
    prev = moment(reservationStore.getActiveTime)
      .subtract(1, "week")
      .format(DATE_FORMAT);
  } else {
    prev = moment(reservationStore.getActiveTime)
      .subtract(1, "day")
      .format(DATE_FORMAT);
  }

  if (prev) {
    reservationStore.setActiveTime(prev);
  }
};

const handleChangeCrawlSite = (value: number) => {
  if (isCallingApi.value) {
    return;
  }

  reservationStore.setCrawlSite(value);
};

const nextActiveDay = () => {
  // COMPLETE: Handle when spam button
  if (isCallingApi.value || !reservationStore.getCanChangeActiveTime) {
    return;
  }

  let prev = "";
  if (viewMode.value === ViewMode.monthly) {
    prev = moment(reservationStore.getActiveTime)
      .add(1, "month")
      .format(DATE_FORMAT);
  } else if (viewMode.value === ViewMode.weekly) {
    prev = moment(reservationStore.getActiveTime)
      .add(1, "week")
      .format(DATE_FORMAT);
  } else {
    prev = moment(reservationStore.getActiveTime)
      .add(1, "day")
      .format(DATE_FORMAT);
  }

  if (prev) {
    reservationStore.setActiveTime(prev);
  }
};

const changeViewMode = (viewMode: ViewMode) => {
  if (isCallingApi.value) return;
  reservationStore.setViewMode(viewMode);
};

const changeViewModeDevice = (viewMode: ViewMode) => {
  if (isCallingApi.value) return;
  reservationStore.setViewModeDevice(viewMode);
};

watch(
  () => reservationStore.getActiveTime,
  async () => {
    activeTime.value = reservationStore.getActiveTime;
    await getData(false);
  }
);

watch(
  () => activeTime.value,
  () => {
    reservationStore.setActiveTime(
      moment(activeTime.value).format(DATE_FORMAT)
    );
  }
);

watch(
  () => reservationStore.getTargetTimeDevice,
  async () => {
    targetTimeDevice.value = reservationStore.getTargetTimeDevice;
    reservationStore.setCanChangeActiveTime(false);

    const resultStatusBookingDevice = await fetchDataStatusBookingDevice(
      deviceId.value,
      targetTimeDevice.value
    );

    if (resultStatusBookingDevice) {
      reservationStore.setStatusBookingDevice(resultStatusBookingDevice);
    }
    reservationStore.setCanChangeActiveTime(true);
  }
);

watch(
  () => reservationStore.getTargetTime,
  async () => {
    targetTime.value = reservationStore.getTargetTime;
    reservationStore.setCanChangeActiveTime(false);
    if (meStore.getStoreType === TypeStore.EVENT) {
      const resultStatusBooking = await fetchDataStatusBookingEvent(
        eventId.value,
        targetTime.value
      );
      if (resultStatusBooking) {
        reservationStore.setStatusBookingEvent(resultStatusBooking);
      }
      reservationStore.setCanChangeActiveTime(true);
    } else {
      const resultStatusBooking = await fetchDataStatusBooking(
        targetTime.value
      );
      if (resultStatusBooking) {
        reservationStore.setStatusBooking(resultStatusBooking);
      }
      reservationStore.setCanChangeActiveTime(true);
    }
  }
);

watch(
  () => targetTime.value,
  async () => {
    reservationStore.setTargetTime(targetTime.value);
  }
);

watch(
  () => targetTimeDevice.value,
  async () => {
    reservationStore.setTargetTimeDevice(targetTimeDevice.value);
  }
);

watch(
  () => reservationStore.getViewMode,
  () => {
    viewMode.value = reservationStore.getViewMode;

    if (!isDevice.value) {
      if (viewMode.value === ViewMode.monthly) {
        typeDatePicker.value = "month";
        formatTime.value = FORMAT_MONTH;
      }
      if (viewMode.value === ViewMode.weekly) {
        typeDatePicker.value = "week";
        formatTime.value = FORMAT_DAY;
      } else if (viewMode.value === ViewMode.daily) {
        typeDatePicker.value = "date";
        formatTime.value = FORMAT_DAY;
      }
    }
  },
  {
    immediate: true,
  }
);

watch(
  () => reservationStore.getViewModeDevice,
  () => {
    viewModeDevice.value = reservationStore.getViewModeDevice;

    if (isDevice.value) {
      if (viewModeDevice.value === ViewMode.monthly) {
        typeDatePicker.value = "month";
        formatTime.value = FORMAT_MONTH;
      }
      if (viewModeDevice.value === ViewMode.weekly) {
        typeDatePicker.value = "week";
        formatTime.value = FORMAT_DAY;
      } else if (viewModeDevice.value === ViewMode.daily) {
        typeDatePicker.value = "date";
        formatTime.value = FORMAT_DAY;
      }
    }
  },
  {
    immediate: true,
  }
);

watch(
  () => reservationStore.getCrawlSite,
  async () => {
    crawlSite.value = reservationStore.getCrawlSite;
    await getData(true);
  }
);

const clickEvent = async (id: number) => {
  eventId.value = id;
  const listEvent = reservationStore.getListEvent;
  listEvent.map((item) => {
    if (item.id === id) {
      handleTimeOpen(item);
      reservationStore.setCurrentEvent(item);
      reservationStore.setEventId(id);
    }
  });
  await getData(true);
};

const clickDevice = async (id: number) => {
  deviceId.value = id;
  const listDevice = reservationStore.getListDevice;
  listDevice.map((item) => {
    if (item.id === id) {
      reservationStore.setCurrentDevice(item);
      reservationStore.setDeviceId(id);
    }
  });
  await getData(true);
};

const getData = async (forceFetch: boolean) => {
  if (isDevice.value) {
    await fetchDataReservationDeviceCalendar(deviceId.value, forceFetch);
    const resultStatusBookingDevice = await fetchDataStatusBookingDevice(
      deviceId.value,
      targetTime.value
    );
    if (resultStatusBookingDevice) {
      reservationStore.setStatusBookingDevice(resultStatusBookingDevice);
    }
  } else {
    const typeStoreId = meStore.getStoreType;
    switch (typeStoreId) {
      case TypeStore.SALON:
      case TypeStore.MEDIAL_CARE:
      case TypeStore.CLASSROOM:
      case TypeStore.CONSULTATION: {
        await fetchDataReservationCommonCalendar(forceFetch, typeStoreId);
        break;
      }
      case TypeStore.RESTAURANT: {
        await fetchDataReservationRestaurantCalendar(forceFetch);
        break;
      }
      case TypeStore.EVENT: {
        await fetchDataReservationEventCalendar(eventId.value, forceFetch);
        break;
      }
      default:
        break;
    }

    if (typeStoreId === TypeStore.EVENT) {
      const resultStatusBooking = await fetchDataStatusBookingEvent(
        eventId.value,
        targetTime.value
      );
      if (resultStatusBooking) {
        reservationStore.setStatusBookingEvent(resultStatusBooking);
      }
    } else {
      const resultStatusBooking = await fetchDataStatusBooking(
        targetTime.value
      );
      if (resultStatusBooking) {
        reservationStore.setStatusBooking(resultStatusBooking);
      }
    }
  }
};

const handleTimeOpen = (data: any) => {
  arrOpenTimeChild.value = [];
  data.opening_times.map((item: any) => {
    let timeStart = moment(item.start, "HHmmss").format("HH:mm");
    let timeEnd = moment(item.end, "HHmmss").format("HH:mm");
    if (timeEnd === "23:59") {
      timeEnd = "24:00";
    }
    const time = timeStart + "-" + timeEnd;
    arrOpenTimeChild.value.push(time);
  });

  arrOpenTimeParent.value = [];
  arrOpenTimeChild.value.forEach((item) => {
    if (!arrOpenTimeParent.value.find((time) => time === item)) {
      arrOpenTimeParent.value.push(item);
    }
  });

  openingTimes.value = arrOpenTimeParent.value;
  targetTime.value = openingTimes.value[0];
};

const dataTypeCrawler = computed(() => {
  if (GROUP_TYPE_STORE.RESTAURANT.includes(Number(meStore.typeStore))) {
    return DATA_CRAWLER_SITE.filter((item: any) => {
      return ![SITE_TYPE_HOTPEPPER_BEAUTY].includes(item.id);
    });
  } else if (meStore.typeStore === SALON) {
    return DATA_CRAWLER_SITE.filter((item: any) => {
      return [SITE_TYPE_HOTPEPPER_BEAUTY, SITE_TYPE_SYSTEM].includes(item.id);
    });
  } else {
    return [];
  }
});

onBeforeMount(async () => {
  if (meStore.getStoreType === TypeStore.EVENT) {
    eventOptions.value = (
      await EventRequest.getAllData<EventInterface[]>({
        published: STATUS_TYPE.PUBLIC,
      })
    ).data;
    reservationStore.setListEvent(eventOptions.value);

    if (eventOptions.value.length && !reservationStore.getEventId) {
      reservationStore.setEventId(eventOptions.value[0]?.id);
      eventId.value = eventOptions.value[0]?.id as any;
      handleTimeOpen(eventOptions.value[0]);
      reservationStore.setCurrentEvent(eventOptions.value[0]);
    } else {
      eventId.value = reservationStore.getEventId as any;
      handleTimeOpen(reservationStore.getCurrentEvent);
      targetTime.value = reservationStore.getTargetTime;
    }
  }

  if (isDevice.value) {
    deviceOptions.value = (await DeviceRequest.getAllData<Device[]>({})).data;
    reservationStore.setListDevice(deviceOptions.value);
    if (!reservationStore.getDeviceId) {
      deviceId.value = deviceOptions.value[0]?.id;
      reservationStore.setDeviceId(deviceOptions.value[0]?.id);
      reservationStore.setCurrentDevice(deviceOptions.value[0]);
    } else {
      deviceId.value = reservationStore.getDeviceId as any;
      const currentDevice = deviceOptions.value.find(
        (item: any) => item.id === deviceId.value
      );

      if (currentDevice) {
        reservationStore.setCurrentDevice(currentDevice);
      }
    }
  }

  await getData(true);
});

onMounted(() => {
  isLoading.value = false;
  if (route.query?.view_seat) {
    reservationStore.setAppearance(Appearance.calendar);
    reservationStore.setViewMode("daily" as ViewMode);
    reservationStore.setActiveTime(moment().format("YYYY-MM-DD"));
    history.replaceState(null, "", "?");
    delete route.query?.view_seat;
  }
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

.head-calendar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .head-calendar__left {
    display: flex;

    .el-select {
      margin-left: 16px;
      width: 200px;
    }
  }

  :deep(.el-select-dropdown__list) {
    width: 225px;
  }

  .head-calendar__center {
    .wrap-date {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid $gray-200;

      .btn-change {
        border-top: none;
        border-bottom: none;
        border-radius: 0px;
        width: 32px;
        height: 32px;
        &.prev {
          border-left: none;
        }
        &.next {
          border-right: none;
        }
      }
      .el-date-editor {
        width: 144px;

        .el-input__wrapper {
          .el-input__inner {
            font-weight: 700;
          }
        }

        .el-input__wrapper {
          padding: 0px;
          box-shadow: none;
          .el-input__prefix {
            display: none;
          }
          .el-input__inner {
            cursor: pointer;
            text-align: center;
          }
        }
      }
    }
  }

  .head-calendar__right {
    position: relative;
    display: flex;
    align-items: center;

    .target-time {
      position: absolute;
      top: 1px;
      left: calc(-128px - 16px);
      width: 128px;
    }

    .target-time-event {
      position: absolute;
      top: 1px;
      left: -195px;
      width: 178px;
    }

    .target-time-device {
      position: absolute;
      top: 1px;
      left: -385px;
      width: 128px;
    }

    .select-device {
      position: absolute;
      top: 1px;
      left: -240px;
    }

    .select-event {
      margin-right: 15px;
    }

    .wrap-toggle {
      padding: 1px;
      background-color: $gray-80;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;

      .separator {
        width: 1px;
        height: 16px;
        background-color: $gray-100;
      }
      .el-button {
        margin: 0px;
        width: 80px;

        &.active {
          & + .div,
          ~ .div {
            display: none;
          }
        }

        &:not(.active) {
          background: $gray-80;
          border: none;
        }

        &:focus {
          background-color: $white-color;
          color: var(--el-button-text-color);
          background-color: var(--el-button-bg-color);
          border-color: var(--el-button-border-color);
        }
      }
    }
  }
}
</style>
