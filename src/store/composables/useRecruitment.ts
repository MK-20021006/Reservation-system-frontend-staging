import { useRouter } from "#imports";
import { ref } from "vue";
import { useMeStore } from "~/../../src/shared/stores/me";
import { HAVE_JOB_OFFER } from "~/../../src/shared/constants";

export default function useRecruitment() {
  const router = useRouter();
  const meStore = useMeStore();
  const hasPerm = ref(false);

  if (meStore.getRecruitment === HAVE_JOB_OFFER) {
    hasPerm.value = true;
    return hasPerm;
  }

  return router.push({ name: "403" });
}
