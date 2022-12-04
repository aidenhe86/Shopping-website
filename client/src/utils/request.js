import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000";

async function request(endpoint, data = {}, method = "get") {
  const token = JSON.parse(window.localStorage.getItem("userToken"));
  // console.debug("API Call:", endpoint, data, method);

  const url = `${BASE_URL}/${endpoint}`;
  const headers = { Authorization: `Bearer ${token}` };
  // check if method is get, if yes set to data, otherwise set to empty obj
  // this ensures get data is sent in the url
  // and post sends data as json
  const params = method === "get" ? data : {};

  try {
    return (await axios({ url, method, data, params, headers })).data;
  } catch (err) {
    // console.error("API Error:", err.response);
    let message = err.response.data.error.message;
    throw Array.isArray(message) ? message : [message];
  }
}

export default request;
