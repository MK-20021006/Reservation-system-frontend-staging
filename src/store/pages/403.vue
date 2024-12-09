<template>
  <div class="not-found">
    <h1>403</h1>
    <el-button type="primary" @click="$router.push({ name: 'index' })">{{
      $t("button.go_to_home")
    }}</el-button>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "guest",
});
</script>

<style lang="scss" scoped>
.not-found {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  h1 {
    font-size: 10rem;
    line-height: 1;
    font-weight: 700;
  }
}
</style>
