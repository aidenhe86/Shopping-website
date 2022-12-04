import request from "../utils/request";

export default function useCategory() {
  return async (category) => {
    let res = await request(`categories/${category}`);
    return res.category;
  };
}
