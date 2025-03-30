import { useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/API';
import './AddClient.scss';

interface PhoneNumber {
    key: number;
    value: string;
}

const AddClient = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [form] = Form.useForm();
    const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([{ key: 0, value: '' }]);
    const [fileList, setFileList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleAddPhoneNumber = () => {
        const newKey = phoneNumbers.length;
        setPhoneNumbers([...phoneNumbers, { key: newKey, value: '' }]);
    };

    const handlePhoneNumberChange = (key: number, value: string) => {
        setPhoneNumbers(phoneNumbers.map(phone => 
            phone.key === key ? { ...phone, value } : phone
        ));
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
           
            const validPhoneNumbers = phoneNumbers
                .map(phone => phone.value.trim())
                .filter(Boolean);

            if (validPhoneNumbers.length === 0) {
                message.error("Kamida bitta telefon raqami kiritish kerak");
                return;
            }

        
            const images = fileList.length > 0 
                ? fileList.map(file => file.url || "")
                : ["", ""]; 

            const formData = {
                full_name: values.fullName.trim(),
                address: "toshkent",
                description: "no description",
                store: "string",
                phone_numbers: validPhoneNumbers,
                images: images
            };

          

            const response = await API.post("/debtor", formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            console.log("Response:", response);

            message.success("Mijoz muvaffaqiyatli qo'shildi");
            navigate("/clients");
        } catch (error: any) {
            console.error("Error adding client:", error);
            if (error.response?.data?.message) {
                message.error(error.response.data.message);
            } else {
                message.error("Mijozni qo'shishda xatolik yuz berdi");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-client-container">
            <div className="add-client-header">
                <h2>Yangi mijoz qo'shish</h2>
                <Button onClick={() => navigate("/clients")} type="link">
                    Orqaga
                </Button>
            </div>
            
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="add-client-form"
            >
                <Form.Item
                    label="To'liq ism"
                    name="fullName"
                    rules={[{ required: true, message: "Iltimos, to'liq ismni kiriting" }]}
                >
                    <Input placeholder="To'liq ismni kiriting" />
                </Form.Item>

                {phoneNumbers.map((phone) => (
                    <Form.Item
                        key={phone.key}
                        label={phone.key === 0 ? "Telefon raqami" : "Qo'shimcha telefon raqami"}
                        required={phone.key === 0}
                    >
                        <Input
                            placeholder="+998 __ ___ __ __"
                            value={phone.value}
                            onChange={(e) => handlePhoneNumberChange(phone.key, e.target.value)}
                        />
                    </Form.Item>
                ))}

                <Button type="dashed" onClick={handleAddPhoneNumber} style={{ marginBottom: 24 }}>
                    <PlusOutlined /> Telefon raqam qo'shish
                </Button>

                <Form.Item label="Rasmlar">
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={({ fileList }) => setFileList(fileList)}
                        beforeUpload={() => false}
                    >
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Rasm yuklash</div>
                        </div>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="submit-button"
                    >
                        Mijozni qo'shish
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddClient; 