import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';
import { BaseApi } from '../../shared/infrastructure/base-api.js';

const baseApi = new BaseApi();
const endpointPath = import.meta.env.VITE_INVENTORY_ENDPOINT_PATH;

export class StockApi extends BaseEndpoint {
    constructor() {
        super(baseApi, endpointPath);
    }

    async addProduct(productData) {
        return this.create(productData);
    }

    async discountProduct(id, quantity) {
        return this.update(id, { quantity, operation: 'discount' });
    }
}