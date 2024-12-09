import { reactive } from "vue";

const authUser = () => {
  const user = reactive({});
  return {
    user,
  };
};
export default authUser;
