import React from "react";
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Chip,
    Button,
    Box,
    Stack,
    Divider
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import WidgetsIcon from '@mui/icons-material/Widgets';

export const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    if (!product || typeof product !== 'object') return null;

    const mainImage = product.images?.find(img => img.is_main) || product.images?.[0];

    const handleDetailsClick = () => {
        navigate(`/products/${product.id}`);
    };

    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.3s',
            '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 6
            }
        }}>
            <CardActionArea onClick={handleDetailsClick}>
                {mainImage && (
                    <CardMedia
                        component="img"
                        height="200"
                        image={mainImage.image}
                        alt={product.name || 'No name'}
                        sx={{ objectFit: 'contain', bgcolor: 'grey.100' }}
                    />
                )}
            </CardActionArea>

            <CardContent sx={{ flexGrow: 1 }} onClick={handleDetailsClick}>
                <Typography gutterBottom variant="h6" component="h3" noWrap>
                    {product.name || 'No name'}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{
                    mb: 2,
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3
                }}>
                    {product.description || 'No description'}
                </Typography>

                <Box sx={{ mb: 2 }}>

                    {product.quantity > 0 ? (
                        <Chip
                            icon={<CheckCircleIcon fontSize="small" />}
                            label={`${product.quantity} в наличии`}
                            color="success"
                            size="small"
                            sx={{ ml: 1 }}
                        />
                    ) : (
                        <Chip
                            icon={<CancelIcon fontSize="small" />}
                            label="Out of stock"
                            color="error"
                            size="small"
                            sx={{ ml: 1 }}
                        />
                    )}
                </Box>

                {product.category && (
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip
                            icon={<CategoryIcon />}
                            label={`${product.category.name || 'N/A'}`}
                            variant="outlined"
                            size="small"
                            color="primary"
                            sx={{
                                backgroundColor: 'primary.light',
                                color: 'primary.contrastText'
                            }}
                        />
                        {product.category.product_type && (
                            <Chip
                                icon={<WidgetsIcon />}
                                label={`${product.category.product_type.name || 'N/A'}`}
                                variant="outlined"
                                size="small"
                                color="secondary"
                                sx={{
                                    backgroundColor: 'secondary.light',
                                    color: 'secondary.contrastText'
                                }}
                            />
                        )}
                    </Stack>
                )}
            </CardContent>

            <Divider />

            <Box sx={{ p: 2 }}>
                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={handleDetailsClick}
                    size="small"
                >
                    View Details
                </Button>
            </Box>
        </Card>
    );
};