import {User} from "../domain/model/user.entity.js";
import {UserResource} from "./user.response.js";

/**
 * User assembler transforms the data to transfer to other layers.
 * @class
 */
export class UserAssembler {
    /**
     * Transform resource to entity.
     * Useful to register or update credentials of User.
     * @param {Object} resource - The resource to be transformed.
     * @returns {User|null} An instance of user entity.
     */
    static toEntityFromResource(resource) {
        if (!resource) {
            return null;
        }
        return new User({
            id: resource.id,
            email: resource.email,
            password: resource.password
        });
    }

    /**
     * Transform user to resource.
     * This is to prevent the leakage of sensitive data.
     * @param {Object} user - The entity to be transformed.
     * @returns {UserResource|null} And instance of user resource.
     */
    static toResourceFromEntity(user) {
        if (!user) {
            return null;
        }
        return new UserResource({
            id: user.id,
            email: user.email,
        });
    }
}