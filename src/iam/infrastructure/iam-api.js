import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";
import {BaseApi} from "../../shared/infrastructure/base-api.js";
const userPath = import.meta.env.VITE_USERS_ENDPOINT_PATH;

/**
 * API client for the IAM module.
 * This class provides methods to perform operations on users through a REST api.
 * Extends BaseApi and uses BaseEndpoint to handle routes generically.
 *
 * @class IamApi
 * @extends BaseApi
 *
 * @property {BaseEndpoint} #userPath
 * Private endpoint for user operations.
 */
export class IamApi extends BaseApi {
    #userPath;

    /**
     * Create a new instance of IamApi.
     * Initializes the endpoint for users using the route configured in the environment variables.
     */
    constructor() {
        super();
        this.#userPath = new BaseEndpoint(this, userPath);
    }

    /**
     * Search user by email in database.
     * @param {string} email - Email linked to user.
     * @returns {Promise<axios.AxiosResponse<any>>} - HTTP response with user's email linked to their contact list.
     */
    findByEmail(email) {
        return this.http.get(`${userPath}?email=${email}`);
    }

    /**
     * Register new users in database.
     * @param userPayload - User data to registered.
     * @returns {userPayload} - HTTP response with user registered.
     */
    create(userPayload) {
        return this.#userPath.create(userPayload);
    }
}