<script>
import { useI18n } from 'vue-i18n';
import { MonitoringStore } from '../../application/monitoring.store.js';
import BatchForm from './batch-form.vue';
import { CROP_TYPE_OPTIONS, HUMIDITY_GUIDES } from '../../infrastructure/batch.assembler.js';

export default {
  components: { BatchForm },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    const cropTypeOptions = [...CROP_TYPE_OPTIONS];
    const humidityGuides = HUMIDITY_GUIDES;

    return {
      service: new MonitoringStore(),
      lots: [],
      readings: [],
      recommendations: [],
      isLoading: false,
      connectionError: '',
      searchQuery: '',
      showForm: false,
      selectedLot: null,
      testHumidity: 50,
      cropTypeOptions,
      humidityGuides,
      defaultImg: 'https://picsum.photos/seed/terratech-default/640/360',
      newLot: { name: '', cropType: cropTypeOptions[0], npkStatus: 'Optimo' }
    };
  },
  computed: {
    filteredLots() {
      return this.lots.filter((lot) => lot.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
    selectedHumidityGuide() {
      return this.humidityGuides[this.newLot.cropType] || null;
    },
    totalLots() {
      return this.lots.length;
    },
    criticalAlerts() {
      return this.lots.filter((lot) => {
        const guide = this.humidityGuides[lot.cropType];
        const humidity = this.getHumidity(lot.id);
        return guide ? humidity < guide.min : humidity < 30;
      }).length;
    },
    systemConnected() {
      return !this.connectionError;
    },
    satelliteImage() {
      const current = this.selectedLot || this.filteredLots[0];
      return current?.image || this.defaultImg;
    }
  },
  methods: {
    getHumidity(lotId) {
      const reading = this.readings.find((r) => String(r.sensorId) === String(lotId));
      return reading ? Number(reading.value) : 0;
    },
    getRecommendation(lotId) {
      const rec = this.recommendations.find((r) => String(r.lotId) === String(lotId));
      if (!rec) return this.t('recommendations.stable-default');

      // Mapeo de traducciones para mensajes del servidor
      const messageKey = this.getRecommendationMessageKey(rec.message);
      if (messageKey) {
        return this.t(`recommendation-messages.${messageKey}`);
      }
      return rec.message; // Fallback al mensaje original si no hay mapeo
    },
    getRecommendationMessageKey(message) {
      if (message.includes('CRÍTICO') || message.includes('CRITICAL')) {
        return 'critical-low-humidity';
      }
      if (message.includes('Aumentar riego') || message.includes('Increase irrigation')) {
        return message.includes('preventivo') ? 'increase-irrigation-preventive' : 'increase-irrigation';
      }
      return null;
    },
    getRecommendationType(type) {
      return this.t(`recommendations.type-${type}`) || type;
    },
    getRecommendationPriority(priority) {
      return this.t(`recommendations.priority-${priority}`) || priority;
    },
    getSensorLabel(index) {
      return `SENSOR NPK-${String(index + 1).padStart(2, '0')}`;
    },
    getHumidityClass(lot) {
      const guide = this.humidityGuides[lot.cropType];
      const humidity = this.getHumidity(lot.id);
      if (!guide) return 'ok';
      return humidity < guide.min ? 'critical' : 'ok';
    },
    async addLot() {
      if (!this.newLot.name || !this.newLot.cropType) return alert(this.t('monitoring.validation-complete-data'));
      if (Number.isNaN(Number(this.testHumidity)) || this.testHumidity < 0 || this.testHumidity > 100) {
        return alert(this.t('monitoring.validation-humidity-range'));
      }

      try {
        this.connectionError = '';
        await this.service.registerLotWithHumidity(this.newLot, this.testHumidity);
        await this.loadAll();
        this.showForm = false;
        this.newLot = { name: '', cropType: this.cropTypeOptions[0], npkStatus: 'Optimo' };
        this.testHumidity = 50;
      } catch (err) {
        console.error(err);
        this.connectionError = this.t('monitoring.error-connection');
        alert(this.t('monitoring.error-save'));
      }
    },
    openForm() {
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
      this.newLot = { name: '', cropType: this.cropTypeOptions[0], npkStatus: 'Optimo' };
      this.testHumidity = 50;
    },
    updateLotName(value) {
      this.newLot.name = value;
    },
    updateCropType(value) {
      this.newLot.cropType = value;
    },
    updateHumidity(value) {
      this.testHumidity = value;
    },
    async loadAll() {
      this.isLoading = true;
      this.connectionError = '';
      try {
        const data = await this.service.getAllData();
        this.lots = data.lots;
        this.readings = data.readings;
        this.recommendations = data.recommendations;
        this.selectedLot = this.lots[0] || null;
      } catch (err) {
        console.error(err);
        this.lots = [];
        this.readings = [];
        this.recommendations = [];
        this.connectionError = this.t('monitoring.error-connection');
      } finally {
        this.isLoading = false;
      }
    },
    selectLot(lot) {
      this.selectedLot = lot;
    }
  },
  mounted() {
    this.loadAll();
  }
};
</script>

<template>
  <section class="monitoring-dashboard">
    <div class="left-panel">
      <h1 class="title">{{ t('monitoring.title') }}</h1>

      <div class="controls">
        <input v-model="searchQuery" type="text" :placeholder="t('monitoring.search-placeholder')" />
        <button v-if="!showForm" type="button" class="btn" @click="openForm">
          {{ t('monitoring.new-lot-btn') }}
        </button>
      </div>

      <batch-form
        v-if="showForm"
        :lot-name="newLot.name"
        :crop-type="newLot.cropType"
        :humidity="testHumidity"
        :crop-type-options="cropTypeOptions"
        @update:lot-name="updateLotName"
        @update:crop-type="updateCropType"
        @update:humidity="updateHumidity"
        @submit="addLot"
        @cancel="closeForm"
      />

      <div v-if="isLoading" class="status-info">{{ t('monitoring.loading') }}</div>
      <div v-if="connectionError" class="error-box">{{ connectionError }}</div>
      <div v-if="!isLoading && !connectionError && filteredLots.length === 0" class="status-info">{{ t('monitoring.no-lots') }}</div>

      <div class="lot-list">
        <article
          v-for="(lot, index) in filteredLots"
          :key="lot.id"
          class="lot-card"
          :class="{ selected: selectedLot && selectedLot.id === lot.id, critical: getHumidityClass(lot) === 'critical' }"
          @click="selectLot(lot)"
        >
          <img :src="lot.image || defaultImg" :alt="lot.name" class="lot-image" />
          <div class="lot-main">
            <div class="lot-row">
              <h3>{{ lot.name }}</h3>
              <span class="pill">{{ lot.cropType }}</span>
            </div>
            <small>{{ getSensorLabel(index) }}</small>
            <p class="metric-line">💧 HUMEDAD: {{ getHumidity(lot.id) }}%</p>
            <p class="metric-line">🌱 NPK: {{ lot.npkStatus }}</p>
          </div>
        </article>
      </div>
    </div>

    <aside class="right-panel">
      <div class="system-card">
        <h2>{{ t('monitoring.system-status') }}</h2>
        <p :class="['network-status', { connected: systemConnected }]">
          ● {{ systemConnected ? t('monitoring.network-connected') : t('monitoring.network-disconnected') }}
        </p>
        <div class="totals">
          <span>{{ t('monitoring.total-lots') }}</span>
          <strong>{{ totalLots }}</strong>
        </div>
        <div class="totals alert">
          <span>{{ t('monitoring.critical-alerts') }}</span>
          <strong>{{ criticalAlerts }}</strong>
        </div>
      </div>

      <div class="satellite-card">
        <p>{{ t('monitoring.satellite-view') }}</p>
        <img :src="satelliteImage" alt="Vista satelital" />
      </div>

      <div v-if="selectedLot" class="details">
        <h3>{{ t('monitoring.detail-prefix') }} {{ selectedLot.name }}</h3>
        <div v-if="recommendations.find(r => String(r.lotId) === String(selectedLot.id))" class="rec-meta">
          <span class="rec-type">{{ getRecommendationType(recommendations.find(r => String(r.lotId) === String(selectedLot.id))?.type) }}</span>
          <span class="rec-priority">{{ getRecommendationPriority(recommendations.find(r => String(r.lotId) === String(selectedLot.id))?.priority) }}</span>
        </div>
        <p>{{ getRecommendation(selectedLot.id) }}</p>
      </div>
    </aside>
  </section>
</template>

<style scoped>
:root {
  --primary: #4A6FA5;
  --success: #5BA89C;
  --white: #FFFFFF;
  --black: #000000;
  --border: #E0E0E0;
}

.monitoring-dashboard {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  background: var(--white);
  color: var(--black);
}

.title {
  margin: 0 0 1rem;
  color: var(--primary);
  font-size: 1.8rem;
  font-weight: 600;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.controls input {
  background: var(--white);
  border: 1px solid var(--border);
  color: var(--black);
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.95rem;
  flex: 1;
  min-width: 200px;
}

.controls input:focus {
  outline: none;
  border-color: var(--primary);
}

.btn {
  background: var(--success);
  border: none;
  color: var(--white);
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn:hover {
  background: #4A9683;
  transform: translateY(-1px);
}

.status-info,
.error-box {
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.status-info {
  background: #E3F2FD;
  border: 1px solid var(--primary);
  color: var(--primary);
}

.error-box {
  background: #FFEBEE;
  border: 1px solid #DC3545;
  color: #DC3545;
}

.lot-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.lot-card {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 1rem;
  align-items: center;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  color: var(--black);
  cursor: pointer;
  transition: all 0.2s;
}

.lot-card:hover {
  border-color: var(--success);
  box-shadow: 0 2px 8px rgba(91, 168, 156, 0.15);
}

.lot-card.critical {
  border-left: 4px solid #DC3545;
  padding-left: calc(1rem - 3px);
}

.lot-card.selected {
  border-color: var(--success);
  background: #F0FFF4;
}

.lot-image {
  width: 100%;
  height: 72px;
  object-fit: cover;
  border-radius: 6px;
}

.lot-main h3 {
  margin: 0 0 0.25rem;
  color: var(--primary);
  font-weight: 600;
}

.lot-main small {
  font-size: 0.8rem;
  color: #999;
}

.lot-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.pill {
  font-size: 0.8rem;
  background: #F9F9F9;
  border-radius: 12px;
  padding: 0.25rem 0.75rem;
  color: var(--primary);
  font-weight: 500;
}

.metric-line {
  margin: 0.3rem 0 0;
  font-size: 0.9rem;
  color: #666;
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.system-card,
.satellite-card,
.details {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
}

.system-card h2 {
  margin: 0 0 1rem;
  color: var(--primary);
  font-size: 1.1rem;
}

.network-status {
  color: #DC3545;
  font-weight: 600;
}

.network-status.connected {
  color: var(--success);
}

.totals {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.totals span:first-child {
  color: #666;
}

.totals strong {
  color: var(--primary);
  font-size: 1.2rem;
}

.totals.alert strong {
  color: #DC3545;
}

.satellite-card p {
  margin: 0 0 1rem;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  color: var(--primary);
  text-align: center;
  font-weight: 600;
}

.satellite-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--border);
}

.details h3 {
  margin: 0 0 0.75rem;
  color: var(--primary);
  font-weight: 600;
}

.details p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.rec-meta {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.rec-type,
.rec-priority {
  font-size: 0.8rem;
  background: #E8F5E9;
  color: var(--success);
  border: 1px solid var(--success);
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  font-weight: 500;
}

@media (max-width: 1024px) {
  .monitoring-dashboard {
    grid-template-columns: 1fr;
  }

  .right-panel {
    grid-column: 1;
    grid-row: 2;
  }
}

@media (max-width: 768px) {
  .monitoring-dashboard {
    gap: 1rem;
  }

  .title {
    font-size: 1.4rem;
  }

  .controls {
    flex-direction: column;
  }

  .controls input,
  .btn {
    width: 100%;
  }

  .lot-card {
    grid-template-columns: 80px 1fr;
    gap: 0.75rem;
  }

  .system-card,
  .satellite-card,
  .details {
    padding: 1rem;
  }
}
</style>
