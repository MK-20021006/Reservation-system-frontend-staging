<template>
  <Head>
    <Title> {{ $t("site_name_title") }}{{ $t("title_screen.login") }} </Title>
  </Head>
  <ClientOnly>
    <Teleport to="#breadcrumb">
      <span key="1">
        <StoreBreadCrum :data-title="dataTitle" />
      </span>
    </Teleport>
  </ClientOnly>
  <div v-loading="loadingRedirect" class="login">
    <div class="main-login">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="loginRules"
        class="form-login"
      >
        <div class="image-logo">
          <IconLogoLogin />
        </div>
        <div class="title-login">{{ $t("title_login") }}</div>
        <div class="text-note">{{ $t("all_service_can_be_booked") }}</div>
        <el-form-item class="form-item" prop="email">
          <IconUser class="icon-input" />
          <InputText
            v-model="formData.email"
            :placeholder="$t('placeholder.email')"
            :formatter="(value) => `${value}`.replace(/\s/g, '')"
            :maxlength="MAX_LENGTH_EMAIL"
            autocomplete="off"
            @keyup.enter="submitForm(formRef)"
          />
        </el-form-item>
        <el-form-item class="form-item" prop="password">
          <IconLock class="icon-input" />
          <InputPassword
            v-model="formData.password"
            :placeholder="$t('placeholder.password')"
            :formatter="(value) => `${value}`.replace(/\s/g, '')"
            autocomplete="off"
            @keyup.enter="submitForm(formRef)"
          />
        </el-form-item>
        <div class="text-forgot__password">
          <nuxt-link class="text-link__blue" to="/forgot-password">
            {{ $t("title_screen.forgot_pass") }}?
          </nuxt-link>
        </div>
        <el-form-item>
          <ButtonYellow
            :loading="loading"
            :name="$t('button.login')"
            @click="submitForm(formRef)"
            @keyup.enter="submitForm(formRef)"
          />
        </el-form-item>
        <div class="divider line one-line">or</div>
        <div class="text-other__login">{{ $t("other_login_methods") }}</div>
        <div class="group-button">
          <div
            v-if="+bookingSource !== BOOKING_SOURCE.LINE && !checkWebView"
            @click="loginBySocial(SocialNetworkType.FACEBOOK)"
          >
            <IconLoginFacebook class="icon-login" />
          </div>
          <div
            v-if="+bookingSource !== BOOKING_SOURCE.LINE && !checkWebView"
            @click="loginBySocial(SocialNetworkType.GOOGLE)"
          >
            <IconLoginGoogle class="icon-login" />
          </div>
          <div @click="loginBySocial(SocialNetworkType.TWITTER)">
            <IconLoginTwitter class="icon-login" />
          </div>
          <div @click="loginBySocial(SocialNetworkType.YAHOO)">
            <IconLoginYahoo class="icon-login" />
          </div>
          <div @click="loginBySocial(SocialNetworkType.LINE)">
            <IconLoginLine class="icon-login" />
          </div>
        </div>
        <div class="line-icon"></div>
        <div class="text-question">
          <p>{{ $t("dont_have_an_account") }}</p>
          <NuxtLink to="/register" class="text-create__account text-link__blue">
            <div>{{ $t("title_screen.create_account") }}</div>
          </NuxtLink>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeMount, onMounted, reactive, ref } from "vue";
import { useCookie, useRouter, useRuntimeConfig, useRoute } from "nuxt/app";
import type { FormInstance } from "element-plus";
import { MAX_LENGTH_EMAIL } from "../../shared/utils/validate";
import { i18n } from "../../shared/plugins/i18n";
import { ROLES } from "../../shared/constants/roles";
import loginRules from "../validate/login";
import InputText from "../../shared/components/input/InputText.vue";
import InputPassword from "../../shared/components/input/InputPassword.vue";
import ButtonYellow from "../../shared/components/button/ButtonYellow.vue";
import authRequest from "~~/../../src/shared/requests/AuthRequest";
import { persistKeys } from "~~/../../src/shared/constants/persist-key";
import {
  SocialNetworkType,
  AUTH_USER_NOT_VERIFICATION_TEXT,
  AUTH_USER_NOT_ACTIVE_TEXT,
} from "~~/../../src/shared/constants/auth";
import { useMeStore } from "~/../../src/shared/stores/me";
import {
  loginFailed,
  messageError,
  loginFailedSocial,
} from "~/../../src/shared/utils/notification";
import IconLogoLogin from "~/../../src/shared/components/icon/IconLogoLogin";
import resetStore from "~/../../src/front/composables/resetStore";
import scrollToTop from "~/../../src/shared/utils/scroll";
import { buildQuery } from "~/../../src/shared/utils";
import { BOOKING_SOURCE } from "~/../../src/shared/constants/reservation";
import { handleCheckWebview } from "~/../../src/front/minxins/webviewMixin";

const route = useRoute();
const meStore = useMeStore();
const router = useRouter();
const { t } = i18n.global;
const formRef = ref<FormInstance>();
const loading = ref(false);
const formData = reactive({
  email: "",
  password: "",
  role_type: ROLES.CUSTOMER,
});
const loadingRedirect = ref(false);
const dataTitle = reactive([{ name: t("breadcrumb.login"), path: "" }]);
const cookieToken = useCookie(persistKeys.ACCESS_TOKEN, {
  secure: true,
  sameSite: "none",
});
const bookingSource = useCookie(persistKeys.BOOKING_SOURCE, {
  secure: true,
  sameSite: "none",
});
const linkRedirect = useCookie(persistKeys.REDIRECT, {
  secure: true,
  sameSite: "none",
});
let checkWebView = ref(false);
const loginSource = useCookie(persistKeys.LOGIN_LINE, {
  secure: true,
  sameSite: "none",
});
const storeBooking = useCookie(persistKeys.STORE_LINE, {
  secure: true,
  sameSite: "none",
});
const typeBooking = useCookie(persistKeys.STORE_TYPE, {
  secure: true,
  sameSite: "none",
});
const typeLogin = useCookie(persistKeys.TYPE_LOGIN, {
  secure: true,
  sameSite: "none",
});
const isHomePage = ref(route.query.is_homepage);

if (cookieToken.value) {
  router.push({ path: "/" });
} else {
  resetStore();
}

const config = useRuntimeConfig();

const handleErrorLogin = () => {
  const query = "?" + buildQuery({ type: null });
  history.replaceState(null, "", `${query}`);
};

// const handleReciveCallback = async (e) => {
//   loadingRedirect.value = true;
//   const data = JSON.parse(e);
//   if (data.token) {
//     cookieToken.value = data.token;
//     await nextTick(() => {
//       meStore.fetchUpdate();
//     });
//     await router.push({ path: "/" });
//   } else if (data.sns_info) {
//     localStorage.setItem(persistKeys.SNS_INFO, JSON.stringify(data.sns_info));
//     await router.push({
//       path: `/register`,
//       query: { from: persistKeys.SNS_INFO },
//     });
//   } else if (data.error) {
//     ElMessage.error(t("errors.login_failed"));
//   }
// };

// const handleCallbackLoginGoogle = (e) => {
//   window.removeEventListener("message", handleCallbackLoginGoogle);
//   handleReciveCallback(e, SocialNetworkType.GOOGLE);
// };
//
// const handleCallbackLoginFacebook = (e) => {
//   window.removeEventListener("message", handleCallbackLoginFacebook);
//   handleReciveCallback(e, SocialNetworkType.FACEBOOK);
// };
//
// const handleCallbackLoginLine = (e) => {
//   window.removeEventListener("message", handleCallbackLoginLine);
//   handleReciveCallback(e, SocialNetworkType.LINE);
// };
//
// const handleCallbackLoginTwitter = (e) => {
//   window.removeEventListener("message", handleCallbackLoginTwitter);
//   handleReciveCallback(e, SocialNetworkType.TWITTER);
// };
//
// const handleCallbackLoginYahoo = (e) => {
//   window.removeEventListener("message", handleCallbackLoginYahoo);
//   handleReciveCallback(e, SocialNetworkType.YAHOO);
// };
const loginBySocial = async (type: SocialNetworkType) => {
  try {
    loadingRedirect.value = true;
    window.location.href = `${config.apiUrl}/auth/${type}/redirect?source=${
      bookingSource.value || BOOKING_SOURCE.WEB
    }&link_redirect=${linkRedirect.value || ""}&store_id=${
      storeBooking.value || ""
    }&store_type=${typeBooking.value || ""}&is_homepage=${isHomePage.value}`;
    localStorage.removeItem("step");
    localStorage.removeItem("id");
  } catch (e) {
    loginFailed();
  } finally {
    loadingRedirect.value = false;
  }
  // if (type === SocialNetworkType.GOOGLE) {
  //   window.addEventListener("message", handleCallbackLoginGoogle, false);
  // } else if (type === SocialNetworkType.FACEBOOK) {
  //   window.addEventListener("message", handleCallbackLoginFacebook, false);
  // } else if (type === SocialNetworkType.LINE) {
  //   window.addEventListener("message", handleCallbackLoginLine, false);
  // } else if (type === SocialNetworkType.TWITTER) {
  //   window.addEventListener("message", handleCallbackLoginTwitter, false);
  // } else if (type === SocialNetworkType.YAHOO) {
  //   window.addEventListener("message", handleCallbackLoginYahoo, false);
  // }
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
      if (data?.data?.token) {
        cookieToken.value = data.data.token;
        await nextTick(async () => {
          await meStore.fetchUpdate();
        });
      }
      typeLogin.value = "";
    } catch (e) {
      loginFailed();
      return e;
    } finally {
      loading.value = false;
    }
    const redirect = useCookie(persistKeys.REDIRECT, {
      secure: true,
      sameSite: "none",
    });
    if (redirect.value) {
      await router.push(redirect.value);
      redirect.value = null;
    } else {
      await router.push({ path: "/" });
    }
  }
};

onMounted(async () => {
  loadingRedirect.value = false;
  scrollToTop();
  checkWebView.value = handleCheckWebview();
});

onBeforeMount(() => {
  if (route.query.data) {
    const data = JSON.parse(String(route.query.data));
    if (data.error) {
      setTimeout(() => {
        loginFailedSocial(data.error);
      }, 200);
    }
    if (
      data.source &&
      (!bookingSource.value ||
        Number(bookingSource.value) !== BOOKING_SOURCE.LINE)
    ) {
      bookingSource.value = data.source;
    }
    handleErrorLogin();
  }
});
</script>

<style lang="scss" scoped>
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../assets/scss/variables" as *;

.login {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
  min-width: 0;

  .main-login {
    margin: 64px auto;
  }

  .form-login {
    width: 400px;

    :deep(.el-form-item__content) {
      margin-left: 0 !important;

      .input-text,
      .input-password,
      .button-submit {
        width: 400px;
        margin-bottom: 5px;

        .el-input__inner {
          margin-left: 30px;
        }
      }
    }

    .title-login {
      font-weight: 700;
    }

    .text-note {
      margin-top: 8px;
      margin-bottom: 24px;
    }

    .text-question {
      margin-top: 33px;
      display: flex;
    }

    .text-forgot__password {
      margin-top: 22px;
      margin-bottom: 32px;

      a {
        text-decoration: none;
      }
    }

    .line-icon {
      border-bottom: 1px solid $line-color;
    }

    .form-item {
      position: relative;
    }

    .icon-input {
      position: absolute;
      z-index: 1;
      left: 15px;
      top: 10px;
    }

    .text-create__account {
      margin-left: 16px;
      text-decoration: none;
    }

    .image-logo {
      text-align: center;
      margin-bottom: 28px;
    }
  }

  .divider {
    display: flex;
    color: $gray-color;

    &:before,
    &:after {
      content: "";
      flex: 1;
    }
  }

  .line {
    align-items: center;
    margin: 5px -5px;

    &:before,
    &:after {
      height: 1px;
      margin: 0 5px;
    }
  }

  .one-line {
    &:before,
    &:after {
      background: $line-color;
    }
  }

  .text-other__login {
    text-align: center;
    color: #000;
    margin-top: 20px;
  }

  .group-button {
    display: flex;
    justify-content: center;
    margin-top: 22px;
    margin-bottom: 24px;

    .icon-login {
      margin: 0 15px;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .login {
    .main-login {
      margin: 24px auto;
    }

    .form-login {
      width: 327px;

      .text-question {
        display: block;
      }
    }
  }
}
</style>
