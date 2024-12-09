<template>
  <div class="connect-template">
    <slot name="connect-type" />
    <div v-if="!isHiddenButtonSave" class="group-button">
      <button-common
        name="button.save"
        background-color="#409EFF"
        color="white"
        width="68px"
        :disabled="disabledSave"
        :loading="isLoadingSave"
        @click="saveData"
      />
      <button-common
        v-if="!isHiddenButtonConnect"
        name="store.button.communication_confirmation"
        background-color="#0071BC"
        color="white"
        width="96px"
        :disabled="disabledConnect"
        :loading="isLoadingConnect"
        @click="connectData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon";

interface Prop {
  isLoadingConnect?: boolean;
  isLoadingSave?: boolean;
  disabledConnect?: boolean;
  disabledSave?: boolean;
  isHiddenButtonConnect?: boolean;
  isHiddenButtonSave?: boolean;
}

withDefaults(defineProps<Prop>(), {
  isLoadingConnect: false,
  isLoadingSave: false,
  disabledConnect: false,
  disabledSave: false,
  isHiddenButtonConnect: false,
  isHiddenButtonSave: false,
});
const emit = defineEmits(["saveData", "connectData"]);

const saveData = () => {
  emit("saveData");
};

const connectData = () => {
  emit("connectData");
};
</script>

<style lang="scss" scoped>
@use "~/../../src/store/assets/scss/variables.scss" as *;

.connect-template {
  border-top: 1px solid $black-10;
  padding: 32px 32px 0 32px;

  .group-button {
    display: flex;
    justify-content: space-between;
    padding: 24px 0 0 0;
    border-top: 1px solid $black-10;
  }

  :deep(.input-password) {
    width: 400px;
  }

  :deep(.el-form-item) {
    margin-bottom: 24px;
  }

  :deep(.div-inline) {
    margin-bottom: 0;
  }
}
</style>
