import React from 'react';
import { useAuth } from '../../context/AuthContext';
import ProductForm from './ProductForm';
import { Container, Paper, Typography, Alert } from '@mui/material';

const ProductCreatePage = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Access Denied
                    </Typography>
                    <Typography>
                        You must be logged in to access this page.
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return <ProductForm />;
};

export default ProductCreatePage;