import { BaseEntity, User } from './../../shared';

export class CardSet implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public user?: User,
    ) {
    }
}
