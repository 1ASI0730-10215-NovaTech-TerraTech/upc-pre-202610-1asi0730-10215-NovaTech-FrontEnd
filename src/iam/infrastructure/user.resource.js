/**
 * Infrastructure resource representing a user as returned by REST API.
 */
export class UserResource {
    /**
     * @param {Object} params
     * @param {string} params.id - User identifier
     * @param {string} params.email - User email
     * @param {string} params.password_hash - Hashed password
     */
    constructor({ id, email, password_hash }) {
        this.id = id;
        this.email = email;
        this.password_hash = password_hash;
    }
}