import { useState, useEffect } from "react";
import { Input, Layout, Menu, Drawer, DatePicker } from "antd";
import { SearchOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { AiOutlineStar,  } from 'react-icons/ai';
import { FaHome } from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";
import { FaFolder } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/API";
import Loading from "../loading";
import './index.scss';

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

interface Debtor {
    id: string;
    full_name: string;
    phone_number: string;
    next_payment_date: string;
    debt_period: number;
    debt_sum: string;
    total_debt_sum: number;
    description: string;
    images: Array<{ image: string }>;
    debtor: string;
    debt_status: string;
    created_at: string;
    updated_at: string;
}

const ClientsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.split('/')[1] || 'home';
    const { token } = useAuth();
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [debtors, setDebtors] = useState<Debtor[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

        const fetchDebtors = async () => {
            try {
                const response = await API.get("/debtor?skip=0&take=10", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Debtors API response:", response.data);
                setDebtors(response.data.data);
            } catch (error: any) {
                console.error("Error fetching debtors:", error);
                setError("Mijozlar ma'lumotlarini yuklashda xatolik yuz berdi");
            }
        };

        if (token) {
            fetchUserData();
            fetchDebtors();
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
                    <div className="clients-page">
                        <div className="search-container">
                            <Input
                                prefix={<SearchOutlined />}
                                placeholder="Mijozlarni qidirish..."
                                className="search-input"
                            />
                            <button className="filter-button">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 7H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path d="M6 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path d="M10 17H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>

                        <div className="clients-list">
                            {debtors.map(debtor => {
                                console.log("Debtor data:", debtor);
                                return (
                                    <div key={debtor.id} className="client-card">
                                        <div className="client-info">
                                            <h3 className="client-name">{debtor.full_name}</h3>
                                            <p className="client-phone">{debtor.phone_number}</p>
                                            <p className="client-debt">
                                                Jami nasiya:
                                                <span className="amount">
                                                    {debtor.total_debt_sum ? Math.abs(Number(debtor.total_debt_sum)).toLocaleString() : '0'} so'm
                                                </span>
                                            </p>
                                            <p className="client-next-payment">
                                                Keyingi to'lov: {debtor.next_payment_date ? new Date(debtor.next_payment_date).toLocaleDateString('uz-UZ') : 'Belirtilmagan'}
                                            </p>
                                        </div>
                                        <button className="favorite-button">
                                            <AiOutlineStar className="star-icon" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <button className="add-client-button">
                            <span className="icon">+</span>
                            Yaratish
                        </button>
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

export default ClientsPage; 