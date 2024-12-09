<template>
  <div>
    <client-only>
      <el-dialog
        :model-value="dialogVisible"
        :title="$t('front.recruitment.enter_information')"
        align-center
        :close-on-click-modal="false"
        :destroy-on-close="true"
        @close="handleClose"
      >
        <el-scrollbar max-height="400px">
          <div class="form-apply">
            <el-form
              ref="formRef"
              :rules="recruitmentRules"
              :model="formData"
              class="form-menu"
              require-asterisk-position="right"
              label-position="left"
              label-width="180px"
            >
              <div class="box-recruitment">
                <el-form-item :label="$t('full_name')" required>
                  <el-form-item prop="first_name" class="first_name">
                    <input-text
                      v-model="formData.first_name"
                      :placeholder="$t('placeholder.first_name')"
                    />
                  </el-form-item>
                  <el-form-item prop="last_name" class="last_name">
                    <input-text
                      v-model="formData.last_name"
                      :placeholder="$t('placeholder.last_name')"
                    />
                  </el-form-item>
                </el-form-item>

                <el-form-item prop="gender" :label="$t('gender')">
                  <el-select
                    v-model="formData.gender"
                    class="select-gender"
                    placeholder=""
                  >
                    <el-option
                      v-for="item in genderOptions"
                      :key="item.value"
                      :value="item.value"
                      :label="$t(item.label)"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  :label="$t('birthday')"
                  class="form-item w-100"
                  prop="birthday"
                >
                  <client-only>
                    <el-date-picker
                      v-model="formData.birthday"
                      :disabled-date="disabledDate"
                      type="date"
                      :placeholder="$t('placeholder.birthday')"
                      format="YYYY年MM月DD日"
                      value-format="YYYY-MM-DD"
                      clearable
                    />
                  </client-only>
                </el-form-item>

                <el-form-item :label="$t('email_address')" prop="email">
                  <input-text
                    v-model="formData.email"
                    :placeholder="$t('placeholder.email_recruitment')"
                  />
                </el-form-item>

                <el-form-item :label="$t('phone_number')" prop="phone">
                  <InputPhone
                    v-model="formData.phone"
                    :placeholder="$t('placeholder.phone')"
                  />
                </el-form-item>

                <el-form-item :label="$t('occupation')" prop="position">
                  <input-text
                    v-model="formData.position"
                    :placeholder="$t('placeholder.occupation')"
                  />
                </el-form-item>
                <el-form-item
                  :label="$t('main_work_content')"
                  prop="job_overview"
                >
                  <el-input
                    v-model="formData.job_overview"
                    :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
                    :placeholder="$t('placeholder.main_work_content')"
                    type="textarea"
                    :rows="4"
                  />
                </el-form-item>
                <el-form-item
                  :label="$t('store.content_of_request')"
                  prop="remarks"
                >
                  <el-input
                    v-model="formData.remarks"
                    v-input-trim
                    :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
                    :rows="6"
                    :placeholder="$t('placeholder.note_recruitment')"
                    type="textarea"
                  />
                </el-form-item>
              </div>
            </el-form>
          </div>
        </el-scrollbar>
        <template #footer>
          <span class="dialog-footer">
            <button-white :name="$t('button.cancel')" @click="handleClose" />
            <button-common
              :name="$t('button.apply')"
              width="108px"
              height="40px"
              color="white"
              :loading="isApplyLoading"
              background-color="#B4985C"
              @click="submitForm(formRef)"
            ></button-common>
          </span>
        </template>
      </el-dialog>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, reactive, ref, toRefs } from "vue";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import InputPhone from "~/../../src/shared/components/input/Phone.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import ButtonWhite from "~/../../src/shared/components/button/ButtonWhite.vue";
import moment from "moment/moment";
import recruitmentRules from "~/../../src/front/validate/recruitment";
import GuestRecruitmentRequest from "~/../../src/shared/requests/GuestRecruitmentRequest";
import { MAX_LENGTH_DEFAULT_TEXTAREA } from "~/../../src/shared/utils/validate";
import { genderOptions } from "~/../../src/shared/constants/user";
import {
  createError,
  messageSuccess,
} from "~/../../src/shared/utils/notification";
import { FormInstance } from "element-plus";

interface Prop {
  dialogVisible: boolean;
  width?: string;
  idJod?: number;
}

const props = withDefaults(defineProps<Prop>(), {
  dialogVisible: false,
  width: "90%",
  idJod: 0,
});

const { idJod } = toRefs(props);

const formData = reactive({
  first_name: "",
  last_name: "",
  phone: "",
  gender: "",
  birthday: "",
  email: "",
  position: "",
  job_overview: "",
  remarks: "",
});

const { dialogVisible } = toRefs(props);
const emits = defineEmits(["handleCloseView"]);
const formRef = ref<FormInstance>();
const isApplyLoading = ref(false);
const handleClose = () => {
  resetForm(formRef.value);
  emits("handleCloseView");
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const submitForm = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        isApplyLoading.value = true;
        const params = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          gender: formData.gender,
          birthday: formData.birthday,
          email: formData.email,
          position: formData.position,
          remarks: formData.remarks,
          working_type: formData.job_overview,
        };
        await GuestRecruitmentRequest.applyRecruitment(idJod.value, params);
        messageSuccess("success.complete_application_form");
        emits("handleCloseView");
        resetForm(formRef.value);
      } catch (error) {
        createError();
      } finally {
        isApplyLoading.value = false;
      }
    }
  });
};

const disabledDate = (time: Date) => {
  return moment(time) >= moment().subtract(0, "days");
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;
@use "../../../../node_modules/element-plus/theme-chalk/src/common/var" as *;
@use "../../../../node_modules/element-plus/theme-chalk/src/mixins/mixins" as *;

:deep(.el-dialog) {
  width: 680px;
}

:deep(.el-dialog__body) {
  padding: 20px 5px 10px 5px;
}

:deep(.el-input__wrapper) {
  width: 100%;
}

.box-recruitment {
  padding: 0 15px;

  :deep(.el-select) {
    width: 100%;

    .el-input {
      height: 40px;
    }
  }

  :deep(.el-date-editor.el-input) {
    width: 100%;
    height: 40px;
  }

  .first_name,
  .last_name {
    width: 49.1%;
  }

  :deep(.first_name) {
    margin-right: calc(100% - 49.1 * 2%);
  }
}

@include res("xs-only", $breakpoints-spec) {
  :deep(.el-dialog) {
    width: 90%;
  }
}
</style>
