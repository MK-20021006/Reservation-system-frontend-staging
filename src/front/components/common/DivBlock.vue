<template>
  <div class="div-block">
    <div
      class="label-text"
      :class="{ 'required-field': isRequired, className: className }"
    >
      {{ $t(label) }}
    </div>
    <slot name="form-item"></slot>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

interface Prop {
  label: string;
  isRequired?: boolean;
  className?: string;
}

withDefaults(defineProps<Prop>(), {
  label: "",
  isRequired: false,
  className: "",
});
</script>

<style lang="scss" scoped>
.div-block {
  .label-text {
    padding-bottom: 8px;
    font-size: 14px;
    line-height: 22px;
  }
}
</style>
