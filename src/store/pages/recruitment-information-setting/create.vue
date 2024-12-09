<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.create_recruitment") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("title_screen.create_recruitment") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <FormRecruitmentSetting ref="_refForm" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <ButtonCreateOrUpdate
            :title="$t('button.save')"
            :loading="_refForm?.isLoadingAction"
            @click="createOrUpdateRecruitment"
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
import useRecruitment from "~/../../src/store/composables/useRecruitment";

useHavePermission(Permission.RecruitmentCreate);
useRecruitment();
const _refForm = ref();

const createOrUpdateRecruitment = async () => {
  if (_refForm.value.isLoadingAction) return;
  await _refForm.value.createOrUpdateRecruitment(_refForm.value._refForm);
};
</script>

<style lang="scss" scoped>
.footer {
  .group-button {
    justify-content: flex-end !important;
  }
}
</style>
