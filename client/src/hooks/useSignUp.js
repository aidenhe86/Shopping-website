import request from "../utils/request";

export default function useSignUp() {
  return async (data) => {
    let res = await request(`auth/register`, data, "post");
    return res.token;
  };
}
