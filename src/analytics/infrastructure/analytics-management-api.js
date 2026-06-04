import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const analyticsEndpointPath = import.meta.env.VITE_REPORTS_ENDPOINT_PATH;

/**
 * API client for the analytics management module.
 *
 * This class provides methods to perform read operations
 * on analytical data reports through a REST API.
 *
 * It extends BaseApi and uses BaseEndpoint to handle routes generically.
 *
 * @class AnalyticsManagementApi
 * @extends BaseApi
 *
 * @property {BaseEndpoint} #analyticsEndpointPath
 * Private endpoint for analytics report operations.
 */
export class AnalyticsManagementApi extends BaseApi {
    #analyticsEndpointPath;

    /**
     * Creates a new instance of AnalyticsManagementApi.
     *
     * Initializes the endpoint for analytics reports
     * using the route configured in the environment variables.
     *
     * @constructor
     */
    constructor() {
        super();
        this.#analyticsEndpointPath = new BaseEndpoint(this, analyticsEndpointPath);
    }

    /**
     * Retrieves all analytical reports.
     *
     * @async
     * @returns {Promise<import('axios').AxiosResponse<Report[]>>}
     * Response containing an array of analytical reports.
     *
     * @example
     * try {
     * const response = await api.getReports();
     * console.log(response.data); // Array of reports
     * } catch (error) {
     * console.error('Error:', error);
     * }
     */
    getReports() {
        return this.#analyticsEndpointPath.getAll();
    }
}