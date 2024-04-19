import axios from "axios";
import API_BASE_URI from '../config/api.config'


export const AxiosInstance = axios.create({
   baseURL: API_BASE_URI
})

