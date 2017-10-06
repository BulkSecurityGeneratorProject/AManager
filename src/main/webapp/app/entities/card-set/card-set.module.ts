import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AManagerSharedModule } from '../../shared';
import { AManagerAdminModule } from '../../admin/admin.module';
import {
    CardSetService,
    CardSetPopupService,
    CardSetComponent,
    CardSetDetailComponent,
    CardSetDialogComponent,
    CardSetPopupComponent,
    CardSetDeletePopupComponent,
    CardSetDeleteDialogComponent,
    cardSetRoute,
    cardSetPopupRoute,
} from './';

const ENTITY_STATES = [
    ...cardSetRoute,
    ...cardSetPopupRoute,
];

@NgModule({
    imports: [
        AManagerSharedModule,
        AManagerAdminModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        CardSetComponent,
        CardSetDetailComponent,
        CardSetDialogComponent,
        CardSetDeleteDialogComponent,
        CardSetPopupComponent,
        CardSetDeletePopupComponent,
    ],
    entryComponents: [
        CardSetComponent,
        CardSetDialogComponent,
        CardSetPopupComponent,
        CardSetDeleteDialogComponent,
        CardSetDeletePopupComponent,
    ],
    providers: [
        CardSetService,
        CardSetPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AManagerCardSetModule {}
