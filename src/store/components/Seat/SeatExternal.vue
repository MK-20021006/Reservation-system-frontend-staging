<template>
  <div class="seat-detail-external">
    <el-form-item class="label-first">
      <div class="group-item">
        <div class="form-item">
          <div class="label">{{ $t("seat_type") }}</div>
          <el-select
            v-if="listType.length >= 1"
            v-model="typeData"
            :disabled="disabled"
            placeholder=" "
            @change="handleChangeType"
          >
            <el-option
              v-for="item in listType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <input-text
            v-else
            disabled="true"
            :model-value="typeData"
          ></input-text>
        </div>
        <div class="form-item">
          <div class="label">{{ $t("seat_name") }}</div>
          <el-form-item :error="getError()">
            <el-select
              v-if="listSeat.length >= 1"
              v-loading="loading"
              placeholder=" "
              :disabled="disabled"
              :model-value="modelValue"
              @change="handleChangeID"
            >
              <el-option
                v-for="item in listSeat"
                :key="item.id"
                :label="`${item.id} - ${item.name}`"
                :value="item.id"
              ></el-option>
            </el-select>
            <input-text
              v-else
              v-loading="loading"
              disabled="true"
              :model-value="modelValue"
            ></input-text>
          </el-form-item>
        </div>
        <div v-if="typeSite !== SITE_TYPE_SYSTEM">
          {{ $t("link_external_site") + ": " }}
          <a
            class="text-link"
            target="_blank"
            :href="findObj(listSeat, 'id', modelValue)?.crawl_url"
            >{{ findObj(listSeat, "id", modelValue)?.crawl_url }}</a
          >
        </div>
        <div v-else>
          {{ $t("link_external_site_arxia") + ": " }}
          <a
            class="text-link"
            target="_blank"
            :href="`${urlSeat}/edit/${seatId}`"
            >{{ `${urlSeat}/edit/${seatId}` }}</a
          >
        </div>
      </div>
    </el-form-item>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, watch } from "vue";
import SeatRequest from "~~/../../src/shared/requests/SeatRequest";
import { findObj } from "~/../../src/shared/utils";
import {
  DATA_CRAWLER_SITE,
  SITE_TYPE_GOOGLE,
  SITE_TYPE_SYSTEM,
} from "~/../../src/shared/constants/siteCrawl";
import InputText from "~/../../src/shared/components/input/InputText.vue";
import { i18n } from "~/../../src/shared/plugins/i18n";

interface Prop {
  disabled: boolean;
  modelValue: number;
  listType: [];
  typeSite: number;
  typeSeat: number;
  seatId: number;
  isSubmit: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  disabled: false,
  modelValue: null,
  listType: [],
  typeSite: null,
  typeSeat: null,
  seatId: null,
  isSubmit: false,
});

const { t } = i18n.global;
const loading = ref(false);
const url = `${window.location.href.split("/external-site")[0]}/store/seat`;
const emits = defineEmits(["update:modelValue", "validate"]);
const { listType, typeSite, typeSeat, disabled, modelValue, isSubmit } =
  toRefs(props);
const listSeat = ref([]);
const typeData = ref(null);
const urlSeat = `${window.location.href.split("/edit")[0]}`;

const getError = () => {
  if (typeData.value && !modelValue.value) {
    emits("validate", false);
    if (isSubmit.value)
      return t("validate.required.field", { field: t("seat_name") });
    else return null;
  } else {
    emits("validate", true);
    return null;
  }
};

if (typeSeat.value) {
  if (typeSite.value !== SITE_TYPE_SYSTEM) {
    typeData.value = typeSeat.value;
    listSeat.value = (
      await SeatRequest.getListSeatCrawlByType(typeSite.value, typeData.value)
    ).data;
  } else {
    typeData.value = typeSeat.value;
  }
}

const handleChangeType = async () => {
  loading.value = true;
  listSeat.value = (
    await SeatRequest.getListSeatCrawlByType(typeSite.value, typeData.value)
  ).data;
  emits("update:modelValue", "");
  loading.value = false;
};

const handleChangeID = (e) => {
  emits("update:modelValue", e);
};
</script>
<style lang="scss" scoped>
.seat-detail-external {
  width: 100%;

  .el-form-item__content {
    .group-item {
      width: calc(100% - 80px);
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
