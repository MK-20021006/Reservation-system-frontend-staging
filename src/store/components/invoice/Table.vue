<template>
  <div class="custom-table">
    <client-only>
      <!-- Table Month -->
      <el-table
        v-if="props.mode === TYPE_MONTH"
        class="table-content"
        max-height="calc(100vh - 58px - 70px - 192px - 100px)"
        :empty-text="noData"
        :data="customData"
        border
        :default-sort="defaultSort"
        :span-method="objectSpanMethod"
        @sort-change="headerSort"
      >
        <el-table-column
          min-width="100px"
          :label="$t('sale_month')"
          class-name="custom-column"
          prop="month"
          align="center"
          :sortable="true"
          :sort-orders="['ascending', 'descending']"
        >
          <template #default="scope">
            <span class="ellipsis">
              {{
                scope.row.year + t("year") + scope.row.month + t("monday")
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          min-width="100px"
          :label="$t('payment_type')"
          class-name="custom-column"
          prop="payment_type"
          align="center"
        >
          <template #default="scope">
            <span class="ellipsis">
              {{
                findObj(PaymentMethod, "value", scope.row.payment_type)?.label
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          v-if="typeStore === RESTAURANT"
          min-width="100px"
          :label="$t('course')"
          class-name="custom-column"
          prop="course"
          align="center"
        >
          <template #default="scope">
            {{ scope.row?.course?.course_name }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="typeStore === EVENT"
          min-width="100px"
          :label="$t('event')"
          class-name="custom-column"
          prop="course"
          align="center"
        >
          <template #default="scope">
            {{ scope.row?.event?.name }}
          </template>
        </el-table-column>
        <el-table-column
          width="150px"
          :label="$t('amount_money')"
          class-name="custom-column"
          prop="amount"
          align="right"
          header-align="left"
        >
          <template #default="scope">
            {{ priceDisplay(scope.row?.amount) }}{{ $t("yen") }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="!GROUP_TYPE_STORE.SAME.includes(typeStore)"
          width="170px"
          :label="$t('total')"
          class-name="custom-column"
          prop="total"
          align="right"
          header-align="left"
        >
          <template #default="scope">
            {{ priceDisplay(scope.row?.total) }}{{ $t("yen") }}
          </template>
        </el-table-column>
      </el-table>
      <!-- Table Week -->
      <el-table
        v-if="props.mode === TYPE_WEEK"
        class="table-content"
        max-height="calc(100vh - 58px - 70px - 192px - 100px)"
        :empty-text="noData"
        :data="customData"
        border
        :default-sort="defaultSort"
        :span-method="objectSpanMethod"
        @sort-change="headerSort"
      >
        <el-table-column
          min-width="100px"
          :label="$t('sale_week')"
          class-name="custom-column"
          prop="week"
          align="center"
          :sortable="true"
          :sort-orders="['ascending', 'descending']"
        >
          <template #default="scope">
            <span class="ellipsis">
              {{
                scope.row.year +
                t("year") +
                scope.row.week +
                type +
                "　" +
                formatDate(scope.row.start_of_week, "(MM/DD～)")
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          min-width="100px"
          :label="$t('payment_type')"
          class-name="custom-column"
          prop="payment_type"
          align="center"
        >
          <template #default="scope">
            <span class="ellipsis">
              {{
                findObj(PaymentMethod, "value", scope.row.payment_type)?.label
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          v-if="typeStore === RESTAURANT"
          min-width="100px"
          :label="$t('course')"
          class-name="custom-column"
          prop="course"
          align="center"
        >
          <template #default="scope">
            {{ scope.row?.course?.course_name }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="typeStore === EVENT"
          min-width="100px"
          :label="$t('event')"
          class-name="custom-column"
          prop="course"
          align="center"
        >
          <template #default="scope">
            {{ scope.row?.event?.name }}
          </template>
        </el-table-column>
        <el-table-column
          width="150px"
          :label="$t('amount_money')"
          class-name="custom-column"
          prop="amount"
          align="right"
          header-align="left"
        >
          <template #default="scope">
            {{ priceDisplay(scope.row?.amount) }}{{ $t("yen") }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="!GROUP_TYPE_STORE.SAME.includes(typeStore)"
          width="170px"
          :label="$t('total')"
          class-name="custom-column"
          prop="total"
          align="right"
          header-align="left"
        >
          <template #default="scope">
            {{ priceDisplay(scope.row?.total) }}{{ $t("yen") }}
          </template>
        </el-table-column>
      </el-table>
      <!-- Table Day -->
      <el-table
        v-if="props.mode === TYPE_DAY"
        class="table-content"
        max-height="calc(100vh - 58px - 70px - 192px - 100px)"
        :empty-text="noData"
        :data="customData"
        border
        :default-sort="defaultSort"
        :span-method="objectSpanMethod"
        @sort-change="headerSort"
      >
        <el-table-column
          min-width="100px"
          :label="$t('sale_month')"
          class-name="custom-column"
          prop="day"
          align="center"
          :sortable="true"
          :sort-orders="['ascending', 'descending']"
        >
          <template #default="scope">
            <span class="ellipsis"> {{ formatDate(scope.row.day) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100px"
          :label="$t('payment_type')"
          class-name="custom-column"
          prop="payment_type"
          align="center"
        >
          <template #default="scope">
            <span class="ellipsis">
              {{
                findObj(PaymentMethod, "value", scope.row.payment_type)?.label
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          v-if="typeStore === RESTAURANT"
          min-width="100px"
          :label="$t('course')"
          class-name="custom-column"
          prop="course"
          align="center"
        >
          <template #default="scope">
            {{ scope.row?.course?.course_name }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="typeStore === EVENT"
          min-width="100px"
          :label="$t('event')"
          class-name="custom-column"
          prop="course"
          align="center"
        >
          <template #default="scope">
            {{ scope.row?.event?.name }}
          </template>
        </el-table-column>
        <el-table-column
          width="150px"
          :label="$t('amount_money')"
          class-name="custom-column"
          prop="amount"
          align="right"
          header-align="left"
        >
          <template #default="scope">
            {{ priceDisplay(scope.row?.amount) }}{{ $t("yen") }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="!GROUP_TYPE_STORE.SAME.includes(typeStore)"
          width="170px"
          :label="$t('total')"
          class-name="custom-column"
          prop="total"
          align="right"
          header-align="left"
        >
          <template #default="scope">
            {{ priceDisplay(scope.row?.total) }}{{ $t("yen") }}
          </template>
        </el-table-column>
      </el-table>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { formatDate } from "~/../../src/shared/utils/format";
import { findObj } from "~/../../src/shared/utils/array";
import {
  PaymentMethod,
  searchDatePayment,
} from "../../../shared/constants/payment";
import { SALON } from "~/../../src/shared/constants/category";

import {
  SORT_ORDER,
  TYPE_DAY,
  TYPE_MONTH,
  TYPE_WEEK,
} from "~/../../src/shared/constants";
import priceDisplay from "../../../shared/utils/price";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { toRefs, ref, watch, computed } from "vue";
import { getTypeSort } from "~/../../src/shared/utils";
import { TableColumnCtx } from "element-plus";
import { useMeStore } from "~/../../src/shared/stores/me";
import { EVENT, RESTAURANT } from "~/../../src/shared/constants/category";
import { GROUP_TYPE_STORE } from "~/../../src/shared/constants/typeStore";

const typeStore = useMeStore().getTypeStore;
const { t } = i18n.global;

interface Prop {
  noData: string;
  tableData: [];
  mode: string;
}

interface CustomDate {
  total: string;
  date: string;
}
const sortTable = {
  order_by: "created_at",
  direct: SORT_ORDER.DESC,
  mode: null,
};
const emits = defineEmits(["headerSort"]);

const customData = ref();
const props = defineProps<Prop>();
const type = ref(null);
const { noData, tableData, mode } = toRefs(props);

const headerSort = ({ order }: { order: string }) => {
  emits("headerSort", { order });
};

const defaultSort = computed(() => {
  return {
    prop: sortTable.order_by,
    order: getTypeSort(sortTable.direct),
  };
});
let diffIndex = 0;

watch([tableData, mode], async ([newVal, newMode]) => {
  if (mode.value === TYPE_MONTH) {
    type.value = t("monday");
    diffIndex = 0;
  } else if (mode.value === TYPE_WEEK) {
    type.value = t("week");
    diffIndex = 0;
  } else if (mode.value === TYPE_DAY) {
    type.value = t("date");
    diffIndex = 0;
  }
  propertys[0] = newMode;
  customData.value = JSON.parse(JSON.stringify(newVal));
  customData.value = customData.value?.map((item, index) => {
    item = customDataTable(item, index);
    return item;
  });
});

const propertys = [mode.value, "payment_type"];

/**
 * @param currentRow = {...}
 * @param index: value (index of currentRow)
 * @return currentRow: currentRow add column total
 */
const customDataTable = (currentRow, index) => {
  if (index == 0) {
    currentRow.total = currentRow.amount || 0;
    return currentRow;
  } else {
    const preRow = customData.value[index - 1];
    let total = currentRow.amount || 0;

    if (
      (propertys.filter((prop) => currentRow[prop] === preRow[prop]).length ||
        0) === propertys.length
    ) {
      for (let i = diffIndex; i <= index - 1; i++) {
        customData.value[i].total += total;
      }

      currentRow.total = customData.value[index - 1].total;
    } else {
      diffIndex = index;
      currentRow.total = total;
    }

    return currentRow;
  }
};

interface User {
  date: string;
  payment_type: string;
  course: string;
  amount: number;
  total: number;
}

interface SpanMethodProps {
  row: User;
  column: TableColumnCtx<User>;
  rowIndex: number;
  columnIndex: number;
}
const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: SpanMethodProps) => {
  //The index of the column we want to merge
  if (![0, 1, 4].includes(columnIndex)) {
    return {
      rowspan: 1,
      colspan: 1,
    };
  }

  const dataTable = customData.value,
    property = column["property"]; /*get all property of table*/
  const tableLen = customData.value.length;
  let _row = 1,
    _col = 1;
  const preRow = dataTable[rowIndex - 1] || {};

  if (
    row[mode.value] === preRow[mode.value] &&
    row.year === preRow.year &&
    (property === mode.value ||
      (preRow[property] === row[property] &&
        row.payment_type === preRow.payment_type))
  ) {
    _row = 0;
  } else if (rowIndex + 1 < tableLen) {
    for (let i = rowIndex + 1; i < tableLen; i++) {
      const nextRow = dataTable[i];
      if (
        nextRow[mode.value] === row[mode.value] &&
        nextRow.year === row.year &&
        (property === mode.value ||
          (nextRow.payment_type === row.payment_type &&
            row[property] === nextRow[property]))
      ) {
        _row++;
      } else {
        break;
      }
    }
  }
  return {
    rowspan: _row,
    colspan: _col,
  };
};
</script>
