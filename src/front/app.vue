<template>
  <NuxtLayout>
    <Transition name="page" mode="out-in">
      <el-container id="nuxt-page" :key="$route.fullPath">
        <NuxtPage />
      </el-container>
    </Transition>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { useMeStore } from "~/../../src/shared/stores/me";
import { provide, ref, watch } from "vue";
import { useRoute } from "#imports";
import { useCookie } from "#app";
import { persistKeys } from "~/../../src/shared/constants/persist-key";
import "animate.css";

const meStore = useMeStore();
const categorySelected = ref("");
provide("categorySelectedGlobal", categorySelected);
const route = useRoute();
if (!meStore.info) {
  await meStore.fetchUpdate();
}

watch(route, async (value) => {
  if (!meStore.info && useCookie(persistKeys.ACCESS_TOKEN).value) {
    await meStore.fetchUpdate();
  }
});
</script>
