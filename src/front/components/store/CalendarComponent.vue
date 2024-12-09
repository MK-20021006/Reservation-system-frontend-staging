<template>
  <div class="calendar">
    <div class="calendar-title">
      <span class="calendar-title__reservation">
        {{ $t("front.store_reservation") }}
      </span>
      <span class="calendar-title__vacancy">
        {{ $t("front.store_vacancy") }}
      </span>
    </div>
    <div class="calendar-box">
      <div class="calendar-wrap">
        <ul class="list-calendar">
          <li
            v-for="(item, index) in data"
            :key="index"
            class="list-calendar__item"
            :class="{ 'show-pc': index > 6 }"
          >
            <p
              class="list-calendar__week"
              :class="getDayColor(item.week, item.holiday)"
            >
              {{ item.week }}
            </p>
            <div class="list-calendar__target">
              <p class="list-calendar__date">
                <span
                  v-if="index === 0"
                  class="list-calendar__date-month"
                  :class="getDayColor(item.week, item.holiday)"
                >
                  {{ formatDate(item.date, "MM") }}/
                </span>
                <span
                  class="list-calendar__date-day"
                  :class="getDayColor(item.week, item.holiday)"
                >
                  {{ formatDate(item.date, "D") }}
                </span>
              </p>
              <p
                class="list-calendar__vacancy"
                :class="{ 'store-booking': checkStatusEmpty(item.status) }"
                @click="handleClick(item)"
              >
                <span v-if="checkStatusBooking(item.status)" class="line">
                  {{ $t("store.off") }}
                </span>
                <span v-if="checkStatusEmpty(item.status)"
                  ><IconEllipse />
                </span>
                <span v-if="checkStatusNotEmpty(item.status)"
                  ><IconClose />
                </span>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";
import { STATUS_PLACE } from "~/../../src/shared/constants";
import { formatDate } from "~/../../src/shared/utils/format";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { useRouter } from "#imports";

const { t } = i18n.global;
const router = useRouter();
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default() {
      return [];
    },
  },
  limit: {
    type: Number,
    default: 14,
  },
  idStore: {
    type: Number,
  },
});

const { idStore } = toRefs(props);
const emits = defineEmits(["handleClick"]);

const handleClick = (item: any) => {
  if (checkStatusEmpty(item.status)) {
    emits("handleClick", item);
  }
};

const handleSubmit = (day: string, status: number) => {
  if (checkStatusEmpty(status)) {
    router.push({
      name: "reservation-booking",
      query: {
        date_booking: day,
        store_id: idStore?.value,
      },
    });
  }
};

const checkStatusEmpty = (status: number) => {
  return status === STATUS_PLACE.PLACE_EMPTY;
};

const checkStatusBooking = (status: number) => {
  return status === STATUS_PLACE.NOT_RECEIVE_BOOKING;
};

const checkStatusNotEmpty = (status: number) => {
  return status === STATUS_PLACE.NOT_PLACE_EMPTY;
};

const getDayColor = (day: string, holiday: string) => {
  if (day === t("saturday")) {
    return "color-blue";
  }
  if (day === t("sunday") || holiday) {
    return "color-red";
  }
  return "";
};

const { data } = toRefs(props);
</script>

<style lang="scss" scoped>
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../../assets/scss/variables" as *;

$gray-calendar: #e9e9e9;

:deep(.color-red) {
  color: $btn-red !important;
}

:deep(.color-blue) {
  color: $blue-medium !important;
}

.calendar {
  display: flex;
  min-height: 80px;
  background: $white-color;

  .calendar-title {
    display: flex;
    border: 1px solid $gray-calendar;
    border-right: none;
    min-width: 150px;
    font-weight: 400;
    font-size: 12px;
    text-align: center;
    align-items: center;
    justify-content: center;

    .calendar-title__reservation {
      margin-right: 6px;
      color: $black-title;
    }

    .calendar-title__vacancy {
      color: $black-title;
    }
  }

  .calendar-box {
    width: calc(100% - 150px);
    height: 80px;

    .calendar-wrap {
      margin: 0;

      .list-calendar {
        display: flex;
        width: 100%;
        height: 80px;
        box-sizing: border-box;

        .list-calendar__item {
          display: flex;
          flex-direction: column;
          width: calc(100% / 14);
          text-align: center;

          &:last-child {
            border-right: 1px solid $gray-calendar;
          }

          .list-calendar__week {
            border: 1px solid $gray-calendar;
            border-right: none;
            border-bottom: none;
            font-size: 12px;
            padding: 4px 0;
            max-height: 27px;
            color: $black-title;
          }

          .list-calendar__target {
            display: block;
            //cursor: pointer;
            padding: 8px 0 0;
            border: 1px solid $gray-calendar;
            border-right: none;
            box-sizing: border-box;
            color: $black-title;
            flex-grow: 1;

            .list-calendar__date {
              line-height: 10px;
              height: 20px;

              .list-calendar__date-month {
                font-size: 8px;
                font-weight: 400;
              }
            }

            .list-calendar__vacancy {
              height: 20px;
              align-items: center;
              text-align: center;
              width: 100%;
              cursor: unset;

              .line {
                font-size: 12px;

                svg {
                  margin: 10px auto;
                }
              }
            }

            .store-booking {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .calendar {
    .calendar-title {
      width: 48px;

      .calendar-title__reservation {
        display: none;
      }
    }

    .calendar-box {
      width: calc(100% - 48px);

      .calendar-wrap {
        .list-calendar {
          .list-calendar__item {
            width: calc(100% / 7);

            &:nth-child(7n) {
              border-right: 1px solid $gray-calendar;
            }
          }

          .show-pc {
            display: none;
          }
        }
      }
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .calendar {
    .calendar-title {
      width: 48px;
      min-width: 48px;
      padding: 0 10px;

      .calendar-title__reservation {
        display: none;
      }
    }

    .calendar-box {
      width: calc(100% - 48px);

      .calendar-wrap {
        .list-calendar {
          .list-calendar__item {
            width: calc(100% / 7);

            &:nth-child(7n) {
              border-right: 1px solid $gray-calendar;
            }
          }

          .show-pc {
            display: none;
          }
        }
      }
    }
  }
}
</style>
