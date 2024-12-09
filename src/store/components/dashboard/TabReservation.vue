<template>
  <div class="chart-container">
    <div class="title">{{ $t("login_statistical") }}</div>
    <el-form
      :model="formData"
      label-position="left"
      label-width="120px"
      inline
      class="custom-form"
    >
      <el-form-item :label="$t('period_select')" class="custom-label">
        <client-only>
          <el-date-picker
            v-model="formData.start_date"
            type="date"
            value-format="YYYY-MM-DD"
            format="YYYY年MM月DD日"
            :disabled-date="disableDateStart"
            :placeholder="$t('start_date')"
            :editable="false"
            @change="handleChange"
          />
        </client-only>
        <client-only>
          <el-date-picker
            v-model="formData.end_date"
            type="date"
            value-format="YYYY-MM-DD"
            format="YYYY年MM月DD日"
            :placeholder="$t('end_date')"
            :disabled-date="disableDateEnd"
            :editable="false"
            @change="handleChange"
          />
        </client-only>
      </el-form-item>
    </el-form>
    <ChartCircle
      :data-title="dataTitle"
      :data="dataCircle"
      :color="dataColor"
      :name="$t('login_statistical')"
    />
    <div class="export">
      <ButtonExport
        v-if="hasPermChartExport && checkData()"
        @click="exportReservation"
      />
    </div>
    <div class="table-login-type custom-table">
      <el-table
        v-loading="loading"
        :data="dataTable"
        class="table-content"
        border
      >
        <el-table-column :label="$t('period')" min-width="200px">
          <template #default>
            <span> {{ formData.start_date || $t("none") }} ~ </span>
            <span>{{ formData.end_date || $t("none") }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('line')" prop="line" min-width="150px" />
        <el-table-column
          :label="$t('google_reservation')"
          prop="google"
          min-width="150px"
        />
        <el-table-column
          v-if="isRestaurant(meStore.getTypeStore)"
          min-width="150px"
          :label="$t('store.hot_pepper_gourmet')"
          prop="hot_pepper_gourmet"
        />
        <el-table-column
          v-if="isSalon(meStore.getTypeStore)"
          min-width="150px"
          :label="$t('store.hot_pepper_beauty')"
          prop="hot_pepper_beauty"
        />
        <el-table-column
          v-if="isRestaurant(meStore.getTypeStore)"
          :label="$t('store.gurunavi')"
          prop="gurunavi"
          min-width="150px"
        />
        <el-table-column
          v-if="isRestaurant(meStore.getTypeStore)"
          :label="$t('eating_log')"
          prop="eating_log"
          min-width="150px"
        />
        <el-table-column
          :label="$t('site_name')"
          prop="web"
          min-width="150px"
        />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from "vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import ChartCircle from "~/../../src/shared/components/chart/Circle.vue";
import ButtonExport from "~/../../src/shared/components/button/Export.vue";
import statisticRequest from "~/../../src/shared/requests/StatisticRequest";
import { DataDashboardStore } from "~/../../src/store/store/dashboard";

import {
  BOOKING_SOURCE_LINE,
  BOOKING_SOURCE_EATING,
  BOOKING_SOURCE_GOOGLE,
  BOOKING_SOURCE_GURUNAVI,
  BOOKING_SOURCE_HOTPEPPER,
  BOOKING_SOURCE_WEB,
  BOOKING_SOURCE_HOTPEPPER_BEAUTY,
} from "~/../../src/shared/constants/booking";
import { onBeforeMount } from "vue";
import moment from "moment/moment";
import { exportFile } from "~/../../src/shared/utils";
import useHavePermission from "~~/../../src/shared/composables/useHavePermission";
import { Permission } from "~/../../src/shared/constants/permission";
import { useMeStore } from "~/../../src/shared/stores/me";
import {
  isSalon,
  isEvent,
  isClassRoom,
  isConsultation,
  isRestaurant,
  isMedialCare,
} from "~/../../src/shared/constants/typeStore";
import { SALON, RESTAURANT } from "~/../../src/shared/constants/category";

const hasPermChartExport = useHavePermission(Permission.ChartExport, false);

interface BOOKING_SOURCE {
  key: number;
  label: string;
  value: number;
}
const meStore = useMeStore();
const dataDashBoard = DataDashboardStore();
const loading = ref(false);
const formData = reactive({
  start_date: null,
  end_date: null,
});
const { t } = i18n.global;

const dataColor = ref<any[]>([]);
const dataTitle = ref<any[]>([]);
const dataCircle = ref<any[]>();

if (meStore.getTypeStore === SALON) {
  dataColor.value = ["#7CB342", "#03A9F4", "#d234eb", "#33415c"];
  dataTitle.value = [
    t("line"),
    t("google_reservation"),
    t("store.hot_pepper_beauty"),
    t("site_name"),
  ];
  dataCircle.value = [
    { value: 0, name: t("line") },
    { value: 0, name: t("google_reservation") },
    { value: 0, name: t("store.hot_pepper_beauty") },
    { value: 0, name: t("site_name") },
  ];
} else if (meStore.getTypeStore === RESTAURANT) {
  dataColor.value = [
    "#7CB342",
    "#03A9F4",
    "#F44336",
    "#3F51B5",
    "#fc781d",
    "#33415c",
  ];
  dataTitle.value = [
    t("line"),
    t("google_reservation"),
    t("hot_pepper_gourmet"),
    t("store.gurunavi"),
    t("eating_log"),
    t("site_name"),
  ];
  dataCircle.value = [
    { value: 0, name: t("line") },
    { value: 0, name: t("google_reservation") },
    { value: 0, name: t("hot_pepper_gourmet") },
    { value: 0, name: t("store.gurunavi") },
    { value: 0, name: t("eating_log") },
    { value: 0, name: t("site_name") },
  ];
} else {
  dataColor.value = ["#7CB342", "#03A9F4", "#33415c"];
  dataTitle.value = [t("line"), t("google_reservation"), t("site_name")];
  dataCircle.value = [
    { value: 0, name: t("line") },
    { value: 0, name: t("google_reservation") },
    { value: 0, name: t("site_name") },
  ];
}

const dataTable = ref<any[]>([
  {
    line: 0,
    google: 0,
    hot_pepper_gourmet: 0,
    hot_pepper_beauty: 0,
    gurunavi: 0,
    eating_log: 0,
    web: 0,
    start_date: formData.start_date,
    end_date: formData.end_date,
  },
]);

const getDataCircle = async (data: BOOKING_SOURCE[]) => {
  dataTable.value = [
    {
      line: 0,
      google: 0,
      hot_pepper_gourmet: 0,
      hot_pepper_beauty: 0,
      gurunavi: 0,
      eating_log: 0,
      web: 0,
      start_date: formData.start_date,
      end_date: formData.end_date,
    },
  ];
  if (meStore.getTypeStore === SALON) {
    dataCircle.value = [
      { value: 0, name: t("line") },
      { value: 0, name: t("google_reservation") },
      { value: 0, name: t("store.hot_pepper_beauty") },
      { value: 0, name: t("site_name") },
    ];
  } else if (meStore.getTypeStore === RESTAURANT) {
    dataCircle.value = [
      { value: 0, name: t("line") },
      { value: 0, name: t("google_reservation") },
      { value: 0, name: t("hot_pepper_gourmet") },
      { value: 0, name: t("store.gurunavi") },
      { value: 0, name: t("eating_log") },
      { value: 0, name: t("site_name") },
    ];
  } else {
    dataCircle.value = [
      { value: 0, name: t("line") },
      { value: 0, name: t("google_reservation") },
      { value: 0, name: t("site_name") },
    ];
  }
  if (data.length > 0) {
    await data.forEach((item) => {
      if (dataCircle.value && dataCircle.value.length > 0) {
        if (item.key === BOOKING_SOURCE_LINE) {
          dataTable.value[0].line = item.value;
          dataCircle.value[0].value = item.value;
        } else if (item.key === BOOKING_SOURCE_GOOGLE) {
          dataTable.value[0].google = item.value;
          dataCircle.value[1].value = item.value;
        }
        if (meStore.getTypeStore === SALON) {
          if (item.key === BOOKING_SOURCE_HOTPEPPER_BEAUTY) {
            dataTable.value[0].hot_pepper_beauty = item.value;
            dataCircle.value[2].value = item.value;
          }
          if (item.key === BOOKING_SOURCE_WEB) {
            dataTable.value[0].web = item.value;
            dataCircle.value[3].value = item.value;
          }
        } else if (meStore.getTypeStore === RESTAURANT) {
          if (item.key === BOOKING_SOURCE_HOTPEPPER) {
            dataTable.value[0].hot_pepper_gourmet = item.value;
            dataCircle.value[2].value = item.value;
          } else if (item.key === BOOKING_SOURCE_GURUNAVI) {
            dataTable.value[0].gurunavi = item.value;
            dataCircle.value[3].value = item.value;
          } else if (item.key === BOOKING_SOURCE_EATING) {
            dataTable.value[0].eating_log = item.value;
            dataCircle.value[4].value = item.value;
          } else if (item.key === BOOKING_SOURCE_WEB) {
            dataTable.value[0].web = item.value;
            dataCircle.value[5].value = item.value;
          }
        } else {
          if (item.key === BOOKING_SOURCE_WEB) {
            dataTable.value[0].web = item.value;
            dataCircle.value[2].value = item.value;
          }
        }
      }
    });
  }
};

const disableDateStart = (date: string) => {
  if (formData.end_date) {
    return moment(date) > moment(formData.end_date);
  }
  return false;
};

const disableDateEnd = (date: string) => {
  if (formData.start_date) {
    return moment(date) < moment(formData.start_date);
  }
  return false;
};

const checkData = () => {
  let total = 0;
  dataCircle.value.filter((item) => {
    total += item.value;
  });
  return total !== 0;
};

const handleChange = () => {
  dataDashBoard.reservation.start = formData.start_date;
  dataDashBoard.reservation.end = formData.end_date;
  getListReservation();
};

const getListReservation = async (key?: boolean) => {
  loading.value = true;
  const response = await statisticRequest.getBookingSource<BOOKING_SOURCE[]>(
    formData,
    key
  );
  await getDataCircle(response.data);
  loading.value = false;
};

const exportReservation = async () => {
  const res: any = await statisticRequest.exportBookingSource(formData);
  if (res) {
    exportFile(res, "S008_ダッシュボード画面_予約ソース");
  }
};

onBeforeMount(async () => {
  if (dataDashBoard.reservation.start) {
    formData.start_date = dataDashBoard.reservation.start;
  }
  if (dataDashBoard.reservation.end) {
    formData.end_date = dataDashBoard.reservation.end;
  }
  await getListReservation(true);
});
</script>

<style lang="scss" scoped>
@import "../../assets/scss/dashboard";
</style>
