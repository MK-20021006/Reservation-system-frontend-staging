<template>
  <div v-loading="loadingChange" class="connect-tabelog">
    <connect-template-crawl
      :disabled-connect="formData.status && data"
      :disabled-save="!formData.status || (formData.status && data)"
      :is-loading-connect="loading"
      :is-loading-save="loadingSubmit"
      :is-hidden-button-save="formData.status === STATUS_CONNECT.SUCCESSFUL"
      :is-hidden-button-connect="true"
      @save-data="postHotPepperBeauty(formRef)"
    >
      <template #connect-type>
        <el-form
          ref="formRef"
          class="data-form"
          :model="formData"
          :rules="hotPepperBeautyRules"
        >
          <div-inline :label="'name_store'" :is-required="true">
            <template #form-item>
              <el-form-item
                :error="errorMsg['identity_from_mail']"
                prop="identity_from_mail"
              >
                <input-text
                  v-model="formData.identity_from_mail"
                  width="400px"
                  :disabled="formData.status === STATUS_CONNECT.SUCCESSFUL"
                  :placeholder="
                    $t('placeholder.enter_store_name_of_the_external_site')
                  "
                />
              </el-form-item>
            </template>
          </div-inline>
          <div class="text-note">
            {{ $t("store.text_note_enter_store_name") }}
          </div>
          <div-inline
            :label="'store.communication_confirmation_status'"
            :class-name="'connected-status'"
          >
            <template #form-item>
              <div
                v-if="formData.status === STATUS_CONNECT.SUCCESSFUL"
                class="confirmation-status"
              >
                <IconCheck />
                <div class="status">
                  {{ $t("store.correct_information") }}
                </div>
              </div>
              <div v-else class="confirmation-status">
                <IconError />
                <div class="status">
                  {{ $t("store.incorrect_information") }}
                </div>
              </div>
            </template>
          </div-inline>

          <template v-if="formData.status === STATUS_CONNECT.SUCCESSFUL">
            <div-inline
              :label="'forwarding_settings'"
              :class-name="'option-connect'"
            >
              <template #form-item>
                <el-radio-group
                  v-model="formData.setting_mail_forward"
                  @change="handleChangeMailStatus"
                >
                  <el-radio :label="STATUS_TYPE.ENABLE">{{
                    $t("completion")
                  }}</el-radio>
                  <el-radio :label="STATUS_TYPE.DISABLE">{{
                    $t("incomplete")
                  }}</el-radio>
                </el-radio-group>
              </template>
            </div-inline>
            <div class="mail-forward">
              <div class="option-connect">
                <span>{{ $t("please_set_exclusive_email_1") }}</span>
                <span class="text-highlight">{{ emailForward }}</span>
                <span> {{ $t("please_set_exclusive_email_2") }}</span>
              </div>
              <div class="text-note-check-mail">
                <span>{{ $t("text_note_check_mail_1") }}</span>
                <span class="text-highlight">{{
                  $t("text_note_check_mail_hotpepper_beauty")
                }}</span>
                <span>{{ $t("text_note_check_mail_2") }}</span>
              </div>
              <div-inline :label="'salon_board'" :class-name="'option-connect'">
                <template #form-item>
                  <a
                    class="text-link link"
                    :href="URL_HOT_PEPPER_BEAUTY"
                    target="_blank"
                  >
                    {{ URL_HOT_PEPPER_BEAUTY }}
                  </a>
                </template>
              </div-inline>
            </div>
          </template>
        </el-form>
      </template>
    </connect-template-crawl>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, watch } from "vue";
import { FormInstance } from "element-plus";
import DivInline from "~/../../src/shared/components/DivInline.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import InputPassword from "~/../../src/shared/components/input/InputPasswordCache.vue";
import { STATUS_TYPE } from "~/../../src/shared/constants";
import storeSettingRequest from "~/../../src/shared/requests/StoreSettingRequest";
import {
  messageError,
  messageSuccess,
  createSuccess,
  updateError,
  updateSuccess,
} from "~/../../src/shared/utils/notification";
import ConnectTemplateCrawl from "~/../../src/store/components/external-site/ConnectTemplateCrawl.vue";
import bookingRequest from "~/../../src/shared/requests/BookingRequest";
import { STATUS_CONNECT } from "~/../../src/shared/constants/status";
import { useRuntimeConfig } from "nuxt/app";
import { EMAIL_FORWARD_EXTERNAL } from "~/../../src/shared/constants";
import { URL_HOT_PEPPER_BEAUTY } from "~/../../src/shared/constants";
import hotPepperBeautyRules from "~/../../src/store/validates/hotPepperBeauty";
import STATUS_CODE from "~/../../src/shared/constants/statusCodeResponse";

interface HotPepperBeauty {
  identity_from_mail: string;
  setting_mail_forward: number;
}

interface Prop {
  data: HotPepperBeauty;
}

const props = defineProps<Prop>();
const { data } = toRefs(props);
const formRef = ref<FormInstance>();
const formData = reactive({
  identity_from_mail: data.value?.identity_from_mail,
  setting_mail_forward: data.value?.setting_mail_forward || 0,
  status: data.value?.status || STATUS_CONNECT.FAILED,
});
const config = useRuntimeConfig();
const emailForward = config.public.emailForward || EMAIL_FORWARD_EXTERNAL;
const emits = defineEmits(["updateHopepperBeauty"]);
const loading = ref(false);
const loadingSubmit = ref(false);
const loadingChange = ref(false);
const errorMsg = ref({});

const handleChangeMailStatus = async () => {
  try {
    loadingChange.value = true;
    await storeSettingRequest.settingMailForwardHotPepperBeauty({
      setting_mail_forward: !!formData.setting_mail_forward,
    });
  } catch (e) {
    if (formData.setting_mail_forward) {
      formData.setting_mail_forward = 1;
    } else {
      formData.setting_mail_forward = 0;
    }
  } finally {
    loadingChange.value = false;
  }
};

const postHotPepperBeauty = async (form: FormInstance) => {
  if (!form) {
    return;
  }
  await form.validate(async (valid) => {
    if (valid) {
      errorMsg.value = {};
      try {
        loadingSubmit.value = true;
        await storeSettingRequest.saveHotPepperBeautySetting(formData);
        emits("updateHopperBeauty");
        messageSuccess("success.connect_hot_pepper_beauty");
        formData.status = STATUS_CONNECT.SUCCESSFUL;
        formData.setting_mail_forward = 0;
      } catch (error) {
        if (error?.response.status === STATUS_CODE.UNPROCESSABLE_ENTITY) {
          errorMsg.value = { identity_from_mail: error.response._data.message };
        } else {
          messageError("errors.connect_external");
        }
      } finally {
        loadingSubmit.value = false;
      }
    }
  });
};

watch(data, (value) => {
  if (value) {
    formData.identity_from_mail = value.identity_from_mail;
    formData.setting_mail_forward = value.setting_mail_forward || 0;
    formData.status = value.status;
  } else {
    formData.identity_from_mail = "";
    formData.setting_mail_forward = null;
    formData.status = STATUS_CONNECT.FAILED;
  }
});
</script>

<style lang="scss" scoped>
@use "~/../../src/store/assets/scss/variables.scss" as *;
.text-note {
  margin-top: -10px;
  margin-bottom: 15px;
  margin-left: 160px;
  color: $red-color-icon;
  white-space: nowrap;
}

.text-red {
  color: $red-color-icon;
}

.mail-forward {
  font-size: 14px;
  color: $black-80;
  margin-bottom: 30px;

  .text-highlight {
    font-weight: 700;
  }

  .option-connect {
    white-space: nowrap;
    margin-bottom: 0 !important;
  }

  .text-note-check-mail {
    width: 690px;
    margin-bottom: 24px;
  }
}
</style>
