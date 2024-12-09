<template>
  <el-scrollbar max-height="400px">
    <div class="list-course">
      <div v-for="item in dataShow" :key="item.id" class="course-header">
        <div class="course-photo">
          <img
            v-if="item.model_has_file[0]?.file?.url"
            :src="item.model_has_file[0]?.file?.url"
            alt=""
          />
          <img v-else src="../../../assets/images/default_store.svg" alt="" />
        </div>
        <div class="course-body">
          <div class="course-body__name ellipsis">
            <span>◆</span>
            {{ item.name }}
          </div>
          <div class="course-body__compare">
            {{ getNameTag(item.course_has_tags) }}
          </div>
          <div class="course-body__compare ellipsis content">
            {{ item.contents }}
          </div>
          <div class="course-body__menu">
            <div
              v-if="
                (item.min_capacity || item.max_capacity) &&
                typeStore === RESTAURANT
              "
              class="course-body__menu-people"
            >
              <icon-people />
              <span>{{ item.min_capacity }}</span>
              <span v-if="item.max_capacity"
                >～ {{ item.max_capacity }}{{ $t("people") }}</span
              >
            </div>
            <div class="course-body__menu-time">
              <icon-lock-blue />
              <span>{{ formatTime(item.start_time) }}</span>
              <span>～ {{ formatTime(item.end_time) }}</span>
            </div>
            <div class="course-body__menu-money">
              <icon-money />
              <span class="money">{{ priceDisplay(item.price) }}</span>
              <span class="text-money"
                >{{ $t("yen") }} ({{ $t("tax_include") }})</span
              >
            </div>
          </div>
        </div>
        <div class="course-action">
          <button-red
            v-if="modelValue !== item.id"
            :name="$t('button.add_store')"
            @click="handleClick(item.id)"
          ></button-red>
          <button-white
            v-else
            :name="$t('button.cancel')"
            @click="handleClick(item.id)"
          />
        </div>
        <div class="line"></div>
      </div>
    </div>
  </el-scrollbar>
</template>
<script setup lang="ts">
import ButtonRed from "../../../../shared/components/button/ButtonRed.vue";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import { computed, defineProps, toRefs, watch } from "vue";
import priceDisplay from "../../../../shared/utils/price";
import { Course } from "~/../../src/front/models";
import { formatTime } from "~/../../src/shared/utils/format";
import { SALON, RESTAURANT } from "~/../../src/shared/constants/category";
import { ref } from "#imports";
import { GROUP_TYPE_STORE } from "~/../../src/shared/constants/typeStore";
import { useDeviceStore } from "~/../../src/front/store/device";
import ButtonWhite from "~/../../src/shared/components/button/ButtonWhite.vue";
interface Prop {
  modelValue: number;
  data?: Course[];
  typeStore: number;
}

const props = defineProps<Prop>();

const { data, typeStore, modelValue } = toRefs(props);
watch(data, (newVal) => {
  dataShow.value = newVal;
});

const dataShow = ref([]);

const emits = defineEmits(["update:modelValue", "handleChangeCourse"]);

const getNameTag = (modelHasTag: any) => {
  const dataName: any[] = [];
  if (modelHasTag) {
    modelHasTag.map((item: any) => {
      dataName.push(item.tag_course?.name);
    });
  }
  return dataName.join(" 、");
};

const handleClick = (id: number) => {
  if (id === modelValue.value) {
    emits("update:modelValue", null);
    emits("handleChangeCourse", null);
  } else {
    emits("update:modelValue", id);
    emits("handleChangeCourse", id);
  }
};
</script>
<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.list-course {
  .course-header {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 10px;

    &:not(&:first-child) {
      border-top: 1px solid rgba(0, 0, 0, 0.102);
    }

    &:not(&:last-child, &:first-child) {
      padding: 12px 0 8px 0;
    }

    &:first-child {
      padding-bottom: 8px;
    }

    &:last-child {
      padding-top: 12px;
    }

    .course-photo {
      img {
        width: 100px;
        height: 100px;
        object-fit: cover;
      }
    }

    .course-body {
      height: 100%;
      flex: 2;

      .content {
        white-space: pre-wrap;
      }

      .course-body__name {
        font-weight: 700;
      }

      .course-body__menu {
        font-size: 12px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        .course-body__menu-people,
        .course-body__menu-time,
        .course-body__menu-money {
          display: flex;
          align-items: center;
          gap: 5px;

          .text-money {
            color: $red-color;
          }

          .money {
            font-weight: bold;
            color: $btn-red;
            font-size: 16px;
          }
        }
      }
    }

    .course-action {
      justify-items: end;
    }
  }
}

.el-button {
  width: 102px;
}

.ellipsis {
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
}

@media only screen and (min-width: 767px) and (max-width: 1000px) {
  .course-header {
    flex-direction: column;
    align-items: flex-start !important;
    height: 100% !important;
    justify-content: flex-start !important;
  }
}

@media only screen and (max-width: 430px) {
  .course-header {
    flex-direction: column;
    align-items: flex-start !important;
    height: 100% !important;
    justify-content: flex-start !important;
  }
}
</style>
