<script setup>
import { ref } from 'vue';
import InventoryList from '../components/inventory-list.vue';
import AddProductForm from '../components/add-product-form.vue';
import DiscountProductForm from '../components/discount-product-form.vue';

const selectedProduct = ref(null);

const handleDiscount = (product) => {
    selectedProduct.value = product;
};

const closeModal = () => {
    selectedProduct.value = null;
};
</script>

<template>
    <div class="inventory-page">
        <h1>Gestión de Inventario</h1>
        <div class="inventory-grid">
            <AddProductForm @product-added="$refs.inventoryList.fetchInventory()" />
            <InventoryList ref="inventoryList" @discount="handleDiscount" />
        </div>
        <DiscountProductForm 
            :product="selectedProduct" 
            @discount-completed="$refs.inventoryList.fetchInventory()"
            @close="closeModal"
        />
    </div>
</template>

<style scoped>
.inventory-page {
    padding: 2rem;
}
.inventory-grid {
    display: grid;
    gap: 2rem;
    margin-top: 2rem;
}
h1 {
    margin: 0 0 1rem 0;
}
</style>