import {Field} from "../domain/model/field.entity.js";

export class FieldAssembler {

    static toEntityFromResource(resource) {
        return new Field({...resource});
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data
            : response.data['field'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}