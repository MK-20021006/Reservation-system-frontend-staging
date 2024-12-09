<template>
  <div class="heath-check">
    {{ $t("health-check") }}
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import scrollToTop from "~/../../src/shared/utils/scroll";

definePageMeta({
  layout: "check",
});

onMounted(() => {
  scrollToTop();
});
</script>

<style lang="scss" scoped>
.heath-check {
  margin: auto;
  font-size: 25px;
  padding-top: 5px;
}
</style>
