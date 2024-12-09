<template>
  <ClientOnly>
    <NuxtLayout mode="in-out">
      <Transition name="page" mode="out-in">
        <div id="nuxt-page" :key="$route.fullPath">
          <NuxtPage />
          <ModalConfirm
            :dialog-visible="dialogVisible"
            :title="$t('warn_store_to_process_booking')"
            :name-cancel="$t('button.cancel')"
            :name-confirm="$t('button.confirm')"
            width="640px"
            @handle-close="handleClose"
            @handle-confirm="handleConfirm"
          />
          <ModalConfirm
            :dialog-visible="dialogVisibleTerminateDate"
            :title="$t('warning_terminate_date_store')"
            :name-cancel="$t('button.cancel')"
            :name-confirm="$t('button.confirm')"
            width="640px"
            @handle-close="handleCloseTerminateDate"
            @handle-confirm="handleConfirmTerminateDate"
          />
        </div>
      </Transition>
    </NuxtLayout>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useMeStore } from "~~/../../src/shared/stores/me";
import ModalConfirm from "~/../../src/store/components/modal/Confirm.vue";
import moment from "moment";
import { useRouter, useRoute } from "#imports";

const router = useRouter();
const route = useRoute();
const dialogVisible = ref(false);
const dialogVisibleTerminateDate = ref(false);
const messageTerminateDate = ref("");
const meStore = useMeStore();
const todayDate = moment().format("YYYY-MM-DD");
const notAuthPages = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/store/registration-application",
  "/store/create",
  "/health-check",
  "/404",
  "/403",
  "/connect-zoom-manual",
];

if (!meStore.info && route.name !== "store-payment") {
  await meStore.fetchUpdate();
}
const handleClose = () => {
  dialogVisible.value = false;
};
const handleConfirm = () => {
  router.push({ name: "reservation" });
  dialogVisible.value = false;
};

const handleCloseTerminateDate = () => {
  dialogVisibleTerminateDate.value = false;
};
const handleConfirmTerminateDate = () => {
  router.push({ name: "payment-setting" });
  dialogVisibleTerminateDate.value = false;
};

const dateEndContract = meStore.info?.store?.widthdraw_at
  ? moment(meStore.info?.store?.widthdraw_at).format("YYYY-MM-DD")
  : null;

if (dateEndContract && moment(dateEndContract).isSame(todayDate)) {
  dialogVisible.value = true;
}

onMounted(() => {
  if (
    meStore.info?.store?.has_active_failed_payments &&
    !notAuthPages.includes(window.location.pathname)
  ) {
    messageTerminateDate.value = "warning_terminate_date_store";
    dialogVisibleTerminateDate.value = true;
  }
});
</script>

<style lang="scss" scoped>
#nuxt-page {
  height: 100%;
}
</style>
