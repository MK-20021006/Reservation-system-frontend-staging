<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title>
          {{ $t("site_name_title") }}{{ $t("title_screen.change_password") }}
        </Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.change_password") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <div class="reset-password">
        <div class="main-content">
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
            :rules="passwordRules"
            class="demo-dynamic"
            @keyup.enter="submitForm(formRef)"
          >
            <div class="form-input password">
              <el-form-item
                prop="current_password"
                :error="errorData?.current_password?.[0]"
                :inline-message="true"
              >
                <IconLock class="icon-input" />
                <InputPassword
                  v-model="formData.current_password"
                  :placeholder="$t('placeholder.current_password')"
                  :formatter="(value) => `${value}`.replace(/\s/g, '')"
                />
              </el-form-item>
            </div>
            <div class="form-input password">
              <el-form-item
                prop="password"
                :error="errorData?.password?.[0]"
                :inline-message="true"
              >
                <IconLock class="icon-input" />
                <InputPassword
                  v-model="formData.password"
                  :placeholder="$t('placeholder.new_password')"
                  :formatter="(value) => `${value}`.replace(/\s/g, '')"
                />
              </el-form-item>
            </div>
            <div class="form-input password-confirm">
              <el-form-item
                prop="password_confirmation"
                :error="errorData?.password_confirmation?.[0]"
                :inline-message="true"
              >
                <IconLock class="icon-input" />
                <InputPassword
                  v-model="formData.password_confirmation"
                  :placeholder="$t('placeholder.password_confirmation')"
                  :formatter="(value) => `${value}`.replace(/\s/g, '')"
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
            </div>
          </el-form>
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { FormInstance } from "element-plus";
import changePasswordRules from "../../validates/changePassword";
import InputPassword from "../../../shared/components/input/InputPassword.vue";
import { updateSuccess } from "~/../../src/shared/utils/notification";
import MainButtonStore from "~/../../src/shared/components/button/MainButtonStore.vue";
import { changePasswordApi } from "~/../../src/shared/api/all/authApi";

const formRef = ref<FormInstance>();
const loading = ref(false);
const errorData = ref({});

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
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.reset-password {
  height: 730px;
  display: flex;
  justify-content: center;
  align-items: center;

  .main-content {
    width: 400px;

    .box-text {
      font-size: 14px;
    }

    .text-desc {
      color: $black-60;
      line-height: 23px;
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
  }
}
</style>
