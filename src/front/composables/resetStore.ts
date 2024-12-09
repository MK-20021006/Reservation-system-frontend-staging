import { useMeStore } from "~/../../src/shared/stores/me";

const useStore = {
  useMeStore,
};

export default function () {
  const stores = Object.keys(useStore) as Array<keyof typeof useStore>;
  stores.forEach((store) => {
    const state = useStore[store]();
    state.$reset();
  });
}
