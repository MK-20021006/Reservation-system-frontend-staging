<template>
  <div class="recommend" @click="handleClick">
    <el-image :src="data.model_has_file?.[0]?.file?.url" fit="cover">
      <template #error>
        <div class="image-slot">
          <IconDefaultStore />
        </div>
      </template>
    </el-image>
    <div class="name-store cursor-pointer ellipsis">
      {{ data?.name }}
    </div>
    <div class="transition ellipsis">
      {{ data?.transportation }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import { RecommendInterface } from "~/../../src/front/models/recommend";
import { useRouter } from "nuxt/app";

interface Prop {
  data: RecommendInterface | null;
  isDisabled?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  data: null,
  isDisabled: false,
});

const { data, isDisabled } = toRefs(props);
const handleClick = async () => {
  if (!isDisabled.value) {
    await useRouter().push({
      name: "store-id",
      params: { id: data.value?.code },
    });
  }
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;

.recommend {
  display: inline-block;
  background-color: $white-color;
  cursor: pointer;
  height: auto;

  .el-image {
    flex-shrink: 0;
    flex-grow: 0;
    width: 100%;
    height: 157px;
    object-fit: contain;
  }

  .name-store {
    cursor: pointer;
    -webkit-line-clamp: 2;
    line-height: 18px;
    color: $blue-90;
    font-size: 13px;
    padding: 0 5px;
  }

  .transition {
    font-size: 10px;
    padding: 0 5px;
  }
}
</style>
