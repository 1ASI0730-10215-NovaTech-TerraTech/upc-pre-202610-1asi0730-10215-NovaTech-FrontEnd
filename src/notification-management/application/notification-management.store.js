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
     * @returns {void}
     */
    function fetchNotifications() {
        loading.value = true;
        notificationApi.getNotifications().then(response => {
            notifications.value = NotificationAssembler.toEntitiesFromResponse(response);
            notificationsLoaded.value = true;
            console.log('Notifications loaded:', notifications.value);
        }).catch(error => {
            errors.value.push(error);
        }).finally(() => {
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
            const response = await notificationApi.createNotification(notification);
            const resource = response.data;
            const newNotification = NotificationAssembler.toEntityFromResource(resource);
            notifications.value.push(newNotification);
            return true;
        } catch (error) {
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
            const response = await notificationApi.updateNotification(notification);
            const resource = response.data;
            const updatedNotification = NotificationAssembler.toEntityFromResource(resource);
            const index = notifications.value.findIndex(n => n.id === updatedNotification.id);
            if (index !== -1) notifications.value[index] = updatedNotification;
            return true;
        } catch (error) {
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
            await notificationApi.deleteNotification(notification.id);
            const index = notifications.value.findIndex(n => n.id === notification.id);
            if (index !== -1) notifications.value.splice(index, 1);
            return true;
        } catch (error) {
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
            // El backend responde con 200 OK pero sin contenido
            // Actualizamos manualmente el estado local
            const response = await notificationApi.markAsRead(id);
            console.log('Mark as read response:', response);

            const index = notifications.value.findIndex(n => n.id === id);
            if (index !== -1) {
                notifications.value[index] = {
                    ...notifications.value[index],
                    is_read: true
                };
                console.log('Notification marked as read in local state');
            }
            return true;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            errors.value.push(error);
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

            // Marcar cada una como leída usando el método markAsRead
            await Promise.all(unreadNotifications.map(n => markAsRead(n.id)));

            // Actualizar el estado local (aunque markAsRead ya lo hace, pero por si acaso)
            notifications.value = notifications.value.map(n => {
                if (n.profile_id === profileId && !n.is_read) {
                    return { ...n, is_read: true };
                }
                return n;
            });
            return true;
        } catch (error) {
            console.error('Error marking all as read:', error);
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