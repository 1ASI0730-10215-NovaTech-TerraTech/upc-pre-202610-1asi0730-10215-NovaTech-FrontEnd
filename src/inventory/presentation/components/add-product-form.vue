<script setup>
import { ref } from 'vue';
import { useInventoryStore } from '../../application/inventory.store.js';

const emit = defineEmits(['product-added']);
const inventoryStore = useInventoryStore();

const product = ref({
  productName: '',
  quantity: '',
  unit: 'kg',
  minimumStock: ''
});

const success = ref(false);
const error = ref('');

const submit = async () => {
  error.value = '';

  if (!product.value.productName.trim()) {
    error.value = 'Ingrese el nombre del producto';
    return;
  }

  if (!product.value.quantity || product.value.quantity <= 0) {
    error.value = 'Ingrese una cantidad válida';
    return;
  }

  try {
    await inventoryStore.addProduct({
      productName: product.value.productName,
      quantity: Number(product.value.quantity),
      unit: product.value.unit,
      minimumStock: Number(product.value.minimumStock) || 0
    });

    product.value = { productName: '', quantity: '', unit: 'kg', minimumStock: '' };
    success.value = true;
    emit('product-added');

    setTimeout(() => {
      success.value = false;
    }, 2000);
  } catch (err) {
    error.value = 'Error al agregar producto';
  }
};
</script>

<template>
  <div class="add-product-form">
    <div class="form-title">
      <span class="title-icon">➕</span>
      <h3>Agregar nuevo producto</h3>
    </div>

    <div v-if="success" class="alert-success">
      ✓ Producto agregado correctamente
    </div>

    <div v-if="error" class="alert-error">
      ⚠️ {{ error }}
    </div>

    <form @submit.prevent="submit">
      <div class="form-row">
        <div class="form-field">
          <label>Producto</label>
          <input
              v-model="product.productName"
              type="text"
              placeholder="Ej: Tomate, Lechuga, Maíz"
              autocomplete="off"
          />
        </div>

        <div class="form-field">
          <label>Cantidad</label>
          <input
              v-model.number="product.quantity"
              type="number"
              step="0.01"
              placeholder="0"
          />
        </div>

        <div class="form-field">
          <label>Unidad</label>
          <select v-model="product.unit">
            <option value="kg">Kilogramos (kg)</option>
            <option value="unidad">Unidades (und)</option>
            <option value="litro">Litros (L)</option>
          </select>
        </div>

        <div class="form-field">
          <label>Stock mínimo</label>
          <input
              v-model.number="product.minimumStock"
              type="number"
              placeholder="Opcional"
          />
        </div>

        <div class="form-field form-action">
          <button type="submit" :disabled="inventoryStore.loading">
            {{ inventoryStore.loading ? 'Agregando...' : 'Agregar producto' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.add-product-form {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 1.25rem;
}

.form-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.title-icon {
  font-size: 1.125rem;
}

.form-title h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.alert-success, .alert-error {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  margin-bottom: 1rem;
}

.alert-success {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.alert-error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

form {
  width: 100%;
}

.form-row {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  flex-wrap: wrap;
}

.form-field {
  flex: 1;
  min-width: 120px;
}

.form-field label {
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.form-field input,
.form-field select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  box-sizing: border-box;
}

.form-field input:focus,
.form-field select:focus {
  outline: none;
  border-color: #00BB31;
  box-shadow: 0 0 0 2px rgba(0, 187, 49, 0.1);
}

.form-action {
  flex: 0 0 auto;
}

.form-action button {
  background: #00BB31;
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}

.form-action button:hover {
  background: #009628;
}

.form-action button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .add-product-form {
    padding: 1rem;
  }

  .form-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .form-field {
    min-width: auto;
  }

  .form-action button {
    width: 100%;
  }
}
</style>