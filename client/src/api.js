import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 *
 */

class ShoppingApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${ShoppingApi.token}` };
    // check if method is get, if yes set to data, otherwise set to empty obj
    // this ensures get data is sent in the url
    // and post sends data as json
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get the current user. */

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Get a list of categories. */

  static async getCategories() {
    let res = await this.request("categories");
    return res.categories;
  }

  /** Get a list of items under a given category. */

  static async getCategory(category) {
    let res = await this.request(`categories/${category}`);
    return res.category;
  }
  /**Get details on an item */

  static async getItem(id) {
    let res = await this.request(`items/${id}`);
    return res.item;
  }

  /** Purchase an item */

  static async purchase(id, data) {
    let res = await this.request(`items/${id}/purchase`, data, "post");
    window.location.href = res.url;
  }

  /** Get token for login from username, password. */

  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  /** Signup for site. */

  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  /** Save user profile page. */

  static async updateCurrentUser(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }
}

export default ShoppingApi;
