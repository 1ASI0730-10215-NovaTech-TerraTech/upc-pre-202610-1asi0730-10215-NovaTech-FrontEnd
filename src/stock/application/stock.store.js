import { defineStore } from 'pinia';
import { ref } from 'vue';
import { StockApi } from '../infrastructure/stock-api.js';
import { InventoryAssembler } from '../infrastructure/inventory.assembler.js';

const stockApi = new StockApi();

export const useStockStore = defineStore('stock', () => {
    const inventory = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const fetchInventory = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await stockApi.getInventory();
            if (response.status === 200) {
                inventory.value = InventoryAssembler.toEntitiesFromResponse(response);
                console.log('✅ Inventario cargado:', inventory.value.length, 'productos');
            }
        } catch (err) {
            console.error('❌ Error al cargar inventario:', err);
            error.value = 'Error al cargar el inventario. Por favor, recarga la página.';
            inventory.value = [];
        } finally {
            loading.value = false;
        }
    };

    const addProduct = async (productData) => {
        loading.value = true;
        error.value = null;
        try {
            // ✅ NO enviar ID, el backend lo genera
            // ✅ Asegurar que ProductId y StockQuantity sean números
            const payload = {
                ProductId: Number(productData.ProductId),
                StockQuantity: Number(productData.StockQuantity),
                WarehouseLocation: productData.WarehouseLocation || null
            };

            console.log('📤 Enviando al backend:', payload);

            const response = await stockApi.createInventory(payload);
            console.log('📥 Respuesta del backend:', response);

            if (response.status === 201 || response.status === 200) {
                console.log('✅ Producto creado exitosamente');
                await fetchInventory(); // Recargar la lista
                return true;
            }
            return false;
        } catch (err) {
            console.error('❌ Error al agregar producto:', err);
            error.value = err.response?.data?.title || 'Error al agregar producto. Intenta nuevamente.';
            return false;
        } finally {
            loading.value = false;
        }
    };

    const discountProduct = async (updatedProduct) => {
        loading.value = true;
        error.value = null;
        try {
            // ✅ Asegurar que StockQuantity sea número
            const payload = {
                id: updatedProduct.id,
                ProductId: Number(updatedProduct.ProductId),
                StockQuantity: Number(updatedProduct.StockQuantity),
                WarehouseLocation: updatedProduct.WarehouseLocation || null
            };

            console.log('📤 Descontando producto:', payload);

            const response = await stockApi.updateInventory(payload);
            console.log('📥 Respuesta del backend:', response);

            if (response.status === 200) {
                console.log('✅ Descuento realizado exitosamente');
                await fetchInventory(); // Recargar la lista
                return true;
            }
            return false;
        } catch (err) {
            console.error('❌ Error al descontar producto:', err);
            error.value = err.response?.data?.title || 'Error al descontar producto. Intenta nuevamente.';
            return false;
        } finally {
            loading.value = false;
        }
    };

    return {
        inventory,
        loading,
        error,
        fetchInventory,
        addProduct,
        discountProduct
    };
});