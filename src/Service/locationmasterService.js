import axios from "axios";
import { APP_CONFIG } from "../config";

const API_BASE = APP_CONFIG.API_BASE_URL;

const API_URL_Location = API_BASE + "/api/LocationMaster";

// GET ALL Locations
export const getAllLocations = async () => {
    const res = await axios.get(`${API_URL_Location}/GetAll`);
    return res;
};

// CREATE Location
export const addLocation = async (facilityId, locationName, gym, pool) => {
    debugger;
    const res = await axios.post(`${API_URL_Location}/Create`, {
        facilityId,
        name: locationName,
        status: true,
        gym,
        pool
    });
    return res;
};

// UPDATE Location
export const updateLocation = async (id, facilityId, locationName, gym, pool) => {
    const res = await axios.put(`${API_URL_Location}/UpdateLocation/${id}`, {
        facilityId,
        name: locationName,
        gym,
        pool
    });
    return res;
};

// CHANGE STATUS
export const changeLocationStatus = async (id, curStatus) => {
    const res = await axios.patch(`${API_URL_Location}/UpdateStatus/${id}`, {
        status: curStatus
    });
    return res;
};

export const getApartmentsByLocation = (locationId) =>{
  console.log(`${API_URL_Location}/apartments/${locationId}`)
  const res= axios.get(`${API_URL_Location}/apartments/${locationId}`);
  return res;
}