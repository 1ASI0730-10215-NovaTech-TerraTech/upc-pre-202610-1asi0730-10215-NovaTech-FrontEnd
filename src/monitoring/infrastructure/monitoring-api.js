import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_TERRATECH_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

export class MonitoringApi {
  getAllLots() {
    return http.get('/lots');
  }

  getAllReadings() {
    return http.get('/readings');
  }

  getAllRecommendations() {
    return http.get('/recommendations');
  }

  createLot(data) {
    return http.post('/lots', data);
  }

  createReading(data) {
    return http.post('/readings', data);
  }

  // Alias para compatibilidad con el store
  getLots() {
    return this.getAllLots();
  }

  getReadings() {
    return this.getAllReadings();
  }

  getRecommendations() {
    return this.getAllRecommendations();
  }
}