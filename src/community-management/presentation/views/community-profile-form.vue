<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useCommunityManagementStore } from '../../application/community-management.store.js';
import { useProfileManagementStore } from '../../../profile-management/application/profile-management.store.js';
import useIamStore from '../../../iam/application/iam.store.js';
/**
 * Component for creating or editing Community Profiles.
 * Uses Vue I18n for internationalization and Pinia for state management.
 */

const { t } = useI18n();
const toast = useToast();
const store = useCommunityManagementStore();
const route = useRoute();
const router = useRouter();


const profileStore = useProfileManagementStore();
const iamStore = useIamStore();

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
  profile_id: null,
  nickname: '',
  reputation_score: 50,
  public_bio: '',
  visibility_status: true
});

/**
 * Lifecycle hook: initializes form data based on route parameters.
 * Fetches existing profile data if in edit mode.
 */
onMounted(async () => {
  if (!profileStore.profilesLoaded) {
    await profileStore.fetchProfiles();
  }

  if (isEdit.value) {
    if (!store.profilesLoaded) {
      await store.fetchProfiles();
    }
    const selected = store.getProfileById(parseInt(route.params.id));
    if (selected) {
      profileData.value = { ...selected };
    }
  }else {

    const currentUserId = iamStore.currentUserId;
    const userGeneralProfile = profileStore.profiles.find(p => p.user_id === currentUserId);

    if (userGeneralProfile) {
      profileData.value.profile_id = userGeneralProfile.id;
    } else {

      toast.add({
        severity: 'warn',
        summary: t('community.profiles.warn-title'),
        detail: t('community.profiles.profile-required'),
        life: 4000
      });

    }
  }
});

/**
 * Handles the save action for both creation and update operations.
 * Navigates back to the profile list upon success.
 * @returns {Promise<void>}
 */
const handleSave = async () => {

  if (!profileData.value.profile_id) {
    toast.add({
      severity: 'error',
      summary: t('notifications.error'),
      detail: t('community.profiles.missing-profile-id'),
      life: 3000
    });
    return;
  }

  let isSuccess = false;

  if (isEdit.value) {
    isSuccess = await store.updateProfile(profileData.value);
  } else {
    isSuccess = await store.addProfile(profileData.value);
  }

  if (isSuccess) {
    toast.add({
      severity: 'success',
      summary: isEdit.value ? t('community.profiles.updated') : t('community.profiles.created'),
      detail: t('community.profiles.success-detail'),
      life: 2000
    });
    setTimeout(() => router.push({ name: 'community-profile-list' }), 2000);
  } else {
    toast.add({
      severity: 'error',
      summary: t('notifications.error'),
      detail: t('community.profiles.save-error'),
      life: 3000
    });
  }
};

const handleCancel = () => {
  router.push({ name: 'community-profile-list' });
};
</script>

<template>
  <div class="profile-settings-container">
    <h2>{{ isEdit ? t('community.profiles.edit-title') : t('community.profiles.new-title') }}</h2>
    <Toast />

    <div class="form-card">
      <div class="p-fluid">

        <div class="field-group">
          <label for="nickname" class="field-label">{{ t('community.profiles.nickname') }}</label>
          <InputText id="nickname" v-model="profileData.nickname" class="full-width" />
        </div>

        <div class="field-group">
          <label for="reputation" class="field-label">{{ t('community.profiles.reputationScore') }}</label>
          <InputText id="reputation" v-model.number="profileData.reputation_score" type="number" class="full-width" readonly />
        </div>

        <div class="field-group">
          <label for="bio" class="field-label">{{ t('community.profiles.publicBio') }}</label>
          <Textarea id="bio" v-model="profileData.public_bio" rows="3" class="full-width" />
        </div>

        <div class="field-group flex align-items-center gap-2 mt-3">
          <Checkbox id="visibility" v-model="profileData.visibility_status" :binary="true" />
          <label for="visibility" class="field-label mb-0">{{ t('community.profiles.visibility') }}</label>
        </div>

        <div class="button-container">
          <Button
              :label="isEdit ? t('community.profiles.update-button') : t('community.profiles.create-button')"
              :icon="isEdit ? 'pi pi-save' : 'pi pi-plus'"
              @click="handleSave"
              class="save-button"
          />
          <Button
              :label="t('community.profiles.cancel-button')"
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