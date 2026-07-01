/**
 * Application service store for the `Notification Management` bounded context.
 * It coordinates notification use cases and keeps a UI-facing state.
 *
 * @module useNotificationStore
 */
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { NotificationManagementApi } from "../infrastructure/notification-management-api.js";
import { NotificationAssembler } from "../infrastructure/notification.assembler.js";
import { Notification } from "../domain/model/notification.entity.js";

const notificationApi = new NotificationManagementApi();

/**
 * Utility function to retry failed requests with exponential backoff
 * @param {Function} fn - The async function to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} delay - Initial delay in ms
 * @returns {Promise} - The result of the function
 */
async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
    let lastError;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            // Si es un error 500, esperamos y reintentamos
            if (error.response?.status === 500) {
                const waitTime = delay * Math.pow(2, attempt);
                console.log(`⚠️ Retry ${attempt + 1}/${maxRetries} in ${waitTime}ms...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            // Si no es 500, lanzamos el error inmediatamente
            throw error;
        }
    }
    throw lastError;
}

/**
 * Reactive store that exposes Notification Management commands and queries.
 *
 * @returns {Object} Store state and actions.
 */
const useNotificationStore = defineStore('notification-management', () => {
    /**
     * List of notification entities.
     * @type {import('vue').Ref<Notification[]>}
     */
    const notifications = ref([]);

    /**
     * List of errors encountered during API operations.
     * @type {import('vue').Ref<Error[]>}
     */
    const errors = ref([]);

    /**
     * Whether notifications have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const notificationsLoaded = ref(false);

    /**
     * Loading state for async operations.
     * @type {import('vue').Ref<boolean>}
     */
    const loading = ref(false);

    /**
     * Number of loaded notifications.
     * @type {import('vue').ComputedRef<number>}
     */
    const notificationsCount = computed(() => {
        return notificationsLoaded.value ? notifications.value.length : 0;
    });

    /**
     * Number of unread notifications.
     * @type {import('vue').ComputedRef<number>}
     */
    const unreadCount = computed(() => {
        return notifications.value.filter(n => !n.is_read).length;
    });

    /**
     * Loads notifications from infrastructure and updates the application state.
     * Uses retry mechanism for 500 errors.
     * @returns {void}
     */
    function fetchNotifications() {
        loading.value = true;
        retryWithBackoff(() => notificationApi.getNotifications(), 3, 1000)
            .then(response => {
                if (response && response.status === 200) {
                    notifications.value = NotificationAssembler.toEntitiesFromResponse(response);
                    notificationsLoaded.value = true;
                    console.log('✅ Notifications loaded:', notifications.value.length);
                }
            })
            .catch(error => {
                console.error('❌ Error fetching notifications after retries:', error);
                errors.value.push(error);
                // Si falla después de reintentos, intentamos usar datos en caché
                if (notifications.value.length === 0) {
                    notifications.value = [];
                    notificationsLoaded.value = true; // Mostrar estado vacío
                }
            })
            .finally(() => {
                loading.value = false;
            });
    }

    /**
     * Finds a notification entity by identifier.
     * @param {number|string} id - Notification identifier.
     * @returns {Notification|undefined} Matching notification, if available.
     */
    function getNotificationById(id) {
        return notifications.value.find(notification => notification.id === id);
    }

    /**
     * Creates a notification through infrastructure and appends it to the local state.
     * @param {Notification} notification - Notification entity to persist.
     * @returns {Promise<boolean>} Success status.
     */
    async function addNotification(notification) {
        loading.value = true;
        try {
            const response = await retryWithBackoff(() => notificationApi.createNotification(notification), 2, 500);
            if (response && (response.status === 200 || response.status === 201)) {
                const resource = response.data;
                const newNotification = NotificationAssembler.toEntityFromResource(resource);
                notifications.value.push(newNotification);
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Error creating notification:', error);
            errors.value.push(error);
            return false;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Updates an existing notification and synchronizes local state.
     * @param {Notification} notification - Notification entity with updated data.
     * @returns {Promise<boolean>} Success status.
     */
    async function updateNotification(notification) {
        loading.value = true;
        try {
            const response = await retryWithBackoff(() => notificationApi.updateNotification(notification), 2, 500);
            if (response && response.status === 200) {
                const resource = response.data;
                const updatedNotification = NotificationAssembler.toEntityFromResource(resource);
                const index = notifications.value.findIndex(n => n.id === updatedNotification.id);
                if (index !== -1) notifications.value[index] = updatedNotification;
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Error updating notification:', error);
            errors.value.push(error);
            return false;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Deletes a notification and removes it from the local state.
     * @param {Notification} notification - Notification entity to remove.
     * @returns {Promise<boolean>} Success status.
     */
    async function deleteNotification(notification) {
        loading.value = true;
        try {
            await retryWithBackoff(() => notificationApi.deleteNotification(notification.id), 2, 500);
            const index = notifications.value.findIndex(n => n.id === notification.id);
            if (index !== -1) notifications.value.splice(index, 1);
            return true;
        } catch (error) {
            console.error('❌ Error deleting notification:', error);
            errors.value.push(error);
            return false;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Marks a notification as read.
     * @param {string|number} id - Notification identifier.
     * @returns {Promise<boolean>} Success status.
     */
    async function markAsRead(id) {
        loading.value = true;
        try {
            // Intentar con reintento
            await retryWithBackoff(() => notificationApi.markAsRead(id), 2, 500);

            // Actualizar estado local manualmente
            const index = notifications.value.findIndex(n => n.id === id);
            if (index !== -1) {
                notifications.value[index] = {
                    ...notifications.value[index],
                    is_read: true
                };
                console.log('✅ Notification marked as read in local state');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Error marking notification as read:', error);
            errors.value.push(error);
            // Aún si falla el backend, actualizamos el estado local para mejor UX
            const index = notifications.value.findIndex(n => n.id === id);
            if (index !== -1) {
                notifications.value[index] = {
                    ...notifications.value[index],
                    is_read: true
                };
                console.log('⚠️ Notification marked as read locally despite API error');
                return true;
            }
            return false;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Marks all notifications as read for the current profile.
     * @param {string} profileId - Profile identifier.
     * @returns {Promise<boolean>} Success status.
     */
    async function markAllAsRead(profileId) {
        loading.value = true;
        try {
            // Obtener todas las notificaciones no leídas del perfil
            const unreadNotifications = notifications.value.filter(
                n => n.profile_id === profileId && !n.is_read
            );

            if (unreadNotifications.length === 0) {
                return true;
            }

            // Marcar cada una como leída con reintentos individuales
            const results = await Promise.allSettled(
                unreadNotifications.map(n => markAsRead(n.id))
            );

            const successCount = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
            console.log(`✅ Marked ${successCount}/${unreadNotifications.length} notifications as read`);

            return successCount > 0;
        } catch (error) {
            console.error('❌ Error marking all as read:', error);
            errors.value.push(error);
            return false;
        } finally {
            loading.value = false;
        }
    }

    return {
        notifications,
        errors,
        loading,
        notificationsLoaded,
        notificationsCount,
        unreadCount,
        fetchNotifications,
        getNotificationById,
        addNotification,
        updateNotification,
        deleteNotification,
        markAsRead,
        markAllAsRead
    }
});

export default useNotificationStore;