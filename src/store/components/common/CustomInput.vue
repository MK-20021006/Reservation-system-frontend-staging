<template>
  <div class="custom-select">
    <el-input v-model="value" :placeholder="$t('front.area_station')">
      <template #prefix>
        <div class="icon">
          <IconLocation />
        </div>
      </template>
    </el-input>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const value = ref("");
</script>

<style lang="scss" scoped>
$background-input: #2d2d2d;
$box-shadow-color: #4e4e4e;
$color-input__inner: #ffffff;

.custom-select {
  .el-input {
    .icon {
      display: flex;
    }
  }

  :deep(.el-input) {
    .el-input__wrapper {
      background: $background-input;
      box-shadow: 0 0 0 1px $box-shadow-color;
    }

    .el-input__inner {
      color: $color-input__inner;
    }

    .el-input__inner::placeholder {
      color: $color-input__inner;
    }
  }
}
</style>
