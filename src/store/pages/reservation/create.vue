<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.reservation_create") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.reservation_create") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <FormBooking ref="_refForm" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonCreateOrUpdate
            :title="$t('reserve')"
            :disabled="_refForm?.isLoadingCheckCoupon"
            :loading="_refForm?.isLoadingBooking"
            @click="handleBooking"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import ButtonCreateOrUpdate from "~/../../src/shared/components/button/CreateOrUpdate.vue";
import { ref } from "vue";
import useHavePermission from "~/../../src/shared/composables/useHavePermission";
import { Permission } from "~/../../src/shared/constants/permission";

useHavePermission(Permission.ReservationCreate);

const _refForm = ref();

const handleBooking = async () => {
  if (_refForm.value.isLoadingCategoriesSeat) return;
  await _refForm.value.handleBooking(_refForm.value._formRef);
};
</script>

<style lang="scss" scoped>
.footer {
  .group-button {
    justify-content: flex-end !important;
  }
}
</style>
