import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { CardSet } from './card-set.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class CardSetService {

    private resourceUrl = SERVER_API_URL + 'api/card-sets';

    constructor(private http: Http) { }

    create(cardSet: CardSet): Observable<CardSet> {
        const copy = this.convert(cardSet);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(cardSet: CardSet): Observable<CardSet> {
        const copy = this.convert(cardSet);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<CardSet> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(cardSet: CardSet): CardSet {
        const copy: CardSet = Object.assign({}, cardSet);
        return copy;
    }
}
