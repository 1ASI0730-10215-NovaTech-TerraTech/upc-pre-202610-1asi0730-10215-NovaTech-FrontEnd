export class Device {
    constructor({id = null, mac_address = '', status = '', last_sync = '' }){
        this.id = id;
        this.mac_address = mac_address;
        this.status = status;
        this.last_sync = last_sync;
    }
}