<template>
  <div v-if="adsPC || (adsMobile && adsMobile.length > 0)" class="external-ads">
    <div v-if="adsPC" class="external-ads__PC">
      <div class="external-ads__side a1">
        <div ref="refAds" class="ads">
          <div class="ads__content">
            <a :href="adsPC.desktop.url" target="_blank">
              <img
                :width="adsPC.desktop.width"
                :height="adsPC.desktop.height"
                :src="adsPC.desktop.image_url"
              />
            </a>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="hidden" v-html="adsPC.data_desktop"></div>
          </div>
          <!-- <div class="btn-close" @click="() => handleClose()">
              <el-icon><CircleCloseFilled /></el-icon>
            </div> -->
        </div>
      </div>
    </div>
    <div v-if="adsMobile && adsMobile.length > 0" class="external-ads__Mobile">
      <el-carousel
        :autoplay="true"
        arrow="never"
        indicator-position="none"
        height="50px"
      >
        <el-carousel-item v-for="(ads, index) in adsMobile" :key="index">
          <div class="ads__content">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <a :href="ads.mobile.url" target="_blank">
              <img
                :width="ads.mobile.width"
                :height="ads.mobile.height"
                :src="ads.mobile.image_url"
              />
            </a>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="hidden" v-html="ads.data_mobile"></div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, onMounted, ref, watch } from "vue";

import { ExternalAdsStore } from "../../../store/externalAds";

import { IAds } from "../../../models/ads";

import { fetchExternalAds } from "../../../composables/externalAds";
import { positionData } from "../../../../shared/constants/adsense";

// import { CircleCloseFilled } from "@element-plus/icons-vue";

interface A1Props {
  position: number[];
  storeId?: number | null;
}

const props = withDefaults(defineProps<A1Props>(), {
  position: () => [positionData.A1],
  storeId: null,
});

const dataAds = ref<IAds[]>([]);
const adsPC = ref<IAds>();
const adsMobile = ref<IAds[]>([]);

const refAds = ref<HTMLElement[]>([]);

const externalAdsStore = ExternalAdsStore();

const getAds = async () => {
  // if (externalAdsStore.isEmptyData) {
  //   await fetchExternalAds({ forceFetch: false }, props.storeId);
  // }
  dataAds.value = externalAdsStore.getAds(props.position);
  const shuffledAds = dataAds.value.sort(() => 0.5 - Math.random());
  adsPC.value = shuffledAds[0];
  adsMobile.value = dataAds.value;
};

// const handleClose = () => {
//   if (refAds.value) {
//     refAds.value.style.display = "none";
//   }
// };

watch(
  () => externalAdsStore.getAds(props.position),
  async () => await getAds()
);

onMounted(async () => {
  await getAds();
});
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/components/ads/a1.scss";
</style>
