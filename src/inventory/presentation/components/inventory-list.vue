<script setup>
import { onMounted } from 'vue';
import { useInventoryStore } from '../../application/inventory.store.js';

const inventoryStore = useInventoryStore();

onMounted(() => {
    inventoryStore.fetchInventory();
});
</script>

<template>
    <div class="inventory-list">
        <h3>Inventario</h3>
        <div v-if="inventoryStore.loading">Cargando...</div>
        <table v-else class="inventory-table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Unidad</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in inventoryStore.inventory" :key="item.id">
                    <td>{{ item.productName }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.unit }}</td>
                    <td>
                        <button @click="$emit('discount', item)">Descontar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.inventory-list {
    padding: 1rem;
}
.inventory-table {
    width: 100%;
    border-collapse: collapse;
}
.inventory-table th,
.inventory-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}
</style>