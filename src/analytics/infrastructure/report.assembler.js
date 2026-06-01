import { Report } from '../domain/model/report.entity.js';

export class ReportAssembler {
    static toEntityFromResource(resource) {
        return new Report({
            id: resource.id,
            device_id: resource.device_id,
            generated_at: resource.generated_at,
            mean_value: resource.mean_value,
            variance: resource.variance,
            standard_deviation: resource.standard_deviation,
            technical_interpretation: resource.technical_interpretation
        });
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['report'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}