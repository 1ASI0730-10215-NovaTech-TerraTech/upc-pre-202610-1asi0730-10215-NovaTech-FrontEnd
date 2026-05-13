<template>
  <div class="p-4">
    <h1 class="text-4xl font-bold mb-5 text-center text-primary">{{ $t('commercial.catalog-title') }}</h1>

    <div v-if="store.loading" class="flex justify-content-center py-8">
      <pv-progress-spinner />
    </div>

    <div v-else-if="store.products.length > 0" class="grid justify-content-center">
      <div v-for="product in store.products" :key="product.id" class="col-12 md:col-6 lg:col-4 p-3">
        <pv-card class="h-full shadow-4 border-round-xl overflow-hidden custom-card">
          <template #header>
            <div class="relative">
              <img :src="getProductImage(product.id)"
                   class="w-full h-13rem object-cover"
                   :alt="product.name"
                   @error="(e) => e.target.src = 'https://images.unsplash.com/photo-1518544861942-8e1003433621?w=600'" />

              <pv-tag :value="product.type"
                      :severity="product.type === 'SUBSCRIPTION' ? 'success' : 'warning'"
                      class="absolute top-0 right-0 m-2 shadow-2" />
            </div>
          </template>

          <template #title>
            <div class="text-xl font-bold text-white uppercase">{{ product.name }}</div>
          </template>

          <template #content>
            <p class="text-400 mb-4 h-3rem overflow-hidden">{{ product.description }}</p>
            <div class="flex align-items-center justify-content-between bg-gray-800 p-2 border-round">
              <span class="text-3xl font-bold text-green-400">${{ product.price }}</span>
              <span class="text-xs font-bold text-500 uppercase">Precio</span>
            </div>
          </template>

          <template #footer>
            <pv-button :label="$t('commercial.buy')"
                       icon="pi pi-shopping-cart"
                       class="w-full p-button-raised p-button-rounded font-bold"
                       @click="handleSelect(product)" />
          </template>
        </pv-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCommercialStore } from '../../application/commercial-management.store';

const store = useCommercialStore();
const router = useRouter();

onMounted(async () => {
  await store.fetchProducts();
});


const getProductImage = (id) => {
  const images = {

    'prod_002': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',

    'prod_003': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',

    'prod_004': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',

    'prod_005': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',

    '9r5pzYm': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600'
  };

  return images[id] || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600';
};

const handleSelect = (product) => {
  store.selectProduct(product);
  router.push('/commercial/order-summary');
};
</script>

<style scoped>
.custom-card {
  background-color: #1a1a1a;
  border: 1px solid #333;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.custom-card:hover {
  transform: translateY(-8px);
  border-color: var(--primary-color);
}
</style>