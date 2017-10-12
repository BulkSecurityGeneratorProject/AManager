import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AManagerCardSetModule } from './card-set/card-set.module';
import { AManagerSetModule } from './set/set.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        AManagerCardSetModule,
        AManagerSetModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AManagerEntityModule {}
