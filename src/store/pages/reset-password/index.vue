<template>
  <Head>
    <Title>
      {{ $t("site_name_title") }}{{ $t("title_screen.reset_password") }}
    </Title>
  </Head>
  <div class="reset-password">
    <div class="main-content">
      <div class="form-header">
        <big-arxia-store />
        <h3 class="reset-password__title">{{ $t("reset_password") }}</h3>
      </div>
      <div class="box-text">
        <p class="text-desc">
          {{ $t("reset_password_notification.improve_the_security") }}
        </p>
        <p class="text-desc">
          {{ $t("reset_password_notification.characters") }}
        </p>
        <p class="text-desc">
          {{ $t("reset_password_notification.types_of_symbols") }}
        </p>
        <p class="text-desc">
          {{ $t("reset_password_notification.different_characters") }}
        </p>
        <p class="text-desc">
          {{ $t("reset_password_notification.include_at_least") }}
        </p>
      </div>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        class="demo-dynamic"
      >
        <div class="form-input password">
          <el-form-item
            prop="password"
            :error="errorData.password?.[0]"
            :inline-message="true"
          >
            <IconLock class="icon-input" />
            <InputPassword
              v-model="formData.password"
              :placeholder="$t('placeholder.password')"
              :formatter="(value) => `${value}`.replace(/\s/g, '')"
              @keyup.enter="submitForm(formRef)"
            />
          </el-form-item>
        </div>
        <div class="form-input password-confirm">
          <el-form-item
            prop="password_confirmation"
            :error="errorData.password_confirmation?.[0]"
            :inline-message="true"
          >
            <IconLock class="icon-input" />
            <InputPassword
              v-model="formData.password_confirmation"
              :formatter="(value) => `${value}`.replace(/\s/g, '')"
              :placeholder="$t('placeholder.password_confirmation')"
              @keyup.enter="submitForm(formRef)"
            />
          </el-form-item>
        </div>
        <div class="group-button">
          <main-button-store
            :loading="loading"
            :name="$t('button.setting')"
            @click="submitForm(formRef)"
            @keyup.enter="submitForm(formRef)"
          />
          <ButtonGray
            :name="$t('button.prev_login')"
            @click="redirectPageLogin"
            @keyup.enter="redirectPageLogin"
          />
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { FormInstance } from "element-plus";
import resetPasswordRules from "~/../../src/store/validates/resetPassword";
import { resetPasswordApi } from "~/../../src/shared/api/all/authApi";
import { useRouter, useRoute } from "#imports";
import InputPassword from "~/../../src/shared/components/input/InputPassword.vue";
import ButtonGray from "~/../../src/shared/components/button/ButtonGray.vue";
import {
  resetPasswordFailed,
  updateSuccess,
} from "~/../../src/shared/utils/notification";
import MainButtonStore from "~/../../src/shared/components/button/MainButtonStore.vue";
import BigArxiaStore from "~/../../src/shared/components/icon/BigArxiaStore.vue";

definePageMeta({ layout: "guest" });

const router = useRouter();
const route = useRoute();
const formRef = ref<FormInstance>();
const loading = ref(false);
const errorData = ref({});

const { formData, rules } = resetPasswordRules();

const submitForm = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        await resetPasswordApi({
          ...formData,
          token: route.query.token,
        });
        updateSuccess();
        await router.push({ path: "/login" });
      } catch (e) {
        resetPasswordFailed();
      } finally {
        loading.value = false;
      }
    }
  });
};

const redirectPageLogin = () => {
  router.push({ path: "/login" });
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.reset-password {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $bg-guest;

  .main-content {
    width: 400px;

    .el-form-item__error--inline {
      margin-left: 0;
    }

    .form-header {
      text-align: center;
    }

    .box-text {
      font-size: 14px;
    }

    .reset-password__title {
      font-size: 20px;
      font-weight: 500;
      margin: 25px 0;
    }

    .text-notification {
      margin: 20px 0;
    }

    .text-desc {
      color: $black-60;
      line-height: 23px;
    }

    .text-note {
      margin-top: 17px;
      font-size: 12px;
    }

    .form-input {
      margin: 24px 0;

      :deep(.el-form-item) {
        margin-bottom: 0;
        width: 400px;

        .el-input__inner {
          margin-left: 30px;
        }
      }

      .text-label {
        margin-bottom: 10px;
      }

      .form-item {
        position: relative;
      }

      .icon-input {
        position: absolute;
        z-index: 99;
        left: 15px;
        top: 10px;
      }
    }

    .button-submit {
      width: 400px;
      margin-left: 0;
      margin-bottom: 24px;
    }

    .back-login {
      text-align: center;
      margin-top: 32px;

      a {
        text-decoration: none;
      }
    }
  }
}
</style>
