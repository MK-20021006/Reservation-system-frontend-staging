<template>
  <div class="store-staff">
    <StoreTitle :title="$t('staff')"></StoreTitle>
    <div class="list-staff">
      <div class="staff">
        <div v-for="item in staff" :key="item.id" class="staff-content">
          <StoreStaff
            :store-type="storeType"
            :staff="item"
            @handle-click-staff="handleClickStaff"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ButtonRed from "~/../../src/shared/components/button/ButtonRed.vue";
import { StaffModel } from "~/../../src/front/models";
import { toRefs, ref } from "vue";

interface Prop {
  staff: StaffModel[];
  storeType: number;
}
const props = defineProps<Prop>();
const { staff } = toRefs(props);
const dialogVisible = ref(false);
const imageUrl = ref("");

const emits = defineEmits(["handleClick"]);
const handleClickStaff = (id) => {
  emits("handleClick", id);
};
</script>

<style lang="scss" scoped>
@use "../../../assets/scss/variables" as *;
@use "element-plus/theme-chalk/src/common/var.scss" as *;
@use "element-plus/theme-chalk/src/mixins/mixins" as *;

.store-staff {
  width: 100%;

  .list-staff {
    margin-top: 24px;

    .staff {
      display: flex;
      flex-wrap: wrap;
      width: 100%;

      .staff-content {
        width: calc(100% / 5 - 9.6px);
        margin-right: 12px;
        margin-bottom: 12px;

        &:nth-child(5n) {
          margin-right: 0;
        }
      }
    }
  }
}

@media screen and (min-width: 1400px) and (max-width: 1600px) {
  .store-staff {
    .list-staff {
      .staff {
        .staff-content {
          width: calc(100% / 4 - 16px);
          &:nth-child(5n) {
            margin-right: 12px;
          }

          &:nth-child(4n) {
            margin-right: 0;
          }
        }
      }
    }
  }
}

@media screen and (min-width: 1200px) and (max-width: 1400px) {
  .store-staff {
    .list-staff {
      margin-top: 12px;

      .staff {
        .staff-content {
          width: calc(100% / 3 - 8px);
          &:nth-child(5n) {
            margin-right: 12px;
          }

          &:nth-child(3n) {
            margin-right: 0;
          }

          &:nth-child(15n) {
            margin-right: 0;
          }
        }
      }
    }
  }
}

@include res("md-and-down", $breakpoints-spec) {
  .store-staff {
    .list-staff {
      .staff {
        .staff-content {
          width: calc(100% / 2 - 6px);

          &:nth-child(5n) {
            margin-right: 12px;
          }

          &:nth-child(2n) {
            margin-right: 0;
          }
        }
      }
    }
  }
}

@include res("xs-only", $breakpoints-spec) {
  .store-staff {
    .list-staff {
      padding: 0 12px;
    }
  }
}
</style>
