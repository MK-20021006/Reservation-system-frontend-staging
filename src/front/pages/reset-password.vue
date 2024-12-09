<template>
  <Head>
    <Title>
      {{ $t("site_name_title") }}{{ $t("title_screen.reset_password") }}
    </Title>
  </Head>
  <ClientOnly>
    <Teleport to="#breadcrumb">
      <span key="1">
        <StoreBreadCrum :data-title="dataTitle" />
      </span>
    </Teleport>
  </ClientOnly>
  <div class="reset-password">
    <div v-if="!isSuccess" class="main-content">
      <h3 class="reset-password__title">{{ $t("reset_password") }}</h3>
      <p class="text-desc text-notification">
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
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        class="demo-dynamic"
      >
        <div class="form-input password">
          <div class="text-label required-field">
            {{ $t("new_password") }}
          </div>
          <el-form-item
            prop="password"
            :error="errorData.password?.[0]"
            :inline-message="true"
          >
            <InputPassword
              v-model="formData.password"
              :placeholder="$t('placeholder.password')"
              :formatter="(value) => `${value}`.replace(/\s/g, '')"
              @keyup.enter="submitForm(formRef)"
            />
          </el-form-item>
          <div class="text-note">{{ $t("front.note_format_password") }}</div>
        </div>
        <div class="form-input password-confirm">
          <div class="text-label required-field">
            {{ $t("new_password_confirm") }}
          </div>
          <el-form-item
            prop="password_confirmation"
            :error="errorData.password_confirmation?.[0]"
            :inline-message="true"
          >
            <InputPassword
              v-model="formData.password_confirmation"
              :placeholder="$t('placeholder.password_confirmation')"
              :formatter="(value) => `${value}`.replace(/\s/g, '')"
              @keyup.enter="submitForm(formRef)"
            />
          </el-form-item>
        </div>
        <div class="group-button">
          <ButtonYellow
            :loading="loading"
            :width="'108px'"
            :name="$t('button.next')"
            @click="submitForm(formRef)"
            @keyup.enter="submitForm(formRef)"
          />
        </div>
      </el-form>
    </div>
    <div v-else class="main-content submit-success">
      <div class="image-logo">
        <IconLogoLogin />
      </div>
      <h3 class="reset-password__title">
        {{ $t("front.title_reset_password_success") }}
      </h3>
      <p class="text-desc text-submit__success">
        {{ $t("front.text_reset_password_success") }}
      </p>
      <div class="group-button">
        <ButtonYellow
          :width="'136px'"
          :name="$t('button.login')"
          @click="redirectPageLogin"
          @keyup.enter="redirectPageLogin"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
import resetPasswordRules from "../validate/resetPassword";
import { onMounted, useRoute, useRouter } from "#imports";
import { resetPasswordApi } from "../../shared/api/all/authApi";
import ButtonYellow from "../../shared/components/button/ButtonYellow.vue";
import InputPassword from "../../shared/components/input/InputPassword.vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import {
  resetPasswordFailed,
  updateSuccess,
} from "~/../../src/shared/utils/notification";
import IconLogoLogin from "~/../../src/shared/components/icon/IconLogoLogin";
import { useCookie } from "#app";
import { persistKeys } from "~/../../src/shared/constants/persist-key";
import scrollToTop from "~/../../src/shared/utils/scroll";

const router = useRouter();
const route = useRoute();
const formRef = ref<FormInstance>();
const loading = ref(false);
const errorData = ref({});
const isSuccess = ref(false);
const { t } = i18n.global;
const dataTitle = reactive([
  { name: t("title_screen.forgot_pass") + "?", path: "" },
]);

const cookieToken = useCookie(persistKeys.ACCESS_TOKEN, {
  secure: true,
  sameSite: "none",
});

if (cookieToken.value) {
  router.push({ path: "/" });
}

const { formData, rules } = resetPasswordRules();

const submitForm = async (form: FormInstance | undefined) => {
  if (!form) return;
  errorData.value = {};
  await form.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        await resetPasswordApi({
          ...formData,
          token: route.query.token,
        });
        updateSuccess();
        isSuccess.value = true;
      } catch (e) {
        resetPasswordFailed();
      } finally {
        scrollToTop();
        loading.value = false;
      }
    }
  });
};

const redirectPageLogin = () => {
  router.push({ path: "/login" });
};

onMounted(() => {
  scrollToTop();
});
</script>

<style lang="scss" scoped>
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../assets/scss/variables" as *;

.reset-password {
  margin: 0 auto;

  .image-logo {
    text-align: center;
    margin-bottom: 28px;
  }

  .main-content {
    width: 572px;
    margin: 64px 0;

    .reset-password__title {
      font-size: 16px;
      font-weight: 700;
    }

    .text-notification {
      margin: 20px 0;
    }

    .text-desc {
      color: $black-60;
      line-height: 23px;
    }

    .text-note {
      margin-top: 5px;
      font-size: 12px;
    }

    .form-input {
      margin: 24px 0;

      :deep(.el-form-item) {
        margin-bottom: 0;
      }
      .text-label {
        margin-bottom: 10px;
        color: $black-90;
      }
    }

    .group-button {
      text-align: center;

      .button-submit {
        margin-top: 24px;
      }

      .button-login {
        text-decoration: none;
      }
    }
  }

  .submit-success {
    text-align: center;

    .text-submit__success {
      margin-top: 16px;
    }
  }

  :deep(.el-form-item__error--inline) {
    margin-left: 0;
  }
}

@include res("xs-only", $breakpoints-spec) {
  .reset-password {
    display: flex;
    justify-content: center;
    font-size: 14px;

    .main-content {
      width: 327px;
    }
  }
}
</style>
