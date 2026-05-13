import { StockMovementEntity } from '../domain/model/stock-movement.entity.js';

export class StockMovementAssembler {
    static toEntity(dto) {
        return new StockMovementEntity({
            id: dto.id,
            productId: dto.productId,
            type: dto.type,
            quantity: dto.quantity,
            previousStock: dto.previousStock,
            newStock: dto.newStock,
            date: dto.date,
            reason: dto.reason
        });
    }

    static toDto(entity) {
        return {
            productId: entity.productId,
            type: entity.type,
            quantity: entity.quantity,
            previousStock: entity.previousStock,
            newStock: entity.newStock,
            date: entity.date,
            reason: entity.reason
        };
    }
}