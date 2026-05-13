<script setup>
import { ref, watch } from 'vue';
import { useInventoryStore } from '../../application/inventory.store.js';

const props = defineProps({
    product: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['discount-completed', 'close']);
const inventoryStore = useInventoryStore();

const quantity = ref(0);
const show = ref(false);

watch(() => props.product, (newVal) => {
    show.value = !!newVal;
    quantity.value = 0;
});

const submit = async () => {
    if (props.product && quantity.value > 0) {
        await inventoryStore.discountProduct(props.product.id, quantity.value);
        emit('discount-completed');
        show.value = false;
        emit('close');
    }
};

const close = () => {
    show.value = false;
    emit('close');
};
</script>

<template>
    <div v-if="show" class="modal">
        <div class="modal-content">
            <h3>Descontar producto: {{ product?.productName }}</h3>
            <p>Stock actual: {{ product?.quantity }} {{ product?.unit }}</p>
            <input v-model.number="quantity" type="number" placeholder="Cantidad a descontar" />
            <div class="modal-actions">
                <button @click="submit" :disabled="inventoryStore.loading">Descontar</button>
                <button @click="close">Cancelar</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    min-width: 300px;
}
.modal-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}
</style>