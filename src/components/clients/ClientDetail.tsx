import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Spin, Button, Alert, Modal, Form, Input, DatePicker, Upload, message } from 'antd';
import { ArrowLeftOutlined, StarOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/API';
import './ClientDetail.scss';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import { validate as uuidValidate } from 'uuid';

interface Debt {
    id: string;
    amount: number;
    created_at: string;
    due_date: string;
    status: string;
    debt_sum: number;
    next_payment_date: string;
    debt_period: number;
    description: string;
    debtor: string;
}

interface ClientDetail {
    id: string;
    full_name: string;
    phone_number: string;
    debt_sum: number;
    created_at: string;
    updated_at: string;
}

interface DebtFormValues {
    debt_sum: number;
    debt_period: number;
    description: string;
    next_payment_date: string;
    images: UploadFile[];
}

interface EditDebtFormValues {
    debt_sum: number;
    debt_period: number;
    description: string;
    debt_date: string;
}

const ClientDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [client, setClient] = useState<ClientDetail | null>(null);
    const [debts, setDebts] = useState<Debt[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    // Validate UUID format
    const isValidUUID = (uuid: string | undefined): boolean => {
        if (!uuid) return false;
        return uuidValidate(uuid);
    };

    const fetchClientData = async () => {
        if (!id || !isValidUUID(id)) {
            setError('Noto\'g\'ri mijoz ID formati');
            setLoading(false);
            return;
        }

        try {
            console.log('Fetching data for client ID:', id);
            const [clientResponse, debtsResponse] = await Promise.all([
                API.get(`/debtor/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                API.get(`/debts`, {
                    params: { debtor_id: id },
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            console.log('Client data:', clientResponse.data);
            console.log('Debts data:', debtsResponse.data);

            setClient(clientResponse.data);
            setDebts(debtsResponse.data.data || []);
        } catch (error) {
            console.error('Error fetching client data:', error);
            setError('Mijoz ma\'lumotlarini yuklashda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id && token) {
            fetchClientData();
        }
    }, [id, token]);

    const handleAddDebt = async (values: DebtFormValues) => {
        if (!id || !isValidUUID(id)) {
            message.error('Noto\'g\'ri mijoz ID formati');
            return;
        }

        setSubmitting(true);
        try {
            const formData = {
                next_payment_date: dayjs(values.next_payment_date).format('YYYY-MM-DD'),
                debt_period: parseInt(values.debt_period.toString()),
                debt_sum: Number(values.debt_sum).toFixed(2),
                total_debt_sum: Number(values.debt_sum).toFixed(2),
                description: values.description.trim(),
                images: values.images.length > 0 
                    ? values.images.map(file => ({ image: file.url || "" }))
                    : [{ image: "" }, { image: "" }],
                debtor: id,
                debt_status: "active"
            };

            console.log('Sending debt data:', formData);

            const response = await API.post('/debts', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Debt creation response:', response);

            message.success('Nasiya muvaffaqiyatli qo\'shildi');
            setIsModalVisible(false);
            form.resetFields();
            fetchClientData();
        } catch (error: any) {
            console.error('Error adding debt:', error);
            const errorMessage = error.response?.data?.error?.message || 'Nasiya qo\'shishda xatolik yuz berdi';
            message.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditDebt = async (values: EditDebtFormValues) => {
        if (!selectedDebt || !id || !isValidUUID(id) || !isValidUUID(selectedDebt.id)) {
            message.error('Noto\'g\'ri ID formati');
            return;
        }
        
        setSubmitting(true);
        try {
            const formData = {
                debt_date: dayjs(values.debt_date).format('YYYY-MM-DD'),
                debt_period: parseInt(values.debt_period.toString()),
                debt_sum: parseFloat(values.debt_sum.toString()),
                total_debt_sum: parseFloat(values.debt_sum.toString()),
                description: values.description.trim(),
                debtor_id: id,
                debt_status: selectedDebt.status || "active"
            };

            console.log('Sending edit debt data:', formData);

            const response = await API.put(`/debts/${selectedDebt.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Edit response:', response);

            message.success('Nasiya muvaffaqiyatli yangilandi');
            setIsEditModalVisible(false);
            editForm.resetFields();
            setSelectedDebt(null);
            fetchClientData();
        } catch (error: any) {
            console.error('Error editing debt:', error);
            const errorMessage = error.response?.data?.error?.message 
                || error.response?.data?.message 
                || 'Nasiyani yangilashda xatolik yuz berdi';
            message.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDebtClick = (debt: Debt) => {
        setSelectedDebt(debt);
        editForm.setFieldsValue({
            debt_sum: debt.debt_sum,
            debt_period: debt.debt_period,
            description: debt.description,
            debt_date: dayjs(debt.created_at)
        });
        setIsEditModalVisible(true);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Not set';
        const date = dayjs(dateString);
        return date.isValid() ? date.format('YYYY-MM-DD') : 'Invalid Date';
    };

    const formatAmount = (amount: number | undefined) => {
        if (amount === undefined || amount === null) return '0';
        return amount.toLocaleString('uz-UZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    action={
                        <Button size="small" onClick={() => navigate('/clients')}>
                            Orqaga
                        </Button>
                    }
                />
            </div>
        );
    }

    if (!client) {
        return (
            <div className="error-container">
                <Alert
                    message="Mijoz topilmadi"
                    type="error"
                    showIcon
                    action={
                        <Button size="small" onClick={() => navigate('/clients')}>
                            Orqaga
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <Layout className="client-detail-page">
            <div className="client-detail-header">
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate('/clients')}
                    className="back-button"
                />
                <h1>{client.full_name}</h1>
                <Button 
                    type="text" 
                    icon={<StarOutlined />} 
                    className="favorite-button"
                />
            </div>

            <div className="client-info-card">
                <div className="total-debt">
                    <span className="label">Umumiy nasiya:</span>
                    <span className="amount">{formatAmount(client.debt_sum)} so'm</span>
                </div>
            </div>

            <div className="debts-section">
                <h2>Faol nasiyalar</h2>
                <div className="debts-list">
                    {debts.map((debt) => (
                        <div 
                            key={debt.id} 
                            className="debt-card"
                            onClick={() => handleDebtClick(debt)}
                        >
                            <div className="debt-info">
                                <div className="debt-date">
                                    {formatDate(debt.created_at)}
                                </div>
                                <div className="debt-amount">
                                    {formatAmount(debt.debt_sum)} so'm
                                </div>
                            </div>
                            <div className="debt-due-date">
                                <span className="label">Keyingi to'lov:</span>
                                <span className="date">
                                    {formatDate(debt.next_payment_date)}
                                </span>
                            </div>
                            <div className={`debt-status ${(debt.status || 'active').toLowerCase()}`}>
                                {debt.status || 'Active'}
                            </div>
                            <Button 
                                type="text"
                                icon={<EditOutlined />}
                                className="edit-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDebtClick(debt);
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <Button 
                type="primary" 
                className="add-debt-button"
                onClick={() => setIsModalVisible(true)}
                icon={<PlusOutlined />}
            >
                Nasiya qo'shish
            </Button>

            <Modal
                title="Yangi nasiya qo'shish"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddDebt}
                    initialValues={{
                        images: []
                    }}
                >
                    <Form.Item
                        name="debt_sum"
                        label="Nasiya summasi"
                        rules={[{ required: true, message: 'Iltimos, nasiya summasini kiriting' }]}
                    >
                        <Input type="number" placeholder="Nasiya summasini kiriting" />
                    </Form.Item>

                    <Form.Item
                        name="debt_period"
                        label="Nasiya muddati (oyda)"
                        rules={[{ required: true, message: 'Iltimos, nasiya muddatini kiriting' }]}
                    >
                        <Input type="number" placeholder="Nasiya muddatini kiriting" />
                    </Form.Item>

                    <Form.Item
                        name="next_payment_date"
                        label="Keyingi to'lov sanasi"
                        rules={[{ required: true, message: 'Iltimos, keyingi to\'lov sanasini tanlang' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Izoh"
                        rules={[{ required: true, message: 'Iltimos, izoh kiriting' }]}
                    >
                        <Input.TextArea placeholder="Izoh kiriting" />
                    </Form.Item>

                    <Form.Item
                        name="images"
                        label="Rasmlar"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e?.fileList;
                        }}
                    >
                        <Upload
                            listType="picture-card"
                            beforeUpload={() => false}
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={submitting} block>
                            Saqlash
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Nasiyani tahrirlash"
                open={isEditModalVisible}
                onCancel={() => {
                    setIsEditModalVisible(false);
                    setSelectedDebt(null);
                    editForm.resetFields();
                }}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleEditDebt}
                >
                    <Form.Item
                        name="debt_sum"
                        label="Nasiya summasi"
                        rules={[{ required: true, message: 'Iltimos, nasiya summasini kiriting' }]}
                    >
                        <Input type="number" placeholder="Nasiya summasini kiriting" />
                    </Form.Item>

                    <Form.Item
                        name="debt_period"
                        label="Nasiya muddati (oyda)"
                        rules={[{ required: true, message: 'Iltimos, nasiya muddatini kiriting' }]}
                    >
                        <Input type="number" placeholder="Nasiya muddatini kiriting" />
                    </Form.Item>

                    <Form.Item
                        name="debt_date"
                        label="Nasiya sanasi"
                        rules={[{ required: true, message: 'Iltimos, nasiya sanasini tanlang' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Izoh"
                        rules={[{ required: true, message: 'Iltimos, izoh kiriting' }]}
                    >
                        <Input.TextArea placeholder="Izoh kiriting" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={submitting} block>
                            Saqlash
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default ClientDetailPage; 