import { defineStore } from 'pinia';
import { ref } from 'vue';
import { InventoryEndpoint } from '../infrastructure/inventory.endpoint.js';

const inventoryEndpoint = new InventoryEndpoint();

export const useInventoryStore = defineStore('inventory', () => {
    const inventory = ref([]);
    const loading = ref(false);

    const fetchInventory = async () => {
        loading.value = true;
        try {
            const response = await inventoryEndpoint.getAll();
            inventory.value = response.data;
        } finally {
            loading.value = false;
        }
    };

    const addProduct = async (productData) => {
        loading.value = true;
        try {
            const response = await inventoryEndpoint.addProduct(productData);
            await fetchInventory();
            return response.data;
        } finally {
            loading.value = false;
        }
    };

    const discountProduct = async (id, quantity) => {
        loading.value = true;
        try {
            const response = await inventoryEndpoint.discountProduct(id, quantity);
            await fetchInventory();
            return response.data;
        } finally {
            loading.value = false;
        }
    };

    const updateFarmerInventory = async (farmerId, data) => {
        loading.value = true;
        try {
            const response = await inventoryEndpoint.updateFarmerInventory(farmerId, data);
            await fetchInventory();
            return response.data;
        } finally {
            loading.value = false;
        }
    };

    return {
        inventory,
        loading,
        fetchInventory,
        addProduct,
        discountProduct,
        updateFarmerInventory
    };
});