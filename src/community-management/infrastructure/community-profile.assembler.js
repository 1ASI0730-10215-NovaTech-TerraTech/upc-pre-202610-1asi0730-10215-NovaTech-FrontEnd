import { CommunityProfile } from "../domain/model/community-profile.entity.js";

/**
 * Maps community profile resources into domain entities.
 *
 * @class CommunityProfileAssembler
 */
export class CommunityProfileAssembler {
    /**
     * Maps resource to CommunityProfile entity using snake_case to match the Entity constructor.
     * @param {Object} resource - Community profile resource payload.
     * @returns {CommunityProfile} CommunityProfile entity.
     */
    static toEntityFromResource(resource) {
        return new CommunityProfile({
            id: resource.id,
            profile_id: resource.profileId,
            nickname: resource.nickname,
            reputation_score: resource.reputationScore,
            public_bio: resource.publicBio,
            visibility_status: resource.visibilityStatus === 1
        });
    }

    /**
     * Parses community profile resources from a response.
     * @param {Object} response - HTTP response.
     * @returns {CommunityProfile[]} CommunityProfile entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return [];
        let resources = response.data;
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}