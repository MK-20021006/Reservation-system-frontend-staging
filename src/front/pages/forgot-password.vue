<template>
  <Head>
    <Title>
      {{ $t("site_name_title") }}{{ $t("title_screen.forgot_pass") }}
    </Title>
  </Head>
  <ClientOnly>
    <Teleport to="#breadcrumb">
      <span key="1">
        <StoreBreadCrum :data-title="dataTitle" />
      </span>
    </Teleport>
  </ClientOnly>
  <div class="forgot-password-container">
    <div v-if="!isSuccess" class="personal-info">
      <div class="title">{{ $t("title_screen.forgot_pass") }}</div>
      <div class="description">
        {{ $t("proceed_with_next") }}
      </div>
      <el-form
        ref="formRef"
        class="data-form"
        :model="formData"
        :rules="forgotPasswordRules"
        @keyup.enter="submitForm(formRef)"
      >
        <div class="div-block">
          <div class="label-text required-field">
            {{ $t("email_address") }}
          </div>
          <el-form-item prop="email">
            <InputText
              v-model="formData.email"
              :placeholder="$t('placeholder.email')"
              :formatter="(value) => `${value}`.replace(/\s/g, '')"
              :maxlength="MAX_LENGTH_EMAIL"
              :width="'100%'"
            />
          </el-form-item>
        </div>
        <div class="div-block">
          <div class="name d-flex justify-content-between align-items-center">
            <div class="name-title">
              {{ $t("name") }}
            </div>
            <div class="name-notice text-note__red">
              {{ $t("please_enter_in_hiragana") }}
            </div>
          </div>
          <div class="name-input d-flex align-items-center">
            <div class="left">
              <div class="label-text required-field">
                {{ $t("first_name_hiragana") }}
              </div>
              <el-form-item prop="first_name_kana">
                <InputText
                  v-model="formData.first_name_kana"
                  :placeholder="$t('placeholder.first_name_hiragana')"
                  :maxlength="MAX_LENGTH_FIRST_NAME"
                  :width="'100%'"
                />
              </el-form-item>
            </div>
            <div class="right">
              <div class="label-text required-field">
                {{ $t("last_name_hiragana") }}
              </div>
              <el-form-item prop="last_name_kana">
                <InputText
                  v-model="formData.last_name_kana"
                  :placeholder="$t('placeholder.last_name_hiragana')"
                  :maxlength="MAX_LENGTH_LAST_NAME"
                  :width="'100%'"
                />
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="div-block">
          <div class="label-text required-field">
            {{ $t("phone_number") }}
          </div>
          <el-form-item prop="phone_number">
            <input-phone v-model="formData.phone_number" />
          </el-form-item>
        </div>
        <div class="div-block">
          <div class="label-text required-field">
            {{ $t("birthday") }}
          </div>
          <el-form-item class="input-date" prop="birth_day">
            <input-date
              v-model="formData.birth_day"
              :placeholder="$t('placeholder.birthday')"
            />
          </el-form-item>
        </div>
        <div
          class="group-button d-flex justify-content-center align-items-center"
        >
          <ButtonGray
            :name="$t('button.back')"
            :width="'108px'"
            @keyup.enter="redirectPageLogin"
            @click="redirectPageLogin"
          ></ButtonGray>
          <ButtonYellow
            class="btn-send-mail"
            :name="$t('send_mail')"
            :width="'110px'"
            :loading="loading"
            @click="submitForm(formRef)"
            @keyup.enter="submitForm(formRef)"
          />
        </div>
      </el-form>
    </div>
    <div v-else class="sent-mail-success">
      <div class="logo">
        <IconLogoLogin />
      </div>
      <div class="title">{{ $t("title_screen.forgot_pass") }}</div>
      <div class="description">
        <span class="have-sent-mail">{{ $t("sent_you_a_link") }}: </span>
        <span class="email-forgot"> {{ formData.email }} </span>
      </div>
      <div class="group-button d-flex align-items-center">
        <ButtonYellow
          class="btn-login"
          :name="$t('go_to_login')"
          :width="'138px'"
          @click="redirectPageLogin"
          @keyup.enter="redirectPageLogin"
        />
        <div class="want-resend-mail">
          <span class="receive-email">{{ $t("do_not_receive_email") }}</span>
          <span class="resend" @click="resendMail" @keyup.enter="resendMail">{{
            $t("button.resend")
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
import forgotPasswordRules from "../validate/forgotPassword";
import { forgotPasswordApi } from "~/../../src/shared/api/all/authApi";
import {
  MAX_LENGTH_EMAIL,
  MAX_LENGTH_LAST_NAME,
  MAX_LENGTH_FIRST_NAME,
} from "~/../../src/shared/utils/validate";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { useRouter } from "#imports";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import InputPhone from "~/../../src/shared/components/input/Phone.vue";
import InputDate from "~/../../src/shared/components/input/Date.vue";
import ButtonYellow from "~/../../src/shared/components/button/ButtonYellow.vue";
import ButtonGray from "~/../../src/shared/components/button/ButtonGray.vue";
import IconLogoLogin from "~/../../src/shared/components/icon/IconLogoLogin";
import {
  forgotPasswordFailed,
  messageError,
  messageSuccess,
} from "~/../../src/shared/utils/notification";
import { useCookie } from "#app";
import { persistKeys } from "~/../../src/shared/constants/persist-key";
import scrollToTop from "~/../../src/shared/utils/scroll";
import { ROLES } from "~/../../src/shared/constants/roles";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";
import { IResponseError } from "~/../../src/shared/requests/types";

const { t } = i18n.global;
const formRef = ref<FormInstance>();
const router = useRouter();
const errorData = ref({});
const loading = ref(false);

const formData = reactive({
  email: "",
  first_name_kana: "",
  last_name_kana: "",
  phone_number: "",
  birth_day: "",
  role_type: ROLES.CUSTOMER,
});

const isSuccess = ref(false);
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

const submitForm = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        errorData.value = {};
        loading.value = true;
        await forgotPasswordApi(formData);
        isSuccess.value = true;
      } catch (error: any) {
        if (error.response?.status === STATUS_CODE.AUTHENTICATION) {
          messageError(error.response?._data?.message);
        } else if (error.response?.status === STATUS_CODE.NOT_FOUND) {
          forgotPasswordFailed();
        } else if (error.response?.status === STATUS_CODE.TOO_MANY_REQUEST) {
          messageError("errors.resend_error");
        } else {
          forgotPasswordFailed();
        }
        return error;
      } finally {
        loading.value = false;
      }
    }
  });
};

const redirectPageLogin = () => {
  router.push({ path: "/login" });
};

const resendMail = async () => {
  try {
    await forgotPasswordApi(formData);
    messageSuccess("success.resend_success");
  } catch (error) {
    messageError("errors.resend_error");
  }
};

onMounted(() => {
  scrollToTop();
});
</script>

<style lang="scss" scoped>
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../assets/scss/variables" as *;

.forgot-password-container {
  width: 90%;
  max-width: 572px;
  margin: 64px auto;

  .title {
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
  }

  .personal-info {
    .description {
      font-size: 14px;
      color: $black-60;
      padding-top: 16px;
      padding-bottom: 24px;
    }

    .div-block {
      .label-text {
        padding-bottom: 8px;
      }

      .name {
        padding-bottom: 8px;
      }

      .name-input {
        gap: 32px;

        .label-text {
          padding-right: 16px;
          padding-top: 10px;
        }

        .el-form-item {
          width: 100%;
        }

        .left,
        .right {
          flex: 1;
        }
      }

      &:deep(.el-date-editor) {
        --el-date-editor-width: 100%;
        height: 40px;
      }
    }

    .el-form-item {
      margin-bottom: 24px;
    }

    :deep(.el-input__wrapper, .el-form-item__content) {
      height: 40px;
    }
  }

  .sent-mail-success {
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 40px;
    }

    .description {
      font-size: 14px;
      margin-bottom: 48px;

      .have-sent-mail {
        color: $black-60;
      }

      .email-forgot {
        font-weight: 600;
      }
    }

    .receive-email {
      padding-left: 24px;
      padding-right: 8px;
      font-size: 16px;
    }

    .resend {
      text-decoration: none;
      font-size: 16px;
      color: $blue;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .group-button {
    margin-top: 48px;
  }
}

@include res("xs-only", $breakpoints-spec) {
  .forgot-password-container {
    width: 88%;
    margin: 24px auto;

    .personal-info {
      .div-block {
        .name {
          padding-bottom: 8px;
          flex-direction: column;
          align-items: flex-start;
        }

        .name-notice {
          font-size: 12px;
          color: $black-60;
        }

        .name-input {
          gap: 12px;
          display: flex;

          .left,
          .right {
            width: 50%;
          }
        }
      }
    }

    .sent-mail-success {
      .description {
        margin-bottom: 24px;
      }

      .group-button {
        flex-direction: column;
        align-items: flex-start;

        .want-resend-mail {
          padding-top: 16px;
        }
      }

      .receive-email {
        padding-left: 0;
        padding-right: 4px;
      }
    }

    .group-button {
      margin-top: 24px;
    }
  }
}
</style>
