<template>
  <el-dialog
    :model-value="dialogVisible"
    :title="$t('detail')"
    width="680px"
    align-center
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :rules="reviewRules"
      :model="formData"
      class="form-menu"
      require-asterisk-position="right"
    >
      <div class="box-review">
        <el-scrollbar max-height="680px">
          <div class="review-item align-items-center">
            <div class="label">{{ $t("contributor") }}</div>
            <div class="content">{{ dataReview.customer?.fullname }}</div>
          </div>
          <div class="review-item align-items-center">
            <div class="label">{{ $t("posted_date") }}</div>
            <div class="content">
              {{ formatDate(dataReview.created_at, "YYYY年MM月DD日 HH:mm") }}
            </div>
          </div>
          <div class="review-item align-items-center">
            <div class="label">{{ $t("evaluation_score") }}</div>
            <div class="content d-flex align-items-center">
              <EvaluateStartComponent :model-value="dataReview.star" />
            </div>
          </div>
          <div class="review-item align-items-center">
            <div class="label">{{ $t("nick_name") }}</div>
            <div class="content">{{ dataReview.nickname }}</div>
          </div>
          <div class="review-item align-items-center">
            <div class="label">{{ $t("gender") }}</div>
            <div class="content">
              {{
                findObj(genderOptions, "value", dataReview.gender)
                  ? $t(findObj(genderOptions, "value", dataReview.gender).label)
                  : ""
              }}
            </div>
          </div>
          <div class="review-item align-items-center">
            <div class="label">{{ $t("era") }}</div>
            <div class="content">
              {{
                findObj(ageOptions, "value", dataReview.age)
                  ? $t(findObj(ageOptions, "value", dataReview.age).label)
                  : ""
              }}
            </div>
          </div>
          <div class="review-item align-items-center">
            <div class="label">{{ $t("title_keyword") }}</div>
            <div class="content">{{ dataReview.title }}</div>
          </div>
          <div class="review-item">
            <div class="label">{{ $t("content") }}</div>
            <div class="content">{{ dataReview.content }}</div>
          </div>
          <el-form-item class="review-item" prop="content">
            <el-input
              v-model="formData.content"
              type="textarea"
              :maxlength="MAX_LENGTH_DEFAULT_TEXTAREA"
              :rows="6"
              :placeholder="$t('placeholder.reply')"
            />
          </el-form-item>
        </el-scrollbar>
      </div>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <button-white :name="$t('button.cancel')" @click="handleClose" />
        <ButtonCommon
          v-if="dataReview.status === IS_REPLY_REVIEW"
          :loading="isEditLoading"
          :name="$t('button.save')"
          background-color="#409EFF"
          color="#fff"
          border-radius="4px"
          width="60px"
          @click="editReview(formRef)"
        />

        <ButtonCommon
          v-else
          :loading="isReplyLoading"
          :name="$t('reply')"
          background-color="#409EFF"
          color="#fff"
          border-radius="4px"
          width="60px"
          @click="replyReview(formRef)"
        />
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, reactive, toRefs, ref, watchEffect } from "vue";
import EvaluateStartComponent from "~/../../src/shared/components/EvaluateStartComponent.vue";
import { formatDate } from "~/../../src/shared/utils/format";
import { i18n } from "~/../../src/shared/plugins/i18n";
import reviewRules from "~/../../src/store/validates/review";
import ReviewRequest from "~/../../src/shared/requests/ReviewRequest";
import ButtonWhite from "~/../../src/shared/components/button/ButtonWhite.vue";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import { Review } from "~/../../src/store/models/review";
import { FormInstance } from "element-plus";
import { IS_REPLY_REVIEW } from "~/../../src/shared/constants/status";
import { MAX_LENGTH_DEFAULT_TEXTAREA } from "~/../../src/shared/utils/validate";
import {
  createError,
  createSuccess,
} from "~/../../src/shared/utils/notification";
import { updateSuccess } from "~/../../src/shared/utils/notification";
import { genderOptions, ageOptions } from "~/../../src/shared/constants/user";
import { findObj } from "~/../../src/shared/utils";

interface Prop {
  dialogVisible: boolean;
  width?: string;
  dataReview: Review;
  loading?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  dialogVisible: false,
  width: "30%",
  loading: false,
  isReply: false,
  isViewData: false,
});

const { t } = i18n.global;
const { dialogVisible, dataReview } = toRefs(props);
const emits = defineEmits([
  "handleCloseView",
  "getDataReview",
  "deleteReviewStore",
]);

const isReplyLoading = ref(false);
const isEditLoading = ref(false);
const formRef = ref<FormInstance>();
const formData = reactive({
  content: "",
});
const handleClose = () => {
  formData.content = dataReview.value.reply?.content;
  resetForm(formRef.value);
  emits("handleCloseView");
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const replyReview = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        isReplyLoading.value = true;
        await ReviewRequest.replyReview(dataReview.value.id, formData);
        createSuccess();
        formData.content = "";
        emits("handleCloseView");
        emits("getDataReview");
      } catch (error) {
        createError();
      } finally {
        isReplyLoading.value = false;
      }
    }
  });
};

const editReview = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid) => {
    if (valid) {
      try {
        isEditLoading.value = true;
        await ReviewRequest.editReplyReview(dataReview.value.id, formData);
        updateSuccess();
        formData.content = "";
        emits("handleCloseView");
        emits("getDataReview");
      } catch (error) {
        createError();
      } finally {
        isEditLoading.value = false;
      }
    }
  });
};

watchEffect(() => {
  formData.content = dataReview.value.reply?.content;
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.box-review {
  color: $black-80;

  .review-item {
    display: flex;
    margin-bottom: 18px;
    margin-right: 15px;
  }

  .label {
    flex-basis: 200px;
    font-size: 14px;
    line-height: 22px;
  }

  .content {
    flex: 1;
    white-space: pre-wrap;

    :deep(.el-rate--large) {
      height: 16px;
    }

    .rate-star {
      font-weight: bold;
      font-size: 16px;
      line-height: 16px;
      color: $color-rating;
      margin-top: 2px;
      margin-left: 6px;
    }
  }
}

.btn-delete {
  :deep(.el-icon) {
    height: 15px;
    width: 15px;
  }
}
</style>
