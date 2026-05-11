import { MonitoringApiService } from '../infrastructure/monitoring-api.service';
import { Lot } from '../domain/model/lot.entity';

export class MonitoringService {
    constructor() {
        this.api = new MonitoringApiService();
    }

    async getAllData() {
        const [lotsRes, readingsRes, recsRes] = await Promise.all([
            this.api.getLots(),
            this.api.getReadings(),
            this.api.getRecommendations()
        ]);

        return {
            lots: lotsRes.data.map(l => new Lot(l)),
            readings: readingsRes.data,
            recommendations: recsRes.data
        };
    }

    async registerLotWithHumidity(newLotData, humidityValue) {
        const nextId = "ID-" + Date.now();
        const lotToSave = {
            ...newLotData,
            id: nextId,
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400"
        };

        // Guardar ambos en el servidor (db.json)
        await this.api.createLot(lotToSave);
        const reading = {
            sensorId: nextId,
            value: Number(humidityValue),
            unit: "%",
            timestamp: new Date().toISOString()
        };
        await this.api.createReading(reading);

        return { lotToSave, reading };
    }
}