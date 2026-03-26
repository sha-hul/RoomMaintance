import axios from "axios";
import { APP_CONFIG } from "../config";

const API_BASE = APP_CONFIG.API_BASE_URL;
const API_URL_Apartment = API_BASE + "/api/ApartmentMaster";

export const decryptParams = async (facid, locid, apart) => {
  const res = await axios.post(`${API_URL_Apartment}/decrypt`, {
    facid: String(facid),
    locid: String(locid),
    apart: String(apart)
  });

  return res.data;
};