<template>
  <div class="box-store">
    <div v-if="isShow" class="header-search">{{ $t("front.store_genre") }}</div>
    <hr v-if="isShow" class="border-header hr" />
    <el-form
      ref="formRef"
      class="custom-form"
      :model="formSearch"
      @keyup.enter="handleClick(formRef)"
    >
      <el-form-item class="box-store__input">
        <InputText
          v-model="formSearch.keyword_search_list_store_screen"
          :placeholder="$t('front.placeholder_search')"
        />
      </el-form-item>
      <el-form-item :label="$t('front.store_budget')" class="budget">
        <div class="budget-input">
          <InputPrice
            v-model="formSearch.min_price"
            :max-price="maxPrice"
            clearable
          />
          <InputPrice
            v-model="formSearch.max_price"
            :min="minPrice"
            :max-price="MAX_PRICE"
            clearable
            @handle-change="changeDataMaxPrice"
          />
        </div>
      </el-form-item>
      <el-form-item class="budget" :label="$t('date')" prop="date">
        <el-date-picker
          v-model="formSearch.date_list"
          :clearable="false"
          width="100%"
          :editable="false"
          format="YYYY年MM月DD日"
          value-format="YYYY-MM-DD"
          :disabled-date="disableDate"
          :placeholder="$t('date')"
        />
      </el-form-item>
      <el-form-item :label="$t('front.store_time_search')" class="budget">
        <div class="budget-input">
          <client-only>
            <time-hours-minute v-model="formSearch.time_list" />
          </client-only>
        </div>
      </el-form-item>
      <ButtonYellow
        :name="$t('button.search')"
        class="btn-submit"
        @click="handleClick(formRef)"
      ></ButtonYellow>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import InputText from "~/../../src/shared/components/input/InputText.vue";
import InputDate from "~/../../src/shared/components/input/Date.vue";
import ButtonYellow from "~/../../src/shared/components/button/ButtonYellow.vue";
import InputNumberText from "~/../../src/shared/components/input/InputNumberText.vue";
import InputPrice from "~/../../src/shared/components/input/Price.vue";
import { toRefs, computed, ref } from "vue";
import { MAX_PRICE } from "~/../../src/shared/utils/validate";
import formSearchRules from "~/../../src/front/validate/formSearch";
import type { FormInstance } from "element-plus";
import { formatValuePrice } from "~/../../src/shared/utils";
import TimeHoursMinute from "~/../../src/shared/components/select/TimeHoursMinute.vue";
import moment from "moment/moment";

const formRef = ref(null);
const emits = defineEmits(["handleClick"]);
const props = defineProps({
  isShow: {
    type: Boolean,
    default: true,
  },
  formSearch: {
    type: Object,
    required: true,
  },
});
const { formSearch } = toRefs(props);
const { rules } = formSearchRules(formSearch.value);

const minPrice = computed(() => {
  return formSearch.value.min_price ? Number(formSearch.value.min_price) : 0;
});

const changeDataMaxPrice = () => {
  if (
    formSearch.value.max_price &&
    Number(formatValuePrice(formSearch.value.max_price)) <
      Number(formatValuePrice(formSearch.value.min_price))
  ) {
    formSearch.value.max_price = formSearch.value.min_price;
  }
};

const disableDate = (date) => {
  return (
    moment(date).add(1, "day") < moment() ||
    moment(date) > moment().add(2, "month").endOf("month")
  );
};

const maxPrice = computed(() => {
  return formSearch.value.max_price
    ? Number(formatValuePrice(formSearch.value.max_price))
    : MAX_PRICE;
});

const handleClick = async (form: FormInstance) => {
  emits("handleClick", formSearch);
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.box-store {
  border: 1px solid #e7e7e7;
  width: 100%;
  padding: 16px 24px 24px;
  position: sticky;
  top: 223px;

  .box-store__input {
    :deep(.el-input) {
      width: 100%;
    }

    margin-top: 16px;
  }

  .header-search {
    font-size: 16px;
    text-align: center;
    font-weight: 400;
    color: $black-100;
    margin-bottom: 16px;
  }

  .hr {
    border-top: 1px solid $grey-small-color;
    width: 100%;
  }

  .el-form-item {
    margin-bottom: 0;
  }

  .budget {
    display: unset;

    :deep(.el-input) {
      width: 100%;
      height: 40px;
    }

    :deep(.el-form-item__label) {
      font-size: 12px;
      line-height: 12px;
      margin: 16px 0 8px;
      color: $black-80;
      height: auto;
    }

    .budget-input {
      display: flex;
      width: 100%;

      :deep(.el-select) {
        width: 100%;
        margin-right: 8px;

        &:last-child {
          margin-right: 0;
        }

        :deep(.el-input) {
          height: 40px;
        }
      }

      .custom-input-price {
        width: calc(100% - 8px);
        margin-right: 8px;

        &:last-child {
          margin-right: 0;
        }

        :deep(.el-input) {
          height: 40px;
        }
      }
    }
  }

  .btn-submit {
    margin: 24px 0 0;
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .box-store {
    top: 142px;
  }
}

@include res("xs-only", $breakpoints-spec) {
  .box-store {
    border-top: 1px solid #e7e7e7;
    border-bottom: 0;
    border-left: 0;
    border-right: 0;
  }
}
</style>
