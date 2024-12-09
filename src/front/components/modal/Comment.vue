<template>
  <div>
    <client-only>
      <el-dialog
        :model-value="dialogVisible"
        :before-close="handleClose"
        :title="title"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :show-close="showClose"
      >
        <el-scrollbar max-height="400px">
          <el-form
            ref="_refForm"
            :model="form"
            class="custom-form"
            :rules="reviewRules"
            require-asterisk-position="right"
          >
            <div class="box-review">
              <el-form-item :label="$t('evaluation_score')">
                <StoreEvaluateStartComponent
                  v-model="form.star"
                  :icon-disabled="false"
                  :disabled="false"
                  :show-score="true"
                />
              </el-form-item>
              <el-form-item :label="$t('nick_name')" prop="nickname">
                <input-text
                  v-model="form.nickname"
                  :placeholder="$t('placeholder.nick_name')"
                />
              </el-form-item>
              <el-form-item :label="$t('gender')" prop="gender">
                <el-radio-group v-model="form.gender">
                  <el-radio
                    v-for="gender in genderOptions"
                    :label="gender.value"
                    >{{ $t(gender.label) }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('era')" prop="age">
                <el-select v-model="form.age" class="select-gender">
                  <el-option
                    v-for="item in ageOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="$t(item.label)"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('title_keyword')" prop="title">
                <input-text
                  v-model="form.title"
                  :placeholder="$t('placeholder.title_keyword')"
                />
              </el-form-item>
              <el-form-item :label="$t('content')" prop="content">
                <el-input
                  v-model="form.content"
                  v-input-trim
                  :placeholder="$t('placeholder.content')"
                  type="textarea"
                  rows="4"
                  :maxlength="MAX_LENGTH_CONTENT_REVIEW"
                />
              </el-form-item>
            </div>
          </el-form>
        </el-scrollbar>
        <template #footer>
          <button-white :name="$t('button.cancel')" @click="handleClose" />
          <ButtonGreenMedium
            :loading="loading"
            :name="$t('button.submit_review')"
            @click="handleSubmit"
          />
        </template>
      </el-dialog>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { defineProps, reactive, toRefs, ref } from "vue";
import ButtonGreenMedium from "~/../../src/shared/components/button/GreenMedium.vue";
import ButtonWhite from "~/../../src/shared/components/button/ButtonWhite.vue";
import { genderOptions, ageOptions } from "~/../../src/shared/constants/user";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import { MAX_LENGTH_CONTENT_REVIEW } from "~/../../src/shared/utils/validate";
import reviewRules from "~/../../src/front/validate/review";
import { GENDER } from "~/../../src/shared/constants/user";
import StoreEvaluateStartComponent from "~/../../src/shared/components/EvaluateStartComponent.vue";

interface Prop {
  dialogVisible: boolean;
  title?: string;
  nameCancel?: string;
  nameConfirm?: string;
  width?: string;
  loading?: boolean;
  showClose?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  dialogVisible: false,
  title: "",
  nameCancel: "",
  nameConfirm: "",
  width: "30%",
  loading: false,
  showClose: true,
});
const { dialogVisible, title, width, loading } = toRefs(props);
const emits = defineEmits(["handleClose", "handleSubmit"]);
const _refForm = ref();
const form = reactive({
  star: 1,
  content: "",
  title: "",
  nickname: "",
  age: "",
  gender: GENDER.OTHER,
});
const handleClose = () => {
  emits("handleClose");
};

const handleSubmit = async () => {
  await _refForm.value.validate(async (valid: boolean) => {
    if (valid) {
      emits("handleSubmit", form);
    }
  });
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

:deep(.el-dialog) {
  width: 680px;
}

:deep(.el-radio__input) {
  .el-radio__inner::after {
    background-color: $blue-100;
    height: 9px;
    width: 9px;
  }
}

:deep(.el-select) {
  width: 100%;

  .el-input {
    height: 40px;
  }
}

:deep(.el-dialog) {
  width: 680px;
}

:deep(.el-input__wrapper) {
  width: 100%;
}

.box-review {
  padding: 0 15px;
}

:deep(.el-dialog__header) {
  padding: 20px;
  border-top: 1px solid $gray-50;
  margin-top: 14px;
}

:deep(.el-dialog__body) {
  padding: 20px 5px 10px 5px;

  .custom-form {
    .el-form-item {
      .el-form-item__label {
        min-width: 120px;
        justify-content: flex-start;
      }

      .el-form-item__content {
        .el-input {
          height: 40px;
        }
      }
    }
  }
}

:deep(.el-dialog__header) {
  .el-dialog__headerbtn {
    top: 0;
  }
}

@include res("xs-only", $breakpoints-spec) {
  :deep(.el-dialog) {
    width: 90%;
  }

  :deep(.el-form-item) {
    display: block;

    .el-form-item__label {
      width: 100%;
    }
  }
}
</style>
