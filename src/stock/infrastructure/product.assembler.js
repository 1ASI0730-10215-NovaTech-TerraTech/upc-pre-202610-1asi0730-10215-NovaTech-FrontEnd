import { ProductEntity } from '../domain/model/product.entity.js';

export class ProductAssembler {
    static toEntity(dto) {
        return new ProductEntity({
            id: dto.id,
            productName: dto.productName,
            quantity: dto.quantity,
            unit: dto.unit,
            minimumStock: dto.minimumStock || 0,
            lastUpdated: dto.lastUpdated || new Date().toISOString()
        });
    }

    static toDto(entity) {
        return {
            productName: entity.productName,
            quantity: entity.quantity,
            unit: entity.unit,
            minimumStock: entity.minimumStock
        };
    }
}