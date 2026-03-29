import axios from "axios";
import { APP_CONFIG } from "../config";

const API_BASE = APP_CONFIG.API_BASE_URL;

const API_URL_Login = API_BASE + "/api/Login";

export const UserLogin = async (empId, password) => {
    debugger;

    //Employee Token Generation
    const res = await axios.post(`${API_URL_Login}/login`, {
        empId,
        password
    });
    sessionStorage.setItem("user", JSON.stringify({
        empId: res.data.empId,
        name: res.data.empName,
        role: res.data.role,
        mail: res.data.mail,
    }));

    return res;
}