<template>
  <div
    v-if="listRecommendStore.length > 0"
    class="section-introduction-recommend"
  >
    <div class="recommend">{{ $t("front.introduction_store") }}</div>
    <div ref="listRecommendStoreRef" class="store animate__animated">
      <template v-for="(store, index) in listRecommendStore" :key="index">
        <CardStoreComponent
          :id="store.code"
          :image="store?.model_has_file[0]?.file?.url"
          :name="store.name"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, onMounted, nextTick } from "vue";
import { useCookie } from "nuxt/app";

import { RecommendStoreInterface } from "../../../models/recommend";
import { persistKeys } from "../../../../shared/constants/persist-key";

import { RecommendStore } from "../../../store/recommendStore";

import guestRecommendStoreRequest from "../../../../shared/requests/GuestRecommendStoreRequest";
import CardStoreComponent from "../../../components/common/CardStoreComponent.vue";
import { NumberStore, Position, TIME_CHANGE } from "../../../constants";
import { sleep } from "../../../../shared/helpers";

const recommendStore = RecommendStore();
const listRecommendStore = ref<RecommendStoreInterface[]>([]);
const listRecommendStoreRef = ref<HTMLDivElement>();

const typeStoreId = useCookie(persistKeys.MENU).value;

const getRecommendStore = async () => {
  const res = await guestRecommendStoreRequest.getAllData<
    RecommendStoreInterface[]
  >({
    type_store_id: typeStoreId,
    position: Position.TOP,
  });

  if (res) {
    recommendStore.setRecommendStoreTop([]);
    if (res.data.length > 0) {
      res.data.forEach((item) => recommendStore.pushRecommendStoreTop(item));
      listRecommendStore.value = recommendStore.getRecommendStoreTop;
    }
  }
};

const autoChangeRecommendStore = async () => {
  const animationClassName = "animate__fadeInRight";

  if (listRecommendStoreRef.value) {
    const allRecommendStoreTop = recommendStore.getAllRecommendStoreTop;
    const shuffled = allRecommendStoreTop.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, NumberStore.top);
    listRecommendStore.value = selected;
    listRecommendStoreRef.value.classList.add(animationClassName);
    await sleep(4000);

    if (listRecommendStoreRef.value.classList.contains(animationClassName)) {
      listRecommendStoreRef.value.classList.remove(animationClassName);
    }
  }
};

onBeforeMount(async () => {
  await getRecommendStore();
});

onMounted(() => {
  nextTick(async () => {
    setInterval(async () => await autoChangeRecommendStore(), TIME_CHANGE);
  });
});
</script>

<style lang="scss" scoped>
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

@use "../../../assets/scss/variables.scss";
@import "../../../assets/scss/components/recommend-store.scss";
.section-introduction-recommend {
  overflow: hidden;

  .animate__animated {
    --animate-duration: 1000ms;
  }
  .recommend {
    font-size: 32px;
    line-height: 32px;
    color: #292c38;
    text-align: center;
    margin-bottom: 60px;
  }

  .store {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px 15px;

    :deep(.card) {
      max-width: 248px;
      width: 100%;
      height: 300px;
      border: none;
      border-radius: 0px;

      .el-card {
        .el-card__body {
          .el-image {
            height: 248px;
          }

          .card__title {
            .title {
              margin-bottom: 0px;
            }
          }

          .card__title .category,
          .card__description,
          .evaluate {
            display: none;
          }
        }
      }
    }
  }
}

@media screen and (min-width: 1200px) and (max-width: 1650px) {
  .section-introduction-recommend {
    .store {
      :deep(.card) {
        max-width: 150px;
        width: 100%;
        height: 182px;

        .el-card {
          .el-card__body {
            .el-image {
              height: 130px;
            }

            .card__title {
              .title {
                margin-bottom: 0px;
              }
            }
          }
        }
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .section-introduction-recommend {
    padding: 0px 24px;
    .store {
      :deep(.card) {
        max-width: initial;
      }
    }
  }
}
</style>
