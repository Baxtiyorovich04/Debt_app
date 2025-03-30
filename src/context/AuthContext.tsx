import { createContext, useContext, useState, ReactNode, useEffect } from "react";


interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
    };

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
