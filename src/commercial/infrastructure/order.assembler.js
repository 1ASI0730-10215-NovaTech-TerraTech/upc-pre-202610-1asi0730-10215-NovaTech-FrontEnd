import { Order } from "../domain/model/order.entity";

export class OrderAssembler {
    static toEntity(resource) {
        return new Order(resource.id, resource.profile_id, resource.product_id, resource.status, resource.total_amount, resource.created_at);
    }
}