/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { AManagerTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { CardSetDetailComponent } from '../../../../../../main/webapp/app/entities/card-set/card-set-detail.component';
import { CardSetService } from '../../../../../../main/webapp/app/entities/card-set/card-set.service';
import { CardSet } from '../../../../../../main/webapp/app/entities/card-set/card-set.model';

describe('Component Tests', () => {

    describe('CardSet Management Detail Component', () => {
        let comp: CardSetDetailComponent;
        let fixture: ComponentFixture<CardSetDetailComponent>;
        let service: CardSetService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [AManagerTestModule],
                declarations: [CardSetDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    CardSetService,
                    JhiEventManager
                ]
            }).overrideTemplate(CardSetDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CardSetDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CardSetService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new CardSet(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.cardSet).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
