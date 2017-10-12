/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { AManagerTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { SetDetailComponent } from '../../../../../../main/webapp/app/entities/set/set-detail.component';
import { SetService } from '../../../../../../main/webapp/app/entities/set/set.service';
import { Set } from '../../../../../../main/webapp/app/entities/set/set.model';

describe('Component Tests', () => {

    describe('Set Management Detail Component', () => {
        let comp: SetDetailComponent;
        let fixture: ComponentFixture<SetDetailComponent>;
        let service: SetService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [AManagerTestModule],
                declarations: [SetDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    SetService,
                    JhiEventManager
                ]
            }).overrideTemplate(SetDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SetDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SetService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Set(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.set).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
