import axiosInstance from './axiosInstance';

export const getProducts = async (filters = {}) => {
    try {
        const params = {
            page: filters.page,
            page_size: filters.pageSize,
            ...(filters.productType && { 'category__product_type': filters.productType }),
            ...(filters.category && { category: filters.category }),
            ...(filters.activeOnly && { is_active: true }),
            ...(filters.search && { search: filters.search }),
        };

        const response = await axiosInstance.get('/products/', { params });

        // Проверяем, есть ли данные в ответе
        if (!response.data ||
            (Array.isArray(response.data) && response.data.length === 0) ||
            (response.data.results && response.data.results.length === 0)) {
            return null; // или undefined, или просто return;
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getProduct = async (id) => {
    try {
        const response = await axiosInstance.get(`/products/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await axiosInstance.post('/products/', productData);
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const getProductTypes = async () => {
    try {
        const response = await axiosInstance.get('/product-types/');
        return response.data;
    } catch (error) {
        console.error('Error fetching product types:', error);
        throw error;
    }
};

export const getProductCategories = async (productTypeId = null) => {
    try {
        const params = productTypeId ? { product_type: productTypeId } : {};
        const response = await axiosInstance.get('/product-categories/', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching product categories:', error);
        throw error;
    }
};
