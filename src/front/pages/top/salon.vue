<template>
  <el-container class="top-container" direction="vertical">
    <Head>
      <Title>
        {{ $t("site_name_title") }}{{ $t("beauty_salon") }}｜{{
          $t("title_screen.top")
        }}
      </Title>
    </Head>
    <div class="section-slide-top">
      <SlideCategoryComponent :array-image="arrayImageSlider" />
    </div>
    <!-- START Ads A1 -->
    <A1 :position="[positionData.A1]" />
    <!-- END Ads A1 -->
    <SectionIntroductionRecommended />
    <div class="section-content divider">
      <hr />
    </div>
    <SectionMapAndNews :show-type-store-in-modal="false" />
    <SectionBannerSmall />
    <SectionRecommendedStore />
    <SectionBannerLarge />
    <SectionRankingStore />
  </el-container>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, ref } from "vue";

import SlideCategoryComponent from "~/../../src/front/components/pages/home/SlideCategoryComponent.vue";
import SectionIntroductionRecommended from "../../components/pages/home/SectionIntroductionRecommended.vue";
import SectionMapAndNews from "../../components/pages/home/SectionMapAndNews.vue";
import SectionRecommendedStore from "../../components/pages/home/SectionRecommendedStore.vue";
import SectionBannerSmall from "../../components/pages/home/SectionBannerSmall.vue";
import SectionBannerLarge from "../../components/pages/home/SectionBannerLarge.vue";
import SectionRankingStore from "../../components/pages/home/SectionRankingStore.vue";
import A1 from "../../components/common/Ads/A1.vue";

import scrollToTop from "~/../../src/shared/utils/scroll";
import { fetchExternalAds } from "../../composables/externalAds";
import { positionData } from "../../../shared/constants/adsense";

const arrayImageSlider = ref([
  {
    src: "home/salon/salon6-min.jpg",
    content: "ヘアサロン",
  },
  {
    src: "home/salon/salon7.jpg",
    content: "ネイルサロン",
  },
  {
    src: "home/salon/salon8-min.webp",
    content: "エステサロン",
  },
  {
    src: "home/salon/salon9.jpg",
    content: "アロマサロン",
  },
  {
    src: "home/salon/salon10-min.jpg",
    content: "りらくサロン",
  },
  {
    src: "home/salon/salon11-min.jpg",
    content: "まつ毛サロン",
  },
]);

onBeforeMount(async () => {
  await fetchExternalAds({ forceFetch: true });
});

onMounted(() => {
  scrollToTop();
});
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

  .divider {
    hr {
      margin: 0px;
      padding: 0px;
    }
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
@import url("../../assets/scss/page/top.scss");
</style>
