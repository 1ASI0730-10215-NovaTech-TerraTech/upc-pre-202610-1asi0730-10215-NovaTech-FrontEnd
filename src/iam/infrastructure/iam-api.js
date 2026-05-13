import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const usersEndpointPath = import.meta.env.VITE_USERS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for IAM bounded-context
 * Only interacts with the user endpoint.
 */
export class IamApi extends BaseApi{
    #usersEndpoint;

    constructor(){
        super();
        this.#usersEndpoint = new BaseEndpoint(this, usersEndpointPath);
    }

    /**
     * Retrieves all users from the API via GET
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>>>}
     */
    getUsers(){
        return this.#usersEndpoint.getAll();
    }

    /**
     * Creates a new user via POST
     * @param {Object} userData - Data for the new user (e.g., { email, password_hash })
     * @returns {Promise<import('axios').AxiosResponse<Object>>}
     */
    createUser(userData){
        return this.#usersEndpoint.create(userData);
    }
}