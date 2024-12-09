<template>
  <el-scrollbar max-height="400px">
    <div class="list-event">
      <div v-for="item in dataShow" :key="item.id" class="event-header">
        <div class="event-photo">
          <img v-if="item.images[0]?.url" :src="item.images[0]?.url" alt="" />
          <img v-else src="../../../assets/images/default_store.svg" alt="" />
        </div>
        <div class="event-body">
          <div class="event-body__name ellipsis">
            <span>◆</span>
            {{ item.name }}
          </div>
          <div class="event-body__compare description ellipsis">
            {{ item.description }}
          </div>
          <div class="event-body__menu">
            <div v-if="item.number_seats" class="event-body__menu-people">
              <icon-people />
              <span>{{ item.number_seats }}{{ $t("people") }}</span>
            </div>
            <div class="event-body__menu-time">
              <icon-lock-blue />
              <span>{{ formatDate(item.start_date) }}</span>
              <span>～ {{ formatDate(item.end_date) }}</span>
            </div>
            <div class="event-body__menu-money">
              <icon-money />
              <template v-if="item?.price >= item?.price_children">
                <span class="text-money">{{
                  priceDisplay(item?.price_children) || 0
                }}</span>
                <span class="text-money">〜</span>
                <span class="text-money"
                  >{{ priceDisplay(item?.price) }}{{ $t("yen") }} ({{
                    $t("tax_include")
                  }})</span
                >
              </template>
              <template v-else>
                <span class="text-money">{{ priceDisplay(item?.price) }}</span>
                <span class="text-money">〜</span>
                <span class="text-money"
                  >{{ priceDisplay(item?.price_children) }}{{ $t("yen") }} ({{
                    $t("tax_include")
                  }})</span
                >
              </template>
            </div>
          </div>
        </div>
        <div class="event-action">
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
import { computed, defineProps, onMounted, toRefs, watch } from "vue";
import priceDisplay from "../../../../shared/utils/price";
import { Course } from "~/../../src/front/models";
import { ref } from "#imports";
import { useDeviceStore } from "~/../../src/front/store/device";
import ButtonWhite from "~/../../src/shared/components/button/ButtonWhite.vue";
import { formatDate } from "~/../../src/shared/utils";
interface Prop {
  modelValue: number;
  data?: [];
  idCourse?: number;
  typeStore: number;
}

const props = defineProps<Prop>();

const { data, modelValue } = toRefs(props);
watch(data, (newVal) => {
  dataShow.value = newVal;
});

const isLoading = ref(false);

const dataShow = ref([]);

const emits = defineEmits(["update:modelValue", "handleChangeEvent"]);

const handleClick = (id: number) => {
  if (id === modelValue.value) {
    emits("update:modelValue", null);
    emits("handleChangeEvent", null);
  } else {
    emits("update:modelValue", id);
    emits("handleChangeEvent", id);
  }
};
</script>
<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.list-event {
  .event-header {
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

    .event-photo {
      img {
        width: 100px;
        height: 100px;
        object-fit: cover;
      }
    }

    .event-body {
      height: 100%;
      flex: 2;

      .description {
        white-space: pre-wrap;
      }

      .event-body__name {
        font-weight: 700;
      }

      .event-body__menu {
        font-size: 12px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        .event-body__menu-people,
        .event-body__menu-time,
        .event-body__menu-money {
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

    .event-action {
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

@media only screen and (min-width: 767px) and (max-width: 1570px) {
  .event-header {
    flex-direction: column;
    align-items: flex-start !important;
    height: 100% !important;
    justify-content: flex-start !important;
  }
}

@media only screen and (max-width: 605px) {
  .event-header {
    flex-direction: column;
    align-items: flex-start !important;
    height: 100% !important;
    justify-content: flex-start !important;
  }
}
</style>
