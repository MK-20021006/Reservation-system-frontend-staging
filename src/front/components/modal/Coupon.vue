<template>
  <div>
    <client-only>
      <el-dialog
        :model-value="dialogVisible"
        :before-close="handleClose"
        :title="title"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :show-close="showClose"
        align-center
      >
        <el-scrollbar max-height="60vh">
          <div class="list-coupon">
            <div
              v-for="(coupon, index) in data"
              :key="coupon.id"
              class="coupon"
              :style="{ 'background-color': getCouponBackgroundColor(index) }"
            >
              <div class="information">
                <div class="information__detail coupon-name">
                  <div class="title">{{ $t("coupon_name") }}：</div>
                  <div class="content">{{ coupon.name }}</div>
                </div>
                <div class="information__detail">
                  <div class="title">{{ $t("coupon_code") }}：</div>
                  <div class="content">{{ coupon.code }}</div>
                </div>
                <div class="information__detail">
                  <div class="title">{{ $t("discount") }}：</div>
                  <div class="content">
                    <div v-if="coupon.fee_type === FEE_TYPE_COUPON.PERCENT">
                      {{ coupon.discount_percent }}{{ $t("discount_percent") }}
                    </div>
                    <div v-else>
                      <template v-if="course">
                        <div>
                          {{ $t("adult") }}
                          {{ priceDisplay(coupon.discount_money)
                          }}{{ $t("yen") }}
                          <span>
                            ({{ $t("tax_include") }}){{
                              $t("discount_number_of_people")
                            }}</span
                          >
                        </div>
                        <div v-if="course.price_children">
                          {{ $t("child") }}
                          {{ priceDisplay(coupon.discount_money_children)
                          }}{{ $t("yen") }}
                          <span>
                            ({{ $t("tax_include") }}){{
                              $t("discount_number_of_people")
                            }}</span
                          >
                        </div>
                      </template>
                      <template v-else>
                        <template v-if="event?.fee_type === TYPE_FEE.AGE">
                          <div>
                            {{ $t("adult") }}
                            {{ priceDisplay(coupon.discount_money)
                            }}{{ $t("yen") }}
                            <span>
                              ({{ $t("tax_include") }})
                              {{ $t("discount_number_of_people") }}</span
                            >
                          </div>
                          <div>
                            {{ $t("child") }}

                            <span
                              >{{ priceDisplay(coupon.discount_money_children)
                              }}{{ $t("yen") }}</span
                            >
                            <span>
                              ({{ $t("tax_include") }}){{
                                $t("discount_number_of_people")
                              }}</span
                            >
                          </div>
                        </template>
                        <template v-else>
                          <div>
                            {{ $t("male") }}
                            {{ priceDisplay(coupon.discount_money_man)
                            }}{{ $t("yen") }}
                            <span>
                              ({{ $t("tax_include") }})
                              {{ $t("discount_number_of_people") }}</span
                            >
                          </div>
                          <div>
                            {{ $t("female") }}
                            {{ priceDisplay(coupon.discount_money_woman)
                            }}{{ $t("yen") }}
                            <span>
                              ({{ $t("tax_include") }})
                              {{ $t("discount_number_of_people") }}</span
                            >
                          </div>
                        </template>
                      </template>
                    </div>
                  </div>
                </div>
                <div v-if="coupon.description" class="information__detail">
                  <div class="title">{{ $t("terms_of_use") }}：</div>
                  <div class="content">
                    {{ coupon.description }}
                  </div>
                </div>
                <div class="information__detail date-expired">
                  <div class="title">{{ $t("booking.date_expired") }}：</div>
                  <div class="content">
                    <div class="end-date">
                      {{ formatDate(coupon.start_date) }} ～
                      {{ formatDate(coupon.end_date) }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="booking">
                <button-red
                  :name="$t('button.add_store')"
                  @click="handleClick(coupon.code)"
                />
              </div>
            </div>
          </div>
        </el-scrollbar>
        <template #footer>
          <button-white :name="$t('close')" @click="handleClose" />
        </template>
      </el-dialog>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from "vue";
import ButtonWhite from "~/../../src/shared/components/button/ButtonWhite.vue";
import { formatDate } from "~/../../src/shared/utils";
import { CouponInterface } from "~/../../src/shared/models";
import ButtonRed from "~/../../src/shared/components/button/ButtonRed.vue";
import { FEE_TYPE_COUPON } from "~/../../src/shared/constants/coupon";
import { TYPE_FEE } from "~/../../src/shared/constants/event";
import priceDisplay from "~/../../src/shared/utils/price";

interface Prop {
  dialogVisible: boolean;
  title?: string;
  showClose?: boolean;
  data: CouponInterface[];
  storeType: number;
  event?: any;
  course?: any;
}

const props = withDefaults(defineProps<Prop>(), {
  dialogVisible: false,
  title: "",
  showClose: true,
  course: null,
  event: null,
  data: () => [],
});
const { dialogVisible, title, data } = toRefs(props);
const emits = defineEmits(["handleClose", "handleClick"]);

const handleClose = () => {
  emits("handleClose");
};

const handleClick = (id: number) => {
  emits("handleClick", id);
};
const backgroundColorArr = ["#e7f0f9", "#fff6d9", "#fcece0"];

const getCouponBackgroundColor = (index: number) => {
  const lengthArr = backgroundColorArr.length;

  if (index % lengthArr === 0) return backgroundColorArr[0];
  if (index % lengthArr === 1) return backgroundColorArr[1];
  if (index % lengthArr === 2) return backgroundColorArr[2];

  return backgroundColorArr[0];
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

:deep(.el-dialog) {
  width: 800px;
  color: $black-80;

  .el-dialog__body {
    padding: 10px 20px;
  }

  .el-dialog__title {
    color: $black-80;
  }
}

:deep(.list-coupon) {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  .coupon {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    border-radius: 8px;

    .information {
      width: calc(100% - 110px);
      color: $black-80;
      background-color: white;
      padding: 12px;
      border-radius: 8px;

      .information__detail {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 5px;

        .title {
          width: 120px;
        }

        .content {
          width: calc(100% - 120px);
          white-space: pre-line;
        }

        &.coupon-name {
          .title,
          .content {
            font-weight: 900;
            color: $red-color;
          }

          .content {
            font-size: 18px;
          }
        }

        &.date-expired {
          font-weight: 900;
        }
      }
    }

    .booking {
      .mobile {
        display: none;
      }
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1000px) {
  :deep(.el-dialog) {
    width: 80%;
  }
}

@include res("xs-only", $breakpoints-spec) {
  :deep(.el-dialog) {
    width: 90%;
  }

  :deep(.list-coupon) {
    .coupon {
      flex-wrap: wrap;
      gap: 12px;
      padding: 12px;

      .information {
        width: 100%;

        .information__detail {
          .title {
            width: unset;
          }

          .content {
            width: unset;
          }
        }
      }

      .booking {
        display: flex;
        justify-content: center;
        justify-items: center;
      }
    }
  }

  :deep(.el-scrollbar__wrap) {
    max-height: 450px !important;
  }
}
</style>
