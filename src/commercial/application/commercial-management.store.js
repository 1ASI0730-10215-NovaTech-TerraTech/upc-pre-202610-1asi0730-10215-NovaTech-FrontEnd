import { defineStore } from 'pinia';
import { CommercialManagementApi } from "../infrastructure/commercial-management-api";
import { ProductAssembler } from "../infrastructure/product.assembler";

const apiService = new CommercialManagementApi();

export const useCommercialStore = defineStore('commercial-management', {
    state: () => ({
        products: [],
        selectedProduct: null,
        loading: false
    }),
    actions: {
        async fetchProducts() {
            this.loading = true;
            try {
                const response = await apiService.getProducts();
                this.products = response.data.map(p => ProductAssembler.toEntity(p));
            } catch (error) {

            } finally {
                this.loading = false;
            }
        },

        selectProduct(product) {
            this.selectedProduct = product;
        },

        async createOrder() {
            if (!this.selectedProduct) return;
            try {
                const orderData = {
                    productId: this.selectedProduct.id,
                    productName: this.selectedProduct.name,
                    amount: this.selectedProduct.price,
                    date: new Date().toLocaleDateString(),
                    status: 'PAID'
                };
                await apiService.createOrder(orderData);
                return true;
            } catch (error) {

                return false;
            }
        }
    }
});