import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const fieldsEndpointPath = import.meta.env.VITE_FIELDS_ENDPOINT_PATH;
const devicesEndpointPath = import.meta.env.VITE_DEVICES_ENDPOINT_PATH;


export class MonitoringApi extends BaseApi {
    #fieldsEndpointPath;
    #devicesEndpointPath;

    constructor() {
        super();
        this.#fieldsEndpointPath = new BaseEndpoint(this, fieldsEndpointPath);
        this.#devicesEndpointPath = new BaseEndpoint(this, devicesEndpointPath);
    }

    getFields() {
        return this.#fieldsEndpointPath.getAll();
    }

    getFieldById(id) {
        return this.#fieldsEndpointPath.getById(id);
    }

    createField(resource) {
        return this.#fieldsEndpointPath.create(resource);
    }

    updateField(resource) {
        return this.#fieldsEndpointPath.update(resource.id, resource);
    }

    deleteField(id) {
        return this.#fieldsEndpointPath.delete(id);
    }

    getDevices() {
        return this.#devicesEndpointPath.getAll();
    }

    getDeviceById(id) {
        return this.#devicesEndpointPath.getById(id);
    }

    createDevice(resource) {
        return this.#devicesEndpointPath.create(resource);
    }

    updateDevice(resource) {
        return this.#devicesEndpointPath.update(resource.id, resource);
    }

    deleteDevice(id) {
        return this.#devicesEndpointPath.delete(id);
    }
}