import axios from "axios";
import { APP_CONFIG } from "../config";

const API_BASE = APP_CONFIG.API_BASE_URL;

const API_URL_Facility = API_BASE + "/api/FacilityMaster";

export const getAllFacility = async () => {
    const res = await axios.get(`${API_URL_Facility}/GetAll`);
    return res;
}

export const updateFacility = async (editId, facilityName) => {
    const res = await axios.put(`${API_URL_Facility}/UpdateFacility/${editId}`, {
        name: facilityName
    });
    return res;
}

export const addFacility = async (facilityName) => {
    const res = await axios.post(`${API_URL_Facility}/Create`, {
        name: facilityName,
        status: true
    });
    return res;
}

export const changeFacilityStatus = async (id, curStatus) => {
    const res = await axios.patch(`${API_URL_Facility}/UpdateStatus/${id}`, {
        status: curStatus
    });
    return res;
}


export const getLocationsByFacility = (facilityId) =>{
  console.log(`${API_URL_Facility}/locations/${facilityId}`)
  const res= axios.get(`${API_URL_Facility}/locations/${facilityId}`);
  return res;
}
