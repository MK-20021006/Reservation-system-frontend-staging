<template>
  <div class="heath-check">
    {{ $t("health-check") }}
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "check",
});
</script>

<style lang="scss" scoped>
.heath-check {
  margin: auto;
  font-size: 25px;
  padding-top: 5px;
}
</style>
