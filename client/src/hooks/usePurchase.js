import request from "../utils/request";
import Toast from "../common/Toast";

export default function usePurchase() {
  return async (data) => {
    try {
      let res = await request(`items/purchase`, data, "post");
      window.location.href = res.url;
    } catch (e) {
      Toast("Process cannot be done, please check again!", "error");
    }
  };
}
