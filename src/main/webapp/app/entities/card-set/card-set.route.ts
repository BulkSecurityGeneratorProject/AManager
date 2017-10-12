import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CardSetComponent } from './card-set.component';
import { CardSetDetailComponent } from './card-set-detail.component';
import { CardSetPopupComponent } from './card-set-dialog.component';
import { CardSetDeletePopupComponent } from './card-set-delete-dialog.component';

export const cardSetRoute: Routes = [
    {
        path: 'card-set',
        component: CardSetComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'aManagerApp.cardSet.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'card-set/:id',
        component: CardSetDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'aManagerApp.cardSet.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const cardSetPopupRoute: Routes = [
    {
        path: 'card-set-new',
        component: CardSetPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'aManagerApp.cardSet.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'card-set/:id/edit',
        component: CardSetPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'aManagerApp.cardSet.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'card-set/:id/delete',
        component: CardSetDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'aManagerApp.cardSet.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
