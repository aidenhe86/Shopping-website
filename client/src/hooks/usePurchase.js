import request from "../utils/request";

export default function usePurchase() {
  return async (data) => {
    let res = await request(`items/purchase`, data, "post");
    window.location.href = res.url;
  };
}
