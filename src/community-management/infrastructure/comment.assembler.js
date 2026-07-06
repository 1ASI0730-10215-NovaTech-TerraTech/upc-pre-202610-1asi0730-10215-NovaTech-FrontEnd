import { Comment } from "../domain/model/comment.entity.js";

/**
 * Maps comment resources into domain entities.
 *
 * @class CommentAssembler
 */
export class CommentAssembler {
    /**
     * Maps resource to Comment entity matching the Entity constructor.
     * * @param {Object} resource - Comment resource payload from the API.
     * @returns {Comment} Comment entity.
     */
    static toEntityFromResource(resource) {
        return new Comment({
            id: resource.id,
            author_profile_id: resource.authorProfileId,
            target_profile_id: resource.targetProfileId,
            content: resource.content,
            rating: resource.rating,
            created_at: resource.createdAt
        });
    }

    /**
     * Parses comment resources from an HTTP response.
     * * @param {Object} response - HTTP response containing the comments data.
     * @returns {Comment[]} Array of Comment entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return [];
        let resources = response.data;
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}