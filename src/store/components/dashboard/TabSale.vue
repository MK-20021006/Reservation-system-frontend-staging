<template>
  <div v-loading="loading" class="chart-container">
    <div class="title">{{ $t("sale") }}</div>
    <el-form
      :model="formData"
      label-position="left"
      label-width="120px"
      inline
      class="custom-form"
    >
      <el-form-item :label="$t('period_select')" class="custom-label">
        <client-only>
          <CustomDatePicker
            v-model="formData.start_date"
            :type-date="getTypeDatePicker"
            :format="format"
            :placeholder="$t('start_date')"
            class="input-date"
            :disabled-date="disableDateStart"
            @clear-data="clearData('start_date')"
            @handle-change="handleSubmit"
          />
        </client-only>
        <client-only>
          <CustomDatePicker
            v-model="formData.end_date"
            :type-date="getTypeDatePicker"
            :format="format"
            :placeholder="$t('end_date')"
            class="input-date"
            :disabled-date="disableDateEnd"
            @clear-data="clearData('end_date')"
            @handle-change="handleSubmit"
          />
        </client-only>
      </el-form-item>
      <el-form-item>
        <client-only>
          <el-radio-group v-model="formData.mode" @change="handleChange">
            <el-radio-button :label="TYPE_MONTH">
              {{ $t("monthly") }}
            </el-radio-button>
            <el-radio-button :label="TYPE_WEEK">
              {{ $t("weekly") }}
            </el-radio-button>
            <el-radio-button :label="TYPE_DAY">
              {{ $t("daily") }}
            </el-radio-button>
          </el-radio-group>
        </client-only>
      </el-form-item>
    </el-form>
    <div class="line">
      <ChartLine
        v-if="dataLine.length > 0"
        :data="dataLine"
        :data-title="dataX"
        :title="$t('unit_yen')"
      />
    </div>
    <div class="export">
      <ButtonExport
        v-if="hasPermChartExport && data.length > 0"
        @click="exportCsv"
      />
    </div>
    <div class="custom-table">
      <client-only>
        <el-table
          v-if="formData.mode === TYPE_MONTH && !loading"
          class="table-content"
          :data="data"
          :empty-text="noData"
          border
        >
          <el-table-column
            min-width="100px"
            :label="$t('year')"
            class-name="custom-column"
          >
            <template #default="scope">
              {{ scope.row.year }}
            </template>
          </el-table-column>
          <el-table-column
            width="160px"
            :label="$t('average')"
            align="right"
            header-align="left"
          >
            <template #default="scope">
              {{
                priceDisplay(formatPriceFromMath(scope.row.average, 2)) +
                $t("yen")
              }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="column in DataTableMonth"
            :key="column.id"
            :label="column.name"
            width="160px"
            align="right"
            header-align="left"
          >
            <template #default="scope">
              {{
                priceDisplay(
                  formatPriceFromMath(
                    findObj(scope.row.data, "key", column.id)?.value || 0,
                    2
                  )
                ) + $t("yen")
              }}
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-if="formData.mode === TYPE_WEEK && !loading"
          class="table-content"
          :data="data"
          :empty-text="noData"
          border
        >
          <el-table-column
            min-width="100px"
            :label="$t('year')"
            class-name="custom-column"
          >
            <template #default="scope">
              {{ scope.row.year }}
            </template>
          </el-table-column>
          <el-table-column
            width="160px"
            :label="$t('average')"
            align="right"
            header-align="left"
          >
            <template #default="scope">
              {{
                priceDisplay(formatPriceFromMath(scope.row.average, 2)) +
                $t("yen")
              }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="column in DataTableWeek"
            :key="column.id"
            :label="column.name"
            width="160px"
            align="right"
            header-align="left"
          >
            <template #header>
              {{
                isData1Year
                  ? column.name +
                    " " +
                    getShowStartDateOfWeek(column.id, formData.start_date)
                  : column.name
              }}
            </template>
            <template #default="scope">
              {{
                priceDisplay(
                  formatPriceFromMath(
                    findObj(scope.row.data, "key", column.id)?.value || 0,
                    2
                  )
                ) + $t("yen")
              }}
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-if="formData.mode === TYPE_DAY && !loading"
          class="table-content"
          :data="data"
          :empty-text="noData"
          border
        >
          <el-table-column
            min-width="100px"
            :label="$t('average')"
            align="right"
            header-align="left"
          >
            <template #default="scope">
              {{
                priceDisplay(formatPriceFromMath(scope.row.average, 2)) +
                $t("yen")
              }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="column in data[0]?.data"
            :key="column.key"
            width="180px"
            align="right"
            header-align="left"
          >
            <template #header>
              {{ formatDate(column.key, "YYYY年MM月DD日") }}
            </template>
            <template #default>
              {{
                priceDisplay(formatPriceFromMath(column.value, 2)) + $t("yen")
              }}
            </template>
          </el-table-column>
        </el-table>
      </client-only>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ChartLine from "~/../../src/shared/components/chart/line.vue";
import statisticRequest from "~/../../src/shared/requests/StatisticRequest";
import { DataDashboardStore } from "~/../../src/store/store/dashboard";
import { computed, onBeforeMount, reactive, ref } from "vue";
import {
  exportFile,
  findObj,
  getDataMap,
  getDataMapWeek,
  getDataMapDay,
  getDataTableWeek,
  getDataTitleWeekLine,
  getEndDate,
  checkDateWeek,
  getShowStartDateOfWeek,
  getDataTitleMonth,
  getDataTableMonth,
} from "~/../../src/shared/utils";
import {
  formatDate,
  formatPriceFromMath,
} from "~/../../src/shared/utils/format";
import {
  DATA_LABEL_MONTH,
  DATA_LABEL_WEEK,
  TYPE_DAY,
  TYPE_MONTH,
  TYPE_WEEK,
} from "~/../../src/shared/constants";
import ButtonExport from "~/../../src/shared/components/button/Export.vue";
import moment from "moment";
import useHavePermission from "~~/../../src/shared/composables/useHavePermission";
import { Permission } from "~/../../src/shared/constants/permission";
import { i18n } from "~/../../src/shared/plugins/i18n";
import priceDisplay from "~/../../src/shared/utils/price";
import CustomDatePicker from "~/../../src/shared/components/input/CustomDatePicker.vue";
import type { TableColumnCtx } from "element-plus";

const { t } = i18n.global;
const hasPermChartExport = useHavePermission(Permission.ChartExport, false);

interface Month {
  key: string | number;
  value: number;
}

interface Income {
  average: number;
  data: Month[];
  label: number;
}

const formData = reactive({
  mode: TYPE_MONTH,
  start_date: null,
  end_date: null,
});
const loading = ref(false);
const type = ref("month");
const tableDashboard = DataDashboardStore();
const format = ref("YYYY年MM月");
const formatValue = ref("YYYY-MM-DD");
const dataX = ref([]);
const noData = ref(t("no_data"));
const dataResponse = ref<Income[]>([]);
const data = ref([]);
const dataLine = ref([]);
const isData1Year = ref(false);

const clearData = (field: string) => {
  formData[field] = null;
  handleSubmit();
};

const getTypeDatePicker = computed(() => {
  return type.value === null || type.value === TYPE_DAY ? "date" : type.value;
});

//DISABLE FORM
const disableDateStart = (date: string) => {
  if (formData.mode !== TYPE_DAY) {
    if (formData.end_date) {
      return moment(date) > moment(formData.end_date);
    }
  } else {
    if (formData.end_date) {
      return (
        moment(date) > moment(formData.end_date) ||
        moment(date) < moment(formData.end_date).subtract(2, "month")
      );
    }
  }
  return moment(date) > moment();
};

const disableDateEnd = (date: string) => {
  if (formData.mode !== TYPE_DAY) {
    if (formData.start_date) {
      return (
        moment(date) < moment(formData.start_date) || moment(date) > moment()
      );
    }
  } else {
    if (formData.start_date) {
      return (
        moment(date) < moment(formData.start_date) ||
        moment(date) > moment() ||
        moment(date) > moment(formData.start_date).add(2, "month")
      );
    }
  }
  return moment(date) > moment();
};

//CHANGE TAB
const handleChange = (model: string) => {
  if (model === TYPE_MONTH) {
    type.value = "month";
    format.value = "YYYY年MM月";
    tableDashboard.mode_sale = TYPE_MONTH;
    formData.start_date = tableDashboard.sale_month.start;
    formData.end_date = tableDashboard.sale_month.end;
    getDataSale();
  } else if (model === TYPE_WEEK) {
    tableDashboard.mode_sale = TYPE_WEEK;
    type.value = "week";
    format.value = "YYYY年ww週　(MM/DD～)";
    formData.start_date = tableDashboard.sale_week.start;
    formData.end_date = tableDashboard.sale_week.end;
    getDataSale();
  } else {
    type.value = "date";
    tableDashboard.mode_sale = TYPE_DAY;
    format.value = "YYYY年MM月DD日";
    formData.start_date = tableDashboard.sale_day.start;
    formData.end_date = tableDashboard.sale_day.end;
    getDataSale();
  }
};

const handleSubmit = async () => {
  if (formData.mode === TYPE_WEEK) {
    tableDashboard.sale_week.start = formData.start_date;
    tableDashboard.sale_week.end = formData.end_date;
  } else if (formData.mode === TYPE_DAY) {
    tableDashboard.sale_day.start = formData.start_date;
    tableDashboard.sale_day.end = formData.end_date;
  } else {
    tableDashboard.sale_month.start = formData.start_date;
    tableDashboard.sale_month.end = formData.end_date;
  }
  await getDataSale();
  if (!data.value.length) {
    noData.value = t("no_result");
  }
};

const DataTableWeek = computed(() => {
  return getDataTableWeek(formData.start_date, formData.end_date);
});

const DataTableMonth = computed(() => {
  return getDataTableMonth(formData.start_date, formData.end_date);
});

const getDataTitleWeek = async (dataCheck = []) => {
  return getDataTitleWeekLine(formData.start_date, formData.end_date);
};

const getDataSale = async () => {
  loading.value = true;
  dataResponse.value = (
    await statisticRequest.getIncome<Income[]>({
      ...formData,
      end_date: getEndDate(formData.mode, formData.end_date),
    })
  ).data;
  if (formData.mode === TYPE_DAY) {
    const getData = await getDataMapDay(dataResponse.value);
    data.value = getData.dataTable;
    dataLine.value = await getSeriesDataDay(getData.dataMap);
    dataX.value = await getDataTitleDay(getData.dataMap);
  } else if (formData.mode === TYPE_WEEK) {
    const getData = await getDataMapWeek(
      dataResponse.value,
      formData.start_date,
      formData.end_date
    );
    data.value = getData.dataTable;
    if (data.value.length === 1) {
      //IF DATA IS ONLY 1 YEAR ==> isData1Year = true
      isData1Year.value = true;
    } else {
      isData1Year.value = false;
    }
    dataLine.value = await getSeriesData(getData.dataMap);
    dataX.value = await getDataTitleWeek(DATA_LABEL_WEEK);
  } else {
    const getData = await getDataMap(
      dataResponse.value,
      formData.start_date,
      formData.end_date
    );
    data.value = getData.dataTable;
    dataLine.value = await getSeriesData(getData.dataMap);
    dataX.value = await getDataTitleMonth(
      formData.start_date,
      formData.end_date
    );
  }
  loading.value = false;
};

const getSeriesData = async (dataSeries = []) => {
  return dataSeries.map((item) => {
    return {
      name: item.year,
      type: "line",
      data: item.data,
      smooth: !0,
      legendHoverLink: !1,
    };
  });
};
const getSeriesDataDay = async (dataSeries = []) => {
  const dataEnd = dataSeries.map((item) => {
    return item.value;
  });

  if (dataEnd.length > 0) {
    return [
      {
        name: t("daily"),
        type: "line",
        data: dataEnd,
        smooth: !0,
        legendHoverLink: !1,
      },
    ];
  }
  return [];
};

const getDataTitleDay = async (dataCheck = []) => {
  const dataTitle = [];
  dataCheck.filter((item) => {
    const index = dataTitle.findIndex(
      (title) =>
        formatDate(title, "YYYY年MM月DD日") ===
        formatDate(item.key, "YYYY年MM月DD日")
    );
    if (index === -1) {
      dataTitle.push(formatDate(item.key, "YYYY年MM月DD日"));
    }
  });
  return dataTitle;
};

const exportCsv = async () => {
  const res: any = await statisticRequest.exportIncome({
    ...formData,
    end_date: getEndDate(formData.mode, formData.end_date),
  });
  if (res) {
    const name = await getNameCsv();
    exportFile(res, name);
  }
};

const getNameCsv = async () => {
  if (formData.mode === TYPE_WEEK) {
    return "S008_ダッシュボード画面_売上比率_週別";
  } else if (formData.mode === TYPE_DAY) {
    return "S008_ダッシュボード画面_売上比率_日別";
  } else {
    return "S008_ダッシュボード画面_売上比率_月別";
  }
};

onBeforeMount(() => {
  if (tableDashboard.mode_sale === TYPE_WEEK) {
    formData.mode = "week";
    format.value = "YYYY年ww週　(MM/DD～)";
    type.value = "week";
    formData.start_date = tableDashboard.sale_week.start;
    formData.end_date = tableDashboard.sale_week.end;
  } else if (tableDashboard.mode_sale === TYPE_DAY) {
    formData.mode = "day";
    type.value = "date";
    format.value = "YYYY年MM月DD日";
    formData.start_date = tableDashboard.sale_day.start;
    formData.end_date = tableDashboard.sale_day.end;
  } else {
    formData.mode = "month";
    type.value = "month";
    format.value = "YYYY年MM月";
    formData.start_date = tableDashboard.sale_month.start;
    formData.end_date = tableDashboard.sale_month.end;
  }
  getDataSale();
});
</script>

<style lang="scss" scoped>
@import "../../assets/scss/dashboard";

:deep(.input-date) {
  width: 200px;

  .select-tags {
    top: 0px;
  }
}
</style>
