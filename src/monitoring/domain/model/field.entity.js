export class Field {

    id;

    profile_id;

    name;

    size_m2;

    soil_type;

    latitude;

    longitude;

    constructor({ id = 0, profile_id = 0, name = '', size_m2 = 0, soil_type = '', latitude = 0, longitude = 0}) {
        this.id = id;
        this.profile_id = profile_id;
        this.name = name;
        this.size_m2 = size_m2;
        this.soil_type = soil_type;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}