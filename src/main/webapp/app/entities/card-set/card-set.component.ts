import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiLanguageService, JhiAlertService } from 'ng-jhipster';

import { CardSet } from './card-set.model';
import { CardSetService } from './card-set.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-card-set',
    templateUrl: './card-set.component.html'
})
export class CardSetComponent implements OnInit, OnDestroy {
cardSets: CardSet[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private cardSetService: CardSetService,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.cardSetService.query().subscribe(
            (res: ResponseWrapper) => {
                this.cardSets = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInCardSets();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: CardSet) {
        return item.id;
    }
    registerChangeInCardSets() {
        this.eventSubscriber = this.eventManager.subscribe('cardSetListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
