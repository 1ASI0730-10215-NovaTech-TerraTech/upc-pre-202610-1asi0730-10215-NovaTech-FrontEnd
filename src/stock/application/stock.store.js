import { defineStore } from 'pinia';
import { ref } from 'vue';
import { StockApi } from '../infrastructure/stock-api.js';
import { InventoryAssembler } from '../infrastructure/inventory.assembler.js';

const stockApi = new StockApi();

export const useStockStore = defineStore('stock', () => {
    const inventory = ref([]);
    const loading = ref(false);

    // Función para generar ID automático (igual que en monitoring)
    function __generateId(collection, prefix) {
        const existingIds = collection.value.map(item => item.id).filter(id => typeof id === 'string' && id.startsWith(prefix));
        let maxNum = 0;
        existingIds.forEach(id => {
            const num = parseInt(id.replace(prefix, ''), 10);
            if (!isNaN(num) && num > maxNum) maxNum = num;
        });
        return `${prefix}${(maxNum + 1).toString().padStart(3, '0')}`;
    }

    const fetchInventory = async () => {
        loading.value = true;
        try {
            const response = await stockApi.getInventory();
            inventory.value = InventoryAssembler.toEntitiesFromResponse(response);
            console.log('📦 Inventario cargado:', inventory.value.length, 'productos');
        } catch (error) {
            console.error('❌ Error al cargar inventario:', error);
        } finally {
            loading.value = false;
        }
    };

    const addProduct = async (productData) => {
        loading.value = true;
        try {
            console.log('🟡 Producto recibido en store:', productData);

            // Auto-generar ID si no tiene (igual que monitoring)
            if (!productData.id || String(productData.id).trim() === '') {
                productData.id = __generateId(inventory, 'inv_');
                console.log('🔵 ID generado automáticamente:', productData.id);
            } else {
                console.log('🟢 Producto ya tiene ID:', productData.id);
            }

            console.log('📤 Enviando al backend:', productData);

            await stockApi.createInventory(productData);
            console.log('✅ Producto creado exitosamente con ID:', productData.id);

            await fetchInventory();
        } catch (error) {
            console.error('❌ Error al agregar producto:', error);
        } finally {
            loading.value = false;
        }
    };

    const discountProduct = async (updatedProduct) => {
        loading.value = true;
        try {
            console.log('🟡 Descontando producto:', updatedProduct);
            await stockApi.updateInventory(updatedProduct);
            console.log('✅ Descuento realizado exitosamente');
            await fetchInventory();
        } catch (error) {
            console.error('❌ Error al descontar producto:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        inventory,
        loading,
        fetchInventory,
        addProduct,
        discountProduct
    };
});