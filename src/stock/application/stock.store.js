import { defineStore } from 'pinia';
import { ref } from 'vue';
import { StockApi } from '../infrastructure/stock-api.js';
import { ProductAssembler } from '../infrastructure/product.assembler.js';

const stockApi = new StockApi();

export const useStockStore = defineStore('stock', () => {
    const products = ref([]);
    const loading = ref(false);

    const fetchProducts = async () => {
        loading.value = true;
        try {
            const response = await stockApi.getAll();
            products.value = response.data.map(ProductAssembler.toEntity);
        } finally {
            loading.value = false;
        }
    };

    const addProduct = async (productData) => {
        loading.value = true;
        try {
            const dto = ProductAssembler.toDto(productData);
            const response = await stockApi.addProduct(dto);
            await fetchProducts();
            return response.data;
        } finally {
            loading.value = false;
        }
    };

    const discountProduct = async (id, quantity) => {
        loading.value = true;
        try {
            const response = await stockApi.discountProduct(id, quantity);
            await fetchProducts();
            return response.data;
        } finally {
            loading.value = false;
        }
    };

    return {
        products,
        loading,
        fetchProducts,
        addProduct,
        discountProduct
    };
});