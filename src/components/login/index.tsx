import { useState } from "react";
import login from "../../context/login";
import "./index.scss";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
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
    const isFormValid = loginData.login.trim() !== "" && loginData.password.trim() !== "";
    return (
        <div className="login-box">
            <div className="login-inputs">
                <img src="./mini_logo.svg" alt="" />
                <h1>Dasturga kirish</h1>
                <p>Iltimos, tizimga kirish uchun login va parolingizni kiriting.</p>
                <form onSubmit={handleSubmit}>

                    <label htmlFor="login">Login</label>
                    <div style={{ width: "100%", position: "relative" }}>
                        <FaUserEdit className="user-log-icon" />
                        <input

                            type="text"
                            name="login"
                            placeholder="login"
                            value={loginData.login}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <label htmlFor="password">Parol</label>
                    <div style={{ width: "100%", position: "relative" }}>
                        <RiLockPasswordFill className="user-log-icon" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    <button type="submit" disabled={!isFormValid}>Kirish</button>
                </form>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </div>

    );
};

export default LoginPage;
