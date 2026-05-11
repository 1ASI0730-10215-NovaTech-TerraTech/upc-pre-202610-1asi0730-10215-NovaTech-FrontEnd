<script>
import { MonitoringApiService } from '../../infrastructure/monitoring-api.service.js';

export default {
  name: "LotList",
  data() {
    return {
      monitoringApi: new MonitoringApiService(), // Instanciamos el servicio
      lots: [],
      readings: [],
      recommendations: [],
      searchQuery: '',
      showForm: false,
      selectedLot: null,
      testHumidity: 50,
      defaultImg: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400",
      newLot: { name: '', cropType: '', npkStatus: 'Óptimo' }
    };
  },
  computed: {
    filteredLots() {
      return this.lots.filter(lot =>
          lot.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    async fetchAllData() {
      try {
        const [lotsRes, readingsRes, recsRes] = await Promise.all([
          this.monitoringApi.getAllLots(),
          this.monitoringApi.getAllReadings(),
          this.monitoringApi.getAllRecommendations()
        ]);
        this.lots = lotsRes.data;
        this.readings = readingsRes.data;
        this.recommendations = recsRes.data;
      } catch (error) {
        console.error("Error cargando datos de la API:", error);
      }
    },
    getHumidity(lotId) {
      const reading = this.readings.find(r => String(r.sensorId) === String(lotId));
      return reading ? reading.value : 0;
    },
    getRecommendation(lotId) {
      const rec = this.recommendations.find(r => String(r.lotId) === String(lotId));
      return rec ? rec.message : "El estado es estable.";
    },
    selectLot(lot) {
      this.selectedLot = lot;
    },
    async addLot() {
      if (!this.newLot.name || !this.newLot.cropType) return alert("Completa los datos");

      const nextId = "ID-" + Date.now();
      const lotToSave = { ...this.newLot, id: nextId, image: this.defaultImg };

      try {
        await this.monitoringApi.createLot(lotToSave);
        await this.monitoringApi.createReading({
          sensorId: nextId,
          value: Number(this.testHumidity),
          unit: "%",
          timestamp: new Date().toISOString()
        });

        await this.fetchAllData(); // Recargar todo
        this.showForm = false;
        this.newLot = { name: '', cropType: '', npkStatus: 'Óptimo' };
        alert("¡Lote registrado con éxito!");
      } catch (err) {
        alert("Error al conectar con el servidor.");
      }
    }
  },
  mounted() {
    this.fetchAllData();
  }
};
</script>