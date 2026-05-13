export class Order {
    constructor(id = '', profile_id = '', product_id = '', status = '', total_amount = 0, created_at = '') {
        this.id = id;
        this.profile_id = profile_id;
        this.product_id = product_id;
        this.status = status;
        this.total_amount = total_amount;
        this.created_at = created_at || new Date().toISOString().split('T')[0];
    }
}