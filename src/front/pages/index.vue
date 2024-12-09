<template>
  <el-container class="top-container" direction="vertical">
    <Head>
      <Title
        >{{ $t("site_name_title") }}{{ $t("title_screen.portal_site") }}</Title
      >
    </Head>
    <div class="section-slide-top">
      <SlideTopComponent />
    </div>
    <!-- START Ads A1 -->
    <A1 :position="[positionData.A1]" />
    <!-- END Ads A1 -->
    <SectionBannerLarge />
    <SectionMapAndNews :show-type-store-in-modal="true" />
    <SectionBannerSmall />
  </el-container>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted } from "vue";
import { useCookie } from "nuxt/app";

import SlideTopComponent from "~/../../src/front/components/pages/home/SlideTopComponent.vue";
import SectionBannerSmall from "~/../../src/front/components/pages/home/SectionBannerSmall.vue";
import SectionBannerLarge from "~/../../src/front/components/pages/home/SectionBannerLarge.vue";
import SectionMapAndNews from "../components/pages/home/SectionMapAndNews.vue";
import A1 from "../components/common/Ads/A1.vue";

import { persistKeys } from "~/../../src/shared/constants/persist-key";
import { positionData } from "../../shared/constants/adsense";
import scrollToTop from "~/../../src/shared/utils/scroll";

import { fetchExternalAds } from "../composables/externalAds";

const menu = useCookie(persistKeys.MENU, {
  secure: true,
  sameSite: "none",
});

onBeforeMount(async () => {
  await fetchExternalAds({ forceFetch: true });
});

onMounted(() => {
  scrollToTop();
});
if (menu.value) {
  menu.value = "";
}
</script>

<style lang="scss" scoped>
@use "~/../../src/front/assets/scss/variables.scss" as *;
@use "~/../../src/shared/assets/scss/element/index.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.top-container {
  .section-slide-top {
    z-index: 2026;
    margin-bottom: 80px;
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .top-container {
    .section-slide-top {
      margin-bottom: 32px;
    }
  }
}
</style>
<style lang="scss">
@import url("../assets/scss/page/top.scss");
</style>
