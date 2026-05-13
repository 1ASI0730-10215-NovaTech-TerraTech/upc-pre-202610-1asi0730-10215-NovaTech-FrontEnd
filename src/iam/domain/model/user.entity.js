/**
 * Entity representing an authenticated user within the IAM bounded context.
 * Contains only non-sensitive data that can safely be stored in the frontend state.
 */
export class User {
    /**
     * @param {Object} params
     * @param {string} params.id - Unique identifier
     * @param {string} params.email - Email address
     */
    constructor({ id, email }) {
        this.id = id;
        this.email = email;
    }
}