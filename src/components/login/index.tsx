import { useState } from "react";
import login from "../../context/login";

const LoginPage = () => {
    const [error, setError] = useState("");
    const [loginData, setLoginData] = useState({ login: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        const result = await login(loginData.login, loginData.password);

        if (!result) {
            setError("Неправильный логин или пароль!");
        }
    };

    console.log(loginData);

    return (
        <div>
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="login"
                    placeholder="Логин"
                    value={loginData.login}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Войти</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default LoginPage;
