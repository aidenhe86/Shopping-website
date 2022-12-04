import request from "../utils/request";

export default function useLogin() {
  return async (data) => {
    let res = await request(`auth/token`, data, "post");
    return res.token;
  };
}
