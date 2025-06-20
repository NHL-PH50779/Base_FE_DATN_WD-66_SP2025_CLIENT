
import axios from "axios";

const instance = axios.create({
  baseURL: "http://base_be-datn_wd-66.sp2025.test/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;