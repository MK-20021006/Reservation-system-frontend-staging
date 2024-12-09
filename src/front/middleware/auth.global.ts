import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "nuxt/app";
import { persistKeys } from "~/../../src/shared/constants/persist-key";
import { BOOKING_SOURCE_LINE } from "~/../../src/shared/constants/booking";
import { buildQuery } from "~/../../src/shared/utils/format";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const bookingSource = useCookie(persistKeys.BOOKING_SOURCE).value;
  let storeBooking = useCookie(persistKeys.STORE_LINE).value;
  const name = String(to.name);
  if (from.query?.is_homepage) {
    to.query = { ...to.query, is_homepage: true };
    const query = buildQuery(to.query);
    to.fullPath = to.path + "?" + query;
  }

  const notAuthPages = ["social", "login"];
  if (notAuthPages.includes(name)) {
    return;
  }
  const linePath = [
    "store-id",
    "reservation",
    "reservation-detail-id",
    "reservation-booking",
    "reservation-payment",
    "profile",
    "change-password",
    "notices",
    "invoices",
    "review",
    "register",
    "forgot-password",
    "invoices-detail-id",
    "reservation-cancel-booking-id",
    "reset-password",
    "privacy",
    "frequent-question",
    "company-introduction",
    "contact",
    "introduction-store",
  ];
  if (
    storeBooking &&
    (!linePath.includes(name) ||
      (name === "store-id" && storeBooking !== to.params.id)) &&
    Number(bookingSource) === BOOKING_SOURCE_LINE
  ) {
    return navigateTo(`/store/${storeBooking}`);
  }

  if (name === "store-id" && from.query?.is_homepage && to.params.id) {
    useCookie(persistKeys.STORE_LINE).value = to.params.id;
    storeBooking = to.params.id;
  }
  if (
    storeBooking &&
    (!linePath.includes(name) ||
      (name === "store-id" && storeBooking !== to.params.id)) &&
    from.query?.is_homepage
  ) {
    return navigateTo(`/store/${storeBooking}?is_homepage=true`);
  }
});
