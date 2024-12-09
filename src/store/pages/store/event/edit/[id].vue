<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title") }}{{ $t("title_screen.edit_event") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.edit_event") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <FormEvent ref="_refForm" :update="true" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonDelete
            class="btn-delete"
            :name="$t('button.delete')"
            :icon="IconDelete"
            @click="handleDelete"
          />
          <ButtonCreateOrUpdate
            :name="$t('button.save')"
            :loading="_refForm?.isLoadingAction"
            @click="handleCreate"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import ButtonCreateOrUpdate from "~/../../src/shared/components/button/CreateOrUpdate.vue";
import ButtonDelete from "~/../../src/shared/components/button/ButtonDelete.vue";
import { useRouter } from "#imports";
import IconDelete from "../../../../components/Icon/Delete";
import { ref } from "vue";
import useHavePermission from "~/../../src/shared/composables/useHavePermission";
import { Permission } from "~/../../src/shared/constants/permission";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import { EVENT } from "~/../../src/shared/constants/category";
useHavePermission(Permission.EventEdit);
useHasTypeStore([EVENT]);

const _refForm = ref();
const router = useRouter();
const handleCreate = async () => {
  await _refForm.value.createOrUpdateEvent(_refForm.value._refForm, true);
};
const handleDelete = async () => {
  await _refForm.value?.deleteRecord();
};
</script>

<style lang="scss" scoped>
@use "../src/admin/assets/scss/variables" as *;

.btn-delete {
  background-color: $white-color;

  &:hover {
    border-color: $gray-100 !important;
    background-color: $gray-100;
    color: $black-80;
  }

  :deep(i) {
    font-size: 21px !important;
  }
}
</style>
