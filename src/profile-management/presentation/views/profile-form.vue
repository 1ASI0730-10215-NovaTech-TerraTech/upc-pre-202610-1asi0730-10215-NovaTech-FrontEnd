<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useProfileManagementStore } from '../../application/profile-management.store.js';

/**
 * Component for creating or editing Agricultural Profiles.
 * Uses Vue I18n for internationalization and Pinia for state management.
 */

const { t } = useI18n();
const toast = useToast();
const store = useProfileManagementStore();
const route = useRoute();
const router = useRouter();

/**
 * Computed property to determine if the component is in edit mode.
 * @type {import('vue').ComputedRef<boolean>}
 */
const isEdit = computed(() => !!route.params.id);

/**
 * Reactive object representing the profile data in the form.
 * @type {import('vue').Ref<Object>}
 */
const profileData = ref({
  id: null,
  user_id: 'usr_001',
  fundo_name: '',
  contact_phone: '',
  moisture_threshold: 0,
  temp_threshold: 0
});

/**
 * Lifecycle hook: initializes form data based on route parameters.
 * Fetches existing profile data if in edit mode.
 */
onMounted(async () => {
  if (isEdit.value) {
    await store.fetchProfiles();
    const selected = store.getProfileById(route.params.id);
    if (selected) {
      profileData.value = { ...selected };
    }
  }
});

/**
 * Handles the save action for both creation and update operations.
 * Navigates back to the profile list upon success.
 * @returns {Promise<void>}
 */
const handleSave = async () => {
  let isSuccess = false;

  if (isEdit.value) {
    // Llama a la función de actualización si hay un ID en la ruta
    isSuccess = await store.updateProfile(profileData.value);
  } else {
    // Llama a la función de creación para perfiles nuevos
    isSuccess = await store.addProfile(profileData.value);
  }

  if (isSuccess) {
    toast.add({
      severity: 'success',
      summary: isEdit.value ? 'Actualizado' : 'Creado',
      detail: 'Operación exitosa',
      life: 2000
    });
    // Redirige a la lista después de un breve delay
    setTimeout(() => router.push({ name: 'profile-list' }), 2000);
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo guardar la información',
      life: 3000
    });
  }
};

</script>


<template>
  <div class="profile-settings-container">
    <h2>{{ isEdit ? t('profiles.edit-title') : t('profiles.new-title') }}</h2>
    <Toast />

    <div class="form-card">
      <div class="p-fluid">
        <!-- Fundo Name -->
        <div class="field-group">
          <label for="fundoName" class="field-label">{{ t('profiles.fundoName') }}</label>
          <InputText id="fundoName" v-model="profileData.fundo_name" class="full-width" />
        </div>

        <!-- Contact Phone -->
        <div class="field-group">
          <label for="contactPhone" class="field-label">{{ t('profiles.contactPhone') }}</label>
          <InputText id="contactPhone" v-model="profileData.contact_phone" class="full-width" />
        </div>

        <!-- Moisture Threshold -->
        <div class="field-group">
          <label for="moisture" class="field-label">{{ t('profiles.moistureThreshold') }}</label>
          <InputText id="moisture" v-model.number="profileData.moisture_threshold" type="number" step="0.1" class="full-width" />
        </div>

        <!-- Temp Threshold -->
        <div class="field-group">
          <label for="temp" class="field-label">{{ t('profiles.tempThreshold') }}</label>
          <InputText id="temp" v-model.number="profileData.temp_threshold" type="number" step="0.1" class="full-width" />
        </div>

        <!-- Action Button -->
        <div class="button-container">
          <Button
              :label="isEdit ? t('profiles.update-button') : t('profiles.create-button')"
              :icon="isEdit ? 'pi pi-save' : 'pi pi-plus'"
              @click="handleSave"
              class="save-button"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-settings-container {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.form-card {
  width: 100%;
  max-width: 450px;
  background: transparent;
  margin-top: 1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  width: 100%;
}

.field-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #334155;
}

.full-width {
  width: 100%;
}

.button-container {
  margin-top: 2rem;
}

.save-button {
  width: auto;
  padding: 0.75rem 1.5rem;
  background-color: #4fd1c5;
  border: none;
}

.save-button:hover {
  background-color: #38b2ac;
}
</style>

