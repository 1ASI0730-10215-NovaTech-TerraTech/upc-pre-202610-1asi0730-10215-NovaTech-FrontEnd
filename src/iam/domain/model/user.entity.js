/**
 *  Represents Users into bounded.
 *  @class
 */
export class User {
    /**
     * Create an instance of User.
     * @param {Object} object - Object container of user.
     * @param {string} object.id - Unique user identifier.
     * @param {string} object.email - Email address linked to user.
     * @param {string} object.password - Password linked to user.
     */
    constructor({id, email, password}) {
        this.id = id;
        this.email = email;
        this.password = password;
    }
}