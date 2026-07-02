import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { CommunityManagementApi } from '../infrastructure/community-management.api.js';
import { CommunityProfileAssembler } from '../infrastructure/community-profile.assembler.js';
import { CommentAssembler } from '../infrastructure/comment.assembler.js';


/**
 * API service instance for community management.
 * @type {CommunityManagementApi}
 */
const api = new CommunityManagementApi();

/**
 * Reactive store that exposes Community Management commands and queries.
 *
 * @returns {Object} Store state, computed properties, and actions.
 */
export const useCommunityManagementStore = defineStore('communityManagement', () => {

    const profiles = ref([]);
    const profilesLoaded = ref(false);

    const comments = ref([]);
    const commentsLoaded = ref(false);

    const errors = ref([]);

    const profilesCount = computed(() => {
        return profilesLoaded.value ? profiles.value.length : 0;
    });

    /**
     * Loads community profiles from infrastructure and updates the application state.
     * @returns {Promise<void>}
     */
    function fetchProfiles() {
        return api.getCommunityProfiles().then(response => {
            profiles.value = CommunityProfileAssembler.toEntitiesFromResponse(response);
            profilesLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
            profilesLoaded.value = true;
        });
    }

    /**
     * Finds a profile entity by identifier.
     * @param {number|string} id - Profile identifier.
     * @returns {CommunityProfile|undefined} Matching profile, if available.
     */
    function getProfileById(id) {
        return profiles.value.find(p => p.id === id);
    }

    /**
     * Creates a profile through infrastructure and appends it to the local state.
     * @param {Object} profile - Profile data to persist.
     */
    function addProfile(profile) {
        const payload = {
            profileId: parseInt(profile.profile_id) || 1,
            nickname: profile.nickname,
            reputationScore: parseInt(profile.reputation_score) || 0,
            publicBio: profile.public_bio,
            visibilityStatus: profile.visibility_status ? 1 : 0
        };

        return api.createCommunityProfile(payload).then(response => {
            const newProfile = CommunityProfileAssembler.toEntityFromResource(response.data);
            profiles.value.push(newProfile);
            return true;
        }).catch(error => {
            errors.value.push(error);
            return false;
        });
    }

    /**
     * Updates an existing profile and synchronizes local state.
     * @param {Object} profile - Profile entity with updated data.
     */
    function updateProfile(profile) {

        const payload = {
            nickname: profile.nickname,
            reputationScore: parseInt(profile.reputation_score) || 0,
            publicBio: profile.public_bio,
            visibilityStatus: profile.visibility_status ? 1 : 0
        };

        return api.updateCommunityProfile(profile.id, payload)
            .then(response => {
                const updatedProfile = CommunityProfileAssembler.toEntityFromResource(response.data);
                const index = profiles.value.findIndex(p => p.id === updatedProfile.id);
                if (index !== -1) {
                    profiles.value[index] = updatedProfile;
                }
                return true;
            })
            .catch(error => {
                errors.value.push(error);
                return false;
            });
    }

    /**
     * Deletes a profile and removes it from the local state.
     * @param {Object} profile - Profile entity to remove.
     */
    function deleteProfile(profile) {
        return api.deleteCommunityProfile(profile.id).then(() => {
            const index = profiles.value.findIndex(p => p.id === profile.id);
            if (index !== -1) {
                profiles.value.splice(index, 1);
            }
            return true;
        }).catch(error => {
            errors.value.push(error);
            return false;
        });
    }

    /**
     * Loads comments from infrastructure and updates the application state.
     * @returns {Promise<void>}
     */

    function fetchComments(targetProfileId) {
        return api.getCommentsByTarget(targetProfileId).then(response => {

            const newComments = CommentAssembler.toEntitiesFromResponse(response);
            const otherComments = comments.value.filter(c => c.target_profile_id !== targetProfileId);
            comments.value = [...otherComments, ...newComments];
            commentsLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
            commentsLoaded.value = true;
        });
    }

    /**
     * Filters and retrieves comments directed to a specific profile.
     * @param {string} targetProfileId - Identifier of the profile receiving the comments.
     * @returns {Array} List of comments associated with the target profile.
     */

    function getCommentsByTargetProfileId(targetProfileId) {
        return comments.value.filter(c => c.target_profile_id === targetProfileId);
    }

    /**
     * Creates a comment through infrastructure and appends it to the local state.
     * @param {Object} commentData - Comment data to persist.
     * @returns {Promise<boolean>} True if the comment was successfully created, false otherwise.
     */

    function addComment(commentData) {

        const payload = {
            authorProfileId: parseInt(commentData.author_profile_id) || 1, // Entero
            targetProfileId: parseInt(commentData.target_profile_id), // Entero
            content: commentData.content,
            rating: parseInt(commentData.rating) || 0
        };

        return api.createComment(payload).then(response => {
            const newComment = CommentAssembler.toEntityFromResource(response.data);
            comments.value.push(newComment);
            return true;
        }).catch(error => {
            errors.value.push(error);
            return false;
        });
    }

    return {
        profiles,
        profilesLoaded,
        errors,
        profilesCount,
        fetchProfiles,
        getProfileById,
        addProfile,
        updateProfile,
        deleteProfile,
        comments,
        commentsLoaded,
        fetchComments,
        getCommentsByTargetProfileId,
        addComment
    };
});