<template>
  <div>
    <el-pagination
      :current-page="modelValue"
      class="custom-pagination"
      background
      layout="prev, pager, next"
      :pager-count="pagerCount"
      :total="total"
      :page-size="pageSize"
      @current-change="handleChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";
interface Prop {
  modelValue: number;
  total?: number;
  pageSize?: number;
  pagerCount?: number;
}
const props = withDefaults(defineProps<Prop>(), {
  total: 1000,
  modelValue: 1,
  pageSize: 10,
  pagerCount: 6,
});

const emits = defineEmits(["update:modelValue", "currentChange"]);
const { total, modelValue, pageSize, pagerCount } = toRefs(props);

const handleChange = (value) => {
  emits("update:modelValue", value);
  emits("currentChange", value);
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

:deep(.el-pagination) {
  --el-fill-color-blank: rgba(0, 0, 0, 0.1);
  --el-pagination-bg-color: rgba(0, 0, 0, 0.1);
  .el-pager li {
    border-radius: 2px !important;
  }

  .el-pager li.is-active {
    background: $btn-red !important;
  }
}
</style>
