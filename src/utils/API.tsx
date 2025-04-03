import axios, { AxiosInstance } from "axios";


const API: AxiosInstance = axios.create({
    baseURL: 'https://nasiya.takedaservice.uz/api/',

    headers: {
        'Content-Type': 'application/json',
    },
});
export default API
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(config.headers.Authorization);
    }
    return config;
});
