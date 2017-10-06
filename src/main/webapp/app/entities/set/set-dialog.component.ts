import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Set } from './set.model';
import { SetPopupService } from './set-popup.service';
import { SetService } from './set.service';
import { CardSet, CardSetService } from '../card-set';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-set-dialog',
    templateUrl: './set-dialog.component.html'
})
export class SetDialogComponent implements OnInit {

    set: Set;
    isSaving: boolean;

    cardsets: CardSet[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private alertService: JhiAlertService,
        private setService: SetService,
        private cardSetService: CardSetService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.cardSetService.query()
            .subscribe((res: ResponseWrapper) => { this.cardsets = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.set.id !== undefined) {
            this.subscribeToSaveResponse(
                this.setService.update(this.set));
        } else {
            this.subscribeToSaveResponse(
                this.setService.create(this.set));
        }
    }

    private subscribeToSaveResponse(result: Observable<Set>) {
        result.subscribe((res: Set) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Set) {
        this.eventManager.broadcast({ name: 'setListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.alertService.error(error.message, null, null);
    }

    trackCardSetById(index: number, item: CardSet) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-set-popup',
    template: ''
})
export class SetPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private setPopupService: SetPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.setPopupService
                    .open(SetDialogComponent as Component, params['id']);
            } else if ( params['card-id'] ){
                this.setPopupService
                    .open(SetDialogComponent as Component, null, params['card-id']);
            } else {
                this.setPopupService
                    .open(SetDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
