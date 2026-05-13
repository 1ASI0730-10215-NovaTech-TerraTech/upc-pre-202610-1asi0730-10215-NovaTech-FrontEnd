<script setup>
import { ref } from 'vue';
import InventoryList from '../components/inventory-list.vue';
import AddProductForm from '../components/add-product-form.vue';
import DiscountProductForm from '../components/discount-product-form.vue';

const selectedProduct = ref(null);
const inventoryListRef = ref(null);

const handleDiscount = (product) => {
  selectedProduct.value = product;
};

const closeModal = () => {
  selectedProduct.value = null;
};

const refreshInventory = () => {
  if (inventoryListRef.value) {
    inventoryListRef.value.fetchInventory();
  }
};
</script>

<template>
  <div class="inventory-page">
    <div class="inventory-header">
      <h1>Gestión de Inventario</h1>
    </div>

    <div class="inventory-content">
      <AddProductForm @product-added="refreshInventory" />
      <InventoryList ref="inventoryListRef" @discount="handleDiscount" />
    </div>

    <DiscountProductForm
        :product="selectedProduct"
        @discount-completed="refreshInventory"
        @close="closeModal"
    />
  </div>
</template>

<style scoped>
.inventory-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem;
}

.inventory-header {
  margin-bottom: 1.5rem;
}

.inventory-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.inventory-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .inventory-page {
    padding: 1rem;
  }
}
</style>