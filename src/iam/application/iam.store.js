import {IamApi} from "../infrastructure/iam-api.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {UserResponse} from "../infrastructure/user.response.js";
import {UserAssembler} from "../infrastructure/user.assembler.js";

const iamApi = new IamApi();

/**
 * IAM Store - Centralized state management for Identity and Access Management.
 *
 * This Pinia store manages the authentication state, session tracking,
 * and user registration/login workflows for the TerraTech platform.
 *
 * @type {Object} Store instance with state and actions.
 */
const useIamStore = defineStore('iam', () => {
    /**
     * The currently authenticated user resource. Null if guest.
     */
    const currentUser = ref(null);

    /**
     * Array of error objects encountered during IAM operations.
     */
    const errors = ref([]);

    /**
     * Computed property that return whether a user is currently logged in.
     */
    const isAuthenticated = computed(() => {
        return currentUser.value !== null;
    });

    /**
     * Internal helper to generate sequential ID for new users.
     * TODO: delete this function when backend is implemented.
     * @returns {string} Generate ID with format: user_Number.
     * @private
     */
    function __generateId(){
        return `usr_${Math.floor(1000 + Math.random() * 9000)}`;
    }

    /**
     * Authenticates a user by checking credentials against the database.
     * @param {string} email - User email address.
     * @param {string} password - User password.
     * @returns {Promise<UserResponse>} Custom response object with execution details.
     */
    function login(email, password) {
        return iamApi.findByEmail(email).then(result => {
            const usersFound = result.data;

            if (usersFound.length === 0) {
                return new UserResponse({
                    success: false,
                    message: "Email doesn't exists."
                });
            }

            const dbUser = usersFound[0];

            if (dbUser.password !== password) {
                return new UserResponse({
                    success: false,
                    message: "Passwords do not match."
                });
            }

            currentUser.value = UserAssembler.toResourceFromEntity(dbUser);

            return new UserResponse({
                success: true,
                message: "Successfully logged in.",
                resourceData: dbUser
            });
        }).catch(error => {
            error.value.push(error);
            return new UserResponse({
                success: false,
                message: "Failed to log in."
            });
        });
    }

    /**
     * Registers a new user if the email is available.
     * @param {string} email - New user email address.
     * @param {string} password - New user password
     * @returns {Promise<UserResponse>|Promise<Awaited<UserResponse>>} Custom response object with execution details.
     */
    function register(email, password) {
        if (!email.includes("@") || password.length < 6) {
            return Promise.resolve(new UserResponse({
                success: false,
                message: "Invalid Format. Email or password are invalid."
            }))
        }

        return iamApi.findByEmail(email).then(result => {
            const usersFound = result.data;

            if (usersFound.length > 0){
                return new UserResponse({
                    success: false,
                    message: "Email already exists."
                });
            }

            const newUserPayload = {
                id: __generateId(),
                email: email,
                password: password
            };

            return iamApi.create(newUserPayload).then(createResponse => {
                const registeredUser = createResponse.data;

                return new UserResponse({
                    success: true,
                    message: "Successfully registered.",
                    resourceData: registeredUser
                });
            })
        }).catch(error => {
            error.value.push(error);
            return new UserResponse({
                success: false,
                message: "Failed to register.",
            });
        });
    }

    /**
     * Clears the authentication state, logging out current user.
     */
    function logout() {
        currentUser.value = null;
    }

    return {
        currentUser,
        errors,
        isAuthenticated,
        login,
        register,
        logout
    };
});

export { useIamStore };