<template>
  <el-container class="top-container" direction="vertical">
    <Head>
      <Title>
        {{ $t("site_name_title") }}{{ $t("consultation") }}｜{{
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
    src: "home/consultation/consultation1.jpeg",
    content: "法律相談",
    description: "（弁護士）",
  },
  {
    src: "home/consultation/consultation2.jpeg",
    content: "不動産相談",
    description: "（不動産鑑定士）",
  },
  {
    src: "home/consultation/consultation3.jpg",
    content: "許認可相談",
    description: "（司法書士）",
  },
  {
    src: "home/consultation/consultation4.jpeg",
    content: "企業相談",
    description: "（行政書士）",
  },
  {
    src: "home/consultation/consultation5.jpeg",
    content: "知財相談",
    description: "（弁理士）",
  },
  {
    src: "home/consultation/consultation6.jpg",
    content: "結婚相談所",
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
  :deep(.gallery) {
    gap: 0px !important;

    p {
      font-size: 13px !important;
    }
  }
}
</style>
<style lang="scss">
@import url("../../assets/scss/page/top.scss");
</style>
