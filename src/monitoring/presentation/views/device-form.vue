<script setup>
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useMonitoringStore } from '../../application/monitoring.store.js';
import { computed, onMounted, ref } from 'vue';
import { Device } from '../../domain/model/device.entity.js';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useMonitoringStore();
const { errors, addDevice, updateDevice } = store;

const form = ref({
  mac_address: '',
  status: '',
  last_sync: ''
});

const isEdit = computed(() => !!route.params.id);
const formTitle = computed(() => isEdit.value ? t('monitoring.edit-device') : t('monitoring.new-device'));

const statusOptions = [
  { label: t('monitoring.status-active'), value: 'ONLINE' },
  { label: t('monitoring.status-inactive'), value: 'OFFLINE' },
  { label: t('monitoring.status-error'), value: 'LOW_BATERRY' }
];

onMounted(() => {
  if (isEdit.value) {
    const device = store.getDeviceById(route.params.id);
    if (device) {
      form.value = { ...device };
    } else {
      navigateBack();
    }
  }
});

function navigateBack() {
  router.push({ name: 'monitoring-devices' });
}

function submit() {
  if (!form.value.mac_address || !form.value.status) {
    alert(t('monitoring.form-validation-error'));
    return;
  }

  const device = new Device({ ...form.value });

  if (isEdit.value) {
    device.id = parseInt(route.params.id);
    updateDevice(device);
  } else {
    addDevice(device);
  }

  setTimeout(() => {
    navigateBack();
  }, 500);
}

function cancel() {
  navigateBack();
}
</script>

<template>
  <div class="device-form-container">
    <!-- Header -->
    <div class="form-header">
      <h2 class="title">{{ formTitle }}</h2>
    </div>

    <!-- Form -->
    <form @submit.prevent="submit" class="form">
      <!-- MAC Address Field -->
      <div class="form-group">
        <label for="mac_address" class="form-label">
          {{ t('monitoring.mac-address') }} <span class="required">*</span>
        </label>
        <pv-input-text
          id="mac_address"
          v-model="form.mac_address"
          :placeholder="t('monitoring.mac-address-placeholder')"
          class="form-input"
          type="text"
        />
      </div>

      <!-- Status Field -->
      <div class="form-group">
        <label for="status" class="form-label">
          {{ t('monitoring.status') }} <span class="required">*</span>
        </label>
        <pv-select
          id="status"
          v-model="form.status"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('monitoring.select-status')"
          class="form-input"
        />
      </div>

      <!-- Last Sync Field -->
      <div class="form-group">
        <label for="last_sync" class="form-label">
          {{ t('monitoring.last-sync') }}
        </label>
        <pv-input-text
          id="last_sync"
          v-model="form.last_sync"
          :placeholder="t('monitoring.last-sync-placeholder')"
          class="form-input"
          type="text"
        />
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <pv-button
          :label="isEdit ? t('monitoring.update') : t('monitoring.create')"
          icon="pi pi-check"
          type="submit"
          class="btn-primary"
        />
        <pv-button
          :label="t('monitoring.cancel')"
          icon="pi pi-times"
          severity="secondary"
          @click="cancel"
        />
      </div>
    </form>

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

.device-form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--color-white);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.form-header {
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
}

.title {
  margin: 0;
  color: var(--color-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: var(--color-primary);
  font-weight: 500;
  font-size: 0.95rem;
}

.required {
  color: var(--color-danger);
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-success);
  box-shadow: 0 0 0 3px rgba(0, 187, 49, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary {
  background-color: var(--color-success);
  border: none;
  flex: 1;
}

.btn-primary:hover {
  background-color: #00a027;
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
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .device-form-container {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>

