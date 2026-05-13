/**
 * Entity representing an authenticated user within the IAM bounded context.
 * Contains only non-sensitive data that can safely be stored in the frontend state.
 */
export class User {
    /**
     * @param {Object} params
     * @param {string} params.id - Unique identifier
     * @param {string} params.email - Email address
     * @param {string} params.password_hash - Password linked user
     */
    constructor({ id, email, password_hash}) {
        this.id = id;
        this.email = email;
        this.password_hash = password_hash;
    }
}