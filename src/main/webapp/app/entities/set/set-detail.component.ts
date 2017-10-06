import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { Set } from './set.model';
import { SetService } from './set.service';

@Component({
    selector: 'jhi-set-detail',
    templateUrl: './set-detail.component.html'
})
export class SetDetailComponent implements OnInit, OnDestroy {

    set: Set;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private setService: SetService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSets();
    }

    load(id) {
        this.setService.find(id).subscribe((set) => {
            this.set = set;
        });
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSets() {
        this.eventSubscriber = this.eventManager.subscribe(
            'setListModification',
            (response) => this.load(this.set.id)
        );
    }
}
