<template>
  <div v-if="listRecommendStore.length > 0" class="recommend-store">
    <div class="title">
      <StoreTitle :title="$t('front.recommend_store')" />
    </div>
    <div class="list-recommend">
      <template v-for="(store, index) in listRecommendStore" :key="index">
        <store-recommend :data="store" :is-disabled="isDisabled" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import guestRecommendStoreRequest from "~/../../src/shared/requests/GuestRecommendStoreRequest";
import {
  Position,
  RecommendInterface,
} from "~/../../src/front/models/recommend";
import { DetailStore } from "~/../../src/front/models";
import { nextTick, onBeforeUnmount, onMounted, ref, toRefs } from "vue";
import { NumberStore, TIME_CHANGE } from "~/../../src/front/constants";

interface Prop {
  data: DetailStore;
  isDisabled?: boolean;
}

const props = defineProps<Prop>();

const { data } = toRefs(props);

const listRecommendStore = ref<RecommendInterface[]>([]);
const dataChange = ref<RecommendInterface[]>([]);
const timeOut = ref();

const getRecommendStore = async () => {
  const res = await guestRecommendStoreRequest.getAllData<RecommendInterface[]>(
    {
      position: Position.top,
      type_store_id: data.value.model_has_type?.type_id,
    }
  );
  if (res.data) {
    listRecommendStore.value = [];
    dataChange.value = res.data;
  }
};

const autoChangeRecommend = async () => {
  if (dataChange.value) {
    const shuffled = dataChange.value.sort(() => 0.5 - Math.random());
    listRecommendStore.value = shuffled.slice(0, NumberStore.top);
  }
};

onMounted(() => {
  getRecommendStore();
  nextTick(async () => {
    timeOut.value = setInterval(
      async () => await autoChangeRecommend(),
      TIME_CHANGE
    );
  });
});

onBeforeUnmount(() => {
  clearInterval(timeOut.value);
});
</script>

<style lang="scss" scoped>
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.recommend-store {
  margin-top: 30px;

  .title {
    margin-bottom: 16px;
  }

  .list-recommend {
    display: flex;
    margin-bottom: 10px;
    gap: 20px;
    flex-wrap: wrap;

    :deep(.recommend) {
      width: calc(100% / 5 - 16px);
      max-width: 200px;

      &:hover {
        box-shadow: 0 0 12px rgba(0, 0, 0, 0.12);
      }
    }
  }
}

@media screen and (min-width: 1200px) and (max-width: 1400px) {
  .recommend-store {
    .list-recommend {
      :deep(.recommend) {
        width: calc(100% / 4 - 15px);
        max-width: 100%;
      }
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .recommend-store {
    .list-recommend {
      :deep(.recommend) {
        width: calc(100% / 2 - 10px);
        max-width: 100%;
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .recommend-store {
    .list-recommend {
      padding: 0 16px;

      :deep(.recommend) {
        width: calc(100% / 2 - 10px);
        max-width: 100%;
      }
    }
  }
}
</style>
