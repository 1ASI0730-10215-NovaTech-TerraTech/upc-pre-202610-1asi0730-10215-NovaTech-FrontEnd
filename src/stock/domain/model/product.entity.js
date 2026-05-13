export class ProductEntity {
    constructor({ id, productName, quantity, unit, minimumStock, lastUpdated }) {
        this.id = id;
        this.productName = productName;
        this.quantity = quantity;
        this.unit = unit;
        this.minimumStock = minimumStock;
        this.lastUpdated = lastUpdated;
    }

    isLowStock() {
        return this.minimumStock && this.quantity <= this.minimumStock;
    }

    canDiscount(amount) {
        return this.quantity >= amount;
    }
}