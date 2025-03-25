import { useState } from "react";
import { Drawer, DatePicker } from "antd";
import { CalendarOutlined, PlusCircleOutlined, UserOutlined } from "@ant-design/icons";
import { FaHome } from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";
import { FaWallet } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import "./index.scss";

const Home = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div className="home-container">

            <header className="header">
                <div className="user-info">
                    <UserOutlined className="avatar" />
                    <span className="username">Testuchun</span>
                </div>
                <CalendarOutlined className="calendar-icon" onClick={() => setIsDrawerOpen(true)} />
            </header>


            <div className="content">

                <div className="balance-card">
                    <p className="balance">135 214 200 so‘m</p>
                    <span className="balance-text">Umumiy nasiya:</span>
                </div>


                <div className="stats">
                    <div className="stat-card">
                        <p className="stat-title">Kechiktirilgan to‘lovlar</p>
                        <span className="stat-value red">26</span>
                    </div>
                    <div className="stat-card">
                        <p className="stat-title">Mijozlar soni</p>
                        <span className="stat-value green">151</span>
                    </div>
                </div>
                <h3 style={{ marginTop: "20px" }}>Hamyoningiz</h3>
                <div className="wallet">
                    <div className="wallet-icon"><FaWallet /></div>
                    <div>
                        <p className="wallet-title">Hisobingizda </p>
                        <p className="wallet-amount">300 000 so‘m</p>

                    </div>


                    <PlusCircleOutlined className="add-icon" />
                </div>
                <div className="this-month-box">
                    <p>Bu oy uchun to‘lov:</p>
                    <p >To‘lov qilingan</p>
                </div>
            </div>


            <nav className="bottom-nav">
                <div className="nav-item active">

                    <FaHome />asosiy

                </div>
                <div className="nav-item">
                    <div>
                        <FaUsersLine /> Mijozlar
                    </div>

                </div>
                <div className="nav-item">
                    <div>
                        <FaFolder />Hisobot
                    </div>

                </div>
                <div className="nav-item">
                    <div>
                        <IoMdSettings />Sozlama
                    </div>

                </div>
            </nav>


            <Drawer title="Kalendar" placement="left" onClose={() => setIsDrawerOpen(false)} open={isDrawerOpen}>
                <DatePicker style={{ width: "100%" }} />
                <h1>coming soon....</h1>
            </Drawer>
        </div>
    );
};

export default Home;
