export class Lot {
    constructor({ id = '', name = '', cropType = '', humidity = 0, npkStatus = '', image = '' }) {
        this.id = id;
        this.name = name;
        this.cropType = cropType;
        this.humidity = humidity;
        this.npkStatus = npkStatus;
        this.image = image;
    }
}