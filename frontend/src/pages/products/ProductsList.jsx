import React from 'react';
import {
    Box,
    Typography,
    Pagination
} from '@mui/material';
import { ProductCard } from '../../components/product_card/ProductCard';

const ProductsList = ({ products, count, pageSize, currentPage, onPageChange }) => {
    return (
        <>
            {products.length > 0 ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </Box>
            ) : (
                <Typography variant="h6" textAlign="center" sx={{ my: 4 }}>
                    Товары не найдены
                </Typography>
            )}

            {count > pageSize && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={Math.ceil(count / pageSize)}
                        page={currentPage}
                        onChange={onPageChange}
                        color="primary"
                    />
                </Box>
            )}
        </>
    );
};

export default ProductsList;