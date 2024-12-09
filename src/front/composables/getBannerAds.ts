import guestBannerRequest from "../../shared/requests/GuestBannerRequest";
import { BannerAdsStore } from "../../front/store/bannerAds";
import { BannerAds } from "../models";
import { useCookie } from "nuxt/app";
import { persistKeys } from "../../shared/constants/persist-key";
import { TYPE_PORTAL } from "../../shared/constants/category";

/**
 * Fetch banner ads
 *
 * @param options
 */
export const fetchBanner = async (
  options = {
    fetchIfEmpty: true,
    forceFetch: false,
  }
) => {
  const bannerAdsStore = BannerAdsStore();

  if (options.forceFetch) {
    bannerAdsStore.setBanner([]);
    await fetchDataBannerAds();
  } else {
    if (options.fetchIfEmpty) {
      if (bannerAdsStore.isEmptyBannerData) {
        await fetchDataBannerAds();
      }
    }
  }
};

/**
 * Fetch data banner ads from server
 */
export const fetchDataBannerAds = async () => {
  const bannerAdsStore = BannerAdsStore();

  // XXX: I must be add setTimeout function at here, because cookie in this time (beforeMount) is still old value
  setTimeout(async () => {
    const typeStore = useCookie(persistKeys.MENU).value || TYPE_PORTAL;

    const res = await guestBannerRequest.getAds(typeStore);

    if (res && res.length > 0) {
      res.forEach((item: BannerAds) => {
        bannerAdsStore.pushBanner(item);
      });
    } else {
      bannerAdsStore.setBanner([]);
    }
  }, 300);
};
