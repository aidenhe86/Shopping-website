import request from "../utils/request";

export default function useUpdateUser() {
  return async (username, data) => {
    let res = await request(`users/${username}`, data, "patch");
    return res.user;
  };
}
