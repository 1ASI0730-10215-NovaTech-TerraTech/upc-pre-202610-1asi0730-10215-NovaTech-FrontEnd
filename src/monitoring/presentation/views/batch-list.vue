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
.monitoring-dashboard {
  display: grid;
  grid-template-columns: 1.9fr 1fr;
  gap: 1.25rem;
  padding: 1rem 1.2rem;
  background: #182b42;
  color: #e5f3ff;
}

.title {
  margin: 0 0 0.7rem;
  color: #67db88;
  font-size: 1.9rem;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-bottom: 0.7rem;
}

.controls input {
  background: #23364f;
  border: 1px solid #376385;
  color: #e6f4ff;
  border-radius: 6px;
  padding: 0.5rem 0.65rem;
}

.controls input {
  flex: 1;
  min-width: 260px;
}

.btn {
  border: 1px solid #5bbf7f;
  background: #2d945b;
  color: #fff;
  border-radius: 6px;
  padding: 0.5rem 0.8rem;
  cursor: pointer;
}

.status-info,
.error-box {
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  margin-bottom: 0.7rem;
}

.status-info { background: #21364d; border: 1px solid #497292; }
.error-box { background: #482029; border: 1px solid #ff5b77; }

.lot-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.lot-card {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 0.75rem;
  align-items: center;
  background: #5cbf87;
  border: 1px solid #66cf92;
  border-radius: 10px;
  padding: 0.5rem;
  color: #102527;
  cursor: pointer;
}

.lot-card.critical { border-left: 6px solid #ff4966; }
.lot-card.selected { box-shadow: 0 0 0 2px #8bf5ab inset; }

.lot-image {
  width: 96px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
}

.lot-main h3 { margin: 0; }
.lot-main small { font-size: 0.72rem; opacity: 0.8; }

.lot-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.pill {
  font-size: 0.72rem;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 999px;
  padding: 0.15rem 0.55rem;
}

.metric-line { margin: 0.2rem 0 0; font-size: 0.9rem; }

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.system-card,
.satellite-card,
.details {
  background: #21364d;
  border: 1px solid #3f6d82;
  border-radius: 12px;
  padding: 0.9rem;
}

.system-card h2 { margin-top: 0; }

.network-status { color: #ff9fb2; }
.network-status.connected { color: #7df0a8; }

.totals {
  display: flex;
  justify-content: space-between;
  margin-top: 0.45rem;
}

.totals.alert { color: #ff7a91; }

.satellite-card p {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: #79dfa0;
  text-align: center;
}

.satellite-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
}

.details h3 {
  margin: 0 0 0.4rem;
  color: #9ef3ba;
}

.rec-meta {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}

.rec-type,
.rec-priority {
  font-size: 0.75rem;
  background: rgba(158, 243, 186, 0.15);
  color: #7df0a8;
  border: 1px solid #5bbf7f;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
}

@media (max-width: 980px) {
  .monitoring-dashboard {
    grid-template-columns: 1fr;
  }
}
</style>
