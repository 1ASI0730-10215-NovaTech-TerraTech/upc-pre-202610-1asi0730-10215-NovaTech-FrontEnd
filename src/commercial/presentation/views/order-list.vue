<template>
  <div class="p-4 flex justify-content-center">
    <pv-card class="w-full md:w-6 shadow-4">
      <template #title>
        <div class="flex align-items-center">
          <i class="pi pi-credit-card mr-2 text-2xl"></i>
          <span>{{ $t('commercial.order-summary') }}</span>
        </div>
      </template>

      <template #content>
        <div v-if="store.selectedProduct" class="mt-2">
          <div class="surface-ground p-3 border-round mb-4">
            <p class="text-xl mb-2"><strong>{{ store.selectedProduct.name }}</strong></p>
            <p class="text-2xl font-bold text-green-600">
              {{ $t('commercial.total-pay') }}: ${{ store.selectedProduct.price }}
            </p>
          </div>

          <div class="mb-4">
            <h3 class="text-lg font-bold mb-3 border-bottom-1 border-300 pb-1">
              {{ $t('commercial.payment-method') }}
            </h3>
            <div class="flex flex-column gap-3">
              <div class="flex align-items-center">
                <pv-radiobutton v-model="paymentMethod" inputId="visa" name="method" value="Visa" />
                <label for="visa" class="ml-2">Visa / Mastercard</label>
              </div>
              <div class="flex align-items-center">
                <pv-radiobutton v-model="paymentMethod" inputId="paypal" name="method" value="PayPal" />
                <label for="paypal" class="ml-2">PayPal</label>
              </div>
            </div>
          </div>

          <div class="flex gap-3 mt-5">
            <pv-button :label="$t('commercial.cancel')" icon="pi pi-arrow-left" class="p-button-outlined flex-1" @click="router.back()" />
            <pv-button :label="$t('commercial.confirm')" icon="pi pi-file-pdf" class="p-button-success flex-1" @click="confirmOrder" />
          </div>
        </div>

        <div v-else class="text-center py-5">
          <i class="pi pi-shopping-cart text-4xl text-400 mb-3"></i>
          <p>{{ $t('commercial.no-products') }}</p>
          <pv-button :label="$t('commercial.cancel')" class="mt-3" @click="router.push('/commercial/catalog')" />
        </div>
      </template>
    </pv-card>

    <pv-dialog v-model:visible="showSuccess" modal :header="$t('commercial.success-title')" :style="{ width: '30rem' }">
      <div class="text-center">
        <i class="pi pi-verified text-green-500 text-6xl mb-3"></i>
        <h2 class="mb-2">{{ $t('commercial.success-title') }}</h2>
        <p class="mb-4 text-600">{{ $t('commercial.success-msg') }}</p>
        <pv-button :label="$t('commercial.finish')" class="p-button-success w-full" @click="router.push('/home')" />
      </div>
    </pv-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCommercialStore } from '../../application/commercial-management.store';

const store = useCommercialStore();
const router = useRouter();
const paymentMethod = ref('Visa');
const showSuccess = ref(false);

const confirmOrder = async () => {
  const success = await store.createOrder();
  if (success) {
    showSuccess.value = true;
  }
};
</script>