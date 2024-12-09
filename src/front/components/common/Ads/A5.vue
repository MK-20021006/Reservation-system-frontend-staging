<template>
  <div v-if="adsPC" class="external-ads">
    <div class="external-ads__PC">
      <div class="external-ads__side a5">
        <div ref="refAds" class="ads">
          <!-- eslint-disable-next-line vue/no-v-html -->
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
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, onMounted, ref, watch } from "vue";

import { ExternalAdsStore } from "../../../store/externalAds";

import { IAds } from "../../../models/ads";

import { fetchExternalAds } from "../../../composables/externalAds";
import { positionData } from "../../../../shared/constants/adsense";

// import { CircleCloseFilled } from "@element-plus/icons-vue";

interface A5Props {
  position: number[];
  storeId?: number | null;
}

const props = withDefaults(defineProps<A5Props>(), {
  position: () => [positionData.A5],
  storeId: null,
});

const dataAds = ref<IAds[]>([]);
const adsPC = ref<IAds>();

const refAds = ref<HTMLElement[]>([]);

const externalAdsStore = ExternalAdsStore();

const getAds = async () => {
  // if (externalAdsStore.isEmptyData) {
  //   await fetchExternalAds({ forceFetch: false }, props.storeId);
  // }
  dataAds.value = externalAdsStore.getAds(props.position);
  const shuffledAds = dataAds.value.sort(() => 0.5 - Math.random());
  adsPC.value = shuffledAds[0];
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
@import "../../../assets/scss/components/ads/a5.scss";
</style>
