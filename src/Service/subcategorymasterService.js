import axios from "axios";
import { APP_CONFIG } from "../config";

const API_BASE = APP_CONFIG.API_BASE_URL;

const API_URL_Subcategory = API_BASE + "/api/SubcategoryMaster";

// GET ALL Subcategories
export const getAllSubcategories = async () => {
    const res = await axios.get(`${API_URL_Subcategory}/GetAll`);
    return res;
};

// CREATE Subcategory
export const addSubcategory = async (categoryId, subcategoryName) => {
    const res = await axios.post(`${API_URL_Subcategory}/Create`, {
        categoryId,
        name: subcategoryName,
        status: true
    });
    return res;
};

// UPDATE Subcategory
export const updateSubcategory = async (id, categoryId, subcategoryName) => {
    const res = await axios.put(`${API_URL_Subcategory}/UpdateSubcategory/${id}`, {
        categoryId,
        name: subcategoryName
    });
    return res;
};

// CHANGE STATUS
export const changeSubcategoryStatus = async (id, curStatus) => {
    const res = await axios.patch(`${API_URL_Subcategory}/UpdateStatus/${id}`, {
        status: curStatus
    });
    return res;
};