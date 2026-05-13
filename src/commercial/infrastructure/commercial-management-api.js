import { BaseApi } from "../../shared/infrastructure/base-api";

export class CommercialManagementApi extends BaseApi {
    constructor() {
        super();
    }


    getProducts() {
        return this.http.get('/products');
    }


    getOrders() {
        return this.http.get('/orders');
    }


    createOrder(orderData) {
        return this.http.post('/orders', orderData);
    }
}