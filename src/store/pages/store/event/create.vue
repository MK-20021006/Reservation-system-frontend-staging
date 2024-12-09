<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.create_event") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.create_event") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <FormEvent ref="_refForm" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonCreateOrUpdate
            title="button.save"
            :loading="_refForm?.isLoadingAction"
            @click="handleCreate"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ButtonCreateOrUpdate from "../../../../shared/components/button/CreateOrUpdate.vue";
import useHavePermission from "~/../../src/shared/composables/useHavePermission";
import { Permission } from "~/../../src/shared/constants/permission";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import { EVENT } from "~/../../src/shared/constants/category";
useHavePermission(Permission.EventCreate);
useHasTypeStore([EVENT]);
const _refForm = ref();

const handleCreate = async () => {
  await _refForm.value.createOrUpdateEvent(_refForm.value._refForm);
};
</script>

<style lang="scss" scoped>
.footer {
  .group-button {
    justify-content: flex-end !important;
  }
}
</style>
