<template>
  <Head>
    <Title
      >{{ $t("site_name_title")
      }}{{ $t("title_screen.change_password") }}</Title
    >
  </Head>
  <ClientOnly>
    <Teleport to="#breadcrumb">
      <span key="1">
        <StoreBreadCrum :data-title="dataTitle" />
      </span>
    </Teleport>
  </ClientOnly>

  <div class="reset-password">
    <div class="main-content">
      <div class="title text-center">
        {{ $t("title_screen.change_password") }}
      </div>
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
        :rules="passwordRules"
        class="demo-dynamic"
        @keyup.enter="submitForm(formRef)"
      >
        <div class="form-input password">
          <div class="text-label required-field">
            {{ $t("placeholder.current_password") }}
          </div>
          <el-form-item
            prop="current_password"
            :error="errorData?.current_password?.[0]"
            :inline-message="true"
          >
            <InputPassword
              v-model="formData.current_password"
              :placeholder="$t('placeholder.current_password')"
              :formatter="(value) => `${value}`.replace(/\s/g, '')"
            />
          </el-form-item>
        </div>
        <div class="form-input password">
          <div class="text-label required-field">
            {{ $t("new_password") }}
          </div>
          <el-form-item
            prop="password"
            :error="errorData?.password?.[0]"
            :inline-message="true"
          >
            <InputPassword
              v-model="formData.password"
              :placeholder="$t('placeholder.new_password')"
              :formatter="(value) => `${value}`.replace(/\s/g, '')"
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
            :error="errorData?.password_confirmation?.[0]"
            :inline-message="true"
          >
            <InputPassword
              v-model="formData.password_confirmation"
              :placeholder="$t('placeholder.password_confirmation')"
              :formatter="(value) => `${value}`.replace(/\s/g, '')"
            />
          </el-form-item>
        </div>
        <div class="group-button text-center">
          <ButtonYellow
            :loading="loading"
            :width="'108px'"
            :name="$t('button.setting')"
            @click="submitForm(formRef)"
            @keyup.enter="submitForm(formRef)"
          />
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { FormInstance } from "element-plus";
import { i18n } from "../../shared/plugins/i18n";
import ButtonYellow from "~/../../src/shared/components/button/ButtonYellow.vue";
import scrollToTop from "~/../../src/shared/utils/scroll";
import changePasswordRules from "~/../../src/front/validate/changePassword";
import { changePasswordApi } from "~/../../src/shared/api/all/authApi";
import { updateSuccess } from "~/../../src/shared/utils/notification";
import InputPassword from "~/../../src/shared/components/input/InputPassword.vue";
import { useMeStore } from "~/../../src/shared/stores/me";
import { useRouter } from "#imports";

definePageMeta({
  activeSidebar: {
    parentName: "change-password",
  },
  middleware: ["auth"],
});

const { t } = i18n.global;
const formRef = ref<FormInstance>();
const errorData = ref({});
const loading = ref(false);
const meStore = useMeStore();
const router = useRouter();

if (meStore?.info?.is_login_social) {
  router.push({ path: "/" });
}

const dataTitle = reactive([
  { name: t("title_screen.change_password"), path: "" },
]);

const { formData, passwordRules } = changePasswordRules();

const submitForm = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        errorData.value = {};
        await changePasswordApi({
          ...formData,
        });
        updateSuccess();
        formData.current_password = null;
        formData.password = null;
        formData.password_confirmation = null;
      } catch (error) {
        errorData.value = error?.data?.errors;
      } finally {
        loading.value = false;
      }
    }
  });
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

  .title {
    font-weight: 500;
    font-size: 20px;
    margin: 32px 0;
  }
  s .image-logo {
    text-align: center;
    margin-bottom: 28px;
  }

  .main-content {
    width: 572px;
    margin-bottom: 32px;

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
