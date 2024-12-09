<template>
  <div class="container-show-more" :style="additionalContainerCss">
    <!-- eslint-disable -->
    <div ref="_refDetail" v-bind:class="{'default': !expanded, 'expanded': expanded}"
         v-bind:style="`--lines: ${lines}`">
      <div v-bind:style="additionalCss">
        {{ text }}
      </div>
    </div>
    <!-- eslint-enable -->
    <a
      v-if="hasMore && triggerShowMore"
      class="anchor"
      :style="additionalAnchorCss"
      @click="onClick"
      >{{ moreText }}</a
    >
    <!--    <a-->
    <!--      v-if="hasMore && expanded"-->
    <!--      class="anchor"-->
    <!--      :style="additionalAnchorCss"-->
    <!--      @click="onClick"-->
    <!--      >{{ lessText }}</a-->
    <!--    >-->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, onUpdated, nextTick, toRefs } from "vue";

const emits = defineEmits(["click"]);
interface Prop {
  lines: number;
  text: string;
  additionalContainerCss: string;
  additionalContentCss: string;
  additionalContentExpandedCss: string;
  hasMore: boolean;
  moreText: string;
  lessText?: string;
  additionalAnchorCss: string;
}

const props = withDefaults(defineProps<Prop>(), {
  lines: 3,
  text: "",
  additionalContainerCss: "",
  additionalContentCss: "",
  additionalContentExpandedCss: "",
  hasMore: true,
  moreText: "",
  lessText: "",
  additionalAnchorCss: "",
});

const { additionalContentCss, additionalContentExpandedCss } = toRefs(props);

const expanded = ref(false);
const triggerShowMore = ref(false);
const _refDetail = ref();

const additionalCss = computed(() => {
  if (expanded.value) {
    return additionalContentCss.value;
  }
  return additionalContentExpandedCss.value;
});

const onClick = () => {
  expanded.value = !expanded.value;
};

const determineShowMore = () => {
  if (
    _refDetail.value &&
    _refDetail.value.offsetHeight < _refDetail.value.scrollHeight
  ) {
    triggerShowMore.value = true;
  } else {
    triggerShowMore.value = false;
  }
};

onMounted(() => {
  nextTick(() => {
    determineShowMore();
  });
});

onUpdated(() => {
  nextTick(() => {
    determineShowMore();
  });
});
</script>
<style lang="scss" scoped>
.container-show-more {
  .default {
    --lines: 3;
    white-space: pre-line;
    display: -webkit-box;
    max-width: 100%;
    -webkit-line-clamp: var(--lines);
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .expanded {
    display: block;
    display: -webkit-box;
    white-space: pre-line;
  }

  .anchor {
    display: block;
    text-align: left;
    font-size: 12px;
    color: #0066cc;
    cursor: pointer;
  }
}
</style>
