import { Report } from '../domain/model/report.entity.js';

/**
 * Assembler for converting API resources into Report entities.
 *
 * Decouples the infrastructure layer from the domain layer.
 *
 * @class ReportAssembler
 */
export class ReportAssembler {

    /**
     * Converts a resource (plain object) into a Report entity.
     *
     * @static
     * @param {Object} resource - Object with report data
     * @returns {Report} Report instance with resource data
     */
    static toEntityFromResource(resource) {
        return new Report({ ...resource });
    }

    /**
     * Converts an API response into an array of Report entities.
     *
     * @static
     * @param {import('axios').AxiosResponse} response - API response
     * @returns {Report[]} Array of Report entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            return [];
        }
        let resources = response.data instanceof Array ? response.data
            : response.data['report'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}