
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {MonitoringApi} from "../infrastructure/monitoring-api.js";
import {DeviceAssembler} from "../infrastructure/device.assembler.js";
import {FieldAssembler} from "../infrastructure/field.assembler.js";
import {Device} from "../domain/model/device.entity.js";
import {Field} from "../domain/model/field.entity.js";

const monitoringApi = new MonitoringApi();

const useMonitoringStore = defineStore('monitoring', () => {

    const devices = ref([]);

    const fields = ref([]);

    const errors = ref([]);

    const devicesLoaded = ref(false);

    const fieldsLoaded = ref(false);

    const devicesCount = computed(() => {
        return devicesLoaded ? devices.value.length : 0;
    });

    const fieldsCount = computed(() => {
        return fieldsLoaded ? fields.value.length : 0;
    });

    function fetchDevices() {
        console.log('fetchDevices: Iniciando llamada al API...');
        monitoringApi.getDevices().then(response => {
            console.log('fetchDevices: Respuesta recibida', response);
            devices.value = DeviceAssembler.toEntitiesFromResponse(response);
            devicesLoaded.value = true;
            console.log('fetchDevices: Dispositivos cargados', devices.value);
        }).catch(error => {
            console.error('fetchDevices: Error', error);
            errors.value.push(error);
        });
    }

    function fetchFields() {
        console.log('fetchFields: Iniciando llamada al API...');
        monitoringApi.getFields().then(response => {
            console.log('fetchFields: Respuesta recibida', response);
            fields.value = FieldAssembler.toEntitiesFromResponse(response);
            fieldsLoaded.value = true;
            console.log('fetchFields: Zonas de cultivo cargadas', fields.value);
        }).catch(error => {
            console.error('fetchFields: Error', error);
            errors.value.push(error);
        });
    }

    function getDeviceById(id) {
        let idNum = parseInt(id);
        return devices.value.find(device => device["id"] === idNum);
    }

    function addDevice(device) {
        monitoringApi.createDevice(device).then(response => {
            const resource = response.data;
            const newDevice = DeviceAssembler.toEntityFromResource(resource);
            devices.value.push(newDevice);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function updateDevice(device) {
        monitoringApi.updateDevice(device).then(response => {
            const resource = response.data;
            const updatedDevice = DeviceAssembler.toEntityFromResource(resource);
            const index = devices.value.findIndex(c => c["id"] === updatedDevice.id);
            if (index !== -1) devices.value[index] = updatedDevice;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function deleteDevice(device) {
        monitoringApi.deleteDevice(device.id).then(() => {
            const index = devices.value.findIndex(c => c["id"] === device.id);
            if (index !== -1) devices.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function getFieldById(id) {
        let idNum = parseInt(id);
        return fields.value.find(field => field["id"] === idNum);
    }

    function addField(field) {
        monitoringApi.createField(field).then(response => {
            const resource = response.data;
            const newField = FieldAssembler.toEntityFromResource(resource);
            fields.value.push(newField);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function updateField(field) {
        monitoringApi.updateField(field).then(response => {
            const resource = response.data;
            const updatedField = FieldAssembler.toEntityFromResource(resource);
            const index = fields.value.findIndex(t => t["id"] === updatedField.id);
            if (index !== -1) fields.value[index] = updatedField;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function deleteField(field) {
        monitoringApi.deleteField(field.id).then(() => {
            const index = fields.value.findIndex(t => t["id"] === field.id);
            if (index !== -1) fields.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    return {
        devices,
        fields,
        errors,
        devicesLoaded,
        fieldsLoaded,
        devicesCount,
        fieldsCount,
        fetchDevices,
        fetchFields,
        getDeviceById,
        addDevice,
        updateDevice,
        deleteDevice,
        addField,
        updateField,
        deleteField,
        getFieldById
    }
});

export { useMonitoringStore };
