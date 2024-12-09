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
        align-center
      >
        <el-scrollbar max-height="60vh">
          <el-form
            ref="_refForm"
            :model="data"
            class="custom-form"
            require-asterisk-position="right"
          >
            <div class="box-review">
              <el-form-item class="hidden-label" :label="$t(' ')">
                <div>
                  <img
                    v-if="data?.image?.file?.url"
                    :src="data?.image?.file?.url"
                    alt=""
                  />
                  <img
                    v-else
                    src="../../assets/images/default_store.svg"
                    alt=""
                  />
                </div>
              </el-form-item>
              <el-form-item :label="$t('full_name')">
                <input-text v-model="data.name" disabled=""></input-text>
              </el-form-item>
              <el-form-item :label="$t('store.position')">
                <input-text v-model="data.position" disabled=""></input-text>
              </el-form-item>
              <el-form-item :label="$t('store.work_years')">
                <input-text v-model="data.year_works" disabled=""></input-text>
              </el-form-item>
              <el-form-item class="fee" :label="$t('store.nomination_fee')">
                <input-price v-model="fee" :disabled="true"></input-price>
                <div>{{ $t("yen") }}({{ $t("tax_include") }})</div>
              </el-form-item>
              <el-form-item :label="$t('store.selfPR')">
                <input-text
                  v-model="data.info"
                  type="textarea"
                  disabled=""
                  height="80px"
                ></input-text>
              </el-form-item>
              <el-form-item class="working_hours" :label="$t('working_hours')">
                <div>
                  <div v-for="item in dataTimeOpen" :key="item.day_of_week">
                    <span v-if="item.day_of_week === DATA_DAY_WORKING.MONDAY"
                      >{{ $t("monday") }}{{ $t("day_of_week") }}：</span
                    >
                    <span v-if="item.day_of_week === DATA_DAY_WORKING.TUESDAY"
                      >{{ $t("tuesday") }}{{ $t("day_of_week") }}：</span
                    >
                    <span v-if="item.day_of_week === DATA_DAY_WORKING.WEDNESDAY"
                      >{{ $t("wednesday") }}{{ $t("day_of_week") }}：</span
                    >
                    <span v-if="item.day_of_week === DATA_DAY_WORKING.THURSDAY"
                      >{{ $t("thursday") }}{{ $t("day_of_week") }}：</span
                    >
                    <span v-if="item.day_of_week === DATA_DAY_WORKING.FRIDAY"
                      >{{ $t("friday") }}{{ $t("day_of_week") }}：</span
                    >
                    <span v-if="item.day_of_week === DATA_DAY_WORKING.SATURDAY"
                      >{{ $t("saturday") }}{{ $t("day_of_week") }}：</span
                    >
                    <span v-if="item.day_of_week === DATA_DAY_WORKING.SUNDAY"
                      >{{ $t("sunday") }}{{ $t("day_of_week") }}：</span
                    >
                    <span v-for="(time, index) in item.data" :key="time">
                      <span
                        >{{ formatTime(time.start) }} ～
                        {{ formatTime(time.end) }}</span
                      >
                      <span v-if="index < item.data?.length - 1">、</span>
                    </span>
                  </div>
                </div>
              </el-form-item>
              <el-form-item :label="$t('holiday')">
                <ClientOnly>
                  <MultiDate v-model="closingTimeStaff" :disabled="true" />
                </ClientOnly>
              </el-form-item>

              <el-form-item
                v-if="data?.staff_comments.length"
                class="list-images"
                :label="
                  storeType === SALON ? $t('staff_image_review') : $t('image')
                "
              >
                <div
                  v-for="item in data?.staff_comments"
                  :key="item?.image?.file?.url"
                  class="image-comment"
                >
                  <el-image :src="item?.image?.file?.url" />
                  <div class="content">{{ item.content }}</div>
                </div>
              </el-form-item>
            </div>
          </el-form>
        </el-scrollbar>
        <template #footer>
          <button-white :name="$t('close')" @click="handleClose" />
        </template>
      </el-dialog>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { defineProps, reactive, toRefs, ref, computed } from "vue";
import ButtonWhite from "~/../../src/shared/components/button/ButtonWhite.vue";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import InputPrice from "~/../../src/shared/components/input/Price.vue";
import { DATA_DAY_WORKING } from "~/../../src/shared/constants/reservation";
import { formatTime, formatDate } from "~/../../src/shared/utils";
import { i18n } from "~/../../src/shared/plugins/i18n";
import MultiDate from "~/../../src/shared/components/input/MultiDate.vue";
import priceDisplay from "~/../../src/shared/utils/price";
import { StaffModel } from "~/../../src/front/models";
import { SALON } from "~/../../src/shared/constants/category";

interface Prop {
  dialogVisible: boolean;
  title?: string;
  showClose?: boolean;
  data: StaffModel | null;
  storeType: number;
}

const props = withDefaults(defineProps<Prop>(), {
  dialogVisible: false,
  title: "",
  showClose: true,
  data: null,
});
const { dialogVisible, title, data } = toRefs(props);
const emits = defineEmits(["handleClose"]);
const { t } = i18n.global;
const fee = ref(null);

if (data.value) {
  fee.value = priceDisplay(data.value.fee);
}
const handleClose = () => {
  emits("handleClose");
};

const closingTimeStaff = computed(() => {
  const arrayTimeClosingStaff = [];
  if (data.value) {
    data.value.staff_closing_times.filter((item) => {
      arrayTimeClosingStaff.push(item.day_off);
    });
  }
  return arrayTimeClosingStaff;
});

const dataTimeOpen = computed(() => {
  const arrayTime = [];
  if (data.value) {
    data.value.staff_opening_times.filter((item) => {
      const index = arrayTime.findIndex(
        (time) => item.day_of_week === time.day_of_week
      );
      if (index === -1) {
        arrayTime.push({
          day_of_week: item.day_of_week,
          data: [
            {
              start: item.start,
              end: item.end,
            },
          ],
        });
      } else {
        arrayTime[index].data?.push({
          start: item.start,
          end: item.end,
        });
      }
    });
  }
  return arrayTime;
});
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

img {
  width: 200px;
  height: 200px;
  object-fit: cover;
}

:deep(.el-dialog) {
  width: 800px;
}

:deep(.list-images) {
  .el-form-item__content {
    gap: 10px;
    display: block;
    justify-content: space-between;
    line-height: unset;

    .image-comment {
      padding-bottom: 10px;

      .el-image {
        width: 160px;
        height: 160px;

        img {
          object-fit: cover;
        }
      }

      .content {
        white-space: pre-line;
      }
    }
  }
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

:deep(.el-textarea__inner) {
  height: 80px;
}

:deep(.el-input__wrapper) {
  width: 100%;
}

.fee {
  color: $black-80;
  display: flex;

  .custom-input-price {
    width: 60%;
    margin-right: 10px;
  }
  width: 60%;
}

.box-review {
  padding: 0 15px;
}

.working_hours {
  color: $black-80;
}

:deep(.el-dialog__header) {
  padding: 20px;
}

:deep(.el-dialog__body) {
  padding: 0 5px 10px 5px;

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

@media only screen and (min-width: 768px) and (max-width: 1000px) {
  :deep(.el-dialog) {
    width: 80%;
  }
}

@include res("xs-only", $breakpoints-spec) {
  :deep(.el-dialog) {
    width: 90%;
  }

  :deep(.hidden-label) {
    .el-form-item__label {
      display: none;
    }
  }

  :deep(.el-scrollbar__wrap) {
    max-height: 450px !important;
  }

  :deep(.el-form-item) {
    display: block;

    .el-form-item__label {
      width: 100%;
    }
  }

  //:deep(.list-images) {
  //  .el-form-item__content {
  //    flex-direction: column;
  //    width: 80%;
  //
  //    .el-image {
  //      width: 95%;
  //      height: 300px;
  //
  //      img {
  //        object-fit: cover;
  //      }
  //    }
  //  }
  //}
}
</style>
