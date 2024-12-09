<template>
  <div class="custom-table">
    <!--
height header: 58px
padding store-content: 20px
header-content + margin-bottom: 50px
padding-top content : 20px
search : 60px
footer : 72px
-->
    <el-table
      class="table-content"
      :data="tableData"
      border
      max-height="calc(100vh - 58px - 20px * 2 - 50px - 20px - 60px - 72px)"
    >
      <el-table-column
        v-for="column in columnData"
        :key="column.prop"
        :label="column.label"
        :prop="column.prop"
        :width="column.width"
        :min-width="column.minWidth"
        :class-name="column.className"
      />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ColumnTableData } from "~/../../src/store/models/table";

interface Prop {
  tableData: [];
  columnData: ColumnTableData[];
}

defineProps<Prop>();
</script>

<style lang="scss" scoped>
@use "~/../../src/store/assets/scss/variables.scss" as *;
</style>
