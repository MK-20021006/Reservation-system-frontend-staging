<template>
  <div class="container-register">
    <Head>
      <Title>
        {{ $t("site_name_title") }}{{ $t("front.member_registration") }}</Title
      ></Head
    >
    <ClientOnly>
      <Teleport to="#breadcrumb">
        <span key="1">
          <StoreBreadCrum :data-title="dataTitle" />
        </span>
      </Teleport>
    </ClientOnly>
    <div class="register-member-container">
      <div class="text-title text-center">
        {{ $t("front.member_registration") }}
      </div>
      <ClientOnly>
        <div class="stepper">
          <el-steps :active="currentStep" finish-status="success">
            <el-step
              class="step__items"
              :title="$t('front.enter_member_information')"
            />
            <el-step
              class="step__items"
              :title="$t('front.temporary_registration_email')"
            />
            <el-step
              class="step__items"
              :title="$t('front.confirm_code_register')"
            />
            <el-step
              class="step__items_5"
              :title="$t('front.completed_register')"
            />
          </el-steps>
        </div>
      </ClientOnly>
      <div class="step__details">
        <component
          :is="currentComponent"
          :current-step="currentStep"
          class="d-flex flex-column"
          @handle-current-step="handleCurrent"
          @handle-redirect="handleRedirect"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  defineAsyncComponent,
  onMounted,
  onUpdated,
  reactive,
  ref,
  shallowRef,
} from "vue";
import { useRoute, useRouter } from "#imports";
import { i18n } from "../../shared/plugins/i18n";
import scrollToTop from "../../shared/utils/scroll";
import { useCookie } from "#app";
import { persistKeys } from "~/../../src/shared/constants/persist-key";

const { t } = i18n.global;
const dataTitle = reactive([
  { name: t("title_screen.create_account"), path: "" },
]);

const MemberInformation = defineAsyncComponent(
  () => import("../components/register_member/MemberInformation.vue")
);
const RegisterEmail = defineAsyncComponent(
  () => import("../components/register_member/RegisterEmail.vue")
);
const ConfirmPhoneNumber = defineAsyncComponent(
  () => import("../components/register_member/ConfirmPhoneNumber.vue")
);
const Completion = defineAsyncComponent(
  () => import("../components/register_member/Completion.vue")
);

const route = useRoute();
const router = useRouter();
const currentStep = ref(0);
const currentComponent = shallowRef();
const STEP = {
  memberInformation: "0",
  RegisterEmail: "1",
  ConfirmPhoneNumber: "2",
  Completion: "3",
};

const cookieToken = useCookie(persistKeys.ACCESS_TOKEN, {
  secure: true,
  sameSite: "none",
});
if (cookieToken.value) {
  router.push({ path: "/" });
}

onUpdated(() => {
  scrollToTop();
  if (localStorage.getItem("step") === STEP.Completion) {
    currentComponent.value = Completion;
    currentStep.value = parseInt(STEP.Completion);
    router.push(route.path);
    localStorage.removeItem("step");
    localStorage.removeItem("id");
    return;
  }
});

onMounted(() => {
  scrollToTop();
  if (route.query?.user_id) {
    localStorage.setItem("id", `${route?.query?.user_id}`);
  }

  if (
    route.query?.user_id ||
    localStorage.getItem("step") === STEP.ConfirmPhoneNumber
  ) {
    localStorage.setItem("step", STEP.ConfirmPhoneNumber);
    currentStep.value = parseInt(STEP.ConfirmPhoneNumber);
    currentComponent.value = ConfirmPhoneNumber;
    router.replace({ query: null });
    return;
  }

  if (!localStorage.getItem("step")) {
    currentComponent.value = MemberInformation;
    currentStep.value = parseInt(STEP.memberInformation);
    return;
  }

  currentStep.value = parseInt(localStorage.getItem("step"));
  switch (localStorage.getItem("step")) {
    case STEP.RegisterEmail:
      if (
        !localStorage.getItem("id") ||
        localStorage.getItem("id") === "undefined"
      ) {
        currentComponent.value = MemberInformation;
        currentStep.value = parseInt(STEP.memberInformation);
        break;
      }
      currentComponent.value = RegisterEmail;
      currentStep.value = parseInt(STEP.RegisterEmail);
      break;
    default:
      currentComponent.value = MemberInformation;
      currentStep.value = parseInt(STEP.memberInformation);
      break;
  }
});

const handleRedirect = async () => {
  const redirect = useCookie(persistKeys.REDIRECT, {
    secure: true,
    sameSite: "none",
  });
  if (redirect.value && redirect.value !== "/register") {
    await router.push(redirect.value);
    redirect.value = null;
  } else {
    await router.push({ path: "/" });
  }
};

const handleCurrent = () => {
  currentStep.value = currentStep.value + 1;
  localStorage.setItem("step", currentStep.value.toString());
  if (currentStep.value === parseInt(STEP.RegisterEmail)) {
    currentComponent.value = RegisterEmail;
  } else if (currentStep.value === parseInt(STEP.ConfirmPhoneNumber)) {
    currentComponent.value = ConfirmPhoneNumber;
  } else {
    currentComponent.value = Completion;
  }
};
</script>

<style lang="scss" scoped>
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../src/front/assets/scss/variables" as *;

.container-register {
  flex: 1;
}

.register-member-container {
  padding: 0 10% 0 10%;
  background-color: $bg-main-user;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .text-title {
    margin: 64px 0 0 0;
    height: 24px;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
  }

  .stepper {
    margin: 20px 0 30px 0;

    .step__items {
      flex-basis: 23%;
    }

    .step__items_5 {
      flex-basis: 11%;
    }
  }

  .step__details {
    padding-bottom: 64px;
    margin: 0 auto;
  }
}

:deep(.el-step.is-horizontal) {
  display: flex;
}

:deep(.el-step__main) {
  position: absolute;
  top: -7px;
  left: 35px;
  white-space: nowrap;
}

:deep(.el_steps) {
  width: 100%;
}

:deep(.is-process) {
  .is-text {
    color: rgba(255, 255, 255, 0.9);
  }

  color: #0052d9;

  .el-step__icon {
    border: inherit;
    background-color: #0052d9;
  }
}

:deep(.el-step__icon) {
  border: 1px solid;
  background-color: #f6f6f6;
}

:deep(.is-success) {
  .el-step__line {
    background: #0052d9;
  }
}

:deep(.el-step:nth-child(1) .el-step__line) {
  left: 150px;
  right: 16px;
}

:deep(.el-step:nth-child(2) .el-step__line) {
  left: 175px;
  right: 16px;
}

:deep(.el-step:nth-child(3) .el-step__line) {
  left: 160px;
  right: 16px;
}

:deep(.el-step:nth-child(4) .el-step__line) {
  left: 150px;
  right: 16px;
}

:deep(.el-step__head.is-success) {
  color: #0052d9;
  border-color: #0052d9;
}

:deep(.el-step__title.is-success) {
  color: #000000e5;
}

:deep(.el-step__title.is-process) {
  font-weight: 400;
}

@include res("sm-and-down", $breakpoints-spec) {
  .register-member-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 24px;
    padding-right: 24px;

    .step__details {
      padding-bottom: 24px;
    }

    .text-title {
      margin-top: 25px !important;
    }

    .stepper {
      margin-bottom: 28px !important;
      margin-top: 20px !important;
    }
  }

  :deep(.el-step__title) {
    display: none !important;
  }

  :deep(.el-step.is-horizontal .el-step__line) {
    left: 0;
    right: 0;
  }
}
</style>
