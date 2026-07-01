import { Inventory } from "../domain/model/inventory.entity.js";

/**
 * Maps inventory resources into domain entities.
 *
 * @class InventoryAssembler
 */
export class InventoryAssembler {

    /**
     * @param {Object} resource - Inventory resource payload.
     * @returns {Inventory} Inventory entity.
     */
    static toEntityFromResource(resource) {
        // El backend devuelve en camelCase: productId, stockQuantity, warehouseLocation
        return new Inventory({
            id: resource.id,
            product_id: resource.productId || resource.product_id,
            stock_quantity: resource.stockQuantity || resource.stock_quantity,
            warehouse_location: resource.warehouseLocation || resource.warehouse_location
        });
    }

    /**
     * Parses inventory resources from a response and maps them into entities.
     *
     * @param {import('axios').AxiosResponse<Array<Object>|Object>} response - HTTP response with inventory resources.
     * @returns {Inventory[]} Inventory entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }

        let resources = response.data;
        if (!Array.isArray(resources)) {
            resources = response.data['inventories'] || response.data['inventory'] || [];
        }

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}