
import API from "../utils/API";

const login = async (login: string, password: string): Promise<boolean> => {
    try {
        const requestData = {
            login: login,
            hashed_password: password 
        };

        const response = await API.post("/auth/login", requestData, {
            headers: { "Content-Type": "application/json" }
        });

        if (response.data.accessToken) {
            localStorage.setItem("token", response.data.accessToken);
            window.location.href = '/home';
            return true;
        }

        return false;
    } catch (error: any) {
        console.error("Authentication error:", error);
        if (error.response) {
            console.error("Server response:", error.response.data);
        }
        return false;
    }
};

export default login;
