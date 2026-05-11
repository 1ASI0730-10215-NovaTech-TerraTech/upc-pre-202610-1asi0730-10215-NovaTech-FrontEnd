import http from '../../shared/http-common';

export class MonitoringApiService {
    // Traer todos los lotes
    getAllLots() {
        return http.get('/lots');
    }

    // Traer todas las lecturas de sensores
    getAllReadings() {
        return http.get('/readings');
    }

    // Traer las recomendaciones
    getAllRecommendations() {
        return http.get('/recommendations');
    }

    // Crear un nuevo lote (el que guardas en el formulario)
    createLot(data) {
        return http.post('/lots', data);
    }

    // Crear la lectura inicial para ese lote
    createReading(data) {
        return http.post('/readings', data);
    }
}