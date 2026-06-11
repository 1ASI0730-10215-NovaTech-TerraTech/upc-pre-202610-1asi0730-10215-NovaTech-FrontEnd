/**
 * User resource for transferring data.
 * This is used to securely expose and format data.
 * A confidential field such as password is omitted.
 * @class
 */
export class UserResource {
    /**
     * Create an instance of User resource.
     * @param {Object} object - Object container of user resource.
     * @param {string} object.id - Unique user identifier.
     * @param {string} object.email - Email address linked to user.
     */
    constructor({id, email}){
        this.id = id;
        this.email = email;
    }
}

/**
 * The system response for IAM operations.
 * Encapsulates the operation status, informational message, and the resource data if applicable.
 * @class
 */
export class UserResponse {
    /**
     * Create an instance User response.
     * @param {Object} object - Object container of user response.
     * @param {Object} object.success - Indicate if IAM operation was successful.
     * @param {Object} object.message - Message of the result.
     * @param {Object} object.resourceData - User data resource.
     */
    constructor({success, message, resourceData = null}){
        this.success = success;
        this.message = message;
        this.resourceData = (success && resourceData)?
            new UserResource({id: resourceData.id, email: resourceData.email})
            : null;
    }
}