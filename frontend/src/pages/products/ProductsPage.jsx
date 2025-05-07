import React, { useState, useEffect } from 'react';
import {
    Box,
    CircularProgress,
    Container,
    Typography,
    Alert
} from '@mui/material';
import { getProducts } from '../../api/products';
import ProductsFilters from './ProductsFilters';
import ProductsList from './ProductsList';
import useProductTypes from '../../hooks/useProductTypes';

const ProductsPage = ({ type }) => {
    const [productsData, setProductsData] = useState({
        results: [],
        count: 0,
        next: null,
        previous: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        activeOnly: true,
        page: 1,
        pageSize: 10,
        productType: '',
        search: ''
    });
    const [searchTrigger, setSearchTrigger] = useState(0);

    const { productTypes } = useProductTypes();

    useEffect(() => {
        if (type && productTypes.length > 0) {
            const foundType = productTypes.find(t => t.name.toLowerCase() === type.toLowerCase());
            setFilters(prev => ({
                ...prev,
                productType: foundType ? foundType.id : '',
                category: '',
                page: 1
            }));
        }
    }, [type, productTypes]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const productsResponse = await getProducts(filters);
                setProductsData(productsResponse || {results: [], count: 0});
                setLoading(false);
            } catch (err) {
                console.error('Ошибка загрузки данных:', err);
                setError(err.message);
                setProductsData({results: [], count: 0});
                setLoading(false);
            }
        };

        fetchData();
    }, [filters, searchTrigger]);

    const handleFilterChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
            page: 1
        }));
    };

    const handleSearchClick = () => {
        setSearchTrigger(prev => prev + 1);
    };

    const handlePageChange = (event, newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    if (loading) return (
        <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Container maxWidth="md">
            <Alert severity="error" sx={{ my: 4 }}>
                Ошибка: {error}
            </Alert>
        </Container>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {type && (
                <Typography variant="h4" gutterBottom>
                    {type}
                </Typography>
            )}

            <ProductsFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                productType={filters.productType}
                onSearchClick={handleSearchClick}
            />

            <ProductsList
                products={productsData.results}
                count={productsData.count}
                pageSize={filters.pageSize}
                currentPage={filters.page}
                onPageChange={handlePageChange}
            />
        </Container>
    );
};

export default ProductsPage;