<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title>
          {{ $t("site_name_title") }}{{ $t("store.menu_create") }}
        </Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>
          <div class="category-header">
            <div>{{ $t("store.menu_create") }}</div>
          </div>
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <form-menu ref="_formRef" @change-loading-data="updateLoading" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <div />
          <ButtonCreateOrUpdate
            :title="$t('button.save')"
            :loading="loading"
            @click="createMenu"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useHavePermission from "~~/../../src/shared/composables/useHavePermission";
import { Permission } from "~~/../../src/shared/constants/permission";
import ButtonCreateOrUpdate from "../../../../shared/components/button/CreateOrUpdate.vue";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";
import {
  RESTAURANT,
  SALON,
  CONSULTATION,
  CLASSROOM,
  MEDIAL_CARE,
} from "~/../../src/shared/constants/category";

useHasTypeStore([RESTAURANT, SALON, CONSULTATION, CLASSROOM, MEDIAL_CARE]);
useHavePermission(Permission.MenuCreate);

const loading = ref(false);
const _formRef = ref();

const createMenu = async () => {
  await _formRef.value.createMenu(_formRef.value.formRef);
};

const updateLoading = (value) => {
  loading.value = value;
};
</script>

<style lang="scss" scoped></style>
