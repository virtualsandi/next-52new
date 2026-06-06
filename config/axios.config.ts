import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 60000,
    timeoutErrorMessage: "Server timed out....",
    headers: {
        "Content-Type": "application/json",

    },
    responseType: "json"
});



// interceptors

// UI Component -----> axios.config --------> Request Intercept -----> Network -----> API server  ---------> Process ---------> axios.config --------> Response Intercept -------> Component

// request interceptor
 axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get("_at_52");
    if(token) {
        config.headers['Authorization'] = "Bearer "+token
    }
    return config;

 })
 export interface AxiosResponseDataType{
    // eslint-disable-next-lin
    data: any,
    message: string,
    status: string,
    meta?: {
        pagination?: {
            page: number,
            limit?: number,
            total?: number
        }
    }
 }
// response interceptors
axiosInstance.interceptors.response.use(
    (response) => {
        return response.data // API response {data: "", message:"", status:"", meta/pagintaion:""}
    },
    (exception) => {
        if(exception.response) {
            throw {code:exception?.status ?? exception?.response?.status, ...exception.response.data}
        }else {
            throw {code: exception?.status, status: exception?.code, message: exception.message}
        }
    }
)


export default axiosInstance