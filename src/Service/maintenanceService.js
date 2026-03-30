import axiosInstance from "./axiosInstance"
import { APP_CONFIG } from "../config";
import axios from "axios";

const API_BASE = APP_CONFIG.API_BASE_URL;
const API_URL_Request = API_BASE + "/api/MaintenanceRequest";

// ---------------------Facility/Apartment API Call---------------------

export const getFacilities = () =>
  axios.get(`${API_URL_Request}/getFacilities`, {withCredentials:true});

export const getLocationsByFacility = (facilityId) =>{
  console.log(`${API_URL_Request}/locations/${facilityId}`)
  const res= axios.get(`${API_URL_Request}/locations/${facilityId}`);
  return res;
}

export const getApartmentsByLocation = (locationId) =>{
  console.log(`${API_URL_Request}/apartments/${locationId}`)
  const res= axios.get(`${API_URL_Request}/apartments/${locationId}`);
  return res;
}

// ---------------------Category/SubCategory API Call---------------------
export const getCategories = () =>
  axios.get(`${API_URL_Request}/categories`);

export const getSubCategoriesByCategory = (categoryId) =>
  axios.get(`${API_URL_Request}/subcategories/${categoryId}`);

// ---------------------Request Submission ---------------------

export const submitMaintenanceRequest = async (data) => {
  return axiosInstance.post(`${API_URL_Request}/SubmitRequest`, data);
};