<script setup>
import { onMounted } from 'vue';
import { useInventoryStore } from '../../application/inventory.store.js';

const emit = defineEmits(['discount']);
const inventoryStore = useInventoryStore();

const fetchInventory = async () => {
  await inventoryStore.fetchInventory();
};

defineExpose({ fetchInventory });

onMounted(() => {
  fetchInventory();
});
</script>

<template>
  <div class="inventory-list">
    <div class="list-header">
      <span class="header-icon">📦</span>
      <h3>Productos en inventario</h3>
      <span class="badge">{{ inventoryStore.inventory.length }}</span>
    </div>

    <div v-if="inventoryStore.loading" class="loading">
      Cargando...
    </div>

    <div v-else-if="inventoryStore.inventory.length === 0" class="empty">
      No hay productos registrados
    </div>

    <div v-else class="table-wrapper">
      <table class="inventory-table">
        <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Unidad</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="item in inventoryStore.inventory"
            :key="item.id"
            :class="{ 'low-stock': item.minimumStock && item.quantity <= item.minimumStock }"
        >
          <td class="product">
            <span v-if="item.productName && item.productName.trim() !== ''">
              {{ item.productName }}
            </span>
            <span v-else class="empty-product">
              ---
            </span>
          </td>
          <td class="quantity">{{ item.quantity }}</td>
          <td class="unit">{{ item.unit }}</td>
          <td class="actions">
            <button class="btn-discount" @click="emit('discount', item)">
              Descontar
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.inventory-list {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.list-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.header-icon {
  font-size: 1rem;
}

.list-header h3 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.badge {
  background: #e2e8f0;
  color: #475569;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 20px;
  margin-left: auto;
}

.loading, .empty {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 0.875rem;
}

.table-wrapper {
  max-height: 400px;
  overflow-y: auto;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
}

.inventory-table thead {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.inventory-table th {
  text-align: left;
  padding: 0.75rem 1.25rem;
  background: white;
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.inventory-table td {
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.875rem;
}

.inventory-table tr:last-child td {
  border-bottom: none;
}

.inventory-table tr.low-stock {
  background: #fef2f2;
}

.inventory-table tr.low-stock:hover {
  background: #fee2e2;
}

.inventory-table tr:hover {
  background: #f8fafc;
}

.product {
  font-weight: 500;
  color: #0f172a;
}

.empty-product {
  color: #cbd5e1;
  font-style: italic;
}

.quantity {
  font-weight: 600;
  color: #0f172a;
}

.unit {
  color: #64748b;
}

.actions {
  text-align: right;
}

.btn-discount {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #ef4444;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-discount:hover {
  background: #fef2f2;
  border-color: #fecaca;
}
</style>