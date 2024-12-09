<template>
  <div class="area--search__header">
    <!-- START transportation -->
    <el-input
      v-model="storeSearch.headerSearch.transportation"
      v-input-trim
      class="input-custom"
      :placeholder="$t('front.areaStation')"
      :disabled="disabledButtonSearch"
      clearable
      @keyup.enter="handleClick"
      @input="handleChange"
    >
      <template #prefix>
        <div class="icon">
          <IconLocation />
        </div>
      </template>
    </el-input>
    <!-- END transportation -->
    <!-- START keyword_name -->
    <el-input
      v-model="storeSearch.headerSearch.keyword_name"
      v-input-trim
      class="input-custom"
      :placeholder="$t(placeHolderKeyWord)"
      :disabled="disabledButtonSearch"
      clearable
      @input="handleChange"
      @keyup.enter="handleClick"
    >
      <template #prefix>
        <div class="icon">
          <IconBeauSalon v-if="isSalon(type)" />
          <IconMenu v-else-if="isRestaurant(type)" />
          <IconMedicalCare v-else-if="isMedialCare(type)" />
          <IconClassRoom v-else-if="isClassRoom(type)" />
          <IconConsultation v-else-if="isConsultation(type)" />
          <IconEvent v-else-if="isEvent(type)" />
          <icon-home-white v-else />
        </div>
      </template>
    </el-input>
    <!-- END keyword_name -->
    <!-- START keyword_date -->
    <ClientOnly>
      <el-date-picker
        v-model="storeSearch.headerSearch.keyword_date"
        class="custom-date"
        type="date"
        format="YYYY年MM月DD日"
        value-format="YYYY-MM-DD"
        :placeholder="$t('date')"
        :prefix-icon="IconDatePicker"
        :editable="false"
        :clearable="false"
        :disabled-date="disableDate"
        :disabled="disabledButtonSearch"
        @change="handleChange"
      />
    </ClientOnly>
    <!-- END keyword_date -->
    <!-- START keyword_time -->
    <ClientOnly>
      <div class="box-search__time d-flex align-items-center">
        <icon-time-select class="icon-time-search" />
        <TimeHoursMinute
          v-model="storeSearch.headerSearch.keyword_time"
          class="custom--time__select"
          :placeholder="$t('time')"
          :disabled="disabledButtonSearch"
          @update:modelValue="handleChange"
        />
      </div>
    </ClientOnly>
    <!-- END keyword_time -->
    <el-button
      class="btn-search"
      :disabled="disabledButtonSearch"
      @click="handleClick"
    >
      <template #icon>
        <IconSearchButton />
      </template>
      {{ $t("button_search") }}
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, toRefs, watch } from "vue";
import { useCookie, useRoute, useRouter } from "nuxt/app";
import moment from "moment/moment";
import { useNuxtApp } from "#imports";

import IconTimeSelect from "~/../../src/front/components/Icon/TimeSelect.vue";
import IconDatePicker from "~/../../src/front/components/Icon/DatePicker.vue";
import TimeHoursMinute from "~/../../src/shared/components/select/TimeHoursMinute.vue";

import { useStoreSearch } from "~/../../src/front/store/store";
import {
  isClassRoom,
  isConsultation,
  isEvent,
  isMedialCare,
  isRestaurant,
  isSalon,
} from "~/../../src/shared/constants/typeStore";
import { persistKeys } from "~/../../src/shared/constants/persist-key";
import { useMeStore } from "~/../../src/shared/stores/me";

interface Prop {
  type: number;
  disabledButtonSearch?: boolean;
  propDataSearch?: any | null;
}

const prop = withDefaults(defineProps<Prop>(), {
  disabledButtonSearch: false,
  propDataSearch: null,
});

const { type, disabledButtonSearch } = toRefs(prop);

const emits = defineEmits(["handleClick", "fillConditionSearch"]);

const { $bus } = useNuxtApp();
const storeSearch = useStoreSearch();
const router = useRouter();
const meStore = useMeStore();

const placeHolderKeyWord = computed(() => {
  if (isSalon(type.value)) {
    return "front.keyword_salon";
  }
  if (isRestaurant(type.value)) {
    return "front.keyword";
  }
  if (isMedialCare(type.value)) {
    return "front.keyword_medial_care";
  }
  if (isEvent(type.value)) {
    return "front.keyword_event";
  }
  if (isConsultation(type.value)) {
    return "front.keyword_consultation";
  }
  if (isClassRoom(type.value)) {
    return "front.keyword_classroom";
  }
  return "front.keyword_portal";
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const disableDate = (date: any) => {
  return (
    moment(date).add(1, "day") < moment() ||
    moment(date) > moment().add(2, "month").endOf("month")
  );
};

const handleChange = () => {
  // TODO: Maybe not use
};

const handleClick = () => {
  storeSearch.headerSearch.district_id = null;
  storeSearch.headerSearch.conscious_id = null;
  storeSearch.headerSearch.island_id = null;
  storeSearch.headerSearch.village_id = null;
  storeSearch.headerSearch.is_map = null;
  meStore.setGeolocationPosition({
    latitude: null,
    longitude: null,
  });

  if (disabledButtonSearch.value) {
    return false;
  }

  $bus.$emit("searchStore");
  emits("handleClick");

  if (type.value === -1) {
    return;
  }

  if (useRoute().name === "store") {
    $bus.$emit("store", storeSearch.headerSearch);
  } else {
    router.push({ name: "store" });
  }
};
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

$background-input: #2d2d2d;
$box-shadow-color: #4e4e4e;
$color-input__inner: #ffffff;

.area--search__header {
  display: flex;
  gap: 16px 24px;
  padding: 16px 40px;

  .box-search__time {
    position: relative;

    .icon-time-search {
      position: absolute;
      left: 12px;
      z-index: 1;
    }

    :deep(.el-select .el-input__wrapper) {
      padding-left: 35px;
    }
  }

  .el-input {
    .icon {
      display: flex;
    }
  }

  :deep(.el-input, .el-input.is-disabled) {
    --el-input-height: 40px;

    &.input-custom {
      width: 320px;

      .el-input__wrapper {
        .el-input__prefix {
          .el-input__prefix-inner {
            color: red;
            :deep(.icon) {
              color: red;
              svg {
                width: 24px;
                height: 24px;
              }
            }
          }
        }
      }
    }

    .el-input__wrapper {
      background: $background-input;
      box-shadow: 0 0 0 1px $box-shadow-color;

      &:hover {
        box-shadow: 0 0 0 1px $box-shadow-color !important;
      }
    }

    .el-input__inner {
      color: $color-input__inner;
      -webkit-text-fill-color: $color-input__inner;
    }

    .el-input__inner::placeholder {
      color: $color-input__inner;
    }
  }

  :deep(.el-date-editor) {
    &.el-input {
      --el-date-editor-width: 200px;
    }
  }

  .el-select {
    width: 200px;
  }

  :deep(.el-radio__input) {
    .el-radio__inner {
      width: 18px;
      height: 18px;

      &:after {
        background-color: #0052d9;
        height: 9px;
        width: 9px;
      }
    }
  }

  :deep(.btn-search) {
    &.el-button,
    &.el-button.is-disabled {
      --el-button-bg-color: #b4985c;
      --el-border-color: #b4985c;
      --el-border-radius-base: 3px;
      --el-color-primary-light-9: rgba(180, 152, 92, 0.93);
      --el-text-color-regular: #ffffff;
      --el-color-primary: #ffffff;
      --el-font-weight-primary: 700;
      --el-button-disabled-border-color: #b4985c;
      --el-button-disabled-bg-color: #b4985c;
      --el-button-disabled-text-color: #ffffff;

      height: 40px;
      width: 200px;

      &:hover {
        border-color: var(--el-button-bg-color) !important;
      }
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .box-search__time {
    width: 100%;
  }
}

@include res("xs-only", $breakpoints-spec) {
  .area--search__header {
    flex-wrap: wrap;
  }
}
</style>
