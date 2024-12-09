<template>
  <div :class="[{ search: isSearch }, { 'is-disable-click': isDisabled }]">
    <div class="breadcrumb-mobile">
      <div class="title-close" :class="className" @click="handleClose">
        <slot name="icon"></slot>
        {{ titleClose }}
      </div>
      <div class="title">{{ title }}</div>
      <div></div>
      <div v-if="isIcon" class="icon-filter d-flex" @click="handleClick">
        <icon-filter />
      </div>
      <slot name="show-icon"></slot>
    </div>
    <slot name="filter-value" />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs, ref, watch, onMounted } from "vue";
import { useDeviceStore } from "../../store/device";
import { useRoute } from "#imports";

const deviceTable = useDeviceStore();
const isDisabled = ref(false);
const route = useRoute();
const height = deviceTable.heightMenu + "px";

const emits = defineEmits(["handleClickFilter", "handleClose"]);
interface Prop {
  titleClose: string;
  title: string;
  isIcon: boolean;
  isSearch: boolean;
  className: string;
}
const props = withDefaults(defineProps<Prop>(), {
  titleClose: "",
  title: "",
  isIcon: false,
  isSearch: false,
  className: "",
});
const handleClick = () => {
  emits("handleClickFilter");
};

if (route.query?.is_preview) {
  isDisabled.value = true;
}

const handleClose = () => {
  emits("handleClose");
};

const { titleClose, title, isIcon } = toRefs(props);
</script>

<style lang="scss" scoped>
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../../assets/scss/variables" as *;

.search {
  height: calc(100vh - v-bind(height));
}

.is-disable-click {
  pointer-events: none;
}

.breadcrumb-mobile {
  display: flex;
  width: 100%;
  padding: 16px 19px;
  background: $white-color;
  justify-content: space-between;
  align-items: center;

  .title-close {
    cursor: pointer;
    color: $black-15;
  }

  .detail-store {
    width: 100%;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  }

  .title-breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .icon-home {
      margin-right: 14px;
    }

    .el-breadcrumb {
      .custom-item {
        :deep(.is-link) {
          color: $black-10;

          &:hover {
            color: $black-100;
          }
        }
      }

      :deep(.breadcrumb__inner) {
        color: $black-15;
      }
    }
  }

  .icon-filter {
    &:hover {
      :deep(svg) {
        path {
          fill: #b4985c;
        }
      }
    }
  }
}
</style>
