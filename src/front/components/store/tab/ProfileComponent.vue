<template>
  <div class="profile-store">
    <store-title :title="$t('front.store_details')"></store-title>
    <div class="table-profile">
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("front.store_name") }}</div>
        <div class="table-cell__content">{{ data?.name }}</div>
      </div>
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("front.genre") }}</div>
        <div class="table-cell__content">
          <span
            v-for="(item, index) in data?.model_has_tag"
            :key="item.model_id"
          >
            <span>{{ item.tag_store?.name }} </span>
            <span v-if="index !== data?.model_has_tag.length - 1"> 、</span>
          </span>
        </div>
      </div>
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("phone_number") }}</div>
        <div class="table-cell__content">
          <div class="phone">{{ data?.phone_number }}</div>
          <div class="text-phone">{{ $t("front.phone_contact_text") }}</div>
          <div class="button">
            <ButtonRed
              :name="$t('button.add_store')"
              font-size="10px"
              @click="handleClick(data?.id)"
            />
          </div>
        </div>
      </div>
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("address") }}</div>
        <div class="table-cell__content">
          <span v-if="data?.postal_code">〒</span>{{ data?.postal_code }}
          {{ data?.address }}
          {{ data?.address_detail }}
          <div
            v-if="data?.iframe_google_map"
            class="show-map"
            v-html="data?.iframe_google_map"
          ></div>
        </div>
      </div>
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("access") }}</div>
        <div class="table-cell__content">
          <div>{{ data?.transportation }}</div>
        </div>
      </div>
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("front.business_hour") }}</div>
        <div class="table-cell__content">
          <div v-for="item in dataTimeOpen" :key="item.day_of_week">
            <span v-if="item.day_of_week === DATA_DAY_WORKING.MONDAY"
              >{{ $t("monday") }}{{ $t("day_of_week") }}：</span
            >
            <span v-if="item.day_of_week === DATA_DAY_WORKING.TUESDAY"
              >{{ $t("tuesday") }}{{ $t("day_of_week") }}：</span
            >
            <span v-if="item.day_of_week === DATA_DAY_WORKING.WEDNESDAY"
              >{{ $t("wednesday") }}{{ $t("day_of_week") }}：</span
            >
            <span v-if="item.day_of_week === DATA_DAY_WORKING.THURSDAY"
              >{{ $t("thursday") }}{{ $t("day_of_week") }}：</span
            >
            <span v-if="item.day_of_week === DATA_DAY_WORKING.FRIDAY"
              >{{ $t("friday") }}{{ $t("day_of_week") }}：</span
            >
            <span v-if="item.day_of_week === DATA_DAY_WORKING.SATURDAY"
              >{{ $t("saturday") }}{{ $t("day_of_week") }}：</span
            >
            <span v-if="item.day_of_week === DATA_DAY_WORKING.SUNDAY"
              >{{ $t("sunday") }}{{ $t("day_of_week") }}：</span
            >
            <span v-for="(time, index) in item.data" :key="time">
              <span
                >{{ formatTime(time.start) }} ～
                {{ formatTime(time.end) }}</span
              >
              <span v-if="index < item.data?.length - 1">、</span>
            </span>
          </div>
        </div>
      </div>
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("regular_holiday") }}</div>
        <div class="table-cell__content">
          <div>{{ data?.comment_opening_time }}</div>
        </div>
      </div>
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("budget_average") }}</div>
        <div class="table-cell__content">
          {{
            data?.min_price > data?.min_price_childrent &&
            data?.min_price_childrent
              ? priceDisplay(data?.min_price_childrent)
              : priceDisplay(data?.min_price)
          }}{{ $t("yen") }} ～
          {{
            data?.max_price > data?.max_price_children
              ? priceDisplay(data?.max_price)
              : priceDisplay(data?.max_price_children)
          }}{{ $t("yen") }}
        </div>
      </div>
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("notes") }}</div>
        <div class="table-cell__content">
          <span class="note">{{ data?.note }}</span>
        </div>
      </div>
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("payment.method") }}</div>
        <div class="table-cell__content">
          {{ data?.method_of_payment }}
        </div>
      </div>
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("cancellation") }}</div>
        <div class="table-cell__content">
          {{ data?.cancellation }}
        </div>
      </div>
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("homepage") }}</div>
        <div class="table-cell__content">
          <div class="link-home-page" @click="openHomePage(data?.home_page)">
            {{ data?.home_page }}
          </div>
        </div>
      </div>
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("operating_officer") }}</div>
        <div class="table-cell__content">
          <div>
            {{
              getFullName(
                data?.operating_officer_first_name,
                data?.operating_officer_last_name
              )
            }}
          </div>
        </div>
      </div>
      <!--      <div class="table-cell">-->
      <!--        <div class="table-cell__title">{{ $t("operational_manager") }}</div>-->
      <!--        <div class="table-cell__content">-->
      <!--          <div>-->
      <!--            {{-->
      <!--              getFullName(-->
      <!--                data?.operational_manager_first_name,-->
      <!--                data?.operational_manager_last_name-->
      <!--              )-->
      <!--            }}-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("price_range") }}</div>
        <div class="table-cell__content">
          <div>
            {{ data?.price_range ? data?.price_range : "" }}
          </div>
        </div>
      </div>
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("delivery_time") }}</div>
        <div class="table-cell__content">
          <div>
            {{ data?.delivery_time ? data?.delivery_time : "" }}
          </div>
        </div>
      </div>
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("timing_and_method") }}</div>
        <div class="table-cell__content">
          <div>
            {{ data?.timing_and_method ? data?.timing_and_method : "" }}
          </div>
        </div>
      </div>
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("necessary_expenses") }}</div>
        <div class="table-cell__content">
          <div>
            {{ data?.necessary_expenses ? data?.necessary_expenses : "" }}
          </div>
        </div>
      </div>
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("handling_returned") }}</div>
        <div class="table-cell__content">
          <div>
            {{ data?.handling_returned ? data?.handling_returned : "" }}
          </div>
        </div>
      </div>
      <div class="table-cell">
        <div class="table-cell__title">{{ $t("handling_defective") }}</div>
        <div class="table-cell__content">
          <div>
            {{ data?.handling_defective ? data?.handling_defective : "" }}
          </div>
        </div>
      </div>
      <!--      <div class="table-cell">-->
      <!--        <div class="table-cell__title">{{ $t("remark") }}</div>-->
      <!--        <div class="table-cell__content">{{ data?.note }}</div>-->
      <!--      </div>-->
    </div>
    <div class="contact-store">{{ $t("front.profile_contact") }}</div>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, computed } from "vue";
import ButtonRed from "../../../../shared/components/button/ButtonRed.vue";
import { formatTime, formatDate } from "~/../../src/shared/utils";
import priceDisplay from "~/../../src/shared/utils/price";
import { DetailStore } from "~/../../src/front/models";
import { DATA_DAY_WORKING } from "~/../../src/shared/constants/reservation";
import getFullName from "~/../../src/shared/utils/getFullName";

interface Prop {
  data: DetailStore;
}
const props = defineProps<Prop>();
const { data } = toRefs(props);
const emits = defineEmits(["handleClick"]);

const dataTimeOpen = computed(() => {
  const arrayTime = [];
  if (data.value) {
    data.value.opening_times.filter((item) => {
      const index = arrayTime.findIndex(
        (time) => item.day_of_week === time.day_of_week
      );
      if (index === -1) {
        arrayTime.push({
          day_of_week: item.day_of_week,
          data: [
            {
              start: item.start,
              end: item.end,
            },
          ],
        });
      } else {
        arrayTime[index].data?.push({
          start: item.start,
          end: item.end,
        });
      }
    });
  }
  return arrayTime;
});

const getDataByDay = (day) => {
  const dataOpening = data?.value;
  return dataOpening.opening_times.filter((item) => {
    return item.day_of_week === day;
  });
};

const openHomePage = (link) => {
  window.open(link, "_blank");
};

const handleClick = (id) => {
  emits("handleClick", id);
};
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;
@use "../../../../../node_modules/element-plus/theme-chalk/src/common/var" as *;
@use "../../../../../node_modules/element-plus/theme-chalk/src/mixins/mixins" as *;

.profile-store {
  background: $white-color;
  padding-bottom: 24px;
  font-size: 12px;

  .table-profile {
    margin-top: 16px;
    padding: 0 17px;

    .table-cell {
      display: flex;
      border-top: 1px solid $border-table;
      border-right: 1px solid $border-table;
      border-left: 1px solid $border-table;

      &:last-child {
        border-bottom: 1px solid $border-table;
      }

      .table-cell__title {
        display: flex;
        align-items: flex-start;
        font-weight: 400;
        width: 165px;
        padding: 12px;
        border-right: 1px solid $border-table;
        background-color: $grey-low-color;
      }

      .table-cell__content {
        padding: 12px;
        width: calc(100% - 165px);
        white-space: pre-line;

        .link-home-page {
          cursor: pointer;
          color: $yellow-50;
        }

        .button {
          .el-button {
            width: 100px;
            height: 24px;
          }
        }

        .show-map {
          margin-top: 12px;
          height: 129px;

          :deep(iframe) {
            max-width: 100%;
            height: 100%;
          }
        }

        .phone {
          font-size: 14px;
          color: $black-color;
        }

        .note {
          white-space: pre-line;
        }

        .text-phone {
          font-size: 10px;
        }
      }
    }
  }

  .contact-store {
    margin-top: 14px;
    padding: 0 17px;
  }
}

@include res("xs-only", $breakpoints-spec) {
  .profile-store {
    .table-profile {
      .table-cell {
        .table-cell__title {
          width: 133px;
        }

        .table-cell__content {
          width: calc(100% - 133px);
        }
      }
    }
  }
}

@include res("sm-only", $breakpoints-spec) {
  .profile-store {
    .table-profile {
      .table-cell {
        .table-cell__title {
          width: 121px;
        }

        .table-cell__content {
          width: calc(100% - 121px);
        }
      }
    }
  }
}
</style>
