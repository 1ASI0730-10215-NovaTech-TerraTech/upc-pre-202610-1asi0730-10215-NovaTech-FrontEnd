<script setup>
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useMonitoringStore } from '../../application/monitoring.store.js';
import { computed, onMounted, ref } from 'vue';
import { Field } from '../../domain/model/field.entity.js';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useMonitoringStore();
const { errors, addField, updateField } = store;

const form = ref({
  name: '',
  size_m2: '',
  soil_type: '',
  location_lat_long: ''
});

const isEdit = computed(() => !!route.params.id);
const formTitle = computed(() => isEdit.value ? t('monitoring.edit-field') : t('monitoring.new-field'));

const soilTypeOptions = [
  { label: t('monitoring.soil-type-loamy'), value: 'loamy' },
  { label: t('monitoring.soil-type-sandy'), value: 'sandy' },
  { label: t('monitoring.soil-type-clay'), value: 'clay' },
  { label: t('monitoring.soil-type-silty'), value: 'silty' }
];

onMounted(() => {
  if (isEdit.value) {
    const field = store.getFieldById(route.params.id);
    if (field) {
      form.value = { ...field };
    } else {
      navigateBack();
    }
  }
});

function navigateBack() {
  router.push({ name: 'monitoring-fields' });
}

function submit() {
  if (!form.value.name || !form.value.size_m2 || !form.value.soil_type) {
    alert(t('monitoring.form-validation-error'));
    return;
  }

  const field = new Field({ ...form.value });

  if (isEdit.value) {
    field.id = parseInt(route.params.id);
    updateField(field);
  } else {
    addField(field);
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
  <div class="field-form-container">
    <!-- Header -->
    <div class="form-header">
      <h2 class="title">{{ formTitle }}</h2>
    </div>

    <!-- Form -->
    <form @submit.prevent="submit" class="form">
      <!-- Name Field -->
      <div class="form-group">
        <label for="name" class="form-label">
          {{ t('monitoring.name') }} <span class="required">*</span>
        </label>
        <pv-input-text
          id="name"
          v-model="form.name"
          :placeholder="t('monitoring.field-name-placeholder')"
          class="form-input"
          type="text"
        />
      </div>

      <!-- Size Field -->
      <div class="form-group">
        <label for="size_m2" class="form-label">
          {{ t('monitoring.size-m2') }} <span class="required">*</span>
        </label>
        <pv-input-number
          id="size_m2"
          v-model="form.size_m2"
          :placeholder="t('monitoring.size-placeholder')"
          class="form-input"
          :min="0"
          :max="999999.99"
        />
      </div>

      <!-- Soil Type Field -->
      <div class="form-group">
        <label for="soil_type" class="form-label">
          {{ t('monitoring.soil-type') }} <span class="required">*</span>
        </label>
        <pv-select
          id="soil_type"
          v-model="form.soil_type"
          :options="soilTypeOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('monitoring.select-soil-type')"
          class="form-input"
        />
      </div>

      <!-- Location Field -->
      <div class="form-group">
        <label for="location_lat_long" class="form-label">
          {{ t('monitoring.location') }}
        </label>
        <pv-input-text
          id="location_lat_long"
          v-model="form.location_lat_long"
          :placeholder="t('monitoring.location-placeholder')"
          class="form-input"
          type="text"
        />
        <small class="form-hint">{{ t('monitoring.location-format-hint') }}</small>
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

.field-form-container {
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

.form-hint {
  color: #666;
  font-size: 0.85rem;
  margin-top: -0.25rem;
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
  .field-form-container {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>

