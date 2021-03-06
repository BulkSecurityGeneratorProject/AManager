import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AManagerSharedModule } from '../../shared';
import {
    SetService,
    SetPopupService,
    SetComponent,
    SetDetailComponent,
    SetDialogComponent,
    SetPopupComponent,
    SetDeletePopupComponent,
    SetDeleteDialogComponent,
    setRoute,
    setPopupRoute,
} from './';

const ENTITY_STATES = [
    ...setRoute,
    ...setPopupRoute,
];

@NgModule({
    imports: [
        AManagerSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        SetComponent,
        SetDetailComponent,
        SetDialogComponent,
        SetDeleteDialogComponent,
        SetPopupComponent,
        SetDeletePopupComponent,
    ],
    entryComponents: [
        SetComponent,
        SetDialogComponent,
        SetPopupComponent,
        SetDeleteDialogComponent,
        SetDeletePopupComponent,
    ],
    providers: [
        SetService,
        SetPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AManagerSetModule {}
