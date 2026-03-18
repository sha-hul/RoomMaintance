import axios from "axios";
import { APP_CONFIG } from "../config";

const API_BASE = APP_CONFIG.API_BASE_URL;

const API_URL_Category = API_BASE + "/api/CategoryMaster";

export const getAllCategory = async () => {
    const res = await axios.get(`${API_URL_Category}/GetAll`);
    return res;
}

export const updateCategory = async (editId, categoryName) => {
    const res = await axios.put(`${API_URL_Category}/UpdateCategory/${editId}`, {
        name: categoryName
    });
    return res;
}

export const addCategory = async (categoryName) => {
    const res = await axios.post(`${API_URL_Category}/Create`, {
        name: categoryName,
        status: true
    });
    return res;
}

export const changeCategoryStatus = async (id, curStatus) => {
    const res = await axios.patch(`${API_URL_Category}/UpdateStatus/${id}`, {
        status: curStatus
    });
    return res;
}