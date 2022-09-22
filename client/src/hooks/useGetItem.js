import request from "../utils/request";

export default function useItem() {
  return (id) => request(`items/${id}`);
}
