<template>
  <div class="staff">
    <div v-for="item in staff" :key="item.id" class="staff-content">
      <StoreStaff
        :staff="item"
        :is-disabled="isDisabled"
        @handle-click-staff="handleClickStaff"
        @show-image="showImage"
      />
    </div>
    <store-show-image
      v-model:dialog-visible="dialogVisible"
      :disable="isDisabled"
      :url="imageUrl"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs } from "vue";
import { StaffModel } from "~/../../src/front/models";
import ButtonRed from "~/../../src/shared/components/button/ButtonRed.vue";
import ButtonCommon from "~/src/shared/components/button/ButtonCommon.vue";

interface Prop {
  staff: StaffModel[];
  isDisabled?: boolean;
}
const props = defineProps<Prop>();
const { staff } = toRefs(props);
const dialogVisible = ref(false);
const imageUrl = ref("");

const emits = defineEmits(["handleClickStaff"]);

const handleClickStaff = (id: number) => {
  emits("handleClickStaff", id);
};

const showImage = (url: string) => {
  if (url) {
    imageUrl.value = url;
    dialogVisible.value = true;
  }
};
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.staff {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  .staff-content {
    width: calc(100% / 5 - 9.6px);
    margin-right: 12px;
    margin-bottom: 12px;

    &:nth-child(5n) {
      margin-right: 0;
    }
  }
}

@media screen and (min-width: 1400px) and (max-width: 1600px) {
  .staff {
    .staff-content {
      width: calc(100% / 4 - 16px);

      &:nth-child(5n) {
        margin-right: 12px;
      }

      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
}

@media screen and (min-width: 1200px) and (max-width: 1400px) {
  .staff {
    .staff-content {
      width: calc(100% / 3 - 8px);

      &:nth-child(5n) {
        margin-right: 12px;
      }

      &:nth-child(3n) {
        margin-right: 0;
      }

      &:nth-child(15n) {
        margin-right: 0;
      }
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .staff {
    .staff-content {
      width: calc(100% / 2 - 6px);

      &:nth-child(5n) {
        margin-right: 12px;
      }

      &:nth-child(2n) {
        margin-right: 0;
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .staff {
    padding: 0 16px;
  }
}
</style>
