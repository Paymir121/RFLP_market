import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Card,
    CardMedia,
    Grid,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Button,
    Stack,
    Paper,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { getProduct } from '../../api/products';
import { ShoppingCart, Favorite, Share, ChevronLeft, ChevronRight } from '@mui/icons-material';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProduct(id);
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleNextImage = () => {
        setCurrentImageIndex(prev =>
            prev === product.images.length - 1 ? 0 : prev + 1
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex(prev =>
            prev === 0 ? product.images.length - 1 : prev - 1
        );
    };

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h6">Загрузка товара...</Typography>
            </Container>
        );
    }

    if (!product) {
        return (
            <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h6">Продукт не найден</Typography>
            </Container>
        );
    }

    const getColumnsCount = () => {
        if (isSmallScreen) return 1;
        if (isMediumScreen) return 2;
        return 3;
    };

    const columnsCount = getColumnsCount();

    const splitSpecifications = () => {
        if (!product.specifications) return [];

        const entries = Object.entries(product.specifications);
        const chunkSize = Math.ceil(entries.length / columnsCount);
        const result = [];

        for (let i = 0; i < columnsCount; i++) {
            result.push(entries.slice(i * chunkSize, (i + 1) * chunkSize));
        }

        return result;
    };

    const specificationsColumns = splitSpecifications();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Grid container spacing={4}>
                    {/* Изображение товара */}
                    <Grid item xs={12} md={6}>
                        {product.images && product.images.length > 0 ? (
                            <Box sx={{ position: 'relative' }}>
                                <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                                    <CardMedia
                                        component="img"
                                        height="500"
                                        image={product.images[currentImageIndex]?.image}
                                        alt={product.name}
                                        sx={{
                                            objectFit: 'contain',
                                            backgroundColor: theme.palette.grey[100]
                                        }}
                                    />
                                </Card>

                                {/* Кнопки навигации */}
                                {product.images.length > 1 && (
                                    <>
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                left: 10,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                backgroundColor: 'rgba(255,255,255,0.7)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,0.9)'
                                                }
                                            }}
                                            onClick={handlePrevImage}
                                        >
                                            <ChevronLeft fontSize="large" />
                                        </IconButton>
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                right: 10,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                backgroundColor: 'rgba(255,255,255,0.7)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,0.9)'
                                                }
                                            }}
                                            onClick={handleNextImage}
                                        >
                                            <ChevronRight fontSize="large" />
                                        </IconButton>
                                    </>
                                )}

                                {/* Миниатюры */}
                                {product.images.length > 1 && (
                                    <Grid container spacing={1} sx={{ mt: 1 }}>
                                        {product.images.slice(0, 4).map((img, index) => (
                                            <Grid item xs={3} key={index}>
                                                <Card
                                                    sx={{
                                                        borderRadius: 1,
                                                        cursor: 'pointer',
                                                        border: currentImageIndex === index ? `2px solid ${theme.palette.primary.main}` : 'none',
                                                        overflow: 'hidden'
                                                    }}
                                                    onClick={() => handleThumbnailClick(index)}
                                                >
                                                    <CardMedia
                                                        component="img"
                                                        height="80"
                                                        image={img.image}
                                                        alt={`${product.name} ${index + 1}`}
                                                        sx={{
                                                            opacity: currentImageIndex === index ? 1 : 0.7,
                                                            '&:hover': {
                                                                opacity: 1
                                                            }
                                                        }}
                                                    />
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Box>
                        ) : (
                            <Box sx={{
                                height: 500,
                                backgroundColor: theme.palette.grey[100],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 2
                            }}>
                                <Typography variant="body1" color="text.secondary">
                                    Изображение отсутствует
                                </Typography>
                            </Box>
                        )}
                    </Grid>

                    {/* Информация о товаре */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                <Chip
                                    label={product.category.product_type.name}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                                <Chip
                                    label={product.category.name}
                                    size="small"
                                    color="secondary"
                                />
                            </Stack>
                            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                                {product.name}
                            </Typography>
                        </Box>

                        <Paper elevation={0} sx={{ p: 2, mb: 3, backgroundColor: theme.palette.grey[50] }}>
                            <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                                {product.price} рублей
                            </Typography>
                            {product.old_price && (
                                <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                    ${product.old_price}
                                </Typography>
                            )}
                            <Chip
                                label={product.quantity > 0 ? 'В наличии' : 'Нет в наличии'}
                                color={product.quantity > 0 ? 'success' : 'error'}
                                size="small"
                                sx={{ mt: 1, ml: 1 }}
                            />
                        </Paper>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body1" paragraph>
                                {product.description}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Характеристики */}
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            Характеристики
                        </Typography>

                        <Grid container spacing={2}>
                            {specificationsColumns.map((column, columnIndex) => (
                                <Grid item xs={12} sm={6} md={4} key={columnIndex}>
                                    <List dense>
                                        {column.map(([key, value]) => (
                                            <ListItem key={key}>
                                                <ListItemText
                                                    primary={key}
                                                    secondary={value}
                                                    secondaryTypographyProps={{ color: 'text.primary' }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default ProductDetailPage;