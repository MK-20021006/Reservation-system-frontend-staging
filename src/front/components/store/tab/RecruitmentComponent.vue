<template>
  <div class="body-recruitment">
    <div v-if="dataJob" v-loading="loadingRecruitment">
      <div class="group-button">
        <el-button
          class="button-prev"
          :icon="ArrowRight"
          :disabled="indexDefault === 0"
          :class="{
            'disable-button': indexDefault === 0,
          }"
          @click="prevRecruitment()"
        ></el-button>
        <el-popover
          placement="top-start"
          :content="dataJob.job_title"
          :width="255"
          trigger="hover"
        >
          <template #reference>
            <div class="button-recruitment">
              {{ dataJob.job_title }}
            </div>
          </template>
        </el-popover>
        <el-button
          class="button-next"
          :icon="ArrowLeft"
          :disabled="indexDefault === listData.length - 1"
          :class="{
            'disable-button': indexDefault === listData.length - 1,
          }"
          @click="nextRecruitment()"
        ></el-button>
      </div>
      <StoreRecruitmentSliderRecruitmentComponent :data-slider="dataJob" />
      <StoreRecruitmentReviewJobComponent
        :data-review="dataJob.staff_reviews"
      />
      <StoreRecruitmentApplicationRequirementComponent :data-apply="dataJob" />
    </div>
    <div v-else>
      <p class="pb-10">{{ $t("no_data") }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, toRefs, ref } from "vue";
import ArrowRight from "~/../../src/shared/components/icon/ArrowRight.vue";
import ArrowLeft from "~/../../src/shared/components/icon/ArrowLeft.vue";
import GuestRecruitmentRequest from "~/../../src/shared/requests/GuestRecruitmentRequest";
import { Recruitment } from "~/../../src/shared/types/recruitment";

interface Prop {
  idStore?: number;
}

const props = withDefaults(defineProps<Prop>(), {
  idStore: 0,
});

const { idStore } = toRefs(props);
const dataJob = ref({});
const listData = ref([]);
const indexDefault = ref(0);
const loadingRecruitment = ref(true);
const getRecruitmentGuest = async () => {
  try {
    listData.value = (
      await GuestRecruitmentRequest.getGuestRecruitment<Recruitment>(
        idStore.value
      )
    ).data;
    dataJob.value = listData.value[indexDefault.value];
  } catch (e) {
  } finally {
    loadingRecruitment.value = false;
  }
};

const prevRecruitment = async () => {
  if (indexDefault.value > 0) {
    indexDefault.value = indexDefault.value - 1;
    dataJob.value = listData.value[indexDefault.value];
  }
};

const nextRecruitment = async () => {
  if (indexDefault.value < listData.value.length - 1) {
    indexDefault.value = indexDefault.value + 1;
    dataJob.value = listData.value[indexDefault.value];
  }
};

onMounted(async () => {
  await getRecruitmentGuest();
});
</script>
<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;
@use "../../../../../node_modules/element-plus/theme-chalk/src/common/var" as *;
@use "../../../../../node_modules/element-plus/theme-chalk/src/mixins/mixins" as *;

.body-recruitment {
  .group-button {
    display: flex;
    justify-content: center;
    padding-bottom: 16px;

    .disable-button {
      background-color: $gray-200 !important;
    }

    .button-recruitment {
      background-color: #c03522;
      text-align: center;
      color: white;
      font-weight: bold;
      width: 200px;
      display: inline-block;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0 15px;
    }

    .button-prev,
    .button-next {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      background-color: white;

      &:hover {
        border: 1px solid #dcdfe6 !important;
      }
    }
  }
}
</style>
