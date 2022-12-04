import request from "../utils/request";

export default function useCategories() {
  return async () => {
    let res = await request(`categories`);
    return res.categories;
  };
}
