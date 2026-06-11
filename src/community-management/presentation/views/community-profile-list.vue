<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useCommunityManagementStore } from "../../application/community-management.store.js";
import { onMounted, toRefs, ref, computed } from "vue";
import InputText from 'primevue/inputtext';

const { t } = useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useCommunityManagementStore();

const { profiles, profilesLoaded } = toRefs(store);
const { fetchProfiles, deleteProfile } = store;

const searchQuery = ref('');

/**
 * Computed property that filters profiles based on the search query.
 * Represents the "Buscar usuario" command.
 */
const filteredProfiles = computed(() => {
  if (!searchQuery.value) return profiles.value;
  return profiles.value.filter(p =>
      p.nickname.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(() => {
  if (!store.profilesLoaded) {
    fetchProfiles();
  }
});

const navigateToNew = () => router.push({ name: 'community-profile-new' });
const navigateToEdit = (id) => router.push({ name: 'community-profile-edit', params: { id } });
const navigateToMural = (id) => router.push({ name: 'community-profile-mural', params: { id } });

const confirmDelete = (profile) => {
  confirm.require({
    message: t('community.profiles.confirm-delete', { name: profile.nickname }),
    header: t('community.profiles.delete-header'),
    icon: 'pi pi-exclamation-triangle',
    accept: () => store.deleteProfile(profile),
  });
};
</script>

<template>
  <div class="list-container">
    <h1>{{ t('community.profiles.title') }}</h1>

    <div class="toolbar">
      <pv-button :label="t('community.profiles.new')" class="add-button" icon="pi pi-plus" @click="navigateToNew" />

      <span class="p-input-icon-left search-bar">
        <i class="pi pi-search" />
        <InputText v-model="searchQuery" :placeholder="t('community.profiles.search')" />
      </span>
    </div>

    <div v-if="searchQuery && filteredProfiles.length === 0" class="not-found-message">
      <i class="pi pi-info-circle"></i> No se encontraron usuarios con ese nickname.
    </div>

    <pv-data-table v-else :loading="!profilesLoaded" :rows="5" :value="filteredProfiles" paginator class="profiles-table">
      <pv-column :header="t('community.profiles.nickname')" field="nickname" sortable/>
      <pv-column :header="t('community.profiles.reputationScore')" field="reputation_score" sortable/>

      <pv-column :header="t('community.profiles.actions')">
        <template #body="slotProps">
          <pv-button icon="pi pi-user" rounded severity="info" text @click="navigateToMural(slotProps.data.id)" v-tooltip="'Ver Mural'"/>
          <pv-button icon="pi pi-pencil" rounded text @click="navigateToEdit(slotProps.data.id)"/>
          <pv-button icon="pi pi-trash" rounded severity="danger" text @click="confirmDelete(slotProps.data)"/>
        </template>
      </pv-column>
    </pv-data-table>
  </div>
</template>

<style scoped>
.list-container {padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.h1 { font-size: 1.5rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.add-button { background-color: #4fd1c5; border: none; }
.search-bar { width: 300px; }
.search-bar input { width: 100%; }
.not-found-message { padding: 1rem; background-color: #fff3cd; color: #856404; border-radius: 4px; text-align: center; }
.profiles-table { min-width: 100%; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }
</style>