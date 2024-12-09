<template>
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
  />
  <svg v-else :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts" setup>
import { computed, defineProps, toRefs } from "vue";

interface Prop {
  iconClass?: string;
  className: string;
}
const props = withDefaults(defineProps<Prop>(), {
  iconClass: "",
  className: "",
});
const { iconClass, className } = toRefs(props);

const isExternal = computed(() => {
  return /^(https?:|mailto:|tel:)/.test(iconClass.value);
});

const iconName = computed(() => {
  return `#icon-${iconClass.value}`;
});

const svgClass = computed(() => {
  if (className.value) {
    return "svg-icon " + className.value;
  }
  return "svg-icon";
});

const styleExternalIcon = computed(() => {
  return {
    mask: `url(${iconClass.value}) no-repeat 50% 50%`,
    "-webkit-mask": `url(${iconClass.value}) no-repeat 50% 50%`,
  };
});
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
