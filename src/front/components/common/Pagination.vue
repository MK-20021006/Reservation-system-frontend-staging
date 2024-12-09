<template>
  <div
    class="custom-pagination d-flex justify-content-between align-items-center"
  >
    <div class="pagination-sizes">
      <ClientOnly>
        <el-select
          v-if="total > 0"
          v-model="pageSize"
          @change="handleSizeChange"
        >
          <el-option
            v-for="size in arrayPageSize"
            :key="size"
            :label="`${size}/page`"
            :value="size"
          />
        </el-select>
      </ClientOnly>
    </div>
    <el-pagination
      v-if="total > 0"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="total"
      :pager-count="paperCount"
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, watchEffect } from "vue";
import { CUSTOMER_PAGINATION } from "~/../../src/shared/constants";

interface Prop {
  arrayPageSize?: number[];
  paperCount?: number;
  defaultRecord?: number;
  currentPage?: number;
  total: number;
}

const props = withDefaults(defineProps<Prop>(), {
  arrayPageSize: () => [10, 50, 100],
  paperCount: 7,
  defaultRecord: CUSTOMER_PAGINATION.PER_PAGE,
  currentPage: 1,
  total: 0,
});

const { defaultRecord, currentPage } = toRefs(props);
const emits = defineEmits(["handleSizeChange", "handleCurrentChange"]);
const pageSize = ref(defaultRecord.value);

const handleSizeChange = (val: number) => {
  emits("handleSizeChange", val);
};

watchEffect(() => {
  pageSize.value = defaultRecord.value;
});

const handleCurrentChange = (val: number) => {
  emits("handleCurrentChange", val);
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.custom-pagination {
  width: 100%;

  .pagination-sizes {
    .el-select {
      width: 128px;
      height: 32px;
    }
  }

  :deep(.el-pagination.is-background) {
    .el-pager {
      li {
        --el-text-color-regular: $red-color;
        border-radius: 2px !important;

        &.is-active {
          color: $white-color;
          background-color: $red-color;
        }

        &:not(.is-active):hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
