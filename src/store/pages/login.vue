<template>
  <Head>
    <Title> {{ $t("site_name_title") }}{{ $t("title_screen.login") }} </Title>
  </Head>
  <div class="login">
    <div class="main-login">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="loginRules"
        class="form-login"
      >
        <div>
          <div class="border-form">
            <big-arxia-store />
            <div class="title-login">{{ $t("title_login") }}</div>
            <el-form-item class="form-item" prop="email">
              <IconUserEmail class="icon-input" />
              <InputText
                v-model.trim="formData.email"
                :placeholder="$t('placeholder.email')"
                :formatter="(value) => `${value}`.replace(/\s/g, '')"
                :maxlength="MAX_LENGTH_EMAIL"
                @keyup.enter="submitForm(formRef)"
              />
            </el-form-item>
            <el-form-item class="form-item" prop="password">
              <IconLock class="icon-input" />
              <InputPassword
                v-model="formData.password"
                :placeholder="$t('placeholder.password')"
                :formatter="(value) => `${value}`.replace(/\s/g, '')"
                @keyup.enter="submitForm(formRef)"
              />
            </el-form-item>
            <div class="text-forgot">
              <NuxtLink to="/forgot-password" class="text-forgot__password">
                {{ $t("title_screen.forgot_pass") }}?
              </NuxtLink>
            </div>
            <el-form-item>
              <main-button-store
                :name="$t('button.login')"
                :loading="loading"
                @click="submitForm(formRef)"
                @keyup.enter="submitForm(formRef)"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="copy-right">
      {{ $t("copy_right") }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from "vue";
import loginRules from "../validates/login";
import type { FormInstance } from "element-plus";
import { useCookie, useRouter } from "nuxt/app";
import { MAX_LENGTH_EMAIL } from "~/../../src/shared/utils/validate";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { ROLES } from "~/../../src/shared/constants/roles";
import InputPassword from "~/../../src/shared/components/input/InputPassword.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import authRequest from "~~/../../src/shared/requests/AuthRequest";
import { persistKeys } from "~~/../../src/shared/constants/persist-key";
import { useMeStore } from "~/../../src/shared/stores/me";
import BigArxiaStore from "~/../../src/shared/components/icon/BigArxiaStore.vue";
import { loginFailed } from "~/../../src/shared/utils/notification";
import MainButtonStore from "~/../../src/shared/components/button/MainButtonStore.vue";
import moment from "moment/moment";

definePageMeta({
  layout: "guest",
});

const meStore = useMeStore();
const router = useRouter();
const { t } = i18n.global;
const formRef = ref<FormInstance>();
const loading = ref(false);
const formData = reactive({
  email: "",
  password: "",
  role_type: ROLES.STORE,
});
const cookieToken = useCookie(persistKeys.ACCESS_TOKEN);
const todayDate = moment().format("YYYY-MM-DD");

const redirectPageBeforeLogin = async () => {
  const redirect = useCookie(persistKeys.REDIRECT);
  if (redirect.value) {
    await router.push(redirect.value);
    redirect.value = null;
  } else {
    await router.push({ path: "/" });
  }
};

const submitForm = async (form: FormInstance | undefined) => {
  if (!form) return;
  const valid = await new Promise((resolve) => {
    form.validate(async (valid) => {
      resolve(valid);
    });
  });
  if (valid) {
    try {
      loading.value = true;
      const data = await authRequest.login(formData);
      if (data.data?.token) {
        cookieToken.value = data.data.token;
        await nextTick(async () => {
          await meStore.fetchUpdate();
          const dateEndContract = meStore.info?.store?.widthdraw_at
            ? moment(meStore.info?.store?.widthdraw_at).format("YYYY-MM-DD")
            : null;
          if (
            (dateEndContract && moment(dateEndContract).isSame(todayDate)) ||
            meStore.info?.store?.has_active_failed_payments
          ) {
            location.reload();
          }
          await redirectPageBeforeLogin();
        });
      }
    } catch (e) {
      loginFailed();
      return e;
    } finally {
      loading.value = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@use "../assets/scss/variables" as *;

.login {
  background-color: $bg-guest;

  .main-login {
    height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .form-login {
      text-align: center;

      :deep(.el-form-item__content) {
        margin-left: 0 !important;
        margin-bottom: 24px;

        .input-text,
        .input-password,
        .button-submit {
          width: 400px;
        }

        .el-input__inner {
          margin-left: 30px;
        }
      }

      :deep(.el-form-item) {
        margin-bottom: 0;
      }

      .title-login {
        font-size: 20px;
        line-height: 36px;
        font-weight: 400;
        text-align: center;
        margin: 24px 0;
      }

      .text-forgot {
        line-height: 22px;
        margin-bottom: 24px;

        &__password {
          text-decoration: none;
        }
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
  }

  .copy-right {
    text-align: center;
    height: 10vh;
  }
}
</style>
