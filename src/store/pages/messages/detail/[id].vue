<template>
  <ListScreenComponent>
    <template #head>
      <Head>
        <Title
          >{{ $t("site_name_title")
          }}{{ $t("title_screen.message_detail_store") }}</Title
        >
      </Head>
    </template>
    <template #header-content>
      <CommonHeaderContentComponent>
        <template #title>{{
          $t("title_screen.message_detail_store")
        }}</template>
      </CommonHeaderContentComponent>
    </template>
    <template #content>
      <form-message :id="id" ref="_refForm"></form-message>
    </template>
  </ListScreenComponent>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "nuxt/app";

const route = useRoute();
const _refForm = ref();
const id = ref(null);
id.value = Number(route.params.id);
</script>

<style lang="scss" scoped>
.footer {
  .group-button {
    justify-content: flex-end;
  }
}
</style>
