export class Field {
    constructor({ id = null, name = '', size_m2 = '', soil_type = '', location_lat_long = ''  }) {
        this.id = id;
        this.name = name;
        this.size_m2 = size_m2;
        this.soil_type = soil_type;
        this.location_lat_long = location_lat_long;
    }
}