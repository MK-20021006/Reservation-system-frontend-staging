import { useMeStore } from "../../shared/stores/me";

export const getPositionSuccess = async (position: GeolocationPosition) => {
  const meStore = useMeStore();
  meStore.setGeolocationPosition({
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  });
};

export const getPositionFailure = async () => {
  throw new Error("Get position failure");
};
