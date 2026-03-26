import axios from "axios";
import { APP_CONFIG } from "../config";

const API_BASE = APP_CONFIG.API_BASE_URL;
const API_URL_Apartment = API_BASE + "/api/ApartmentMaster";

// GET ALL Apartments
export const getAllApartments = async () => {
    const res = await axios.get(`${API_URL_Apartment}/GetAll`);
    return res;
};


// CREATE Apartment
export const addApartment = async (locationId, apartmentName, esubID, roomCount) => {
    const res = await axios.post(`${API_URL_Apartment}/Create`, {
        locationId,
        name: apartmentName,
        esubscriptionID: esubID,
        status: true,
        roomCount
    });
    return res;
};

// UPDATE Apartment
export const updateApartment = async (id, locationId, apartmentName, esubID, roomCount) => {
    const res = await axios.put(`${API_URL_Apartment}/UpdateApartment/${id}`, {
        locationId,
        esubscriptionID: esubID,
        name: apartmentName,
        roomCount
    });
    return res;
};

// CHANGE STATUS
export const changeApartmentStatus = async (id, curStatus) => {
    const res = await axios.patch(`${API_URL_Apartment}/UpdateStatus/${id}`, {
        status: curStatus
    });
    return res;
};

// Get Encrypt URL
export const getEncryptUrl = async (payload) => {
    const res = await axios.post(`${API_URL_Apartment}/encrypt`, {
        facid: `${payload.facid}`,
        locid: `${payload.locid}`,
        apart: `${payload.apart}`
    });
    return res.data.encryptedUrl;
};