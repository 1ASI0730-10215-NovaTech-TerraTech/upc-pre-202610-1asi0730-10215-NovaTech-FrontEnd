<script>
import { MonitoringService } from '../../application/monitoring.service';

export default {
  data() {
    return {
      service: new MonitoringService(),
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
      return this.lots.filter(lot => lot.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
  },
  methods: {
    getHumidity(lotId) {
      const reading = this.readings.find(r => String(r.sensorId) === String(lotId));
      return reading ? reading.value : 0;
    },
    getRecommendation(lotId) {
      const rec = this.recommendations.find(r => String(r.lotId) === String(lotId));
      return rec ? rec.message : "El estado es estable. No se requieren acciones.";
    },
    async addLot() {
      if (!this.newLot.name || !this.newLot.cropType) return alert("Completa los datos");
      try {
        await this.service.registerLotWithHumidity(this.newLot, this.testHumidity);
        await this.loadAll(); // Recarga todo desde el db.json actualizado
        this.showForm = false;
        this.newLot = { name: '', cropType: '', npkStatus: 'Óptimo' };
        alert("Lote registrado correctamente.");
      } catch (err) {
        alert("Error de conexión");
      }
    },
    async loadAll() {
      const data = await this.service.getAllData();
      this.lots = data.lots;
      this.readings = data.readings;
      this.recommendations = data.recommendations;
    },
    selectLot(lot) { this.selectedLot = lot; }
  },
  mounted() {
    this.loadAll();
  }
};
</script>