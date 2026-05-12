<script>
import { useI18n } from 'vue-i18n';
import { MonitoringStore } from '../../../monitoring/application/monitoring.store.js';
import { HUMIDITY_GUIDES } from '../../../monitoring/infrastructure/batch.assembler.js';

export default {
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      service: new MonitoringStore(),
      lots: [],
      readings: [],
      isLoading: false,
      connectionError: '',
      humidityGuides: HUMIDITY_GUIDES,
      defaultImg: 'https://picsum.photos/seed/terratech-default/640/360'
    };
  },
  computed: {
    totalLots() {
      return this.lots.length;
    },
    criticalAlerts() {
      return this.lots.filter((lot) => {
        const guide = this.humidityGuides[lot.cropType];
        const humidity = this.getHumidity(lot.id);
        return guide ? humidity < guide.min : humidity < 30;
      }).length;
    }
  },
  methods: {
    getHumidity(lotId) {
      const reading = this.readings.find((r) => String(r.sensorId) === String(lotId));
      return reading ? Number(reading.value) : 0;
    },
    getHumidityClass(lot) {
      const guide = this.humidityGuides[lot.cropType];
      const humidity = this.getHumidity(lot.id);
      if (!guide) return 'ok';
      return humidity < guide.min ? 'critical' : 'ok';
    },
    async loadAll() {
      this.isLoading = true;
      this.connectionError = '';
      try {
        const data = await this.service.getAllData();
        this.lots = data.lots.slice(0, 5);
        this.readings = data.readings;
      } catch (err) {
        console.error(err);
        this.lots = [];
        this.readings = [];
        this.connectionError = this.t('monitoring.error-connection');
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.loadAll();
  }
};
</script>

<template>
  <section class="home-page">
    <div class="page-header">
      <h1>{{ t('home.welcome') }}</h1>
      <p>{{ t('home.subtitle') }}</p>
    </div>

    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-number">{{ totalLots }}</div>
        <div class="stat-text">{{ t('home.total-lots') }}</div>
      </div>
      <div class="stat-box alert">
        <div class="stat-number">{{ criticalAlerts }}</div>
        <div class="stat-text">{{ t('home.alerts') }}</div>
      </div>
    </div>

    <div class="content-box">
      <div v-if="isLoading" class="message loading">{{ t('monitoring.loading') }}</div>
      <div v-else-if="connectionError" class="message error">{{ connectionError }}</div>
      <div v-else-if="lots.length === 0" class="message empty">
        <p>{{ t('monitoring.no-lots') }}</p>
      </div>
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>{{ t('home.lot-name') }}</th>
              <th>{{ t('home.crop-type') }}</th>
              <th>Humedad</th>
              <th>{{ t('home.npk') }}</th>
              <th>{{ t('home.status') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="lot in lots"
              :key="lot.id"
              :class="['data-row', getHumidityClass(lot)]"
            >
              <td>{{ lot.name }}</td>
              <td>{{ lot.cropType }}</td>
              <td class="humidity-cell">{{ getHumidity(lot.id) }}%</td>
              <td>{{ lot.npkStatus }}</td>
              <td>
                <span
                  v-if="getHumidityClass(lot) === 'critical'"
                  class="badge critical"
                >
                  ⚠️ Crítico
                </span>
                <span v-else class="badge normal">
                  ✓ Normal
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="action-bar">
      <router-link to="/monitoring" class="btn-primary">
        Ver todos los lotes →
      </router-link>
    </div>
  </section>
</template>

<style scoped>
:root {
  --primary: #1A2B4C;
  --success: #00BB31;
  --white: #FFFFFF;
  --black: #000000;
  --border: #E0E0E0;
}

.home-page {
  background: var(--white);
  min-height: 100%;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0 0 0.5rem;
  color: var(--primary);
  font-size: 1.8rem;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  color: #666;
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-box {
  background: var(--white);
  border-left: 4px solid var(--success);
  border-radius: 6px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.stat-box.alert {
  border-left-color: #DC3545;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.stat-box.alert .stat-number {
  color: #DC3545;
}

.stat-text {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.content-box {
  background: var(--white);
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  overflow: auto;
}

.message {
  text-align: center;
  padding: 2rem;
  font-size: 1rem;
  color: #666;
}

.message.error {
  background: #FFF5F5;
  color: #DC3545;
  border-radius: 4px;
  padding: 1rem;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.data-table thead {
  background: #F9F9F9;
  border-bottom: 2px solid var(--border);
}

.data-table th {
  padding: 1rem 0.75rem;
  text-align: left;
  color: var(--primary);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.3px;
}

.data-table tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
}

.data-table tbody tr:hover {
  background: #F9F9F9;
}

.data-table td {
  padding: 1rem 0.75rem;
  color: var(--black);
}

.humidity-cell {
  color: var(--success);
  font-weight: 600;
}

.data-row.critical .humidity-cell {
  color: #DC3545;
}

.badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
}

.badge.normal {
  background: #E8F5E9;
  color: var(--success);
}

.badge.critical {
  background: #FFEBEE;
  color: #DC3545;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--success);
  color: var(--white);
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background: #00A027;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 187, 49, 0.3);
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.5rem;
  }

  .stats-grid {
    gap: 1rem;
  }

  .stat-box {
    padding: 1.25rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.85rem;
  }
}
</style>