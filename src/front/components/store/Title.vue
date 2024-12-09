<template>
  <div class="store-title">
    {{ title }}
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
const { title } = toRefs(props);
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.store-title {
  width: 100%;
  line-height: 44px;
  font-size: 15px;
  background: $yellow-40;
  font-weight: 700;
  color: $yellow-color;
  padding: 0 16px;
}
</style>
