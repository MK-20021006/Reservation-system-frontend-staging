<template>
  <div class="completion-container">
    <IconCheck class="icon-check"></IconCheck>
    <div class="notification-success text-center text-no-wrap">
      {{ $t("front.member_registration_completed") }}
    </div>
    <button-yellow
      class="btn-next"
      width="160px"
      :name="$t('button.next')"
      @click="handleSubmit"
    ></button-yellow>
  </div>
</template>

<script type="ts" setup>
import ButtonYellow from "../../../shared/components/button/ButtonYellow.vue";

const emits = defineEmits([
  "handleRedirect",
]);

const handleSubmit = async () =>{
  emits("handleRedirect");
}
</script>

<style lang="scss" scoped>
@use "../../../shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../src/front/assets/scss/variables" as *;

.completion-container {
  margin: 0 auto;

  .icon-check {
    margin: auto auto 24px;
  }

  .notification-success {
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 24px;
  }

  :deep(.el-button) {
    margin: auto;
  }

  .btn-next {
    margin-bottom: 64px;
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .icon-check {
    margin-bottom: 24px !important;
  }

  .btn-next {
    margin-bottom: 24px !important;
  }

  .notification-success {
    margin-bottom: 24px !important;
  }
}
</style>
