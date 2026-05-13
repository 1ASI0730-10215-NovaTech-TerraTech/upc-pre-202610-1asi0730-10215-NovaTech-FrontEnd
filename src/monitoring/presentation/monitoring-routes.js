/**
 * Lazy-loaded monitoring module components for route definitions.
 *
 * @type {Function}
 * @description Component loader for device list view
 */
const deviceList = () => import('./views/device-list.vue');

/**
 * Component loader for device form view (create/edit)
 * @type {Function}
 */
const deviceForm = () => import('./views/device-form.vue');

/**
 * Component loader for field list view
 * @type {Function}
 */
const fieldList = () => import('./views/field-list.vue');

/**
 * Component loader for field form view (create/edit)
 * @type {Function}
 */
const fieldForm = () => import('./views/field-form.vue');

/**
 * Child routes exposed by the Monitoring presentation layer.
 *
 * These routes define the navigation paths for device and field management
 * within the monitoring module. Each route is lazy-loaded for optimal performance.
 *
 * Routes:
 * - `/devices` - List all devices
 * - `/devices/new` - Create new device
 * - `/devices/:id/edit` - Edit existing device
 * - `/fields` - List all fields
 * - `/fields/new` - Create new field
 * - `/fields/:id/edit` - Edit existing field
 *
 * @type {import('vue-router').RouteRecordRaw[]}
 *
 * @example
 * // Used in router configuration
 * const routes = [
 *   {
 *     path: '/monitoring',
 *     children: monitoringRoutes
 *   }
 * ];
 */
const monitoringRoutes = [
    {   path: 'devices',             name: 'monitoring-devices',      component: deviceList, meta: {title: 'Devices'}},
    {   path: 'devices/new',         name: 'monitoring-device-new',    component: deviceForm, meta: {title: 'New Device'}},
    {   path: 'devices/:id/edit',    name: 'monitoring-device-edit',   component: deviceForm, meta: {title: 'Edit Device'}},
    {   path: 'fields',              name: 'monitoring-fields',       component: fieldList, meta: {title: 'Fields'}},
    {   path: 'fields/new',          name: 'monitoring-field-new',    component: fieldForm, meta: {title: 'New Fields'}},
    {   path: 'fields/:id/edit',     name: 'monitoring-field-edit',   component: fieldForm, meta: {title: 'Edit Fields'}}
];

export default monitoringRoutes;