import axios from "axios";
import { getEmpId } from "../Common/auth"
import { APP_CONFIG } from "../config";

const API_BASE = APP_CONFIG.API_BASE_URL;

const API_URL_AdminDashboard = API_BASE + "/api/AdminDashboard";

export const getRequestdetails = () => {
    const empId = getEmpId();
    return axios.get(`${API_URL_AdminDashboard}/getRequestdetails`, {
        params: { empId },
        withCredentials: true
    });
};

export const updateAction = async (data) => {
    return axios.post(`${API_URL_AdminDashboard}/updateAction`, data);
};