import axios from "axios";
import { APP_CONFIG } from "../config";

const API_BASE = APP_CONFIG.API_BASE_URL;
const API_URL_RegisterAdmin = API_BASE + "/api/RegisterAdmin";

export const registerAdmin = (payload) =>
  axios.post(`${API_URL_RegisterAdmin}/register`, payload);