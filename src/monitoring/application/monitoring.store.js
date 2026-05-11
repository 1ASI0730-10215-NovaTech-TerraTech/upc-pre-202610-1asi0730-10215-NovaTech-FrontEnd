import { MonitoringApi } from '../infrastructure/monitoring-api.js';
import {
    buildLotCreatePayload,
    buildReadingCreatePayload,
    toLotEntities
} from '../infrastructure/batch.assembler.js';

export class MonitoringStore {
    constructor() {
        this.api = new MonitoringApi();
    }

    async getAllData() {
        const [lotsRes, readingsRes, recsRes] = await Promise.all([
            this.api.getLots(),
            this.api.getReadings(),
            this.api.getRecommendations()
        ]);

        return {
            lots: toLotEntities(lotsRes.data),
            readings: readingsRes.data,
            recommendations: recsRes.data
        };
    }

    async registerLotWithHumidity(newLotData, humidityValue) {
        const nextId = 'ID-' + Date.now();
        const lotToSave = buildLotCreatePayload(newLotData, nextId);

        await this.api.createLot(lotToSave);
        const reading = buildReadingCreatePayload(nextId, humidityValue);
        await this.api.createReading(reading);

        return { lotToSave, reading };
    }
}