<template>
  <div class="connect-google">
    <connect-template
      :disabled-connect="formData.status && data"
      :disabled-save="!formData.status || (formData.status && data)"
      :is-loading-connect="loading"
      :is-loading-save="loadingSubmit"
      @connect-data="checkConnection(formRef)"
      @save-data="postGoogle(formRef)"
    >
      <template #connect-type>
        <el-form
          ref="formRef"
          class="data-form"
          :model="formData"
          :rules="googleRules"
        >
          <el-form-item v-if="!data" :label="$t('email')" prop="email">
            <input-text v-model="formData.email" width="400px" />
          </el-form-item>
          <el-form-item :label="$t('password')" prop="password">
            <input-text v-model="formData.password" width="400px" />
          </el-form-item>
          <div-inline
            :label="'store.communication_confirmation_status'"
            :class-name="'connected-status'"
          >
            <template #form-item>
              <div v-if="formData.status" class="confirmation-status">
                <IconCheck />
                <div class="status">{{ $t("store.correct_information") }}</div>
              </div>
              <div v-if="!formData.status" class="confirmation-status">
                <IconError />
                <div class="status">
                  {{ $t("store.incorrect_information") }}
                </div>
              </div>
            </template>
          </div-inline>
          <!--          <div-inline-->
          <!--            :label="'line_linkage_method'"-->
          <!--            :class-name="'connected-status'"-->
          <!--          >-->
          <!--            <template #form-item>-->
          <!--              <div>-->
          <!--                <a-->
          <!--                  class="text-guide"-->
          <!--                  target="_blank"-->
          <!--                  :href="useAssetsFile('LINE_Linkage_Method.pdf')"-->
          <!--                  >{{ $t("coordination_procedure") }}</a-->
          <!--                >-->
          <!--              </div>-->
          <!--            </template>-->
          <!--          </div-inline>-->
        </el-form>
      </template>
    </connect-template>
  </div>
</template>

<script lang="ts" setup>
import ConnectTemplate from "./ConnectTemplate";
import { reactive, ref, toRefs, watch } from "vue";
import { FormInstance } from "element-plus";
import DivInline from "~/../../src/shared/components/DivInline.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import googleRules from "~/../../src/store/validates/google";
import storeSettingRequest from "~/../../src/shared/requests/StoreSettingRequest";
import {
  messageError,
  messageSuccess,
  createSuccess,
  createError,
} from "~/../../src/shared/utils/notification";

const openLink = (link: string) => {
  window.open(link, "_blank");
};

interface Google {
  email: "";
  password: "";
}
interface Prop {
  data: Google;
}
const emits = defineEmits(["updateGoogle"]);
const props = defineProps<Prop>();
const { data } = toRefs(props);

const formRef = ref<FormInstance>();
const formData = reactive({
  // TODO data
  email: data.value?.email || "",
  password: data.value?.password || "",
  status: !!data.value,
});

const loading = ref(false);
const loadingSubmit = ref(false);

const checkConnection = async (form: FormInstance) => {
  if (!form) {
    return;
  }
  await form.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        await storeSettingRequest.checkGoogleAvailable(formData);
        formData.status = true;
        messageSuccess("success.connect_google");
      } catch (error) {
        formData.status = false;
        messageError("errors.connect_external");
      } finally {
        loading.value = false;
      }
    } else {
      formData.status = false;
    }
  });
};

const postGoogle = async (form: FormInstance) => {
  if (!form) {
    return;
  }
  await form.validate(async (valid) => {
    if (valid) {
      try {
        if (formData.status) {
          loadingSubmit.value = true;
          await storeSettingRequest.saveGoogleSetting(formData);
          emits("updateGoogle");
          createSuccess();
        } else {
          messageError("errors.setting_google");
        }
      } catch (error) {
        formData.status = false;
        createError();
      } finally {
        loadingSubmit.value = false;
      }
    } else {
      formData.status = false;
    }
  });
};

watch(data, (value) => {
  if (value) {
    formData.email = value.email;
    formData.password = value.password;
  } else {
    formData.email = "";
    formData.password = "";
  }
  formData.status = !!value;
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

:deep(.data-form) {
  width: 100% !important;
}

:deep(.el-form-item) {
  .el-form-item__label {
    width: 160px;
    min-width: 160px;
    justify-content: flex-start;
    padding: unset;
  }
}
</style>
