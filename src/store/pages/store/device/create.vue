<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.create_device") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.create_device") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <FormDevice ref="_refForm" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonCreateOrUpdate
            :title="$t('button.save')"
            :loading="_refForm?.isLoadingAction"
            @click="createOrUpdate"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import ButtonCreateOrUpdate from "~/../../src/shared/components/button/CreateOrUpdate.vue";
import { ref } from "vue";
import {
  SALON,
  CONSULTATION,
  CLASSROOM,
  MEDIAL_CARE,
} from "~/../../src/shared/constants/category";
import useHasTypeStore from "~/../../src/shared/composables/useHasTypeStore";

useHasTypeStore([SALON, CONSULTATION, CLASSROOM, MEDIAL_CARE]);

const _refForm = ref();

const createOrUpdate = async () => {
  await _refForm.value.createDevice(_refForm.value._formRef);
};
</script>

<style lang="scss" scoped>
.footer {
  .group-button {
    justify-content: flex-end !important;
  }
}
</style>
