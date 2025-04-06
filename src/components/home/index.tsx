import { useState, useEffect } from "react";
import { Drawer, DatePicker, Layout, Menu } from "antd";
import { CalendarOutlined, PlusCircleOutlined, UserOutlined } from "@ant-design/icons";
import { FaHome } from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";
import { FaWallet } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/API";
import Loading from "../loading";
import "./index.scss";

const { Sider, Content } = Layout;

interface UserProfile {
    id: string;
    created_at: string;
    updated_at: string;
    login: string;
    phone_number: string;
    wallet: string;
    image: string | null;
    pin_code: number;
    is_active: boolean;
}

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const currentPath = location.pathname.split('/')[1] || 'home';
    const { token } = useAuth();
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string | null>(null);

    const menuItems = [
        {
            key: 'home',
            icon: <FaHome />,
            label: 'Asosiy',
            onClick: () => navigate('/home')
        },
        {
            key: 'clients',
            icon: <FaUsersLine />,
            label: 'Mijozlar',
            onClick: () => navigate('/clients')
        },
        {
            key: 'reports',
            icon: <FaFolder />,
            label: 'Hisobot'
        },
        {
            key: 'settings',
            icon: <IoMdSettings />,
            label: 'Sozlama'
        }
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await API.get("/auth/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserData(response.data.data);
            } catch (error: any) {
                console.error("Error fetching user data:", error);
                setError("Foydalanuvchi ma'lumotlarini yuklashda xatolik yuz berdi");
            }
        };

        if (token) {
            fetchUserData();
        }
    }, [token]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!userData) {
        return <Loading />;
    }

    return (
        <Layout className="home-layout">
            <Sider width={250} className="sidebar">
                <div className="logo">
                    <h2>Debt App</h2>
                </div>
                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[currentPath]}
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <header className="header">
                    <div className="user-info">
                        <UserOutlined className="avatar" />
                        <span className="username">{userData.login}</span>
                    </div>
                    <CalendarOutlined className="calendar-icon" onClick={() => setIsDrawerOpen(true)} />
                </header>
                <Content className="content">
                    <div className="dashboard-grid">
                        <div className="balance-card">
                            <p className="balance">5 499 000 so'm</p>
                            <span className="balance-text">Umumiy nasiya:</span>
                        </div>

                        <div className="stats">
                            <div className="stat-card">
                                <p className="stat-title">Kechiktirilgan to'lovlar</p>
                                <span className="stat-value red">0</span>
                            </div>
                            <div className="stat-card">
                                <p className="stat-title">Mijozlar soni</p>
                                <span className="stat-value green">8</span>
                            </div>
                        </div>

                        <div className="wallet-section">
                            <h3>Hamyoningiz</h3>
                            <div className="wallet">
                                <div className="wallet-icon"><FaWallet /></div>
                                <div>
                                    <p className="wallet-title">Hisobingizda </p>
                                    <p className="wallet-amount">{userData.wallet} so'm</p>
                                </div>
                                <PlusCircleOutlined className="add-icon" />
                            </div>
                            <div className="this-month-box">
                                <p>Bu oy uchun to'lov:</p>
                                <p>To'lov qilingan</p>
                            </div>
                        </div>
                    </div>
                </Content>
            </Layout>

            <Drawer title="Kalendar" placement="right" onClose={() => setIsDrawerOpen(false)} open={isDrawerOpen}>
                <DatePicker style={{ width: "100%" }} />
                <h1>coming soon....</h1>
            </Drawer>
        </Layout>
    );
};

export default Home;
