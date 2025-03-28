import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/API";
import "./index.scss";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";

const LoginPage = () => {
    const [loginData, setLoginData] = useState({ login: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setToken } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await API.post("/auth/login", {
                login: loginData.login,
                hashed_password: loginData.password
            });

            if (response.data.accessToken) {
                setToken(response.data.accessToken);
                navigate('/home', { replace: true });
            } else {
                setError("Login yoki parol noto'g'ri!");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            setError("Tizimga kirishda xatolik yuz berdi");
        }
    };

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

                    <button type="submit" disabled={!isFormValid}>
                        Kirish
                    </button>
                </form>
                {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
            </div>
        </div>
    );
};

export default LoginPage;
