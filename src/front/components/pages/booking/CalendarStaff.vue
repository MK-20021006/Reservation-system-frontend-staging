<template>
  <div v-loading="loadingCalendar && !loading" class="staff-list">
    <div class="select-staff">{{ $t("select_staff") }}</div>
    <div class="stylist-option-area">
      <ul class="stylist-option-list">
        <li
          :class="{ 'is-selected': !staffId }"
          @click="handleChangeStaff(null)"
        >
          <IconCheckStaff v-if="!staffId" />
          {{ $t("all_staff") }}
        </li>
        <template v-for="stylist in dataStaff" :key="stylist.id">
          <li
            :class="{ 'is-selected': stylist.id === staffId }"
            @click="handleChangeStaff(stylist.id)"
          >
            <IconCheckStaff v-if="stylist.id === staffId" />
            {{ stylist.name }}
          </li>
        </template>
      </ul>
    </div>
    <div class="select-date">{{ $t("select_date") }}</div>
    <div class="action">
      <ButtonCommon
        :name="$t('before_week')"
        width="140px"
        background-color="#FFFFFF"
        border="1px solid #CCCCCC"
        :disabled="disabledPrev"
        @click="handlePrevWeek"
      />
      <ButtonCommon
        :name="$t('after_week')"
        width="140px"
        background-color="#FFFFFF"
        border="1px solid #CCCCCC"
        :disabled="disabledNext"
        @click="handleNextWeek"
      />
    </div>
    <el-scrollbar max-height="435px">
      <table :class="{ 'staff-list__table': dataTimeStaff?.length > 0 }">
        <thead class="header-table__container">
          <tr class="day-week_container">
            <th
              rowspan="2"
              class="prev-week"
              :class="{ 'disabled-next': disabledPrev }"
              @click="handlePrevWeek"
            >
              <span class="before">{{ $t("before_week") }}</span>
              <span class="date">{{
                $t("template_notice.date_and_time")
              }}</span>
            </th>
            <th colspan="7" class="year-month">
              <span>{{ fromYear }}</span>
              <span v-if="toYear">～{{ toYear }}</span>
            </th>
            <th
              rowspan="2"
              class="next-week"
              :class="{ 'disabled-next': disabledNext }"
              @click="handleNextWeek"
            >
              <span>{{ $t("after_week") }}</span>
            </th>
          </tr>
          <tr class="day-cell__container">
            <template v-for="itemDate in dataDate" :key="itemDate">
              <th
                class="day-cell"
                :class="{
                  sun: isSunday(itemDate.date),
                  sat: isSaturday(itemDate.date),
                }"
              >
                <div>{{ itemDate.day }}</div>
                <div>({{ itemDate.title }})</div>
              </th>
            </template>
          </tr>
        </thead>
        <tbody class="content-table__container">
          <tr class="list-time">
            <th>
              <table class="more-inner-table time-table-left">
                <tbody>
                  <template v-for="item in dataTime" :key="item">
                    <tr>
                      <th
                        class="time-cell"
                        :class="{
                          'time-sharp-line': checkTimeRound(getHour(item)),
                        }"
                      >
                        {{ getHour(item) }}
                      </th>
                    </tr>
                  </template>
                </tbody>
              </table>
            </th>
            <template v-for="item in dataTimeStaff" :key="item">
              <th
                v-if="!item.day_off && !checkMaxDate(item.date)"
                class="inner-col"
                rowspan="1"
              >
                <table class="more-inner-table">
                  <tbody>
                    <template v-for="data in item.data" :key="data">
                      <tr>
                        <template
                          v-if="
                            data[Object.keys(data)[0]] &&
                            !checkData(item.date, data) &&
                            !(Object.keys(data)[0] === '23:59')
                          "
                        >
                          <th
                            class="time-cell time-booking"
                            :class="{
                              'is-checked': checkTime(item.date, data),
                            }"
                            @click="
                              handleClickCalendar(
                                item.date,
                                Object.keys(data)[0]
                              )
                            "
                          >
                            <div class="text-icon">
                              <IconCircle />
                            </div>
                          </th>
                        </template>
                        <th v-else class="time-cell">
                          <div class="text-icon">
                            <IconCloseWhite />
                          </div>
                        </th>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </th>
              <th v-else class="inner-col day-close" rowspan="1">
                <table class="more-inner-table">
                  <tbody v-if="checkMaxDate(item.date)">
                    <div class="close-col-text"></div>
                    <div class="close-col-text"></div>
                    <div class="close-col-text"></div>
                  </tbody>
                  <tbody v-else>
                    <div class="close-col-text">{{ $t("store.off") }}</div>
                    <div class="close-col-text">
                      {{ $t("industry_store") }}
                    </div>
                    <div class="close-col-text">{{ $t("sunday") }}</div>
                  </tbody>
                </table>
              </th>
            </template>
            <th class="time-table-right">
              <table class="more-inner-table time-table-left">
                <tbody>
                  <table class="more-inner-table time-table-left">
                    <tbody>
                      <template v-for="item in dataTime" :key="item">
                        <tr>
                          <th
                            class="time-cell"
                            :class="{
                              'time-sharp-line': checkTimeRound(getHour(item)),
                            }"
                          >
                            {{ getHour(item) }}
                          </th>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </tbody>
              </table>
            </th>
          </tr>
        </tbody>
      </table>
    </el-scrollbar>
    <div class="action action-button">
      <ButtonCommon
        :name="$t('before_week')"
        width="140px"
        background-color="#FFFFFF"
        border="1px solid #CCCCCC"
        :disabled="disabledPrev"
        @click="handlePrevWeek"
      />
      <ButtonCommon
        :name="$t('after_week')"
        width="140px"
        background-color="#FFFFFF"
        border="1px solid #CCCCCC"
        :disabled="disabledNext"
        @click="handleNextWeek"
      />
    </div>
    <ul class="calender-description">
      <li class="open">
        <IconCircle /> <span>{{ $t("can_booking") }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { STATUS_PLACE } from "~/../../src/shared/constants";
import bookingGuestRequest from "~/../../src/shared/requests/front/booking";
import { computed, onMounted, reactive, ref, toRefs, watch } from "vue";
import moment from "moment";
import {
  getDayByDate,
  formatDate,
  change23Hours59MinHoursTo24Hours,
} from "~/../../src/shared/utils";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";

interface Prop {
  storeId: number;
  courseId: number;
  staffId: number | null;
  menuId: number[] | null;
  course: number | null;
  date: string | null;
  dataStaff: any[];
  loading: boolean;
  timeSelected: string;
}

const props = withDefaults(defineProps<Prop>(), {
  staffId: null,
  storeId: null,
  menuId: () => [],
  courseId: null,
  date: "",
  timeSelected: "",
  dataStaff: () => [],
});

const loadingCalendar = ref(false);
const fromYear = ref("");
const toYear = ref("");
const dataTimeStaff = ref<any[]>([]);
const {
  storeId,
  staffId,
  courseId,
  date,
  menuId,
  dataStaff,
  timeSelected,
  loading,
} = toRefs(props);

const dateNext = ref("");

const checkMaxDate = (date: string) => {
  return moment(date).isAfter(moment().add(2, "months").endOf("month"));
};

//GET DATE NEXT
const getValueDate = () => {
  if (date.value) {
    // CHECK DATE 1 WEEK TO DATE ORDER IF DATE ORDER <= DATE NOW ADD 1 WEEK
    if (moment().add("7", "day").isSameOrAfter(date.value)) {
      dateNext.value = moment().format("YYYY-MM-DD");
    } else {
      // GET NUMBER DAY DIFF DATE ORDER
      const day = moment(date.value).diff(moment(), "days");
      // GET NUMBER WEEK ADD
      const addWeek = Math.floor(day / 7);
      // GET DATE START WEEK FROM DATE NOW
      dateNext.value = moment().add(addWeek, "week").format("YYYY-MM-DD");
    }
  } else {
    dateNext.value = moment().format("YYYY-MM-DD");
  }
};

getValueDate();

const checkTime = (dateCheck: string, data: string) => {
  if (
    moment(date.value).isSame(moment(dateCheck)) &&
    Object.keys(data)[0] &&
    Object.keys(data)[0] === timeSelected.value
  ) {
    return true;
  }
  return false;
};

const disabledPrev = computed(() => {
  let check = false;
  if (!dateNext.value) {
    return false;
  }
  dataTimeStaff.value?.forEach((item) => {
    if (moment(item.date).isSame(moment().format("YYYY-MM-DD"))) {
      check = true;
    }
  });
  return check;
});

const disabledNext = computed(() => {
  let check = false;
  if (!dateNext.value) {
    return false;
  }
  const dateCheck = moment()
    .add(2, "month")
    .endOf("month")
    .format("YYYY-MM-DD");
  dataTimeStaff.value?.forEach((item) => {
    if (moment(item.date).isSame(dateCheck)) {
      check = true;
    }
  });
  return check;
});

const checkData = (dateCheck: string, data: string) => {
  const time = moment(Object.keys(data)[0], "HH:mm");
  if (
    moment(dateCheck).isSame(moment().format("YYYY-MM-DD")) &&
    time.isBefore(moment(moment().format("HH:mm"), "HH:mm"))
  ) {
    return true;
  }
  return false;
};

const getHour = (time: string) => {
  return change23Hours59MinHoursTo24Hours(time);
};

const dataDate = computed(() => {
  const array: any[] = [];
  toYear.value = "";
  dataTimeStaff.value?.forEach((item, index) => {
    if (!index) {
      fromYear.value = moment(item.date).format("YYYY年MM月");
    }
    array.push({
      day: moment(item.date).format("DD"),
      date: item.date,
      title: getDayByDate(item.date),
    });
    if (moment(item.date).format("YYYY年MM月") !== fromYear.value) {
      toYear.value = moment(item.date).format("YYYY年MM月");
    }
  });
  return array;
});

const dataTime = computed(() => {
  const array: any[] = [];
  dataTimeStaff.value?.forEach((item, index) => {
    if (!index) {
      item.data.forEach((itemDate: any) => {
        array.push(Object.keys(itemDate)[0]);
      });
    }
  });
  return array;
});

const getTimeStaff = async (key?: boolean) => {
  try {
    loadingCalendar.value = true;
    const response = await bookingGuestRequest.getStaffBooking<any[]>({
      store_id: storeId.value,
      date: dateNext.value,
      course_id: courseId.value,
      menu_ids: menuId.value,
      staff_id: staffId.value,
    });
    dataTimeStaff.value = response.data;
  } catch (_) {
  } finally {
    loadingCalendar.value = false;
  }
};

const emits = defineEmits([
  "prevWeek",
  "nextWeek",
  "handleClickCalendar",
  "handleChangeStaff",
]);

const isSunday = (date: string) => {
  return moment(date).day() === 6;
};

const isSaturday = (date: string) => {
  return moment(date).day() === 0;
};

const handlePrevWeek = () => {
  if (disabledPrev.value) {
    return;
  }
  if (moment(dateNext.value).subtract("7", "day").isSameOrBefore(moment())) {
    dateNext.value = moment().format("YYYY-MM-DD");
  } else {
    dateNext.value = moment(dateNext.value)
      .subtract("7", "day")
      .format("YYYY-MM-DD");
  }
  getTimeStaff();
};

const handleNextWeek = () => {
  if (disabledNext.value) {
    return;
  }
  const timeValue = moment(dateNext.value).add("7", "day");
  const dateCheck = moment()
    .add(2, "month")
    .endOf("month")
    .format("YYYY-MM-DD");
  if (timeValue.isAfter(dateCheck)) {
    dateNext.value = dateCheck;
  } else {
    dateNext.value = timeValue.format("YYYY-MM-DD");
  }
  getTimeStaff();
};

const handleClickCalendar = (dateSubmit: string, time: string) => {
  emits("handleClickCalendar", dateSubmit, time);
};

const checkTimeRound = (time: string) => {
  const arrayTime = [
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
    "24:00",
  ];
  return arrayTime.includes(time);
};

const handleChangeStaff = (idStaff: number) => {
  emits("handleChangeStaff", idStaff);
};

watch([staffId, menuId, courseId], ([staff, menu, course]) => {
  if (staff || menu || course) {
    getTimeStaff();
  }
});

onMounted(() => {
  getTimeStaff(true);
});
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

:deep(th) {
  vertical-align: middle !important;
}

.staff-list {
  width: 100%;

  .select-staff {
    color: $black-85;
    font-weight: 700;
    line-height: 24px;
  }

  .stylist-option-area {
    margin: 8px 0;

    .stylist-option-list {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;

      li {
        padding: 6px 16px;
        border-radius: 12px;
        border: 1px solid $gray-110;
        font-size: 10px;
        color: rgba(0, 0, 0, 0.6);
        cursor: pointer;
        line-height: 12px;

        svg {
          margin-right: 6px;
        }
      }

      .is-selected {
        padding: 4px 16px 4px 12px;
        border: 1px solid $yellow-color;
        color: $yellow-color;
        display: flex;
        align-items: center;
        cursor: unset;
      }
    }
  }

  .select-date {
    margin-bottom: 8px;
    color: $black-85;
    line-height: 24px;
  }

  .action {
    display: none;
  }

  .el-scrollbar {
    border-bottom: 1px solid #bfb9b0;
  }

  .staff-list__table {
    width: 100%;
    border: solid #bfb9b0;
    border-spacing: 0;
    border-width: 0 1px 1px 1px;
    box-sizing: border-box;
    white-space: nowrap;
    color: #000000;
    font-size: 12px;
    line-height: 1.5;
    border-collapse: separate;

    .header-table__container {
      position: sticky;
      top: 0;
      background: $color-white;

      .day-week_container {
        .next-week,
        .prev-week {
          background-color: $white-color;
          border: solid #bfb9b0;
          border-width: 1px 0 2px 0;
          text-align: center;
          padding: 0 13px;
          height: 84px;
          cursor: pointer;
          font-weight: bold;

          .date {
            display: none;
          }
        }

        .disabled-next {
          cursor: unset;
          color: $gray-110;
        }

        .next-week {
          border-left: 1px solid #bfb9b0;
        }

        .year-month {
          max-width: 80%;
          width: 80%;
          border-top: 1px solid #bfb9b0;
          box-sizing: border-box;
          font-weight: bold;
          height: 39px;
          text-align: center;
          background-color: $white-color;
          border-left: 1px solid #bfb9b0;
        }
      }

      .day-cell__container {
        height: 45px;

        .day-cell {
          border: solid #bfb9b0;
          border-width: 1px 0 2px 1px;
          box-sizing: border-box;
          height: 45px;
          font-weight: bold;
          text-align: center;
        }

        .sun,
        .sat {
          background: #eeddd9;
          color: #bb5555;
        }
      }
    }

    .content-table__container {
      .list-time {
        .inner-col {
          border-left: 1px solid #bfb9b0;
          box-sizing: border-box;
          text-align: center;
        }

        .day-close {
          background-color: $gray-80;
        }

        th {
          &:nth-child(8) {
            border-right: 1px solid #bfb9b0;
          }

          .more-inner-table {
            border: 0 none;
            border-collapse: collapse;
            width: 100%;
            border-spacing: 0;
            padding: 0;
            margin: 0;

            tr {
              &:first-child {
                th {
                  border-top: none;
                }
              }

              .time-cell {
                text-align: center;
                background-color: $gray-80;
                border-top: 1px solid #bfb9b0;
                font-size: 11px;
                height: 35px;
                width: 100%;

                .text-icon {
                  display: flex;
                  justify-content: center;
                }
              }

              .time-booking {
                cursor: pointer;
                background-color: #ffffff;
              }

              .is-checked {
                background-color: #fcdbe3;
                text-decoration: none;
              }

              .time-sharp-line {
                font-size: 12px;
              }
            }
          }

          .time-table-left {
            font-weight: bold;
            white-space: nowrap;

            tr {
              .time-cell {
                text-align: right;
                padding-right: 15px;
              }
            }
          }
        }
      }
    }
  }

  .calender-description {
    display: flex;
    margin-top: 16px;
    align-items: center;
    font-size: 10px;
    flex-wrap: wrap;
    gap: 10px 24px;

    .open,
    .tel,
    .disable {
      display: flex;
      align-items: center;

      .tel {
        color: $gray-110;
      }
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .staff-list {
  }
}

@include res("xs-only", $breakpoints-spec) {
  .staff-list {
    .action {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      flex-wrap: wrap;

      .el-button {
        border: 1px solid $gray-110 !important;

        &:hover {
          border: 1px solid $gray-110 !important;
        }
      }

      .is-disabled {
        color: $gray-110;

        &:hover {
          border: 1px solid $gray-110 !important;
        }
      }
    }

    .action-button {
      margin-top: 16px;
    }

    .staff-list__table {
      .header-table__container {
        .day-week_container {
          .next-week {
            display: none;
          }

          .prev-week {
            cursor: unset;

            .before {
              display: none;
            }

            .date {
              display: block;
            }
          }
        }
      }

      .content-table__container {
        .list-time {
          .time-table-right {
            display: none;
          }
        }
      }
    }
  }
}
</style>
