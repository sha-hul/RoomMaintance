import axios from "axios";
import { APP_CONFIG } from "../config";

const API_BASE = APP_CONFIG.API_BASE_URL;
const API_URL_ApartmentMicrosite = API_BASE + "/api/ApartmentMicrosite";

export const decryptParams = async (facid, locid, apart) => {
  const res = await axios.post(`${API_URL_ApartmentMicrosite}/decrypt`, {
    facid: String(facid),
    locid: String(locid),
    apart: String(apart)
  });
  return res.data;
};

export const getApartmentDetails = (facid, locationId, apartmentID) => {
 return axios.get(`${API_URL_ApartmentMicrosite}/getApartmentDetails`, {
    params: { faciId: facid, locId: locationId, appId: apartmentID },
});
};

export const getApartmentRequestDetails = (apartmentId) => {
  return axios.get(`${API_URL_ApartmentMicrosite}/getApartmentRequestDetails/${apartmentId}`);
};

export const cancelMaintenanceRequest = (reqId) =>{
  return axios.put(`${API_URL_ApartmentMicrosite}/cancelMaintenanceRequest/${reqId}`);
}