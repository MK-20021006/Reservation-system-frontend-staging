<template>
  <div>
    <ListScreenComponent class="dashboard">
      <template #head>
        <Head>
          <Title>{{ $t("site_name_title") }}{{ $t("dashboard") }}</Title>
        </Head>
      </template>
      <template #content>
        <div class="sale">
          <DashboardTabSale />
        </div>
        <div class="people-visit">
          <DashboardTabVisit />
        </div>
        <div class="login-type">
          <DashboardTabReservation />
        </div>
      </template>
    </ListScreenComponent>
  </div>
</template>

<script lang="ts" setup>
import useHavePermission from "~~/../../src/shared/composables/useHavePermission";
import { Permission } from "~/../../src/shared/constants/permission";

definePageMeta({
  alias: "/dashboard",
});
useHavePermission(Permission.ChartView);
</script>

<style lang="scss" scoped>
@use "../assets/scss/variables.scss" as *;

.dashboard {
  :deep(.scroll-content) {
    background: unset !important;
  }

  :deep(.content) {
    background: unset;
    padding: unset;

    .sale,
    .people-visit,
    .login-type {
      background: $white-color;
      margin-bottom: 20px;
      padding: 20px;
    }
  }
}
</style>
