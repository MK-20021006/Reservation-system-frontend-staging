<template>
  <div :class="getClass()">
    <div v-for="item in data" :key="item.id" class="list-menu-type">
      <div class="menu-type-header">
        <div
          class="menu-type-image"
          @click="showImage(item.model_has_file?.[0]?.file.url)"
        >
          <el-image :src="item.model_has_file?.[0]?.file.url">
            <template #error>
              <div class="image-slot">
                <img src="../../assets/images/default_store.svg" />
              </div>
            </template>
          </el-image>
        </div>
        <div class="menu-type-content">
          <div class="menu-type-content__name">
            {{ item.name }}
          </div>
          <div class="menu-type-content__note">
            {{ item.description }}
          </div>
          <div class="menu-type-footer show-md-and-down">
            <div v-if="!item.price_status">
              {{ $t("front.cost") }}:
              <span class="price">{{ priceDisplay(item.price) }}</span>
              <span class="show-text">
                {{ $t("yen") }} ({{ $t("tax_include") }})
              </span>
            </div>
            <div v-else>
              {{ $t("front.cost") }}:
              <span class="price">{{ $t("market_price") }}</span>
            </div>
            <div class="show-button">
              <ButtonCommon
                v-if="GROUP_TYPE_STORE.SAME.includes(typeStore)"
                :name="$t('button.add_menu')"
                background-color="#FEA497"
                border-radius="3px"
                color="#FFFFFF"
                @click="handleClickMenu(item.id)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="menu-type-footer hidden-md-and-down">
        <div v-if="!item.price_status">
          {{ $t("front.cost") }}:
          <span class="price">{{ priceDisplay(item.price) }}</span>
          <span class="show-text">
            {{ $t("yen") }} ({{ $t("tax_include") }})
          </span>
        </div>
        <div v-else>
          {{ $t("front.cost") }}:
          <span class="price">{{ $t("market_price") }}</span>
        </div>
        <div class="show-button">
          <ButtonCommon
            v-if="GROUP_TYPE_STORE.SAME.includes(typeStore)"
            :name="$t('button.add_menu')"
            background-color="#FEA497"
            border-radius="3px"
            color="#FFFFFF"
            @click="handleClickMenu(item.id)"
          />
        </div>
      </div>
    </div>
    <store-show-image v-model:dialog-visible="dialogVisible" :url="imageUrl" />
  </div>
</template>

<script lang="ts" setup>
import priceDisplay from "~/../../src/shared/utils/price";
import { Menu } from "~/../../src/front/models";
import { toRefs, ref } from "vue";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import { SALON } from "~/../../src/shared/constants/category";
import { GROUP_TYPE_STORE } from "~/../../src/shared/constants/typeStore";

interface Prop {
  data: Menu[];
  typeStore: number;
}

const props = defineProps<Prop>();
const emits = defineEmits(["handleClickMenu"]);

const { data, typeStore } = toRefs(props);

const imageUrl = ref("");
const dialogVisible = ref(false);
const showImage = (url) => {
  if (url) {
    imageUrl.value = url;
    dialogVisible.value = true;
  }
};

// SALON
const handleClickMenu = (idMenu: number) => {
  emits("handleClickMenu", idMenu);
};

const getClass = () => {
  if (GROUP_TYPE_STORE.SAME.includes(typeStore.value)) {
    return "menu-type-salon";
  }
  return "menu-type";
};
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

@mixin list-menu-type {
  .menu-type-header {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: 75%;

    :deep(.el-image__wrapper) {
      position: unset;
    }

    .menu-type-image {
      width: 120px;
      height: 120px;
      margin-right: 16px;
      cursor: pointer;

      .el-image {
        display: inline-block;
        overflow: unset;

        :deep(.el-image__inner) {
          width: 120px;
          height: 120px;
          object-fit: cover;

          &:hover {
            opacity: 0.5;
          }
        }

        :deep(.el-image__wrapper) {
          width: 120px;
          height: 120px;

          .image-slot {
            width: 120px;
            height: 120px;

            img {
              width: 100%;
              height: 120px;
              object-fit: cover;
            }
          }

          &:hover {
            opacity: 0.5;
          }
        }
      }
    }
  }

  .menu-type-content {
    white-space: pre-line;

    .menu-type-content__name {
      font-size: 16px;
      line-height: 24px;
    }

    .menu-type-content__note {
      color: $black-60;
    }
  }

  .menu-type-footer {
    width: 25%;
    min-width: 180px;
    font-size: 12px;
    display: flex;
    justify-content: flex-end;
    color: $black-60;
    flex-wrap: wrap;

    .price {
      margin-left: 8px;
      color: $btn-red;
      font-size: 18px;
      line-height: 24px;
    }

    .show-text {
      margin-left: 4px;
      color: $btn-red;
      font-size: 10px;
      line-height: 10px;
    }

    &.show-md-and-down {
      display: none;
    }
  }
}

.menu-type {
  .list-menu-type {
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid $yellow-30;
    gap: 16px;

    @include list-menu-type;
  }
}

.menu-type-salon {
  .list-menu-type {
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid $yellow-30;
    gap: 16px;

    @include list-menu-type;

    .menu-type-footer {
      .show-button {
        width: 100%;
        display: flex;
        justify-content: flex-end;

        .el-button {
          font-weight: 700;
          width: 114px;
          height: 32px;
          font-size: 10px;
        }
      }
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .menu-type {
    .list-menu-type {
      .menu-type-header {
        width: 100%;
      }

      .menu-type-footer {
        width: 100%;
        padding-top: 8px;
        justify-content: flex-start;

        &.show-md-and-down {
          display: flex;
        }
      }
    }
  }

  .menu-type-salon {
    .list-menu-type {
      .menu-type-header {
        width: 100%;
      }

      .menu-type-footer {
        width: 100%;
        padding-top: 8px;
        justify-content: flex-start;

        .show-button {
          justify-content: flex-start;
          margin-top: 4px;
        }

        &.show-md-and-down {
          display: flex;
        }
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .menu-type {
    padding: 0 16px;
  }

  :deep(.el-image__wrapper) {
    position: unset;
  }

  .menu-type-salon {
    padding: 0 16px;
  }
}
</style>
