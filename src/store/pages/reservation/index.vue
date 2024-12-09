<template>
  <CalendarScreenComponent>
    <template #head>
      <Head>
        <Title>{{ $t("site_name_title") }}{{ $t("reservations") }}</Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>
          {{
            reservationStore.appearance === Appearance.calendar
              ? $t("store.calendar")
              : $t("reservations")
          }}</template
        >
        <template #button>
          <div
            v-if="
              reservationStore.appearance === Appearance.list &&
              _refListReservation?.isSettingExternalSite &&
              _refListReservation?.isCrawlType &&
              _refListReservation?.statusConnectExternal
            "
            class="crawl-data-manual"
          >
            <span class="status"
              >{{ $t("integration_status") }}:
              {{
                findObj(
                  statusJobBookingCrawlManual,
                  "value",
                  _refListReservation?.statusCrawlBooking
                )?.label
              }}</span
            >
            <span class="date">{{ $t("crawl.cooperation_date") }}</span>
            <client-only>
              <el-date-picker
                v-model="formData.start_date"
                :editable="false"
                :placeholder="$t('start_date')"
                width="144px"
                class="mr-10"
                type="date"
                :disabled-date="disabledDateStart"
                format="YYYY年MM月DD日"
                value-format="YYYY-MM-DD"
                clearable
              />
            </client-only>
            <client-only>
              <el-date-picker
                v-model="formData.end_date"
                :editable="false"
                :placeholder="$t('end_date')"
                width="144px"
                class="mr-10"
                type="date"
                :disabled-date="disabledDateEnd"
                format="YYYY年MM月DD日"
                value-format="YYYY-MM-DD"
                clearable
              />
            </client-only>
            <icon-sync
              :class="{ 'rotage-btn': isLoadingCrawl }"
              class="icon-sync"
              @click="handleCrawlBooking"
            />
          </div>
          <el-button
            v-if="reservationStore.appearance === Appearance.list"
            class="btn__add"
            @click="addNewReservation"
          >
            <IconAddCircle />
            <span>
              {{ t("create_new") }}
            </span>
          </el-button>
          <ButtonExport
            v-if="reservationStore.appearance === Appearance.list"
            :name="$t('button_export')"
            class="btn_export"
            :loading="_refListReservation?.isLoadingExport"
            @click="handleExportBooking"
          />
          <el-button
            :icon="IconCalendar"
            :class="[
              { active: reservationStore.appearance === Appearance.calendar },
            ]"
            @click="() => changeAppearance(Appearance.calendar)"
          ></el-button>
          <el-button
            :icon="IconList"
            :class="[
              { active: reservationStore.appearance === Appearance.list },
            ]"
            @click="() => changeAppearance(Appearance.list)"
          ></el-button>
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <div
        v-if="reservationStore.appearance === Appearance.calendar"
        class="h-100 w-100"
      >
        <HeadCalendar :is-booking="true" />
        <BodyCalendar />
      </div>
      <div
        v-else-if="reservationStore.appearance === Appearance.list"
        class="h-100 w-100"
      >
        <HeadCalendar
          :is-calling-api="_refListReservation?.isLoadingTable"
          :is-booking="true"
        />
        <ListReservation ref="_refListReservation" />
      </div>
    </template>
  </CalendarScreenComponent>
</template>

<script lang="ts" setup>
import { i18n } from "~/../../src/shared/plugins/i18n";
import IconAddCircle from "../../components/Icon/IconAddCircle.vue";
import ListReservation from "../../components/reservations/ListReservation.vue";
import HeadCalendar from "../../components/reservations/HeadCalendar.vue";
import BodyCalendar from "../../components/reservations/BodyCalendar.vue";
import IconCalendar from "../../components/Icon/IconCalendar.vue";
import IconList from "../../components/Icon/IconList.vue";
import ButtonExport from "~/../../src/shared/components/button/Export.vue";
import { useReservation } from "../../store/useReservation";
import { Appearance } from "../../constants";
import { useRouter } from "#imports";
import { ref } from "vue";
import { DataTableStore } from "~/../../src/store/store/dataTable";
import moment from "moment";
import { statusJobBookingCrawlManual } from "~/../../src/shared/constants";
import { findObj } from "~/../../src/shared/utils";

const { t } = i18n.global;
const reservationStore = useReservation();
const isLoadingExport = ref(false);
const router = useRouter();
const _refListReservation = ref();
const isLoadingCrawl = ref(false);
const dataTableStore = DataTableStore();

const formData = ref({
  start_date: dataTableStore.bookingCrawl.start_date,
  end_date: dataTableStore.bookingCrawl.end_date,
});

const disabledDateStart = (time: Date) => {
  return formData.value.end_date
    ? moment(time, "YYYY-MM-DD").isAfter(
        moment(formData.value.end_date).format("YYYY-MM-DD")
      ) ||
        moment(
          moment(formData.value.end_date).subtract("6", "days"),
          "YYYY-MM-DD"
        ).isAfter(moment(time).format("YYYY-MM-DD"))
    : false;
};

const disabledDateEnd = (time: Date) => {
  return formData.value.start_date
    ? moment(time, "YYYY-MM-DD").isBefore(
        moment(formData.value.start_date).format("YYYY-MM-DD")
      ) ||
        moment(
          moment(formData.value.start_date).add("6", "days"),
          "YYYY-MM-DD"
        ).isBefore(moment(time).format("YYYY-MM-DD"))
    : false;
};

const changeAppearance = (value: Appearance) => {
  reservationStore.setAppearance(value);
};

const handleCrawlBooking = async () => {
  isLoadingCrawl.value = true;
  await _refListReservation.value.handleCrawlBookingManual(
    formData.value.start_date,
    formData.value.end_date
  );
  dataTableStore.bookingCrawl.start_date = formData.value.start_date;
  dataTableStore.bookingCrawl.end_date = formData.value.end_date;
  isLoadingCrawl.value = false;
};

const handleExportBooking = async () => {
  await _refListReservation.value.handleExport();
};

const addNewReservation = () => {
  router.push({ name: "reservation-create" });
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables.scss";

:deep() {
  .header-content {
    .group-button {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .el-button {
        border: none;
        background-color: transparent;
        margin: 0px;
        padding: 0px;
        width: 24px;
        height: 24px;

        .el-icon {
          width: 24px;
          height: 24px;
          svg {
            width: 24px;
            height: 24px;
            path {
              fill: black;
            }
          }
        }

        + .el-button {
          margin-left: 16px;
        }

        &.active {
          .el-icon {
            svg {
              path {
                fill: variables.$menuBg;
              }
            }
          }
        }

        &.btn__add {
          height: 40px;
          width: 122px;
          background-color: variables.$green-medium-color;
          color: white;

          span {
            margin-left: 8px;
          }
        }

        &.btn_export {
          width: auto;
          height: auto;
          padding: 8.5px 20px;
          background-color: variables.$white-color;

          .el-icon {
            svg {
              width: 15px;
              height: 15px;
              path {
                fill: black;
              }
            }
          }
        }
      }
    }
  }
}

:deep(.crawl-data-manual) {
  display: flex;
  align-items: center;

  .icon-sync {
    cursor: pointer;
  }

  .rotage-btn {
    transform: rotate(-360deg);
    transition: 1s;
    cursor: unset;
  }

  .status,
  .date {
    margin-right: 20px;
  }

  .el-input {
    width: 170px;
    height: 40px;
  }
}
</style>
