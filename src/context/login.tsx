import API from "../utils/API";
const login = async (login: string, password: string) => {
    try {
        const requestData = { login, hashed_password: password };
        console.log("Отправляем запрос:", JSON.stringify(requestData));

        const response = await API.post("/login", requestData, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        });

        console.log("Успешный вход:", response.data);

        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }

        return response.data;
    } catch (error: any) {
        console.error("Ошибка авторизации:", error);

        if (error.response) {
            console.error("Ответ от сервера:", error.response.data);
        }

        return null;
    }
};

export default login;
