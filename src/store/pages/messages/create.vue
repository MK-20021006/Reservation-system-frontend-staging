<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.create_message_store") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{
          $t("title_screen.create_message_store")
        }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <form-message ref="_refForm"></form-message>
    </template>
    <template #footer>
      <div class="footer divider">
        <div v-if="_refForm?.isCreate" class="group-button d-flex">
          <ButtonGray :name="$t('button.back')" @click="backConfirmMessage" />
          <button-common
            :name="$t('button.confirmation')"
            width="68px"
            color="white"
            background-color="#0071BC"
            :loading="_refForm?.isLoadingAction"
            @click="confirmMessage"
          ></button-common>
        </div>
        <div v-else class="group-button d-flex">
          <div></div>
          <button-common
            :name="$t('button.sent')"
            width="68px"
            color="white"
            background-color="#0071BC"
            :loading="_refForm?.isLoadingAction"
            @click="createMessage"
          ></button-common>
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ButtonCommon from "~/../../src/shared/components/button/ButtonCommon.vue";
import ButtonGray from "~/../../src/shared/components/button/ButtonGray.vue";

const _refForm = ref();

const confirmMessage = async () => {
  await _refForm.value.confirmCreateMessage(_refForm.value.formRef);
};

const createMessage = async () => {
  await _refForm.value.createMessage(_refForm.value.formRef);
};

const backConfirmMessage = async () => {
  await _refForm.value.backMessage();
};
</script>
