<template>
  <div class="section-ranking-store__load-more">
    <div class="ranking-criteria">
      <div
        :class="[
          'criteria',
          'reservation-ranking',
          { active: criteria === OrderBy.booking },
        ]"
        @click="() => (criteria = OrderBy.booking)"
      >
        {{ $t("ranking.reservation_ranking") }}
      </div>
      <div
        :class="[
          'criteria',
          'access-ranking',
          { active: criteria === OrderBy.access },
        ]"
        @click="() => (criteria = OrderBy.access)"
      >
        {{ $t("ranking.access_ranking") }}
      </div>
    </div>
    <div class="ranking-period">
      <div
        :class="['period', { active: period === Period.day }]"
        @click="
          () => {
            period = Period.day;
            pageCard = 1;
          }
        "
      >
        {{ $t("ranking.by_date") }}
      </div>
      <div
        :class="['period', { active: period === Period.week }]"
        @click="
          () => {
            period = Period.week;
            pageCard = 1;
          }
        "
      >
        {{ $t("ranking.by_week") }}
      </div>
      <div
        :class="['period', { active: period === Period.month }]"
        @click="
          () => {
            period = Period.month;
            pageCard = 1;
          }
        "
      >
        {{ $t("ranking.by_month") }}
      </div>
    </div>
    <div class="ranking-list-store">
      <div v-loading="isLoading" class="card-store">
        <template v-for="store in listRankingStore" :key="store.id">
          <CardStoreComponent
            :id="store.stores.code"
            :image="store.stores.model_has_file[0]?.file?.url"
            :name="store.stores.name"
            :model-has-tag="store.stores.model_has_tag"
            :introduction="store.stores?.introduction"
            :rating="store.stores?.review[0]?.avg || 0"
          />
        </template>
      </div>
      <div
        v-show="
          listRankingStore.length > 0 &&
          listRankingStore.length < allRankingStore.length
        "
        class="btn-load__more"
      >
        <ButtonYellow
          max-width="200px"
          :name="$t('front.see_next')"
          :loading="isLoading"
          @click="handleLoadMore"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, watch } from "vue";

import { OrderBy, DataRankingStore, Period } from "../../../models";

import { useRankingStore } from "../../../store/rankingStore";

import guestRankingRequest from "../../../../shared/requests/GuestRankingRequest";

import ButtonYellow from "../../../../shared/components/button/ButtonYellow.vue";
import CardStoreComponent from "../../../components/common/CardStoreComponent.vue";
import { useCookie } from "#app";
import { persistKeys } from "../../../../shared/constants/persist-key";

const rankingStore = useRankingStore();

const criteria = ref<OrderBy>(OrderBy.booking);
const period = ref<Period>(Period.day);
const incrementCard = 6;
const pageCard = ref<number>(1);

const listRankingStore = ref<DataRankingStore[]>([]);
const allRankingStore = ref<DataRankingStore[]>([]);
const isLoading = ref<boolean>(false);

const getRankingStore = async () => {
  isLoading.value = true;

  const res = await guestRankingRequest.getListRanking<DataRankingStore[]>({
    order_by: criteria.value,
    period: period.value,
    store_type_id: useCookie(persistKeys.MENU).value,
  });
  if (res) {
    rankingStore.setRanking([], criteria.value, period.value);
    if (res.data.data.length > 0) {
      res.data.data.forEach((item) => {
        rankingStore.pushRanking(item, criteria.value, period.value);
      });

      const listRanking = rankingStore.getRankingStore(
        criteria.value,
        period.value
      );

      if (listRanking) {
        allRankingStore.value = listRanking;
        listRankingStore.value = allRankingStore.value.slice(
          incrementCard * (pageCard.value - 1),
          incrementCard * pageCard.value
        );
      }
    }
  }
  isLoading.value = false;
};

const handleLoadMore = () => {
  isLoading.value = true;
  pageCard.value++;
  const addArrCard = allRankingStore.value.slice(
    incrementCard * (pageCard.value - 1),
    incrementCard * pageCard.value
  );

  listRankingStore.value = listRankingStore.value.concat(addArrCard);
  isLoading.value = false;
};

watch(
  () => [criteria.value, period.value],
  async () => {
    await getRankingStore();
  }
);

onBeforeMount(async () => {
  await getRankingStore();
});
</script>

<style lang="scss" scope>
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

@use "../../../assets/scss/variables.scss";

.section-ranking-store__load-more {
  padding: 0px 15% 80px;

  .ranking-criteria {
    width: 100%;
    height: 80px;
    margin-bottom: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: variables.$white-color;

    .criteria {
      height: 100%;
      flex-grow: 1;
      flex-shrink: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      font-weight: 400;
      line-height: 32px;
      font-size: 16px;
      padding: 12px 47px;

      &:hover {
        cursor: pointer;
      }

      &.active {
        color: variables.$title-red;
        box-shadow: 0px 1px 0px variables.$title-red;
      }
    }
  }

  .ranking-period {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-bottom: 40px;

    .period {
      width: 132px;
      height: 40px;
      background-color: variables.$white-color;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;

      &:hover {
        cursor: pointer;
      }

      &.active {
        background-color: variables.$yellow-medium-color;
        color: variables.$white-color;
      }
    }
  }

  .ranking-list-store {
    width: 100%;

    .card-store {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 32px;
      padding: 0px;
      width: 100%;

      .card {
        width: calc((100% - (32px * 2)) / 3);
        min-width: 248px;
      }
    }

    .btn-load__more {
      margin: 40px 0px 0px;
      text-align: center;
    }
  }
}

@media screen and (max-width: 1200px) {
  .section-ranking-store__load-more {
    padding: 0px 0px 80px;

    .ranking-list-store {
      .card-store {
        .card {
          width: calc((100% - 32px) / 2);
        }
      }
    }
  }
}

@include res("sm-and-down", $breakpoints-spec) {
  .section-ranking-store__load-more {
    padding: 0px 0px 80px;

    .ranking-list-store {
      .card-store {
        .card {
          width: calc((100% - 32px) / 2);
        }
      }
    }
  }
}

@media screen and (max-width: 853px) {
  .section-ranking-store__load-more {
    .ranking-list-store {
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
  .section-ranking-store__load-more {
    padding: 40px 0px;

    .ranking-period {
      padding: 0px 15%;
    }

    .ranking-list-store {
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
