<script setup>
import { ref } from 'vue';
import { useInventoryStore } from '../../application/inventory.store.js';

const emit = defineEmits(['product-added']);
const inventoryStore = useInventoryStore();

const product = ref({
    productName: '',
    quantity: 0,
    unit: 'kg',
    minimumStock: 0
});

const submit = async () => {
    await inventoryStore.addProduct(product.value);
    emit('product-added');
    product.value = { productName: '', quantity: 0, unit: 'kg', minimumStock: 0 };
};
</script>

<template>
    <div class="add-product-form">
        <h3>Agregar Producto</h3>
        <form @submit.prevent="submit">
            <input v-model="product.productName" placeholder="Nombre del producto" required />
            <input v-model.number="product.quantity" type="number" placeholder="Cantidad" required />
            <select v-model="product.unit">
                <option value="kg">Kilogramos</option>
                <option value="unidad">Unidades</option>
                <option value="litro">Litros</option>
            </select>
            <input v-model.number="product.minimumStock" type="number" placeholder="Stock mínimo" />
            <button type="submit" :disabled="inventoryStore.loading">Agregar</button>
        </form>
    </div>
</template>

<style scoped>
.add-product-form {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
}
form {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}
input, select, button {
    padding: 0.5rem;
}
</style>