<template>
  <div class="show-more">
    <span>{{ textShow }}</span>
    <span
      v-if="!triggerShowMore && expanded"
      class="show-more-text"
      @click="onClick"
    >
      {{ moreText }}
    </span>
    <!--    <span-->
    <!--      v-else-if="triggerShowMore && expanded"-->
    <!--      class="show-more-text"-->
    <!--      @click="onClick"-->
    <!--    >-->
    <!--      {{ lessText }}-->
    <!--    </span>-->
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRefs } from "vue";
import { MAX_LENGTH_SHOW_TEXT } from "~/../../src/shared/utils/validate";

interface Prop {
  moreText: string;
  lessText: string;
  text: string;
  max: number;
}
const props = withDefaults(defineProps<Prop>(), {
  moreText: "",
  lessText: "",
  text: "",
  max: MAX_LENGTH_SHOW_TEXT,
});

const { text, max } = toRefs(props);
const expanded = computed(() => {
  return text.value.length > max.value;
});
const triggerShowMore = ref(false);

const onClick = () => {
  triggerShowMore.value = !triggerShowMore.value;
};

const textShow = computed(() => {
  if (!triggerShowMore.value) {
    return text.value.length > max.value
      ? text.value.slice(0, max.value) + "..."
      : text.value;
  }
  return text.value;
});
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
.show-more {
  white-space: pre-line;

  .show-more-text {
    cursor: pointer;
    color: $blue-medium;
  }
}
</style>
