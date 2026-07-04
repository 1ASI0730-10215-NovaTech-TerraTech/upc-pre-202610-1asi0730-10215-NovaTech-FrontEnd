// src/analytics/application/analytics-management.store.js
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { AnalyticsManagementApi } from "../infrastructure/analytics-management-api.js";
import { ReportAssembler } from "../infrastructure/report.assembler.js";
// Importamos los stores de monitoring y stock
import { useMonitoringStore } from "../../monitoring/application/monitoring.store.js";
import { useStockStore } from "../../stock/application/stock.store.js";

const analyticsApi = new AnalyticsManagementApi();

/**
 * Analytics Management Store - Centralized state management for analytics module.
 * Ahora también obtiene datos de monitoring y stock para el dashboard.
 *
 * @module stores/analytics
 * @returns {Object} Store instance with state and actions
 */
const useAnalyticsStore = defineStore('analytics', () => {
    const reportsList = ref([]);
    const errors = ref([]);
    const reportsLoaded = ref(false);
    const loading = ref(false);

    // Referencias a otros stores - las creamos dentro del store para que sean reactivas
    const monitoringStore = useMonitoringStore();
    const stockStore = useStockStore();

    const reportsCount = computed(() => {
        return reportsLoaded.value ? reportsList.value.length : 0;
    });

    /**
     * Fetches all analytical reports from the API.
     * También carga dispositivos e inventario si no están cargados.
     */
    async function fetchReports() {
        loading.value = true;
        try {
            // 1. Cargar reportes
            const response = await analyticsApi.getReports();
            if (response && response.data) {
                reportsList.value = ReportAssembler.toEntitiesFromResponse(response);
            }
            reportsLoaded.value = true;

            // 2. Cargar dispositivos (monitoring) si no están cargados
            if (!monitoringStore.devicesLoaded) {
                await monitoringStore.fetchDevices();
            }

            // 3. Cargar inventario (stock) si no está cargado
            if (stockStore.inventory.length === 0) {
                await stockStore.fetchInventory();
            }

            console.log('✅ Analytics: Datos cargados correctamente');
            console.log('📊 Dispositivos:', monitoringStore.devices.length);
            console.log('📦 Inventario:', stockStore.inventory.length);
            console.log('📋 Reportes:', reportsList.value.length);

        } catch (error) {
            console.error('Error fetching data for analytics:', error);
            errors.value.push(error);
            reportsLoaded.value = true;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Gets a report by its ID
     * @param {string|number} id - Report identifier
     * @returns {Report|undefined}
     */
    function getReportById(id) {
        return reportsList.value.find(report => String(report.id) === String(id));
    }

    // Computed que combinan datos de monitoreo e inventario para el dashboard
    const deviceStats = computed(() => {
        const devices = monitoringStore.devices || [];
        const online = devices.filter(d => d.status === 'ONLINE').length;
        const offline = devices.filter(d => d.status === 'OFFLINE').length;
        const lowBattery = devices.filter(d => d.status === 'LOW_BATTERY').length;
        return { total: devices.length, online, offline, lowBattery };
    });

    const inventoryStats = computed(() => {
        const items = stockStore.inventory || [];
        const totalStock = items.reduce((sum, item) => sum + (item.stock_quantity || item.StockQuantity || 0), 0);
        return { totalItems: items.length, totalStock };
    });

    /**
     * Obtiene el promedio de humedad de los dispositivos basado en los reportes
     * Si no hay reportes, usa datos de ejemplo para demostración
     */
    const averageHumidity = computed(() => {
        // Si tenemos reportes, usarlos
        if (reportsList.value.length > 0) {
            return reportsList.value;
        }

        // Si no hay reportes pero hay dispositivos, generar datos simulados
        const devices = monitoringStore.devices || [];
        if (devices.length > 0) {
            return devices.map((device) => ({
                id: device.id,
                device_id: device.id,
                mean_value: device.status === 'ONLINE' ? 45 + Math.random() * 30 : 20 + Math.random() * 15,
                standard_deviation: device.id,
                generated_at: new Date().toISOString().split('T')[0],
                variance: (Math.random() * 10).toFixed(2),
                technical_interpretation: device.status === 'ONLINE' ? 'Normal operation' : 'Device offline'
            }));
        }

        // Si no hay nada, retornar array vacío
        return [];
    });

    return {
        reportsList,
        errors,
        reportsLoaded,
        loading,
        reportsCount,
        fetchReports,
        getReportById,
        // Nuevas propiedades
        deviceStats,
        inventoryStats,
        averageHumidity
    };
});

export { useAnalyticsStore };