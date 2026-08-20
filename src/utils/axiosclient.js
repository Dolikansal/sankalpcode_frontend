import axios from "axios";

const axiosclient = axios.create({
    baseURL: "https://sankalpcode-backend.onrender.com",
    withCredentials: true, // Cookies handle karne ke liye sahi hai
    headers: { // 'headers' small letters mein hona chahiye
        "Content-Type": "application/json"
    }
});

// Agar tum headers mein JWT token bhej rahe ho (LocalStorage se), 
// toh ye interceptor add karna best rehta hai:
axiosclient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Check karo tumhare token ki key yahi hai na
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosclient;