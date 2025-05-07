import React, { useEffect, useState } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    TextField,
    Button
} from '@mui/material';
import { getProductCategories } from '../../api/products';

const ProductsFilters = ({ filters, onFilterChange, productType, onSearchClick }) => {
    const [categories, setCategories] = useState([]);
    const [localSearch, setLocalSearch] = useState(filters.search || '');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await getProductCategories();
                setCategories(Array.isArray(categories) ? categories : []);
            } catch (err) {
                console.error('Ошибка загрузки категорий:', err);
                setCategories([]);
            }
        };

        fetchCategories();
    }, []);

    const handleSearchChange = (e) => {
        setLocalSearch(e.target.value);
    };

    const handleSearchClick = () => {
        onFilterChange({ target: { name: 'search', value: localSearch } });
        if (onSearchClick) onSearchClick();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    return (
        <Box sx={{ mb: 4, display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                    label="Поиск по названию"
                    variant="outlined"
                    size="small"
                    name="search"
                    value={localSearch}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                    sx={{ minWidth: 250 }}
                />
                <Button
                    variant="contained"
                    onClick={handleSearchClick}
                    sx={{ height: '40px' }}
                >
                    Найти
                </Button>
            </Box>

            <FormControl sx={{ minWidth: 200 }} size="small">
                <InputLabel>Категория</InputLabel>
                <Select
                    name="category"
                    value={filters.category}
                    onChange={onFilterChange}
                    label="Категория"
                >
                    <MenuItem value="">Все категории</MenuItem>
                    {categories.map(category => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControlLabel
                control={
                    <Checkbox
                        name="activeOnly"
                        checked={filters.activeOnly}
                        onChange={onFilterChange}
                    />
                }
                label="Только активные"
            />
        </Box>
    );
};

export default ProductsFilters;