import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { CardSet } from './card-set.model';
import { CardSetPopupService } from './card-set-popup.service';
import { CardSetService } from './card-set.service';

@Component({
    selector: 'jhi-card-set-delete-dialog',
    templateUrl: './card-set-delete-dialog.component.html'
})
export class CardSetDeleteDialogComponent {

    cardSet: CardSet;

    constructor(
        private cardSetService: CardSetService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.cardSetService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'cardSetListModification',
                content: 'Deleted an cardSet'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-card-set-delete-popup',
    template: ''
})
export class CardSetDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private cardSetPopupService: CardSetPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.cardSetPopupService
                .open(CardSetDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
