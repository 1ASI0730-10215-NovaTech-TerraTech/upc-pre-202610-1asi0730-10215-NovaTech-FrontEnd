export class StockMovementEntity {
    constructor({ id, productId, type, quantity, previousStock, newStock, date, reason }) {
        this.id = id;
        this.productId = productId;
        this.type = type;
        this.quantity = quantity;
        this.previousStock = previousStock;
        this.newStock = newStock;
        this.date = date;
        this.reason = reason;
    }
}