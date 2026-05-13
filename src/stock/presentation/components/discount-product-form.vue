<script setup>
import { ref, watch } from 'vue';
import { useStockStore } from '../../application/stock.store.js';

const props = defineProps({
  product: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['discount-completed', 'close']);
const stockStore = useStockStore();

const quantity = ref(0);
const show = ref(false);

watch(() => props.product, (newVal) => {
  show.value = !!newVal;
  quantity.value = 0;
});

const submit = async () => {
  if (props.product && quantity.value > 0) {
    await stockStore.discountProduct(props.product.id, quantity.value);
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
      <h3>Descontar producto</h3>
      <p class="product-name">{{ props.product?.productName }}</p>
      <p class="current-stock">Stock actual: {{ props.product?.quantity }} {{ props.product?.unit }}</p>
      <input
          v-model.number="quantity"
          type="number"
          placeholder="Cantidad a descontar"
          autofocus
      />
      <div class="modal-actions">
        <button class="btn-submit" @click="submit" :disabled="stockStore.loading">
          Descontar
        </button>
        <button class="btn-cancel" @click="close">
          Cancelar
        </button>
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  min-width: 320px;
}

.modal-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  color: #1e293b;
}

.product-name {
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.current-stock {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.modal-content input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.875rem;
  box-sizing: border-box;
}

.modal-content input:focus {
  outline: none;
  border-color: #00BB31;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-submit {
  flex: 1;
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-submit:hover {
  background: #dc2626;
}

.btn-cancel {
  flex: 1;
  background: #e2e8f0;
  color: #475569;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-cancel:hover {
  background: #cbd5e1;
}
</style>