import request from "../utils/request";

export default function useGetUser() {
  return (username) => request(`users/${username}`);
}
