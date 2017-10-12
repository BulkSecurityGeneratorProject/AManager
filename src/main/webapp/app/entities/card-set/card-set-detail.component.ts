import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import {JhiAlertService, JhiDataUtils, JhiEventManager, JhiParseLinks} from 'ng-jhipster';

import { CardSet } from './card-set.model';
import { CardSetService } from './card-set.service';

import { Set } from '../set/set.model';
import { SetService } from '../set/set.service';
import {Principal} from "../../shared/auth/principal.service";
import {ResponseWrapper} from "../../shared/index";
import {ITEMS_PER_PAGE} from "../../shared/constants/pagination.constants";

@Component({
    selector: 'jhi-card-set-detail',
    templateUrl: './card-set-detail.component.html'
})
export class CardSetDetailComponent implements OnInit, OnDestroy {

    cardSet: CardSet;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    sets: Set[];
    itemsPerPage: number;
    links: any;
    page: any;
    predicate: any;
    queryCount: any;
    reverse: any;
    totalItems: number;

    constructor(
        private eventManager: JhiEventManager,
        private cardSetService: CardSetService,
        private route: ActivatedRoute,
        private alertService: JhiAlertService,
        private principal: Principal,
        private setService: SetService,
        private parseLinks: JhiParseLinks,
        private dataUtils: JhiDataUtils
    ) {
        this.sets = [];
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.page = 0;
        this.links = {
            last: 0
        };
        this.predicate = 'id';
        this.reverse = true;
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCardSets();
        this.loadSets();
        this.registerChangeInSets();
    }

    load(id) {
        this.cardSetService.find(id).subscribe((cardSet) => {
            this.cardSet = cardSet;
        });
    }

    loadSets() {
        this.setService.query({
            page: this.page,
            size: this.itemsPerPage,
            sort: this.sort()
        }).subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    registerChangeInSets() {
        this.eventSubscriber = this.eventManager.subscribe('setListModification', (response) => this.reset());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    reset() {
        this.page = 0;
        this.sets = [];
        this.loadSets();
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        for (let i = 0; i < data.length; i++) {
            this.sets.push(data[i]);
        }
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCardSets() {
        this.eventSubscriber = this.eventManager.subscribe(
            'cardSetListModification',
            (response) => this.load(this.cardSet.id)
        );
    }
}
