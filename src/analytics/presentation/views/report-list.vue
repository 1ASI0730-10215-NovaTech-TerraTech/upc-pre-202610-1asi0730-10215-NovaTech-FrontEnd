<template>
  <div class="analytics-container">

    <div class="analytics-header">
      <h2>{{ $t('analytics.title') }}</h2>
      <p>{{ $t('analytics.subtitle') }}</p>
    </div>

    <div class="alert-banner-critical">
      <div class="alert-icon">⚠️</div>
      <div class="alert-content">
        <strong>{{ $t('analytics.sys-alert-title') }}</strong> {{ $t('analytics.sys-alert-desc') }}
      </div>
    </div>

    <div class="visual-dashboard-grid">

      <div class="visual-card">
        <div class="card-header">
          <span class="icon-box">🗺️</span>
          <h3>{{ $t('analytics.fertility-map') }}</h3>
        </div>
        <div class="card-body">
          <div class="agricultural-map">
            <div class="plot optimal">P1<span class="tooltip">dev_001: {{ $t('analytics.optimal') }}</span></div>
            <div class="plot critical animate-pulse">P2<span class="tooltip">dev_003: {{ $t('analytics.critical') }}</span></div>
            <div class="plot critical">P3<span class="tooltip">dev_004: {{ $t('analytics.critical') }}</span></div>
            <div class="plot warning">P4<span class="tooltip">dev_005: {{ $t('analytics.warning') }}</span></div>
            <div class="plot optimal">P5<span class="tooltip">dev_001: {{ $t('analytics.optimal') }}</span></div>
          </div>
          <div class="map-legend">
            <span class="legend-item"><span class="box optimal"></span> {{ $t('analytics.optimal') }} (Humedad > 50%)</span>
            <span class="legend-item"><span class="box warning"></span> {{ $t('analytics.warning') }} (Humedad 30% - 50%)</span>
            <span class="legend-item"><span class="box critical"></span> {{ $t('analytics.critical') }} (Humedad < 30%)</span>
          </div>
        </div>
      </div>

      <div class="visual-card">
        <div class="card-header">
          <span class="icon-box">📊</span>
          <h3>{{ $t('analytics.dashboard-metrics') }}</h3>
        </div>
        <div class="card-body chart-body">
          <div class="bar-chart">
            <div v-for="rep in reportsList" :key="rep.id" class="chart-bar-wrapper">
              <div class="bar-value-label">{{ rep.mean_value }}%</div>
              <div class="bar" :style="{ height: rep.mean_value + '%' }"></div>
              <div class="bar-label">{{ rep.device_id }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="reports-section">
      <h3>📋 {{ $t('analytics.records-title') }}</h3>

      <div class="metrics-grid">
        <div v-for="rep in reportsList" :key="rep.id" class="card-metric">
          <div class="card-header-metric">
            <span class="device-tag">🆔 {{ rep.device_id }}</span>
            <span class="date-tag">{{ rep.generated_at }}</span>
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
      </div>
    </div>

    <div class="bottom-controls">
      <div class="recommendations-box">
        <h4>💡 {{ $t('analytics.recommendations') }}</h4>
        <p>{{ $t('analytics.recommendations-desc') }}</p>
      </div>

      <div class="actions-wrapper">
        <button @click="triggerExportReport" class="btn-action-export">
          📥 {{ $t('analytics.export-btn') }}
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import { useAnalyticsStore } from '../../application/analytics-management.store.js';

export default {
  name: "ReportList",
  setup() {
    // Inicializamos el Store de Pinia en la capa de presentación
    const analyticsStore = useAnalyticsStore();
    return { analyticsStore };
  },
  computed: {

    reportsList() {
      return this.analyticsStore.reportsList;
    }
  },
  mounted() {

    this.analyticsStore.fetchReports();
  },
  methods: {
    triggerExportReport() {
      let reportContent = "========================================================\n";
      reportContent += "             TERRATECH - REPORTE MENSUAL CONSOLIDADO     \n";
      reportContent += "========================================================\n\n";
      reportContent += `Fecha de Generación: ${new Date().toLocaleDateString()}\n`;
      reportContent += "Módulo: Analytics Management\n";
      reportContent += "Estado del Sistema: Evento de Dominio Ejecutado con Éxito\n\n";
      reportContent += "--------------------------------------------------------\n";
      reportContent += "RESUMEN DE DISPOSITIVOS ANALIZADOS\n";
      reportContent += "--------------------------------------------------------\n";

      this.reportsList.forEach((rep, index) => {
        reportContent += `\n[Reporte #${index + 1}] Dispositivo: ${rep.device_id}\n`;
        reportContent += `  - Fecha: ${rep.generated_at}\n`;
        reportContent += `  - Humedad Promedio: ${rep.mean_value}% HR\n`;
        reportContent += `  - Varianza: ${rep.variance}\n`;
        reportContent += `  - Desviación Estándar: ±${rep.standard_deviation}\n`;
        reportContent += `  - Interpretación: ${rep.technical_interpretation}\n`;
      });

      reportContent += "\n\n--------------------------------------------------------\n";
      reportContent += "RECOMENDACIONES GENERALES DE IRRIGACIÓN\n";
      reportContent += "--------------------------------------------------------\n";
      reportContent += "Optimizar los ciclos de irrigación por goteo de manera prioritaria en los sectores controlados por los dispositivos dev_003 y dev_004 debido a lecturas de humedad por debajo del umbral crítico tolerado.\n\n";
      reportContent += "========================================================\n";
      reportContent += "             FIN DEL REPORTE - TERRATECH 2026            \n";
      reportContent += "========================================================\n";

      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "Reporte_Mensual_TerraTech.txt");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>


<style scoped>
.analytics-container {
  padding: 30px;
  background-color: #f4f7f4;
  min-height: 90vh;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.analytics-header h2 {
  color: #1b5e20;
  margin: 0 0 5px 0;
}

.analytics-header p {
  color: #666;
  margin: 0 0 20px 0;
  font-size: 14px;
}

.alert-banner-critical {
  background-color: #f3e5f5;
  border-left: 5px solid #7b1fa2;
  color: #4a148c;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
}

.alert-icon {
  margin-right: 15px;
  font-size: 20px;
}

.visual-dashboard-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  margin-bottom: 30px;
}

.visual-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  flex: 1;
  min-width: 340px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
}

.card-header {
  background: #f9faf9;
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 14px;
  color: #2e7d32;
}

.card-body {
  padding: 20px;
}

.agricultural-map {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.plot {
  padding: 25px 5px;
  text-align: center;
  font-weight: bold;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.optimal { background-color: #4caf50; }
.warning { background-color: #ff9800; }
.critical { background-color: #f44336; }

.animate-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.map-legend {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.box {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.chart-body {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 180px;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 15px;
  width: 100%;
  height: 130px;
  border-bottom: 2px solid #ccc;
  padding: 0 5px;
}

.chart-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bar {
  width: 100%;
  background: linear-gradient(to top, #2e7d32, #4caf50);
  border-radius: 4px 4px 0 0;
}

.bar-value-label {
  font-size: 10px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.bar-label {
  font-size: 10px;
  color: #666;
  margin-top: 5px;
}

.reports-section h3 {
  color: #2e7d32;
  margin-bottom: 15px;
}

.metrics-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card-metric {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 290px;
}

.card-header-metric {
  background: #f1f8e9;
  padding: 10px 15px;
  border-bottom: 1px solid #dcedc8;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: bold;
  color: #33691e;
}

.report-title {
  margin: 10px 0 5px 0;
  font-size: 12px;
  color: #777;
  text-transform: uppercase;
}

.data-highlight {
  font-size: 26px;
  font-weight: bold;
  color: #1b5e20;
  margin: 0 0 10px 0;
}

.unit { font-size: 14px; color: #666; }

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
  background: #fafafa;
  padding: 6px;
  border-radius: 4px;
}

.sub-data {
  font-size: 11px;
  color: #7f8c8d;
  margin: 0;
}

.bottom-controls {
  margin-top: 30px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.recommendations-box h4 {
  margin: 0 0 8px 0;
  color: #2e7d32;
}

.recommendations-box p {
  margin: 0 0 15px 0;
  font-size: 13px;
  color: #555;
  line-height: 1.5;
}

.btn-action-export {
  background-color: #2e7d32;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
}

.btn-action-export:hover {
  background-color: #1b5e20;
}
</style>