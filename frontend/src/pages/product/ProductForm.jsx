import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductTypes, getProductCategories } from '../../api/products';
import axiosInstance from '../../api/axiosInstance';

import {
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Button,
    CircularProgress,
    Typography,
    Box,
    Paper,
    Alert,
    Container
} from '@mui/material';

import SpecificationsField from './SpecificationsField';
import ImageUploader from './ImageUploader';

const ProductForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',           // Название продукта
        description: '',    // Описание продукта
        price: '',         // Цена продукта (число с плавающей точкой)
        quantity: '',      // Количество на складе (целое число)
        category: '',      // ID категории продукта
        type: '',          // ID типа продукта
        specifications: {}, // Характеристики продукта (объект)
        images: []         // Массив изображений продукта
    });

    const [productTypes, setProductTypes] = useState([]);  // Список типов продуктов
    const [categories, setCategories] = useState([]);      // Список категорий продуктов
    const [loading, setLoading] = useState(false);         // Флаг загрузки
    const [error, setError] = useState(null);             // Ошибка при отправке формы
    const [success, setSuccess] = useState(false);        // Флаг успешного создания продукта

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [types, categories] = await Promise.all([
                    getProductTypes(),
                    getProductCategories()
                ]);
                setProductTypes(types);
                setCategories(Array.isArray(categories) ? categories : []);
            } catch (err) {
                console.error('Ошибка при загрузке данных:', err);
                setCategories([]);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', parseFloat(formData.price));
            formDataToSend.append('quantity', parseInt(formData.quantity));
            formDataToSend.append('category', formData.category);
            formDataToSend.append('type', formData.type);
            formDataToSend.append('specifications', JSON.stringify(formData.specifications));

            formData.images.forEach((image) => {
                formDataToSend.append('images', image);
            });

            await axiosInstance.post('/products/', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setSuccess(true);
            setTimeout(() => navigate('/products'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Ошибка при создании продукта');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Добавить новый продукт
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {typeof error === 'object' ? JSON.stringify(error) : error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        Продукт успешно создан! Перенаправление...
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        '& .MuiTextField-root, & .MuiFormControl-root': {
                            minWidth: '200px',
                            width: '100%'
                        }
                    }}>
                        <TextField
                            label="Название продукта"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            inputProps={{ minLength: 2 }}
                        />

                        <TextField
                            label="Описание"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            required
                            inputProps={{ minLength: 10 }}
                        />

                        <Box sx={{
                            display: 'flex',
                            gap: 3,
                            flexDirection: { xs: 'column', sm: 'row' }
                        }}>
                            <TextField
                                label="Цена"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                inputProps={{ step: "0.01", min: "0.01" }}
                                required
                            />

                            <TextField
                                label="Количество"
                                name="quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={handleChange}
                                inputProps={{ min: "0" }}
                                required
                            />
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            gap: 3,
                            flexDirection: { xs: 'column', sm: 'row' }
                        }}>
                            <FormControl>
                                <InputLabel>Категория</InputLabel>
                                <Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    label="Категория"
                                    required
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl>
                                <InputLabel>Тип продукта</InputLabel>
                                <Select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    label="Тип продукта"
                                    required
                                >
                                    {productTypes.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>
                                            {type.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <SpecificationsField
                            specifications={formData.specifications}
                            onChange={(specs) => setFormData(prev => ({ ...prev, specifications: specs }))}
                        />

                        <ImageUploader
                            images={formData.images}
                            onChange={(images) => setFormData(prev => ({ ...prev, images }))}
                            minImages={1}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/products')}
                                disabled={loading}
                            >
                                Отмена
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Создать продукт'}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default ProductForm;