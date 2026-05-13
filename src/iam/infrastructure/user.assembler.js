import {User} from "../domain/model/user.entity.js";

/**
 * Transforming data from external source, in this case MockUp
 */
export class UserAssembler {
    /**
     * Converts a plain object into an instance of the User entity.
     * @param  resource - The raw user data.
     * @returns {User} A new instance of the User entity.
     */
    static toEntityFromResource(resource) {
        return new User({...resource});
    }

    /**
     * Processes a complete HTTP response to extract and convert multiple users.
     * @param {import('axios').AxiosResponse<Object>} response - HTTP response from users endpoint.
     * @returns {User[]} An array of User.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : (response.data['users'] || []);
        return resources.map(resource=>this.toEntityFromResource(resource));
    }
}