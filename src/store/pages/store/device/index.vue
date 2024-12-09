<template>
  <CalendarScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("store.device.title_screen") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>
          {{
            reservationStore.appearanceDevice === Appearance.calendar
              ? $t("store.calendar")
              : $t("title_screen.equipment_list")
          }}</template
        >
        <template #button>
          <el-button
            v-if="reservationStore.appearanceDevice === Appearance.list"
            class="btn__add"
            @click="addNewDevice()"
          >
            <IconAddCircle />
            <span>
              {{ t("create_new") }}
            </span>
          </el-button>
          <el-button
            :icon="IconCalendar"
            :class="[
              {
                active:
                  reservationStore.appearanceDevice === Appearance.calendar,
              },
            ]"
            @click="changeAppearance(Appearance.calendar)"
          ></el-button>
          <el-button
            :icon="IconList"
            :class="[
              { active: reservationStore.appearanceDevice === Appearance.list },
            ]"
            @click="changeAppearance(Appearance.list)"
          ></el-button>
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <div
        v-if="reservationStore.appearanceDevice === Appearance.calendar"
        class="h-100 w-100"
      >
        <HeadCalendar :is-device="true" :is-hidden-time="false" />
        <BodyCalendar :is-device="true" />
      </div>
      <div
        v-else-if="reservationStore.appearanceDevice === Appearance.list"
        class="h-100 w-100"
      >
        <HeadCalendar
          :is-device="true"
          :is-hidden-time="true"
          :is-calling-api="_refListReservation?.isLoadingTable"
        />
        <ListReservationDevice />
      </div>
    </template>
  </CalendarScreenComponent>
</template>

<script lang="ts" setup>
import { i18n } from "~/../../src/shared/plugins/i18n";
import IconAddCircle from "../../../components/Icon/IconAddCircle.vue";
import ListReservationDevice from "~/../../src/store/components/reservations/ListReservationDevice.vue";
import HeadCalendar from "../../../components/reservations/HeadCalendar.vue";
import BodyCalendar from "../../../components/reservations/BodyCalendar.vue";
import IconCalendar from "../../../components/Icon/IconCalendar.vue";
import IconList from "../../../components/Icon/IconList.vue";
import { useReservation } from "../../../store/useReservation";
import { Appearance } from "../../../constants";
import {
  SALON,
  CONSULTATION,
  CLASSROOM,
  MEDIAL_CARE,
} from "~/../../src/shared/constants/category";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import { useRouter } from "#imports";
import { ref } from "vue";

useHasTypeStore([SALON, CONSULTATION, CLASSROOM, MEDIAL_CARE]);
const { t } = i18n.global;
const reservationStore = useReservation();
const router = useRouter();
const _refListReservation = ref();

const changeAppearance = (value: Appearance) => {
  reservationStore.setAppearanceDevice(value);
};

const addNewDevice = () => {
  router.push({ name: "store-device-create" });
};
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables.scss";

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
      }
    }
  }
}
</style>
