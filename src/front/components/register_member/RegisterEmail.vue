<template>
  <div class="register-container justify-content-center">
    <p class="check__email">{{ $t("front.check_your_email") }}</p>
    <p class="confirm__email">
      {{ $t("front.notification_confirm_register") }}
    </p>
    <p class="note-text">※{{ $t("front.note") }}</p>
    <p class="note-text__detail">
      {{ $t("front.notification_check_mail") }}
    </p>
    <a href="#" @click="resend">{{ $t("front.resend_email") }}</a>
  </div>
</template>

<script lang="ts" setup>
import { resendVerify } from "../../../shared/requests/RegisterRequest";
import {
  messageSuccess,
  messageError,
} from "../../../shared/utils/notification";

const id = localStorage.getItem("id");
const resend = async () => {
  const body = {
    type: "email-otp",
  };
  try {
    const data = await resendVerify(body, id);
    if (data.data === false) {
      messageError("errors.resend_failed"); //resend failed
    } else {
      messageSuccess("success.resend_success");
    }
  } catch (error: any) {
    messageError("errors.resend_error"); //wait 2 minutes
  }
};
</script>

<style lang="scss" scoped>
@use "../../../shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../src/front/assets/scss/variables" as *;

.register-container {
  a {
    color: #0066cc;
  }

  .check__email {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 24px;
  }

  .confirm__email {
    font-size: 16px;
    line-height: 30px;
    color: $black-60;
    margin-bottom: 30px;
  }

  .note-text {
    font-weight: 700;
    font-size: 18px;
    line-height: 20px;
    margin-bottom: 24px;
  }

  .note-text__detail {
    font-size: 16px;
    line-height: 30px;
    color: $black-60;
    margin-bottom: 16px;
  }
}
@include res("sm-and-down", $breakpoints-spec) {
  .check__email {
    margin-bottom: 16px !important;
  }

  .confirm__email {
    margin-bottom: 24px !important;
  }

  .note-text {
    margin-bottom: 16px !important;
  }
}
</style>
