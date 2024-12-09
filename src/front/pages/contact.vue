<template>
  <Head>
    <Title> {{ $t("site_name_title") }}{{ $t("title_screen.contact") }} </Title>
  </Head>
  <ClientOnly>
    <Teleport to="#breadcrumb">
      <span key="1">
        <StoreBreadCrum :data-title="dataTitle" :is-hidden="true" />
      </span>
    </Teleport>
  </ClientOnly>
  <div class="contact">
    <div class="box-content">
      <div class="group-header">
        <div class="text-title">
          <div class="icon-chat"><IconChat /></div>
          {{ $t("front.inquiry_screen") }}
        </div>
        <div class="text-reservation">{{ $t("site_name") }}</div>
      </div>
      <div class="group-body">
        <div class="title-body">
          <el-link type="primary" href="https://jp.ar-xia.com/" target="_blank"
            >{{ $t("front.introduction_help_support") }}
          </el-link>
          <span>
            {{ $t("front.please_contact_us") }}
          </span>
        </div>
        <div class="form-body">
          <el-form
            ref="formRef"
            :model="formData"
            :rules="contactRules"
            class="demo-ruleForm"
          >
            <div class="form-input person-name">
              <div class="text-label">
                {{ $t("name") }}<span class="icon-required">*</span>
              </div>
              <div class="input-item__name">
                <el-form-item
                  class="input-item__left"
                  prop="first_name"
                  :error="errorData.first_name?.[0]"
                >
                  <InputText
                    v-model="formData.first_name"
                    :placeholder="$t('placeholder.first_name')"
                    :maxlength="MAX_LENGTH_FIRST_NAME"
                    :width="'100%'"
                  />
                </el-form-item>
                <el-form-item
                  class="input-item__right"
                  prop="last_name"
                  :error="errorData.last_name?.[0]"
                >
                  <InputText
                    v-model="formData.last_name"
                    :placeholder="$t('placeholder.last_name')"
                    :maxlength="MAX_LENGTH_LAST_NAME"
                    :width="'100%'"
                  />
                </el-form-item>
              </div>
            </div>
            <div class="form-input person-email">
              <div class="text-label">
                {{ $t("email_address") }}<span class="icon-required">*</span>
              </div>
              <el-form-item prop="email" :error="errorData.email?.[0]">
                <InputText
                  v-model="formData.email"
                  :maxlength="MAX_LENGTH_EMAIL"
                  :placeholder="$t('placeholder.email')"
                  :width="'100%'"
                />
              </el-form-item>
            </div>
            <div class="form-input person-phone">
              <div class="text-label">{{ $t("phone_number") }}</div>
              <el-form-item
                :error="errorData.phone_number?.[0]"
                prop="phone_number"
              >
                <InputPhone
                  v-model="formData.phone_number"
                  :placeholder="$t('placeholder.phone')"
                />
              </el-form-item>
            </div>
            <div class="form-input person-subject">
              <div class="text-label">{{ $t("subject") }}</div>
              <el-form-item :error="errorData.subject?.[0]">
                <InputText
                  v-model="formData.subject"
                  :width="'100%'"
                  :placeholder="$t('placeholder.subject')"
                />
              </el-form-item>
            </div>
            <div class="form-input person-content">
              <div class="text-label">
                {{ $t("content") }}<span class="icon-required">*</span>
              </div>
              <el-form-item prop="message" :error="errorData.message?.[0]">
                <el-input
                  v-model="formData.message"
                  :rows="4"
                  type="textarea"
                  :placeholder="$t('placeholder.content')"
                />
              </el-form-item>
            </div>
            <div class="form-input person-content">
              <div class="text-label"></div>
              <div class="group-button">
                <ButtonRed
                  :loading="loading"
                  :name="$t('button.send')"
                  @click="submitForm(formRef)"
                />
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
import contactRules from "../validate/contact";
import ContactRequest from "../../shared/requests/ContactRequest";
import STATUS_CODE from "../../shared/constants/statusCodeResponse";
import { ElMessage } from "element-plus";
import { i18n } from "../../shared/plugins/i18n";
import { useMeStore } from "~/../../src/shared/stores/me";
import { MAX_LENGTH_EMAIL } from "../../shared/utils/validate";
import InputText from "../../shared/components/input/InputText.vue";
import InputPhone from "../../shared/components/input/Phone.vue";
import ButtonRed from "../../shared/components/button/ButtonRed.vue";
import { useDeviceStore } from "~/../../src/front/store/device";
import {
  MAX_LENGTH_FIRST_NAME,
  MAX_LENGTH_LAST_NAME,
} from "~/../../src/shared/utils/validate";
import { onMounted } from "#imports";
import scrollToTop from "~/../../src/shared/utils/scroll";
import { ROLES } from "~/../../src/shared/constants/roles";

const customerData = useMeStore();
const loading = ref(false);
const errorData = ref({});
const formRef = ref<FormInstance>();
const formData = reactive({
  first_name: customerData.info?.first_name
    ? customerData.info?.first_name
    : "",
  last_name: customerData.info?.last_name ? customerData.info?.last_name : "",
  email: customerData.info?.email ? customerData.info?.email : "",
  phone_number: customerData.info?.phone_number
    ? customerData.info?.phone_number
    : "",
  subject: "",
  message: "",
  role_type: ROLES.CUSTOMER,
});

const { t } = i18n.global;
const dataTitle = reactive([{ name: t("breadcrumb.contact"), path: "" }]);
const deviceTable = useDeviceStore();
const device = computed(() => {
  return deviceTable.device;
});

onMounted(() => {
  scrollToTop();
});

const submitForm = (form: FormInstance | undefined) => {
  if (!form) return;
  form.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        errorData.value = {};

        await ContactRequest.post(formData);
        ElMessage.success(t("success.send_success"));
        formData.subject = null;
        formData.message = null;
      } catch (e: any) {
        if (e.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorData.value = e.data.errors;
        }
      } finally {
        loading.value = false;
      }
    } else {
      return false;
    }
  });
};
</script>

<style scoped lang="scss">
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../assets/scss/variables" as *;

.contact {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  padding-top: 24px;
  padding-bottom: 44px;
  width: 100%;

  .box-content {
    width: 90%;
    max-width: 880px;
  }

  .text-title {
    color: $black-color;
    font-size: 20px;
    font-weight: 700;
    display: flex;
    align-items: center;

    .icon-chat {
      margin-right: 10px;
    }
  }

  .text-reservation {
    color: $pink-color;
    margin-top: 5px;
  }

  .title-body {
    color: $black-80;
    font-size: 13px;
    border-bottom: 1px solid $black-20;
    padding: 8px 0 16px 0;
    margin: 16px 0;

    .el-link {
      margin-top: -5px;
    }
  }

  .form-input {
    display: flex;
    margin-bottom: 20px;

    .text-label {
      width: 135px;
      color: $black-80;
      display: flex;
      justify-content: right;
      align-items: center;
      padding-right: 20px;

      .icon-required {
        color: $red-color-icon;
        margin-left: 5px;
        margin-top: 5px;
      }
    }

    :deep(.el-form-item__content) {
      margin-left: 0 !important;
    }

    .el-form-item,
    .group-button {
      width: calc(100% - 135px);
      margin-bottom: 0;
    }

    .input-item__left {
      margin-right: 12px;
    }

    .group-button {
      text-align: center;

      .button-submit {
        width: 136px;
      }
    }
  }

  .person-name {
    .input-item__name {
      display: flex;
      width: calc(100% - 135px);

      .el-form-item {
        width: 50%;
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .contact {
    padding-bottom: 24px;

    .box-content {
      width: 87%;

      .form-input {
        display: block;
        margin-bottom: 0;

        .el-form-item,
        .group-button {
          width: 100%;
          margin-bottom: 16px;
        }

        .text-label {
          margin: 10px 0;
          justify-content: left;
        }
      }
    }

    .person-name {
      .input-item__name {
        width: 100%;

        .el-form-item {
          width: 50%;
        }
      }
    }
  }
}
</style>
