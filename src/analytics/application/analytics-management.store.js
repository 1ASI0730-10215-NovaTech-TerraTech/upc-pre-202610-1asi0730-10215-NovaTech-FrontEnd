import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {AnalyticsManagementApi} from "../infrastructure/analytics-management-api.js";
import {ReportAssembler} from "../infrastructure/report.assembler.js";
import {Report} from "../domain/model/report.entity.js";

const analyticsApi = new AnalyticsManagementApi();

/**
 * Analytics Management Store - Centralized state management for analytics module.
 *
 * @module stores/analytics
 * @returns {Object} Store instance with state and actions
 */
const useAnalyticsStore = defineStore('analytics', () => {

    const reportsList = ref([]);
    const errors = ref([]);
    const reportsLoaded = ref(false);

    const reportsCount = computed(() => {
        return reportsLoaded.value ? reportsList.value.length : 0;
    });

    /**
     * Fetches all analytical reports from the API.
     * Uses fallback local data if the server is unreachable or empty.
     */
    function fetchReports() {
        analyticsApi.getReports().then(response => {
            if (response && response.data && (response.data.length > 0 || response.data['report'])) {
                reportsList.value = ReportAssembler.toEntitiesFromResponse(response);
            } else {
                throw new Error("Empty data from server");
            }
            reportsLoaded.value = true;
        }).catch(error => {
            console.warn("Servidor Render sin datos o inaccesible. Cargando datos de respaldo.");
            errors.value.push(error);

            const fallbackResponse = {
                status: 200,
                data: [
                    { "id": "rep_001", "device_id": "dev_001", "generated_at": "2026-05-13", "mean_value": 66.046, "variance": 12.5, "standard_deviation": 3.53, "technical_interpretation": "The average humidity of 66% indicates well-hydrated soil." },
                    { "id": "rep_002", "device_id": "dev_003", "generated_at": "2026-05-13", "mean_value": 22.1, "variance": 5.2, "standard_deviation": 2.28, "technical_interpretation": "Critical moisture levels detected; immediate irrigation required." },
                    { "id": "rep_003", "device_id": "dev_004", "generated_at": "2026-05-13", "mean_value": 28.5, "variance": 1.8, "standard_deviation": 1.34, "technical_interpretation": "Thermal stability observed within the expected range for tomatoes." },
                    { "id": "rep_004", "device_id": "dev_005", "generated_at": "2026-05-12", "mean_value": 45.2, "variance": 20.1, "standard_deviation": 4.48, "technical_interpretation": "High variability in data; sensor review is recommended." },
                    { "id": "rep_005", "device_id": "dev_001", "generated_at": "2026-05-12", "mean_value": 65.8, "variance": 10.3, "standard_deviation": 3.21, "technical_interpretation": "Stable data behavior compared to the previous day." }
                ]
            };
            reportsList.value = ReportAssembler.toEntitiesFromResponse(fallbackResponse);
            reportsLoaded.value = true;
        });
    }

    return {
        reportsList,
        errors,
        reportsLoaded,
        reportsCount,
        fetchReports
    }
});

export { useAnalyticsStore };