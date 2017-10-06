import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CardSet } from './card-set.model';
import { CardSetPopupService } from './card-set-popup.service';
import { CardSetService } from './card-set.service';
import { User, UserService } from '../../shared';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-card-set-dialog',
    templateUrl: './card-set-dialog.component.html'
})
export class CardSetDialogComponent implements OnInit {

    cardSet: CardSet;
    isSaving: boolean;

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private cardSetService: CardSetService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.userService.query()
            .subscribe((res: ResponseWrapper) => { this.users = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.cardSet.id !== undefined) {
            this.subscribeToSaveResponse(
                this.cardSetService.update(this.cardSet));
        } else {
            this.subscribeToSaveResponse(
                this.cardSetService.create(this.cardSet));
        }
    }

    private subscribeToSaveResponse(result: Observable<CardSet>) {
        result.subscribe((res: CardSet) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: CardSet) {
        this.eventManager.broadcast({ name: 'cardSetListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.alertService.error(error.message, null, null);
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-card-set-popup',
    template: ''
})
export class CardSetPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private cardSetPopupService: CardSetPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.cardSetPopupService
                    .open(CardSetDialogComponent as Component, params['id']);
            } else {
                this.cardSetPopupService
                    .open(CardSetDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
