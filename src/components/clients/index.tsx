import { useState, useEffect } from "react";
import { Button, Spin, message, Input } from "antd";
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { AiOutlineStar } from 'react-icons/ai';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/API";
import MainLayout from "../layout/MainLayout";
import './index.scss';

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
    const { token } = useAuth();
    const [debtors, setDebtors] = useState<Debtor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleFilter = () => {
        console.log("Filter button clicked");
    };

    const fetchDebtors = async () => {
        if (!token) { 
            setError("Authentication token not found.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const params = searchTerm ? { search: searchTerm } : {};
            const response = await API.get("/debtor", {
                headers: { Authorization: `Bearer ${token}` },
                params: params
            });
            setDebtors(response.data.data || []);
        } catch (error: any) {
            console.error("Error fetching debtors:", error);
            const errorMsg = error.response?.data?.message || "Mijozlar ma'lumotlarini yuklashda xatolik yuz berdi";
            setError(errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDebtors();
    }, [token, searchTerm]);

    const handleClientClick = (debtorId: string) => {
        navigate(`/clients/${debtorId}`);
    };

    const formatAmount = (amount: number | undefined | null) => {
        const num = amount ?? 0;
        return num.toLocaleString('uz-UZ');
    };

    const filteredDebtors = debtors;

    return (
        <MainLayout>
            <div className="clients-page-content">
                <div className="search-container">
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Mijozlarni qidirish..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="filter-button" onClick={handleFilter}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 7H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M6 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M10 17H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>
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
                        {filteredDebtors.length === 0 ? (
                            <div className="no-clients-message">Mijozlar topilmadi.</div>
                        ) : (
                            filteredDebtors.map((debtor) => (
                                <div 
                                    key={debtor.id} 
                                    className="client-card"
                                    onClick={() => handleClientClick(debtor.id)}
                                >
                                    <div className="client-info">
                                        <h3 className="client-name">{debtor.full_name || 'N/A'}</h3>
                                        <p className="client-phone">{debtor.phone_number || '-'}</p>
                                        <p className="client-debt">
                                            Jami nasiya:
                                            <span className={`amount ${debtor.debt_sum < 0 ? 'negative' : ''}`}>
                                                {formatAmount(debtor.debt_sum)} so'm
                                            </span>
                                        </p>
                                    </div>
                                    <button 
                                        className="favorite-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log('Toggle favorite for:', debtor.id);
                                        }}
                                    >
                                        <AiOutlineStar className="star-icon" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
                <Button 
                    type="primary" 
                    className="add-client-button" 
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/clients/add')}
                >
                    Yaratish
                </Button>
            </div>
        </MainLayout>
    );
};

export default ClientsPage; 