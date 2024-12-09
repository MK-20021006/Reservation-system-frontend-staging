<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title") }}{{ $t("title_screen.new_seat") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.new_seat") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <FormSeat ref="_refForm" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonCreateOrUpdate
            :title="$t('button.save')"
            :disabled="_refForm?.loadingAvatar"
            :loading="_refForm?.isLoadingAction"
            @click="handleCreate"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import ButtonCreateOrUpdate from "../../../../shared/components/button/CreateOrUpdate.vue";
import { ref } from "vue";
import useHavePermission from "~~/../../src/shared/composables/useHavePermission";
import { Permission } from "~~/../../src/shared/constants/permission";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import { RESTAURANT } from "~/../../src/shared/constants/category";

useHavePermission(Permission.SeatCreate);
useHasTypeStore([RESTAURANT]);

const _refForm = ref();

const handleCreate = async () => {
  await _refForm.value.createOrUpdateSeat(_refForm.value._formRef);
};
</script>

<style lang="scss" scoped>
.footer {
  .group-button {
    justify-content: flex-end !important;
  }
}
</style>
