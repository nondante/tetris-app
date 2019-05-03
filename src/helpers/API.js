import axios from "axios";

class APIClass {
  constructor() {
    this.instance = axios.create({
      baseURL: process.env.REACT_APP_APIURL,
      timeout: 1000
    });
  }

  getDefaultHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
      responseType: "application/json"
    };
  }

  get(url) {
    return this.instance.get(url, {
      method: "get",
      headers: this.getDefaultHeaders()
    });
  }

  post(url, data) {
    return this.instance.post(url, data, {
      method: "post",
      headers: this.getDefaultHeaders()
    });
  }

  call(method, url, data) {
    return this.instance[method](url, data, {
      method,
      headers: this.getDefaultHeaders()
    });
  }
}

const API = new APIClass();

export default API;
