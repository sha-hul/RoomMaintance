import axios from "axios";
import { getEmpId } from "../Common/auth"
import { APP_CONFIG } from "../config";

const API_BASE = APP_CONFIG.API_BASE_URL;

const API_URL_EmpDashboard = API_BASE + "/api/EmpDashboard";

export const getRequestdetails = () => {
    const empId = getEmpId();
    return axios.get(`${API_URL_EmpDashboard}/getRequestdetails`, {
        params: { empId },
        withCredentials: true
    });
};