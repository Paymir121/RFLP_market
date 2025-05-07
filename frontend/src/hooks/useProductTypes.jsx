import { useState, useEffect } from 'react';
import { getProductTypes } from '../api/products';

const useProductTypes = () => {
    const [productTypes, setProductTypes] = useState([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const typesResponse = await getProductTypes();
                setProductTypes(typesResponse);
            } catch (err) {
                console.error('Ошибка загрузки типов продуктов:', err);
            }
        };
        fetchInitialData();
    }, []);

    return { productTypes };
};

export default useProductTypes;