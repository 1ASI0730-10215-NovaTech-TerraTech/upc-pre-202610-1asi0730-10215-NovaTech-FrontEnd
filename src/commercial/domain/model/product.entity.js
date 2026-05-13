export class Product {
    constructor(id = 0, name = '', description = '', price = 0, type = '', imageUrl = '') {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.type= type;
        this.imageUrl = imageUrl;
    }
}