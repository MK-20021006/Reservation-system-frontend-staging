<template>
  <div class="confirm-container">
    <p class="register-sms__confirm">{{ $t("front.register_sms_confirm") }}</p>
    <p class="confirm-sms">{{ $t("front.confirm_sms") }}</p>
    <el-form
      ref="formRef"
      :model="formConfirm"
      :rules="ruleCode"
      class="input__code d-flex align-items-center"
    >
      <label for="code" class="label__code">
        <span>{{ $t("front.confirmation_code") }}</span>
      </label>
      <el-form-item prop="code">
        <InputCode
          v-model="formConfirm.code"
          class="input__code-detail"
          :maxlength="MAX_LENGTH_SMS_CODE"
          :placeholder="$t('front.placeholder_digital_code')"
        ></InputCode
      ></el-form-item>
    </el-form>
    <a href="#" @click="resend">{{ $t("front.resend_sms") }}</a>
    <div class="text-center">
      <button-yellow
        class="btn__confirm"
        :name="$t('front.confirm')"
        :loading="loading"
        @click="confirm(formRef)"
      >
      </button-yellow>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from "vue";
import {
  resendVerify,
  verifySms,
} from "~/../../src/shared/requests/RegisterRequest";
import ruleCode from "../../validate/codeSms";
import { FormInstance } from "element-plus";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { MAX_LENGTH_SMS_CODE } from "~/../../src/shared/utils/validate";
import InputCode from "~/../../src/shared/components/input/Code.vue";
import ButtonYellow from "~/../../src/shared/components/button/ButtonYellow.vue";
import {
  messageSuccess,
  messageError,
} from "~/../../src/shared/utils/notification";
import { persistKeys } from "~~/../../src/shared/constants/persist-key";
import { useCookie, useRouter } from "nuxt/app";
import { useMeStore } from "~/../../src/shared/stores/me";

interface Prop {
  currentStep: number;
}
const cookieToken = useCookie(persistKeys.ACCESS_TOKEN);
const router = useRouter();
const meStore = useMeStore();
const prop = defineProps<Prop>();
const userId = localStorage.getItem("id");
const formRef = ref<FormInstance>();
const formConfirm = reactive({
  code: "",
});

const loading = ref(false);
const { t } = i18n.global;
const emits = defineEmits(["handleCurrentStep"]);

const confirm = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const data: any = await verifySms(formConfirm, +userId);
        if (!data.data.verify) {
          messageError("message_sms_verify");
        } else {
          cookieToken.value = data.data.verify;
          await nextTick(async () => {
            await meStore.fetchUpdate();
          });
          emits("handleCurrentStep");
        }
      } catch (e) {
      } finally {
        loading.value = false;
      }
    }
  });
};

const resend = async () => {
  const body = {
    type: "email-otp",
  };
  try {
    const data = await resendVerify(body, userId);
    if (data.data === false) {
      messageError("errors.resend_failed"); //resend failed
      return;
    } else {
      messageSuccess("success.resend_success");
    }
  } catch (error: any) {
    messageError("errors.resend_error"); //wait 2 minutes
    return;
  }
};
</script>

<style lang="scss" scoped>
@use "../../../shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../src/front/assets/scss/variables" as *;

.confirm-container {
  width: 874px;

  a {
    padding-left: 160px;
    color: #0066cc;
    margin-bottom: 24px;
  }

  .register-sms__confirm {
    font-weight: 700;
    margin-bottom: 24px;
    font-size: 16px;
    line-height: 24px;
  }

  .confirm-sms {
    font-size: 16px;
    line-height: 30px;
    color: $black-60;
    margin-bottom: 24px;
  }

  .input__code {
    margin-bottom: 16px;

    .label__code {
      flex-basis: 190px;
      font-size: 16px;
      line-height: 24px;

      &::after {
        content: "*";
        color: var(--el-color-danger);
        margin-left: 4px;
      }
    }
  }

  .btn__confirm {
    width: 96px;
  }
}

:deep(.el-form-item) {
  margin-bottom: 0;
  width: 100%;
}

:deep(.el-input__wrapper) {
  height: 40px;
  border: 1px solid #dcdcdc;
  border-radius: 3px;
  padding: 8px 16px;
}

:deep(.el-input__inner) {
  padding: 0;
}

@include res("sm-and-down", $breakpoints-spec) {
  .confirm-container {
    width: 80vw;

    a {
      padding-left: 0;
    }

    .register-sms__confirm {
      margin-bottom: 9px;
    }

    .input__code {
      display: block;
      margin-bottom: 24px;

      .label__code {
        margin-bottom: 8px;
      }
    }
  }
}
</style>
