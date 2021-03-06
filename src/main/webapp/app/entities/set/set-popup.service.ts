import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Set } from './set.model';
import { SetService } from './set.service';
import {CardSetService} from "../card-set/card-set.service";

@Injectable()
export class SetPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private setService: SetService,
        private cardSetService: CardSetService,

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any, cardId?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id && id != null) {
                this.setService.find(id).subscribe((set) => {
                    this.ngbModalRef = this.setModalRef(component, set);
                    resolve(this.ngbModalRef);
                });
            } else if (cardId) {
                this.cardSetService.find(cardId).subscribe((cardSet) => {
                    var set = new Set();
                    set.cardset = cardSet;
                    this.ngbModalRef = this.setModalRef(component, set);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.setModalRef(component, new Set());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    setModalRef(component: Component, set: Set): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.set = set;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
