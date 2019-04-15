import axios from "axios";

const api = axios.create({
  baseURL: "https://week-5-backend.herokuapp.com"
});
export default api;
