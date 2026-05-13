/**
 * Represents a monitoring device in the system.
 *
 * This class encapsulates device data including its unique identifier,
 * MAC address, operational status, and last synchronization timestamp.
 *
 * @class Device
 * @example
 * const device = new Device({
 *   id: 'dev_001',
 *   mac_address: 'AA:BB:CC:00:11:22',
 *   status: 'ONLINE',
 *   last_sync: '2026-05-13T10:00:00Z'
 * });
 */
export class Device {
    /**
     * Unique device identifier.
     * @type {string|null}
     */
    id;

    /**
     * MAC (Media Access Control) address of the device.
     * Format: XX:XX:XX:XX:XX:XX
     * @type {string}
     */
    mac_address;

    /**
     * Device operational status.
     * Possible values: 'ONLINE', 'OFFLINE', 'LOW_BATTERY'
     * @type {string}
     */
    status;

    /**
     * Timestamp of the last device synchronization.
     * ISO 8601 format
     * @type {string}
     */
    last_sync;

    /**
     * Creates a new Device instance.
     *
     * @constructor
     * @param {Object} params - Device parameters
     * @param {string|null} [params.id=null] - Unique device identifier
     * @param {string} [params.mac_address=''] - Device MAC address
     * @param {string} [params.status=''] - Device operational status
     * @param {string} [params.last_sync=''] - Last synchronization timestamp
     */
    constructor({id = null, mac_address = '', status = '', last_sync = '' }){
        this.id = id;
        this.mac_address = mac_address;
        this.status = status;
        this.last_sync = last_sync;
    }
}