<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title>
          {{ $t("site_name_title") }}{{ $t("store.category_create") }}
        </Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>
          <div class="category-header">
            <div>{{ $t("store.category_create") }}</div>
          </div>
        </template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <form-category
        ref="_formRef"
        class="form-category-add"
        @change-loading-data="updateLoading"
      />
    </template>
    <template #footer>
      <div class="footer">
        <div class="group-button">
          <div />
          <ButtonCreateOrUpdate
            title="button.save"
            :loading="loading"
            @click="createCategory"
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
import {
  RESTAURANT,
  SALON,
  CONSULTATION,
  CLASSROOM,
  MEDIAL_CARE,
} from "~/../../src/shared/constants/category";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";

useHasTypeStore([RESTAURANT, SALON, CONSULTATION, CLASSROOM, MEDIAL_CARE]);

useHavePermission(Permission.CategoryCreate);

const loading = ref(false);
const _formRef = ref();

const createCategory = async () => {
  await _formRef.value.createCategory(_formRef.value.formRef);
};

const updateLoading = (value) => {
  loading.value = value;
};
</script>

<style lang="scss" scoped></style>
