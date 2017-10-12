import { BaseEntity } from './../../shared';

export class Set implements BaseEntity {
    constructor(
        public id?: number,
        public title?: string,
        public content?: any,
        public cardset?: BaseEntity,
    ) {
    }
}
