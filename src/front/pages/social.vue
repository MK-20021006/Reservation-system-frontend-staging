<template>
  <div v-loading="loading" class="social"></div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeMount, ref } from "vue";
import { persistKeys } from "~/../../src/shared/constants/persist-key";
import { useCookie, useRoute, useRouter } from "#imports";
import { useMeStore } from "~/../../src/shared/stores/me";
import { BOOKING_SOURCE } from "~/../../src/shared/constants/reservation";
import menuRestaurant from "~/../../src/shared/constants/menuRestaurant";
import { SALON, RESTAURANT } from "~/../../src/shared/constants/category";
import { GROUP_TYPE_STORE } from "~/../../src/shared/constants/typeStore";

const loading = ref(true);
const cookieToken = useCookie(persistKeys.ACCESS_TOKEN, {
  secure: true,
  sameSite: "none",
});
const meStore = useMeStore();
const router = useRouter();
const route = useRoute();
const bookingSource = useCookie(persistKeys.BOOKING_SOURCE, {
  secure: true,
  sameSite: "none",
});
const redirect = useCookie(persistKeys.REDIRECT, {
  secure: true,
  sameSite: "none",
});
const storeBooking = useCookie(persistKeys.STORE_LINE, {
  secure: true,
  sameSite: "none",
});
const typeBooking = useCookie(persistKeys.STORE_TYPE, {
  secure: true,
  sameSite: "none",
});
const typeLogin = useCookie(persistKeys.TYPE_LOGIN, {
  secure: true,
  sameSite: "none",
});

const handleReceiveCallback = async (e: any) => {
  loading.value = true;
  const data = JSON.parse(e);

  if (
    data.source &&
    (!bookingSource.value ||
      Number(bookingSource.value) !== BOOKING_SOURCE.LINE)
  ) {
    bookingSource.value = data.source;
  }

  if (data.token) {
    cookieToken.value = data.token;
    await nextTick(async () => {
      await meStore.fetchUpdate();
    });

    typeLogin.value = data.provider;
    if (
      data.source &&
      Number(bookingSource.value) === BOOKING_SOURCE.LINE &&
      data.store_id
    ) {
      storeBooking.value = data.store_id;
      if (
        data.store_type &&
        GROUP_TYPE_STORE.SAME.includes(Number(data.store_type))
      ) {
        typeBooking.value = data.store_type;
        await nextTick(async () => {
          await router.push({
            name: "store-id",
            params: { id: data.store_id },
            query: {
              tab: menuRestaurant.COURSE_MENU,
              menu: menuRestaurant.COURSE_MENU,
            },
          });
        });
      } else if (data.store_type && Number(data.store_type) === RESTAURANT) {
        typeBooking.value = data.store_type;
        await nextTick(async () => {
          await router.push({
            name: "store-id",
            params: { id: data.store_id },
            query: {
              tab: menuRestaurant.COURSE_MENU,
              menu: menuRestaurant.COURSE_MENU_TAB_COURSE,
            },
          });
        });
      } else if (
        data.store_type &&
        GROUP_TYPE_STORE.EVENT.includes(Number(data.store_type))
      ) {
        typeBooking.value = data.store_type;
        await nextTick(async () => {
          await router.push({
            name: "store-id",
            params: { id: data.store_id },
            query: {
              tab: menuRestaurant.EVENT,
              menu: menuRestaurant.EVENT,
            },
          });
        });
      } else {
        await nextTick(async () => {
          await router.push({
            name: "store-id",
            params: { id: data.store_id },
          });
        });
      }
      return;
    }
    if (redirect.value) {
      await router.push(redirect.value);
      redirect.value = null;
    } else {
      await router.push({ path: "/" });
    }
  }
  // else if (data.sns_info) {
  //   localStorage.setItem(persistKeys.SNS_INFO, JSON.stringify(data.sns_info));
  //   await router.push({
  //     path: `/register`,
  //     query: { from: persistKeys.SNS_INFO },
  //   });
  // }
};

onBeforeMount(async () => {
  if (route.query.data) {
    await handleReceiveCallback(route.query.data);
  }
});
</script>

<style lang="scss" scoped>
.social {
  height: 100vh;
  justify-content: center;
  display: flex;
  width: 100%;
}
</style>
