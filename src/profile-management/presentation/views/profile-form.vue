<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useProfileManagementStore } from '../../application/profile-management.store.js';
import useIamStore from "../../../iam/application/iam.store.js";

import { ProfileManagementApi } from '../../infrastructure/profile-management-api.js';
const profileApi = new ProfileManagementApi();

const { t } = useI18n();
const toast = useToast();
const store = useProfileManagementStore();
const iamStore = useIamStore();
const route = useRoute();
const router = useRouter();

/**
 * Computed property to determine if the component is in edit mode
 */
const isEdit = computed(() => !!route.params.id);

/**
 * Reactive state object representing the profile fields bound to the form inputs.
 */
const profileData = ref({
  id: null,
  user_id: 0,
  fundo_name: '',
  contact_phone: '',
  moisture_threshold: 0,
  temp_threshold: 0
});

/**
 * If in edit mode, fetches and loads the existing profile parameters.
 * If in creation mode, assigns the current user identity context securely.
 */
onMounted(async () => {
  if (isEdit.value) {
    await store.fetchProfiles();
    const selected = store.getProfileById(Number(route.params.id));
    if (selected) {
      profileData.value = { ...selected };
    }
  } else {
    profileData.value.user_id = Number(iamStore.currentUserId);
  }
});

/**
 * Handles the saving orchestration for the form.
 */
const handleSave = async () => {
  let isSuccess = false;

  if (isEdit.value) {
    isSuccess = await store.updateProfile(profileData.value);
  } else {
    const cleanPayloadForDotNet = {
      userId: Number(profileData.value.user_id),
      fundoName: profileData.value.fundo_name,
      contactPhone: profileData.value.contact_phone,
      moistureThreshold: Number(profileData.value.moisture_threshold),
      tempThreshold: Number(profileData.value.temp_threshold)
    };

    try {
      const response = await profileApi.createProfile(cleanPayloadForDotNet);

      if (response.status === 201 || response.status === 200) {
        isSuccess = true;
        await store.fetchProfiles();
      }
    } catch (error) {
      console.error("Error to created a new profile:", error);
      isSuccess = false;
    }
  }

  if (isSuccess) {
    toast.add({
      severity: 'success',
      summary: isEdit.value ? t('profiles.update-button') : t('profiles.create-button'),
      detail: t('profiles.success-detail'),
      life: 2000
    });
    setTimeout(() => router.push({ name: 'profile-list' }), 2000);
  } else {
    toast.add({
      severity: 'error',
      summary: t('profiles.error-header'),
      detail: t('profiles.error-detail'),
      life: 3000
    });
  }
};

const handleCancel = () => {
  router.push({ name: 'profile-list' });
};
</script>

<template>
  <div class="profile-settings-container">
    <h2>{{ isEdit ? t('profiles.edit-title') : t('profiles.new-title') }}</h2>
    <Toast />

    <div class="form-card">
      <div class="p-fluid">

        <div class="field-group">
          <label for="fundoName" class="field-label">{{ t('profiles.fundoName') }}</label>
          <InputText id="fundoName" v-model="profileData.fundo_name" class="full-width" />
        </div>


        <div class="field-group">
          <label for="contactPhone" class="field-label">{{ t('profiles.contactPhone') }}</label>
          <InputText id="contactPhone" v-model="profileData.contact_phone" class="full-width" />
        </div>


        <div class="field-group">
          <label for="moisture" class="field-label">{{ t('profiles.moistureThreshold') }}</label>
          <InputText id="moisture" v-model.number="profileData.moisture_threshold" type="number" step="0.1" class="full-width" />
        </div>


        <div class="field-group">
          <label for="temp" class="field-label">{{ t('profiles.tempThreshold') }}</label>
          <InputText id="temp" v-model.number="profileData.temp_threshold" type="number" step="0.1" class="full-width" />
        </div>


        <div class="button-container">
          <Button
              :label="isEdit ? t('profiles.update-button') : t('profiles.create-button')"
              :icon="isEdit ? 'pi pi-save' : 'pi pi-plus'"
              @click="handleSave"
              class="save-button"
          />
          <Button
              :label="t('profiles.cancel-button')"
              icon="pi pi-times"
              @click="handleCancel"
              class="cancel-button"
              severity="danger"
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
  display: flex;
  gap: 1rem;
  align-items: center;
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

.cancel-button {
  width: auto;
  padding: 0.75rem 1.5rem;
}
</style>