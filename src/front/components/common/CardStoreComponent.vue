<template>
  <div class="card cursor-pointer" @click="handleClick">
    <el-card shadow="hover" :body-style="{ padding: '0px' }">
      <el-image :src="props.image" fit="cover">
        <template #error>
          <div class="image-slot">
            <IconDefaultStore />
          </div>
        </template>
      </el-image>
      <div class="content">
        <div class="ml-20 mr-20 card__title">
          <div class="title">{{ props.name }}</div>
          <div v-if="props.typeName" class="category">
            {{ props.typeName }}
          </div>
          <div v-if="props.modelHasTag" class="category">
            {{ getTagStore(props.modelHasTag) }}
          </div>
        </div>
        <div v-if="props.introduction" class="ml-20 mr-20 card__introduction">
          {{ props.introduction }}
        </div>
        <div v-if="props.rating !== undefined" class="ml-20 mr-20 evaluate">
          <StoreEvaluateStartComponent
            :model-value="formatPriceFromMath(props.rating, 2)"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import StoreEvaluateStartComponent from "~/../../src/shared/components/EvaluateStartComponent.vue";
import { formatPriceFromMath } from "../../../shared/utils/format";
import { getTagStore } from "../../../shared/utils";
import { TagStoreModel } from "../../../admin/models";
import { useRouter } from "nuxt/app";

const router = useRouter();

const props = defineProps<{
  id: string;
  image: string | undefined;
  name: string;
  typeName?: string;
  modelHasTag?: TagStoreModel[];
  introduction?: string | null;
  rating?: number;
}>();

const handleClick = async () => {
  await router.push({ name: "store-id", params: { id: props.id } });
};
</script>

<style lang="scss" scoped>
$color-card-title: #292c38;
$color-card-description: #292c38cc;
$color-category: #636363;
$color-rating: #ffc33a;

$heightCardImage: 200px;
$heightCardContent: 126px;

.card {
  display: inline-block;
  height: calc($heightCardImage + $heightCardContent);

  :deep(.el-card) {
    width: 100%;
    height: 100%;
    --el-card-border-color: #0000001a;

    .el-card__body {
      padding: 20px 0px;
      height: 100%;
      display: flex;
      flex-direction: column;
      font-size: 14px;
      font-weight: 400;

      .el-image {
        flex-shrink: 0;
        flex-grow: 0;
        width: 100%;
        height: 200px;
      }

      .content {
        padding: 16px 0px;

        .card__title {
          .title {
            font-size: 16px;
            margin-bottom: 6px;
            line-height: 20px;
            color: $color-card-title;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .category {
            font-size: 12px;
            line-height: 18px;
            color: $color-category;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .card__introduction {
          display: block;
          font-size: 12px;
          line-height: 18px;
          color: $color-card-description;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .evaluate {
          .point {
            display: inline-block;
            font-size: 16px;
            font-weight: 700;
            color: $color-rating;
            margin-left: 16px;
          }
        }
      }
    }
  }
}
</style>
