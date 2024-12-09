<template>
  <div class="application-recruitment">
    <div class="application-recruitment__header">
      <div class="application-recruitment__header-title">
        {{ $t("front.recruitment.application_requirements") }}
      </div>
    </div>
    <el-form
      ref="formRef"
      class="data-form"
      :model="dataApply"
      label-width="160px"
      label-position="left"
    >
      <div class="application-item">
        <div class="application-item__body recruitment-period">
          <client-only>
            <el-form-item
              class="form-item"
              :label="$t('front.recruitment.recruitment_period')"
            >
              <el-date-picker
                v-model="dataApply.start_date"
                type="date"
                class="start-date"
                format="YYYY年MM月DD日"
                value-format="YYYY-MM-DD"
                readonly
                clearable
              />
              <el-date-picker
                v-model="dataApply.end_date"
                type="date"
                class="end-date"
                format="YYYY年MM月DD日"
                value-format="YYYY-MM-DD"
                readonly
                clearable
              />
            </el-form-item>
          </client-only>
        </div>
      </div>
      <div class="application-item">
        <div class="application-item__body">
          <el-form-item :label="$t('front.recruitment.recruitment_details')">
            <div class="box-text">{{ dataApply.recruitment_detail }}</div>
          </el-form-item>
        </div>
      </div>
      <div class="application-item">
        <div class="application-item__body">
          <el-form-item :label="$t('front.recruitment.work_content')">
            <div class="box-text">{{ dataApply.job_overview }}</div>
          </el-form-item>
        </div>
      </div>
      <div class="application-item">
        <div class="application-item__body">
          <el-form-item :label="$t('front.recruitment.business_flow')">
            <div class="box-text">{{ dataApply.workflow }}</div>
          </el-form-item>
        </div>
      </div>
      <div class="application-item">
        <div class="application-item__body">
          <el-form-item :label="$t('front.recruitment.work_location')">
            <div class="box-text">{{ dataApply.workplace }}</div>
          </el-form-item>
        </div>
      </div>
      <div class="application-item">
        <div class="application-item__body">
          <el-form-item :label="$t('front.recruitment.working_hours')">
            <div class="box-text">{{ workHours }}</div>
          </el-form-item>
        </div>
      </div>
      <div class="application-item">
        <div class="application-item__body">
          <el-form-item :label="$t('front.recruitment.salary')">
            <div class="box-text">{{ salaryPrice }}</div>
          </el-form-item>
        </div>
      </div>
      <div class="application-item">
        <div class="application-item__body">
          <el-form-item :label="$t('front.recruitment.training_system')">
            <div class="box-text">{{ dataApply.training }}</div>
          </el-form-item>
        </div>
      </div>
      <div class="application-item">
        <div class="application-item__body">
          <el-form-item :label="$t('front.recruitment.contact_information')">
            <div class="box-text">{{ dataApply.contact }}</div>
          </el-form-item>
        </div>
      </div>
      <div class="application-item">
        <div class="application-item__body">
          <el-form-item :label="$t('front.recruitment.manager')">
            <div class="box-text">{{ dataApply.manager }}</div>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="group-button d-flex justify-content-end">
      <button-common
        :name="$t('button.apply')"
        width="108px"
        height="40px"
        color="white"
        background-color="#B4985C"
        @click="handleClick"
      ></button-common>
    </div>
    <FormRecruitment
      :dialog-visible="centerDialogVisible"
      :id-jod="dataApply.id"
      @handle-close-view="handleCloseView"
    />
  </div>
</template>

<script setup lang="ts">
import InputText from "~/../../src/shared/components/input/InputText.vue";
import { ref, defineProps, toRefs, watchEffect } from "vue";
import FormRecruitment from "~/../../src/front/components/modal/FormRecruitment.vue";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import { Recruitment } from "~/../../src/shared/types/recruitment";
import priceDisplay from "~/../../src/shared/utils/price";

interface Prop {
  dataApply: Recruitment;
  idJod?: number;
}

const props = withDefaults(defineProps<Prop>(), {
  idJod: 0,
});

const { dataApply } = toRefs(props);
const salaryPrice = ref("");
const workHours = ref("");
const centerDialogVisible = ref(false);

const handleCloseView = () => {
  centerDialogVisible.value = false;
};

const handleClick = () => {
  centerDialogVisible.value = true;
};

watchEffect(() => {
  workHours.value = priceDisplay(dataApply.value.working_time);
  salaryPrice.value = priceDisplay(dataApply.value.salary);
});
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;
@use "../../../../../node_modules/element-plus/theme-chalk/src/common/var" as *;
@use "../../../../../node_modules/element-plus/theme-chalk/src/mixins/mixins" as *;

.application-recruitment {
  &__header {
    &-title {
      background-color: #b4985c33;
      color: #b4985c;
      font-weight: bold;
      padding: 12px 24px;
      font-size: 15px;
      margin-bottom: 15px;
      border-radius: 3px;
    }
  }

  .application-item {
    display: flex;
    align-items: center;

    .recruitment-period {
      margin-top: 16px;
      margin-bottom: 10px;

      :deep(.start-date) {
        margin-right: calc(100% - 49.1 * 2%);
      }

      :deep(.el-date-editor.el-input) {
        width: 49.1%;
        height: 40px;
        gap: 10px;
      }
    }

    &__label {
      width: 160px;
    }

    &__images img {
      width: 160px;
      height: 160px;
    }

    &__body {
      width: 100%;

      .box-text {
        background-color: white;
        padding: 4px 10px;
        border: 1px solid $gray-500;
        border-radius: 4px;
        white-space: break-spaces;
        width: 100%;
      }
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  :deep(.el-form-item) {
    display: block;
  }

  .group-button {
    margin: 8px 24px 24px 0;
  }
}

@include res("xs-only", $breakpoints-spec) {
  .application-item {
    padding: 0 24px;
  }
}
</style>
