<script setup>
import { ref } from 'vue';
import ProductList from '../components/product-list.vue';
import AddProductForm from '../components/add-product-form.vue';
import DiscountProductForm from '../components/discount-product-form.vue';

const selectedProduct = ref(null);
const productListRef = ref(null);

const handleDiscount = (product) => {
  selectedProduct.value = product;
};

const closeModal = () => {
  selectedProduct.value = null;
};

const refreshProducts = () => {
  if (productListRef.value) {
    productListRef.value.fetchProducts();
  }
};
</script>

<template>
  <div class="stock-page">
    <div class="stock-header">
      <h1>Gestión de Inventario</h1>
    </div>

    <div class="stock-content">
      <AddProductForm @product-added="refreshProducts" />
      <ProductList ref="productListRef" @discount="handleDiscount" />
    </div>

    <DiscountProductForm
        :product="selectedProduct"
        @discount-completed="refreshProducts"
        @close="closeModal"
    />
  </div>
</template>

<style scoped>
.stock-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem;
}

.stock-header {
  margin-bottom: 1.5rem;
}

.stock-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.stock-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .stock-page {
    padding: 1rem;
  }
}
</style>