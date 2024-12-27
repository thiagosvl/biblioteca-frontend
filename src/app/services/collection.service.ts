import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Collection, CollectionPaginated } from './../models/Collection';

import { SortDirection } from '@angular/material/sort';
import { WebApiService } from './web-api.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  public servicePrefix: string = "collections";

  constructor(private webApiService: WebApiService) { }

  get(search?: string): Observable<Collection[]> {
    let urlString: string = `${this.webApiService.ApiUrl}/${this.servicePrefix}`;
    if (search) {
      urlString += `?search=${search}`;
    }
    return this.webApiService.get(urlString);
  }

  getPaginated(sort: string, order: SortDirection, page: number, pageSize: number, search: string): Observable<CollectionPaginated> {
    return this.webApiService.get(`${this.webApiService.ApiUrl}/${this.servicePrefix}/paginate?sort=${sort}&order=${order}&page=${page + 1
      }&per_page=${pageSize}&search=${search}`);
  }

  add(item: Collection): Observable<any> {
    return this.webApiService.post(`${this.webApiService.ApiUrl}/${this.servicePrefix}`, item);
  }

  update(id: number, item: Collection): Observable<any> {
    return this.webApiService.put(`${this.webApiService.ApiUrl}/${this.servicePrefix}/${id}`, item);
  }

  delete(id: number): Observable<any> {
    return this.webApiService.delete(`${this.webApiService.ApiUrl}/${this.servicePrefix}/${id}`);
  }
}
