<template>
  <div v-if="listRecommendStore.length > 0" class="section-recommend-store">
    <div class="recommend">{{ $t("front.recommend_store") }}</div>
    <div ref="listRecommendStoreRef" class="store animate__animated">
      <div class="card-store">
        <template v-for="(store, index) in listRecommendStore" :key="index">
          <CardStoreComponent
            :id="store.code"
            :image="store?.model_has_file[0]?.file?.url"
            :name="store.name"
            :model-has-tag="store.model_has_tag"
            :introduction="store?.introduction"
            :rating="store?.reviews[0]?.avg || 0"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, ref, nextTick } from "vue";
import { useCookie } from "nuxt/app";

import { RecommendStoreInterface } from "../../../models/recommend";
import { persistKeys } from "../../../../shared/constants/persist-key";
import { NumberStore, Position, TIME_CHANGE } from "../../../constants";

import { RecommendStore } from "../../../store/recommendStore";

import guestRecommendStoreRequest from "../../../../shared/requests/GuestRecommendStoreRequest";
import CardStoreComponent from "../../../components/common/CardStoreComponent.vue";
import { PLAN_NAME } from "../../../../shared/constants";
import { sleep } from "../../../../shared/helpers";

const recommendStore = RecommendStore();
const listRecommendStoreRef = ref<HTMLDivElement>();
const listRecommendStore = ref<RecommendStoreInterface[]>([]);

const typeStoreId = useCookie(persistKeys.MENU).value;

const getRecommendStore = async () => {
  // COMPLETE: Get recommend store premium
  const resPremium = await guestRecommendStoreRequest.getAllData<
    RecommendStoreInterface[]
  >({
    type_store_id: typeStoreId,
    position: Position.BOTTOM,
    plan_id: PLAN_NAME.PREMIUM,
  });
  recommendStore.setRecommendStoreBottomPremium([]);
  if (resPremium && resPremium.data.length > 0) {
    resPremium.data.forEach((item) =>
      recommendStore.pushRecommendStoreBottomPremium(item)
    );
  }
  // COMPLETE: Get recommend store standard
  const resStandard = await guestRecommendStoreRequest.getAllData<
    RecommendStoreInterface[]
  >({
    type_store_id: typeStoreId,
    position: Position.BOTTOM,
    plan_id: PLAN_NAME.STANDARD,
  });
  if (resStandard) {
    recommendStore.setRecommendStoreBottomStandard([]);
    if (resStandard.data.length > 0) {
      resStandard.data.forEach((item) =>
        recommendStore.pushRecommendStoreBottomStandard(item)
      );
    }
  }

  getListRecommendStore();
};

/**
 * Random to list recommend store
 */
const getListRecommendStore = () => {
  const shuffledStorePremium =
    recommendStore.getRecommendStoreBottom.premium.sort(
      () => 0.5 - Math.random()
    );
  const storePremium = shuffledStorePremium.slice(0, NumberStore.bottomPremium);
  const lengthStoreStandard = NumberStore.bottom - storePremium.length;
  const shuffledStoreStandard =
    recommendStore.getRecommendStoreBottom.standard.sort(
      () => 0.5 - Math.random()
    );
  const storeStandard = shuffledStoreStandard.slice(0, lengthStoreStandard);

  listRecommendStore.value = [...storePremium, ...storeStandard];
};

const autoChangeRecommendStore = async () => {
  const animationClassName = "animate__fadeInRight";

  if (listRecommendStoreRef.value) {
    getListRecommendStore();
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
.section-recommend-store {
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
    padding: 0px 15% 80px;

    .card-store {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 32px;
      width: 100%;

      :deep(.card) {
        width: calc((100% - (32px * 2)) / 3);
        .el-card {
          border: none;
          border-radius: 0px;
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .section-recommend-store {
    .store {
      .card-store {
        .card {
          width: calc((100% - 32px) / 2);
        }
      }
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .section-recommend-store {
    .store {
      .card-store {
        .card {
          width: calc((100% - 32px) / 2);
        }
      }
    }
  }
}

@media screen and (max-width: 853px) {
  .section-recommend-store {
    .store {
      .card-store {
        padding: 0px 24px;

        .card {
          width: 100%;
        }
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .section-recommend-store {
    .store {
      padding: 0px 0px 80px;

      .card-store {
        padding: 0px 24px;

        .card {
          width: 100%;
        }
      }
    }
  }
}
</style>
