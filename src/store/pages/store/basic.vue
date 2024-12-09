<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title>{{ $t("site_name_title") }}{{ $t("store.basic_info") }}</Title>
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{ $t("store.basic_info") }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <FormStore ref="_refForm" />
    </template>
    <template #footer>
      <div class="footer divider">
        <div class="group-button">
          <button-white
            :name="$t('preview')"
            :loading="_refForm?.isSubmitPreview"
            :disabled="_refForm?.loadingAvatar"
            @click="handleRedirectDetailStore"
          />
          <ButtonLightBlue
            :name="$t('button.save')"
            :loading="_refForm?.isLoadingAction"
            :disabled="_refForm?.loadingAvatar"
            @click="handleUpdate"
          />
        </div>
      </div>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ButtonLightBlue from "~/../../src/shared/components/button/ButtonLightBlue.vue";
import ButtonWhite from "~/../../src/shared/components/button/ButtonWhite.vue";
import { useHead } from "@vueuse/head";

useHead({
  script: () => {
    let w = window,
      d = document;
    let s = "https://app.chatplus.jp/cp.js";
    d["__cp_d"] = "https://app.chatplus.jp";
    d["__cp_c"] = "ce688977_1";
    let a = d.createElement("script"),
      m = d.getElementsByTagName("script")[0];
    (a.async = true), (a.src = s), m.parentNode.insertBefore(a, m);
  },
});

const _refForm = ref();

const handleUpdate = async () => {
  await _refForm.value.UpdateStore(_refForm.value._formRef);
};

const handleRedirectDetailStore = async () => {
  await _refForm.value.previewStore(_refForm.value._formRef);
};
</script>

<style lang="scss" scoped>
.footer {
  .group-button {
    justify-content: flex-end !important;
  }
}
</style>
