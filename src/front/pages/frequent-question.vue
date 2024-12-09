<template>
  <Head>
    <Title>
      {{ $t("site_name_title") }}{{ $t("title_screen.frequent_question") }}
    </Title>
  </Head>
  <ClientOnly>
    <Teleport to="#breadcrumb">
      <span key="1">
        <StoreBreadCrum v-if="device === 'desktop'" :data-title="dataTitle" />
        <StoreBreadCrumMb
          v-if="device === 'mobile' && valueMobile === 1"
          :title-close="$t('breadcrumb.contact')"
          :is-icon="true"
          @handle-click-filter="handleClickFilter"
          @handle-close="handleBack"
        >
          <template #icon>
            <IconLeft />
          </template>
        </StoreBreadCrumMb>
        <StoreBreadCrumMb
          v-if="device === 'mobile' && valueMobile === 2"
          :title-close="$t('close')"
          :title="$t('category_question')"
          :is-icon="false"
          :is-search="true"
          @handle-close="handleCloseSearch"
        >
          <template #icon>
            <IconLeft />
          </template>
          <template #show-icon>
            <div></div>
          </template>
          <template #filter-value>
            <div class="sidebar-menu__mobile item-menu">
              <ul>
                <li
                  v-for="(item, index) in tableData"
                  :key="index"
                  :class="[
                    'category-question__item',
                    {
                      active: activeSidebar(item.id),
                    },
                  ]"
                  @click="getQuestionItem(item.id)"
                >
                  <span class="title text-truncate">{{ item.name }}</span>
                </li>
              </ul>
            </div>
          </template>
        </StoreBreadCrumMb>
      </span>
    </Teleport>
  </ClientOnly>
  <el-container
    v-if="valueMobile !== 2"
    v-loading="loadingAllPage"
    direction="horizontal"
    class="box-question"
  >
    <div v-if="device !== 'mobile'" class="box-sidebar">
      <div class="text-name">{{ $t("category_question") }}</div>
      <div class="item-menu">
        <ul>
          <li
            v-for="(item, index) in tableData"
            :key="index"
            :class="[
              'category-question__item',
              {
                active: activeSidebar(item.id),
              },
            ]"
            @click="getQuestionItem(item.id)"
          >
            <span class="title text-truncate">{{ item.name }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div v-loading="loading" class="box-content">
      <div class="group-header">
        <div class="text-title">
          <div class="icon-chat"><IconChat /></div>
          {{ $t("breadcrumb.contact") }}
        </div>
        <div class="text-title__reservation">{{ $t("site_name") }}</div>
      </div>
      <div class="group-body">
        <div class="group-body__title">{{ titleCategory }}</div>
        <div
          v-for="(question, index) in questionData"
          :key="index"
          class="group-body__item"
        >
          <div class="body-text__title">{{ question.title }}</div>
          <div class="body-text__content">{{ question.content }}</div>
          <div v-if="question.title_url && question.faq_url">
            <NuxtLink
              class="body-text__link"
              :to="question.faq_url"
              target="_blank"
            >
              {{ question.title_url }}
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="text-note">{{ $t("front.question_after_reading") }}</div>
      <div class="group-button">
        <ButtonRed
          :name="$t('button.inquiry')"
          font-size="14px"
          @click="$router.push({ name: 'contact' })"
        />
      </div>
    </div>
  </el-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { i18n } from "~/../../src/shared/plugins/i18n";
import { useDeviceStore } from "~/../../src/front/store/device";
import ButtonRed from "~/../../src/shared/components/button/ButtonRed.vue";
import QuestionRequest from "~/../../src/shared/requests/QuestionRequest";
import { useRoute } from "#imports";
import { FrequentQuestion } from "~/../../src/front/models/frequentQuestion";
import { useRouter } from "#app";
import QuestionCategoryRequest from "~/../../src/shared/requests/QuestionCategoryRequest";
import { Question } from "~/../..//src/front/models/question";
import { buildQuery } from "~/../../src/shared/utils";
import scrollToTop from "~/../../src/shared/utils/scroll";

const titleCategory = ref("");

const router = useRouter();
const questionData = ref([]);
const categoryId = ref(1);
const route = useRoute();
const valueMobile = ref(1);
const { t } = i18n.global;
const dataTitle = reactive([{ name: t("breadcrumb.contact"), path: "" }]);
const loading = ref(false);
const loadingAllPage = ref(false);
const deviceTable = useDeviceStore();
const tableData = ref([]);
const device = computed(() => {
  return deviceTable.device;
});

if (route.query?.category_id) {
  categoryId.value = route.query?.category_id;
}

const handleClickFilter = () => {
  valueMobile.value = 2;
};

const handleBack = () => {
  router.push("/");
};

const handleCloseSearch = () => {
  valueMobile.value = 1;
};

const getListQuestion = async () => {
  try {
    const questionList = (
      await QuestionRequest.list<FrequentQuestion[]>(
        {
          category_id: categoryId.value,
        },
        true
      )
    ).data;
    questionData.value = questionList.data;
    titleCategory.value = questionData.value[0]?.category?.name;
  } catch (e) {
    return e;
  }
};

const getCategoryQuestion = async () => {
  tableData.value = (
    await QuestionCategoryRequest.getAllData<Question[]>(true)
  )?.data;
};

const getQuestionItem = async (category_id) => {
  loading.value = true;
  const query = "?" + buildQuery({ category_id: category_id });
  history.replaceState(null, null, `${query}`);
  valueMobile.value = 1;
  categoryId.value = category_id;
  await getListQuestion();
  loading.value = false;
};

const activeSidebar = computed(() => (index) => {
  return Number(categoryId.value) === index;
});

onMounted(async () => {
  loadingAllPage.value = true;
  scrollToTop();
  await getCategoryQuestion();
  await getListQuestion();
  loadingAllPage.value = false;
});
</script>

<style lang="scss" scoped>
@use "../src/shared/assets/scss/element/index" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;
@use "../assets/scss/variables" as *;

.box-sidebar {
  flex: 0 0 312px;
  background-color: $white-color;
  height: fit-content;
  padding: 16px 24px 24px;

  .text-name {
    padding-bottom: 16px;
    border-bottom: 1px solid #e4e4e4;
    width: 100%;
  }

  .item-menu {
    height: calc(100% - 72px - 16px);
  }
}

.sidebar-menu__mobile {
  border-top: 1px solid $gray-100;
  padding: 16px 24px;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .category-question__item {
    width: 100%;
    position: relative;
    cursor: pointer;
    padding: 14px 0;

    a {
      display: flex;
      align-items: center;
      position: relative;
      text-decoration: none;
      padding: 0 24px;

      .title {
        position: relative;
        height: $height-item;
        line-height: $height-item;
        white-space: nowrap;
      }
    }
  }

  :deep(.active) {
    color: red;
    span {
      color: $yellow-color;
    }
  }
}

.el-container {
  gap: 24px;
  padding: 24px 12.5% 64px;

  .box-content {
    width: 100%;
    margin: 0 85px;
    .group-header {
      margin-bottom: 32px;

      .text-title {
        color: $black-color;
        font-size: 20px;
        font-weight: 700;
        display: flex;
        align-items: center;

        .icon-chat {
          margin-right: 10px;
        }

        &__reservation {
          color: $pink-color;
        }
      }
    }

    .group-body {
      &__title {
        border-bottom: 1px solid $black-20;
        padding-bottom: 8px;
      }

      &__item {
        border-bottom: 1px dotted $black-26;
        padding: 16px 0;
      }

      .body-text {
        &__title {
          font-weight: 700;
        }

        &__content {
          color: $black-60;
          padding: 8px 0;
        }
      }
    }

    .text-note {
      font-weight: bold;
      color: $black-60;
      padding-top: 16px;
      padding-bottom: 24px;
    }

    .group-button {
      text-align: center;

      .button-submit {
        width: 164px;
      }
    }
  }
}

@include res("sm-only", $breakpoints-spec) {
  .el-container {
    gap: 16px;
    padding: 24px 5%;
    .box-content {
      margin: 0 8%;
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .el-container {
    padding: 0;
    .box-content {
      margin: 6%;
    }
  }
}
</style>
