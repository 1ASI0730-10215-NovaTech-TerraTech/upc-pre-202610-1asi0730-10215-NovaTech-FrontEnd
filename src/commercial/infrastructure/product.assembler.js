import { Product } from "../domain/model/product.entity";

export class ProductAssembler {
    static toEntity(resource) {
        return new Product(resource.id, resource.name, resource.description, resource.price, resource.category, resource.imageUrl);
    }
}