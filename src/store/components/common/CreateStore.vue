<template>
  <div class="create-store-container">
    <div class="icon-logo">
      <big-arxia-store />
    </div>
    <div class="title text-center">{{ title }}</div>
    <el-scrollbar always>
      <div class="store-content">
        <slot name="store-content" />
      </div>
    </el-scrollbar>
    <div class="group-button">
      <slot name="group-button" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import BigArxiaStore from "~/../../src/shared/components/icon/BigArxiaStore.vue";

interface Prop {
  title?: string;
}

withDefaults(defineProps<Prop>(), {
  title: "",
});
</script>

<style scoped lang="scss">
@use "~/../../src/shared/assets/scss/variables" as *;

.create-store-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: $gray-400;
  height: 100vh;

  .el-scrollbar {
    width: 100%;
  }

  .icon-logo {
    padding-top: 42px;
  }

  .title {
    font-weight: 500;
    font-size: 24px;
    line-height: 36px;
    width: 100%;
    background-color: $gray-100;
    padding: 10px;
    margin-top: 20px;
  }

  .store-content {
    width: 100%;
    padding-top: 32px;
  }

  .group-button {
    width: 95%;
    border-top: 1px solid #0000001a;
    padding: 24px 0;
    display: flex;
    justify-content: flex-end;
  }

  :deep(& > .el-scrollbar) {
    height: calc(100vh - 106px - 56px - 20px - 89px);
    width: 100%;

    .el-scrollbar__view {
      display: grid;
      height: 100%;
    }
  }
}
</style>
