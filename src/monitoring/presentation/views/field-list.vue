<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue';
import { useMonitoringStore } from '../../application/monitoring.store.js';
import { onMounted, toRefs } from 'vue';

const { t } = useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useMonitoringStore();
const { fields, errors, fieldsLoaded } = toRefs(store);
const { fetchFields, deleteField } = store;

onMounted(() => {
  if (!fieldsLoaded.value) {
    fetchFields();
  }
});

function navigateToCreate() {
  router.push({ name: 'monitoring-field-new' });
}

function navigateToEdit(field) {
  router.push({ name: 'monitoring-field-edit', params: { id: field.id } });
}

function confirmDelete(field) {
  confirm.require({
    message: t('monitoring.confirm-delete-field'),
    header: t('monitoring.delete-field-title'),
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      deleteField(field);
    }
  });
}

const columns = [
  { field: 'id', header: t('monitoring.field-id'), sortable: true },
  { field: 'name', header: t('monitoring.name'), sortable: true },
  { field: 'size_m2', header: t('monitoring.size-m2'), sortable: true },
  { field: 'soil_type', header: t('monitoring.soil-type'), sortable: true },
  { field: 'location_lat_long', header: t('monitoring.location'), sortable: false }
];
</script>

<template>
  <div class="field-list-container">
    <!-- Header -->
    <div class="list-header">
      <h2 class="title">{{ t('monitoring.fields') }}</h2>
      <pv-button
        icon="pi pi-plus"
        :label="t('monitoring.new-field')"
        class="btn-primary"
        @click="navigateToCreate"
      />
    </div>

    <!-- Data Table -->
    <pv-data-table
      v-if="fieldsLoaded"
      :value="fields"
      :columns="columns"
      responsive-layout="scroll"
      paginator
      :rows="10"
      :rows-per-page-options="[5, 10, 20, 50]"
      current-page-report-template="Showing {first} to {last} of {totalRecords} fields"
      striped-rows
      show-grid-lines
      class="p-datatable-striped"
    >
      <pv-column
        v-for="col of columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :sortable="col.sortable"
        :style="`width: ${col.field === 'location_lat_long' ? '20%' : '18%'}`"
      />

      <!-- Actions Column -->
      <pv-column
        header="Actions"
        header-style="width: 15%"
        body-style="text-align: center"
        class="actions-column"
      >
        <template #body="{ data }">
          <pv-button
            icon="pi pi-pencil"
            class="btn-icon btn-edit"
            :title="t('monitoring.edit')"
            @click="navigateToEdit(data)"
          />
          <pv-button
            icon="pi pi-trash"
            class="btn-icon btn-delete"
            :title="t('monitoring.delete')"
            @click="confirmDelete(data)"
          />
        </template>
      </pv-column>
    </pv-data-table>

    <!-- Loading State -->
    <div v-else class="loading-state">
      <p>{{ t('monitoring.loading') }}</p>
    </div>

    <!-- Error Messages -->
    <div v-if="errors.length > 0" class="error-container">
      <div v-for="(error, index) in errors" :key="index" class="error-message">
        {{ error.message }}
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --color-primary: #1A2B4C;
  --color-success: #00BB31;
  --color-danger: #FF4757;
  --color-white: #FFFFFF;
  --color-border: #E0E0E0;
  --color-light: #F5F7FA;
}

.field-list-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  margin: 0;
  color: var(--color-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.btn-primary {
  background-color: var(--color-success);
  border: none;
}

.btn-primary:hover {
  background-color: #00a027;
}

.actions-column {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.btn-icon {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  background-color: var(--color-white);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit {
  color: #1976d2;
}

.btn-edit:hover {
  background-color: rgba(25, 118, 210, 0.1);
  border-color: #1976d2;
}

.btn-delete {
  color: var(--color-danger);
}

.btn-delete:hover {
  background-color: rgba(255, 71, 87, 0.1);
  border-color: var(--color-danger);
}

.loading-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-primary);
  opacity: 0.6;
}

.error-container {
  margin-top: 1rem;
}

.error-message {
  padding: 1rem;
  background-color: #ffe0e0;
  color: var(--color-danger);
  border-radius: 4px;
  border-left: 4px solid var(--color-danger);
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    gap: 1rem;
  }

  .title {
    font-size: 1.25rem;
  }
}
</style>

