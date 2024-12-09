<template>
  <div v-if="filterCategory.length" class="booking-menu-container">
    <el-row class="column-header">
      <el-col :span="13">{{ $t("menu") }}</el-col>
      <el-col :span="6">{{ $t("amount_money") }}</el-col>
      <el-col :span="5">{{ $t("treatment_time") }}</el-col>
    </el-row>
    <el-scrollbar max-height="340px">
      <div v-for="item in filterCategory" :key="item.id">
        <el-row>
          <el-col :span="24" class="category-name">{{ item.name }}</el-col>
        </el-row>
        <el-row v-for="menu in item.menus" :key="menu.id" class="menu-item">
          <el-col
            :span="3"
            class="d-flex justify-content-center align-items-center"
          >
            <el-checkbox-group
              v-model="arrMenuSelect"
              :disabled="disabled || isLoading"
            >
              <el-checkbox
                :key="menu.id"
                :label="menu.id"
                @change="handleChangeCategory"
                ><span
              /></el-checkbox>
            </el-checkbox-group>
          </el-col>
          <el-col :span="10" class="text d-flex align-items-center">
            {{ menu.name }}
          </el-col>
          <el-col :span="6" class="text d-flex align-items-center"
            >{{ priceDisplay(menu.price || 0) }}{{ $t("yen") }}
          </el-col>
          <el-col :span="5" class="text d-flex align-items-center">
            {{ getTimeHours(menu?.time) }}
          </el-col>
        </el-row>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, onMounted, ref, toRefs, watch } from "vue";
import priceDisplay from "~/../../src/shared/utils/price";
import { MenuCategory } from "~/../../src/front/models";
import { getTimeHours } from "~/../../src/shared/utils";

interface Prop {
  categoryList: MenuCategory[];
  arrIdMenuProp: [];
  disabled?: boolean;
  isLoading?: boolean;
  isDetail?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  disabled: false,
  isLoading: false,
});
const emits = defineEmits(["changeMenu"]);

const { categoryList, arrIdMenuProp } = toRefs(props);
const arrMenuSelect = ref([]);

const filterCategory = computed(() =>
  categoryList.value.filter((item) => item.menus.length)
);

const handleChangeCategory = () => {
  emits("changeMenu", arrMenuSelect.value);
};

onMounted(() => {
  arrMenuSelect.value = JSON.parse(JSON.stringify(arrIdMenuProp.value));
});
</script>

<style scoped lang="scss">
@use "../src/shared/assets/scss/variables" as *;

.booking-menu-container {
  border-bottom: 1px solid $gray-200;

  .column-header {
    background-color: #ecf5ff;
    border: 1px solid $gray-200;
    border-right: none;
    border-bottom: none;
  }

  .el-col {
    padding: 13px 16px;
    border-right: 1px solid $gray-200;

    &.text {
      color: $black-60;
    }
  }

  .category-name {
    background-color: #ecf5ff;
    border: 1px solid $gray-200;
    border-bottom: none;
  }

  .menu-item {
    border: 1px solid $gray-200;
    border-bottom: none;
    border-right: none;
  }

  .el-checkbox-group {
    .el-checkbox {
      height: auto;
      width: 14px;
    }
  }
}
</style>
