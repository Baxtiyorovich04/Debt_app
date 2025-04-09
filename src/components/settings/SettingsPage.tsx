import React from 'react';
import { Layout, List, Typography } from 'antd';
import { RightOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MainLayout from '../layout/MainLayout';
import './SettingsPage.scss';

const {  } = Layout;
const { Title, Text } = Typography;

interface SettingsItem {
    title: string;
    onClick: () => void;
    icon: React.ReactNode;
    isLogout?: boolean; // Make isLogout optional
}

interface SettingsGroup {
    section: string;
    items: SettingsItem[];
}

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const settingsData: SettingsGroup[] = [
        {
            section: 'Asosiy',
            items: [
                { title: 'Shaxsiy ma\'lumotlar', onClick: () => console.log('Navigate to Personal Info'), icon: <RightOutlined /> },
                { title: 'Xavfsizlik', onClick: () => console.log('Navigate to Security'), icon: <RightOutlined /> },
            ]
        },
        {
            section: 'Boshqa',
            items: [
                { title: 'Yordam', onClick: () => console.log('Navigate to Help'), icon: <RightOutlined /> },
                { title: 'Taklif va shikoyatlar', onClick: () => console.log('Navigate to Feedback'), icon: <RightOutlined /> },
                { title: 'Dastur haqida', onClick: () => console.log('Navigate to About App'), icon: <RightOutlined /> },
                { title: 'Ommaviy oferta', onClick: () => console.log('Navigate to Public Offer'), icon: <RightOutlined /> },
                { title: 'Maxfiylik siyosati', onClick: () => console.log('Navigate to Privacy Policy'), icon: <RightOutlined /> },
            ]
        },
        {
            section: '', // No section title for logout
            items: [
                { title: 'Chiqish', onClick: handleLogout, icon: <LogoutOutlined />, isLogout: true },
            ]
        }
    ];

    return (
        <MainLayout>
            <div className="settings-page-content">
                <Title level={2} className="settings-main-title">Sozlamalar</Title>
                {settingsData.map((group, index) => (
                    <div key={index} className="settings-group">
                        {group.section && <Title level={5} className="settings-section-title">{group.section}</Title>}
                        <List<SettingsItem>
                            itemLayout="horizontal"
                            dataSource={group.items}
                            renderItem={item => (
                                <List.Item 
                                    className={`settings-item ${item.isLogout ? 'logout-item' : ''}`}
                                    onClick={item.onClick}
                                >
                                    <List.Item.Meta
                                        title={<Text className={item.isLogout ? 'logout-text' : ''}>{item.title}</Text>}
                                    />
                                    <div className="settings-item-icon">{item.icon}</div>
                                </List.Item>
                            )}
                        />
                    </div>
                ))}
            </div>
        </MainLayout>
    );
};

export default SettingsPage; 