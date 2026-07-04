<!-- src/analytics/presentation/views/report-list.vue -->
<template>
  <div class="analytics-container">
    <div class="analytics-header">
      <h2>{{ $t('analytics.title') }}</h2>
      <p>{{ $t('analytics.subtitle') }}</p>
    </div>

    <!-- Mostrar estadísticas de dispositivos e inventario -->
    <div class="stats-summary">
      <div class="stat-card">
        <i class="pi pi-microchip"></i>
        <div>
          <span class="stat-number">{{ store.deviceStats.total }}</span>
          <span class="stat-label">{{ $t('analytics.devices-stats') }}</span>
          <span class="stat-detail">({{ store.deviceStats.online }} {{ $t('monitoring.online') }}, {{ store.deviceStats.offline }} {{ $t('monitoring.offline') }})</span>
        </div>
      </div>
      <div class="stat-card">
        <i class="pi pi-box"></i>
        <div>
          <span class="stat-number">{{ store.inventoryStats.totalItems }}</span>
          <span class="stat-label">{{ $t('analytics.products-stats') }}</span>
          <span class="stat-detail">({{ store.inventoryStats.totalStock }} {{ $t('monitoring.units') }})</span>
        </div>
      </div>
    </div>

    <div v-if="store.loading" class="loading-state">
      <pv-progress-spinner />
      <p>{{ $t('monitoring.loading') }}</p>
    </div>

    <template v-else>
      <div class="alert-banner-critical">
        <div class="alert-icon">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <div class="alert-content">
          <strong>{{ $t('analytics.sys-alert-title') }}</strong> {{ $t('analytics.sys-alert-desc') }}
        </div>
      </div>

      <div class="visual-dashboard-grid">
        <!-- Fertility Map Card -->
        <div class="visual-card">
          <div class="card-header">
            <span class="icon-box"><i class="pi pi-map"></i></span>
            <h3>{{ $t('analytics.fertility-map') }}</h3>
          </div>
          <div class="card-body">
            <div class="agricultural-map">
              <!-- Usar dispositivos reales para el mapa -->
              <div
                  v-for="device in displayDevices"
                  :key="device.id"
                  class="plot"
                  :class="{
                  optimal: device.status === 'ONLINE',
                  warning: device.status === 'LOW_BATTERY',
                  critical: device.status === 'OFFLINE'
                }"
              >
                {{ device.id }}
                <span class="tooltip">{{ device.id }}: {{ device.status }}</span>
              </div>
            </div>
            <div class="map-legend">
              <div class="legend-item">
                <span class="legend-dot optimal"></span>
                <span class="legend-label">{{ $t('analytics.optimal') }}</span>
                <span class="legend-value">{{ $t('monitoring.status-active') }}</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot warning"></span>
                <span class="legend-label">{{ $t('analytics.warning') }}</span>
                <span class="legend-value">{{ $t('monitoring.status-error') }}</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot critical"></span>
                <span class="legend-label">{{ $t('analytics.critical') }}</span>
                <span class="legend-value">{{ $t('monitoring.status-inactive') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Dashboard Metrics Card - Ahora con datos reales -->
        <div class="visual-card">
          <div class="card-header">
            <span class="icon-box"><i class="pi pi-chart-line"></i></span>
            <h3>{{ $t('analytics.dashboard-metrics') }}</h3>
          </div>
          <div class="card-body chart-body">
            <div class="bar-chart">
              <div
                  v-for="item in store.averageHumidity"
                  :key="item.id"
                  class="chart-bar-wrapper"
              >
                <div class="bar-value">{{ Math.round(item.mean_value) }}%</div>
                <div class="bar-container">
                  <div
                      class="bar"
                      :style="{
                      height: Math.min(Math.max(item.mean_value, 0), 100) + '%',
                      background: item.mean_value > 70 ? 'linear-gradient(to top, #2e7d32, #4caf50)' :
                                   item.mean_value > 40 ? 'linear-gradient(to top, #f57c00, #ffb300)' :
                                   'linear-gradient(to top, #c62828, #ef5350)'
                    }"
                  ></div>
                </div>
                <div class="bar-label">{{ item.device_id || item.id }}</div>
              </div>
              <div v-if="store.averageHumidity.length === 0" class="no-data">
                {{ $t('monitoring.no-devices') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="reports-section">
        <h3><i class="pi pi-clipboard"></i> {{ $t('analytics.records-title') }}</h3>

        <div class="metrics-grid">
          <div v-for="rep in store.reportsList" :key="rep.id" class="card-metric">
            <div class="card-header-metric">
              <span class="device-tag"><i class="pi pi-microchip"></i> {{ rep.device_id }}</span>
              <span class="date-tag"><i class="pi pi-calendar"></i> {{ rep.generated_at }}</span>
            </div>
            <div class="card-body">
              <h4 class="report-title">{{ $t('analytics.control-metrics') }}</h4>
              <p class="data-highlight">{{ rep.mean_value }} <span class="unit">% HR</span></p>

              <hr class="divider" />

              <p class="data-interpretation">
                <strong>{{ $t('analytics.tech-interpretation') }}</strong> {{ rep.technical_interpretation }}
              </p>
              <div class="sub-data-group">
                <p class="sub-data">{{ $t('analytics.variance') }} <code>{{ rep.variance }}</code></p>
                <p class="sub-data">{{ $t('analytics.deviation') }} <code>±{{ rep.standard_deviation }}</code></p>
              </div>
            </div>
          </div>
          <div v-if="store.reportsList.length === 0" class="no-data-card">
            <i class="pi pi-inbox"></i>
            <p>{{ $t('monitoring.no-devices') }}</p>
          </div>
        </div>
      </div>

      <div class="bottom-controls">
        <div class="recommendations-box">
          <h4><i class="pi pi-lightbulb"></i> {{ $t('analytics.recommendations') }}</h4>
          <p>{{ $t('analytics.recommendations-desc') }}</p>
        </div>

        <div class="actions-wrapper">
          <pv-button @click="triggerExportReport" class="btn-action-export" severity="success">
            <i class="pi pi-download"></i> {{ $t('analytics.export-btn') }}
          </pv-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useAnalyticsStore } from '../../application/analytics-management.store.js';
import { useMonitoringStore } from '../../../monitoring/application/monitoring.store.js';
import { useStockStore } from '../../../stock/application/stock.store.js';

// Inicializar stores
const store = useAnalyticsStore();
const monitoringStore = useMonitoringStore();
const stockStore = useStockStore();

// Computed para obtener los dispositivos a mostrar en el mapa
const displayDevices = computed(() => {
  // Si hay dispositivos en el store de monitoring, usar los primeros 5
  if (monitoringStore.devices && monitoringStore.devices.length > 0) {
    return monitoringStore.devices.slice(0, 5);
  }
  // Si no hay dispositivos, usar datos de ejemplo
  return [
    { id: 'dev_001', status: 'ONLINE' },
    { id: 'dev_002', status: 'OFFLINE' },
    { id: 'dev_003', status: 'ONLINE' },
    { id: 'dev_004', status: 'LOW_BATTERY' },
    { id: 'dev_005', status: 'ONLINE' }
  ];
});

onMounted(async () => {
  console.log('🔄 Iniciando carga de datos para Analytics...');

  // Cargar datos de analytics (esto también carga monitoring y stock)
  await store.fetchReports();

  // Verificar que los datos se cargaron correctamente
  console.log('📊 Estado final:');
  console.log('  - Dispositivos:', monitoringStore.devices.length);
  console.log('  - Inventario:', stockStore.inventory.length);
  console.log('  - Reportes:', store.reportsList.length);
});

const triggerExportReport = () => {
  let reportContent = "========================================================\n";
  reportContent += "             TERRATECH - MONTHLY CONSOLIDATED REPORT     \n";
  reportContent += "========================================================\n\n";
  reportContent += `Generation Date: ${new Date().toLocaleDateString()}\n`;
  reportContent += "Module: Analytics Management\n";
  reportContent += "System Status: Domain Event Executed Successfully\n\n";
  reportContent += "--------------------------------------------------------\n";
  reportContent += "DEVICES SUMMARY\n";
  reportContent += "--------------------------------------------------------\n";
  reportContent += `Total Devices: ${store.deviceStats.total}\n`;
  reportContent += `  - Online: ${store.deviceStats.online}\n`;
  reportContent += `  - Offline: ${store.deviceStats.offline}\n`;
  reportContent += `  - Low Battery: ${store.deviceStats.lowBattery}\n\n`;
  reportContent += "--------------------------------------------------------\n";
  reportContent += "INVENTORY SUMMARY\n";
  reportContent += "--------------------------------------------------------\n";
  reportContent += `Total Products: ${store.inventoryStats.totalItems}\n`;
  reportContent += `Total Stock Units: ${store.inventoryStats.totalStock}\n\n`;
  reportContent += "--------------------------------------------------------\n";
  reportContent += "ANALYZED REPORTS\n";
  reportContent += "--------------------------------------------------------\n";

  store.reportsList.forEach((rep, index) => {
    reportContent += `\n[Report #${index + 1}] Device: ${rep.device_id}\n`;
    reportContent += `  - Date: ${rep.generated_at}\n`;
    reportContent += `  - Average Humidity: ${rep.mean_value}% RH\n`;
    reportContent += `  - Variance: ${rep.variance}\n`;
    reportContent += `  - Standard Deviation: ±${rep.standard_deviation}\n`;
    reportContent += `  - Interpretation: ${rep.technical_interpretation}\n`;
  });

  reportContent += "\n\n--------------------------------------------------------\n";
  reportContent += "GENERAL IRRIGATION RECOMMENDATIONS\n";
  reportContent += "--------------------------------------------------------\n";
  reportContent += "Optimize drip irrigation cycles as a priority in sectors controlled by devices with low humidity readings.\n\n";
  reportContent += "========================================================\n";
  reportContent += "              END OF REPORT - TERRATECH 2026            \n";
  reportContent += "========================================================\n";

  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "Monthly_Report_TerraTech.txt");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style scoped>
/* Mantén todos tus estilos existentes */

.analytics-container {
  padding: 30px;
  background-color: #f4f7f4;
  min-height: 90vh;
  font-family: 'Segoe UI', Arial, sans-serif;
}

/* Nuevos estilos para el resumen de estadísticas */
.stats-summary {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #e0e0e0;
  flex: 1;
  min-width: 200px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card i {
  font-size: 1.8rem;
  color: #2e7d32;
  background: rgba(46, 125, 50, 0.1);
  padding: 0.5rem;
  border-radius: 10px;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1b5e20;
  display: block;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.stat-detail {
  font-size: 0.7rem;
  color: #888;
  margin-left: 0.5rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.alert-banner-critical {
  background-color: #f3e5f5;
  border-left: 5px solid #7b1fa2;
  color: #4a148c;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.alert-banner-critical:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.alert-icon {
  margin-right: 15px;
}

.alert-icon i {
  font-size: 1.25rem;
}

.visual-dashboard-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  margin-bottom: 30px;
}

.visual-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  flex: 1;
  min-width: 340px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.visual-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: #f9faf9;
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-header h3 {
  margin: 0;
  font-size: 14px;
  color: #2e7d32;
}

.icon-box i {
  font-size: 1.25rem;
  color: #2e7d32;
  background: rgba(46, 125, 50, 0.1);
  padding: 8px;
  border-radius: 10px;
}

.card-body {
  padding: 20px;
}

.agricultural-map {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.plot {
  padding: 25px 5px;
  text-align: center;
  font-weight: bold;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  position: relative;
  transition: all 0.2s ease;
}

.plot:hover {
  transform: scale(1.02);
  filter: brightness(1.05);
}

.plot .tooltip {
  visibility: hidden;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 11px;
}

.plot:hover .tooltip {
  visibility: visible;
}

.optimal { background-color: #4caf50; }
.warning { background-color: #ff9800; }
.critical { background-color: #f44336; }

.animate-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.8; }
  100% { opacity: 1; }
}

.map-legend {
  display: flex;
  justify-content: space-around;
  gap: 15px;
  flex-wrap: wrap;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-dot.optimal { background-color: #4caf50; }
.legend-dot.warning { background-color: #ff9800; }
.legend-dot.critical { background-color: #f44336; }

.legend-label {
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.legend-value {
  font-size: 11px;
  color: #888;
}

.chart-body {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 200px;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 15px;
  width: 100%;
  height: 160px;
  border-bottom: 2px solid #ccc;
  padding: 0 5px;
}

.chart-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bar-value {
  font-size: 11px;
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 5px;
}

.bar-container {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: flex-end;
  background: #e8ece8;
  border-radius: 6px;
  overflow: hidden;
}

.bar {
  width: 100%;
  border-radius: 6px 6px 0 0;
  transition: height 0.3s ease;
}

.bar-label {
  font-size: 10px;
  color: #666;
  margin-top: 8px;
  font-weight: 500;
}

.no-data {
  width: 100%;
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 20px 0;
}

.no-data-card {
  width: 100%;
  text-align: center;
  padding: 2rem;
  color: #999;
}

.no-data-card i {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  color: #ddd;
}

.reports-section h3 {
  color: #2e7d32;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reports-section h3 i {
  font-size: 1.25rem;
  color: #2e7d32;
  background: rgba(46, 125, 50, 0.1);
  padding: 8px;
  border-radius: 10px;
}

.metrics-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card-metric {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  width: 290px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.card-metric:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card-header-metric {
  background: #f1f8e9;
  padding: 12px 15px;
  border-bottom: 1px solid #dcedc8;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: bold;
  color: #33691e;
}

.card-header-metric i {
  margin-right: 4px;
}

.report-title {
  margin: 10px 0 5px 0;
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
}

.data-highlight {
  font-size: 28px;
  font-weight: bold;
  color: #1b5e20;
  margin: 0 0 10px 0;
}

.unit { font-size: 13px; color: #666; }

.divider {
  border: 0;
  border-top: 1px solid #eee;
  margin: 10px 0;
}

.data-interpretation {
  font-size: 13px;
  color: #444;
  line-height: 1.4;
  margin: 0 0 10px 0;
}

.sub-data-group {
  display: flex;
  justify-content: space-between;
  background: #f8f9fa;
  padding: 8px;
  border-radius: 8px;
}

.sub-data {
  font-size: 11px;
  color: #666;
  margin: 0;
}

.sub-data code {
  background: #e9ecef;
  padding: 2px 5px;
  border-radius: 5px;
  font-size: 10px;
}

.bottom-controls {
  margin-top: 30px;
  background: white;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  transition: all 0.3s ease;
}

.bottom-controls:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.recommendations-box {
  flex: 1;
}

.recommendations-box h4 {
  margin: 0 0 8px 0;
  color: #2e7d32;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recommendations-box h4 i {
  font-size: 1.25rem;
  color: #ff9800;
}

.recommendations-box p {
  margin: 0;
  font-size: 13px;
  color: #555;
  line-height: 1.5;
}

.btn-action-export {
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-action-export:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

@media (max-width: 768px) {
  .analytics-container {
    padding: 15px;
  }
  .bottom-controls {
    flex-direction: column;
    align-items: stretch;
  }
  .btn-action-export {
    width: 100%;
  }
  .stats-summary {
    flex-direction: column;
  }
  .stat-card {
    min-width: auto;
  }
}
</style>