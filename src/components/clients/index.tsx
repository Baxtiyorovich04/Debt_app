import { useState, useEffect } from "react";
import { Input, Layout, Menu, Drawer, DatePicker, Spin, Alert, Button } from "antd";
import { SearchOutlined, CalendarOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import { AiOutlineStar } from 'react-icons/ai';
import { FaHome } from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";
import { FaFolder } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/API";
import './index.scss';
import { message } from "antd";

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
    debt_sum: number;
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
    const [loading, setLoading] = useState(true);

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
            setLoading(true);
            try {
                const response = await API.get("/debtor", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDebtors(response.data.data || []);
            } catch (error: any) {
                console.error("Error fetching debtors:", error);
                setError("Mijozlar ma'lumotlarini yuklashda xatolik yuz berdi");
                message.error("Mijozlar ma'lumotlarini yuklashda xatolik yuz berdi");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchUserData();
            fetchDebtors();
        }
    }, [token]);

    const handleClientClick = (debtorId: string) => {
        navigate(`/clients/${debtorId}`);
    };

    const formatAmount = (amount: number | undefined | null) => {
        if (amount === undefined || amount === null) {
            return '0.00';
        }
        return amount.toLocaleString('uz-UZ', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!userData) {
        return <Spin size="large" className="loading-spinner" />;
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
                        <div className="clients-header">
                            <h1>Mijozlar</h1>
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />}
                                onClick={() => navigate('/clients/add')}
                            >
                                Mijoz qo'shish
                            </Button>
                        </div>

                        {loading ? (
                            <div className="clients-loading">
                                <Spin size="large" />
                            </div>
                        ) : error ? (
                            <div className="clients-error">
                                {error}
                            </div>
                        ) : (
                            <div className="clients-list">
                                {debtors.map((debtor) => (
                                    <div 
                                        key={debtor.id} 
                                        className="client-card"
                                        onClick={() => handleClientClick(debtor.id)}
                                    >
                                        <div className="client-info">
                                            <h3>{debtor.full_name}</h3>
                                            <p className="phone">{debtor.phone_number}</p>
                                            <p className="debt">Nasiya: {formatAmount(debtor.debt_sum)} so'm</p>
                                            <p className="date">Qo'shilgan: {formatDate(debtor.created_at)}</p>
                                        </div>
                                        <button 
                                            className="favorite-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Handle favorite toggle
                                            }}
                                        >
                                            <AiOutlineStar className="star-icon" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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