<template>
  <ListScreenComponent v-loading="loading">
    <template #head>
      <Head>
        <Title>{{ $t("site_name_title") }}{{ $t("store.revenue") }}</Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("store.revenue") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <revenue-subscription :data="data" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonBack @click="handleBack" />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import ButtonBack from "~/../../src/shared/components/button/ButtonBack.vue";
import { useRoute, useRouter } from "#imports";
import { ref, onMounted } from "vue";
import { DetailReportRevenue } from "~/../../src/admin/models";
import RevenueSubscription from "../../../components/revenue/Subscription.vue";
import SubscriptionRequest from "~/../../src/shared/requests/SubscriptionRequest";

const route = useRoute();
const router = useRouter();
const data = ref<DetailReportRevenue>();
const loading = ref(false);

const detailReportRevenue = async () => {
  try {
    loading.value = true;
    data.value = (await SubscriptionRequest.show(+route.params.id))
      .data as DetailReportRevenue;
  } catch (_) {
    router.push({ name: "revenue" });
  } finally {
    loading.value = false;
  }
};

const handleBack = () => {
  router.push({ name: "revenue" });
};

onMounted(() => {
  detailReportRevenue();
});
</script>

<style lang="scss" scoped>
@use "../src/front/assets/scss/variables" as *;

.btn-delete {
  background-color: $white-color;
  width: 68px;

  &:hover,
  :focus {
    border-color: $gray-100 !important;
    background-color: $gray-100;
    color: $black-80;
  }
}

.btn-save {
  width: 68px;
}
</style>
