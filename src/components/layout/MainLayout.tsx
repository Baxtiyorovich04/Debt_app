import React, { useState, useEffect } from 'react';
import { Layout, Menu, Drawer, DatePicker, Spin, Avatar } from 'antd';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { FaHome } from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";
import { FaFolder } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/API";
import './MainLayout.scss';

const { Sider, Content, Header } = Layout;

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

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.substring(1) || 'home'; // Get path like 'home', 'clients'
    const { token } = useAuth();
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);

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
            label: 'Hisobot',
            onClick: () => console.log('Navigate to reports') 
        },
        {
            key: 'settings',
            icon: <IoMdSettings />,
            label: 'Sozlama',
            onClick: () => navigate('/settings')
        }
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                 setLoadingUser(false);
                 return; // Don't fetch if no token
            }
            setLoadingUser(true);
            try {
                const response = await API.get("/auth/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData(response.data.data);
            } catch (error: any) {
                console.error("Error fetching user data:", error);
                // Handle error appropriately, maybe show a message
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUserData();
    }, [token]);

    return (
        <Layout className="main-layout">
            <Sider width={250} className="sidebar">
                <div className="logo">
                    {/* Use dynamic app name or placeholder */}
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
                <Header className="header">
                    <div className="user-info">
                        {loadingUser ? (
                            <Spin size="small" />
                        ) : userData ? (
                            <>
                                <Avatar icon={<UserOutlined />} src={userData.image} />
                                <span className="username">{userData.login}</span>
                            </>
                        ) : (
                            <span>User not found</span>
                        )}
                    </div>
                    <CalendarOutlined className="calendar-icon" onClick={() => setIsDrawerOpen(true)} />
                </Header>
                <Content className="content">
                    {children} 
                </Content>
            </Layout>

            <Drawer title="Kalendar" placement="right" onClose={() => setIsDrawerOpen(false)} open={isDrawerOpen}>
                <DatePicker style={{ width: "100%" }} />
                {/* Placeholder content */}
                <h1>coming soon....</h1> 
            </Drawer>
        </Layout>
    );
};

export default MainLayout; 