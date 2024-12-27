import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Publisher, PublisherPaginated } from './../models/Publisher';

import { SortDirection } from '@angular/material/sort';
import { WebApiService } from './web-api.service';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  public servicePrefix: string = "publishers";

  constructor(private webApiService: WebApiService) { }

  get(search?: string): Observable<Publisher[]> {
    let urlString: string = `${this.webApiService.ApiUrl}/${this.servicePrefix}`;
    if (search) {
      urlString += `?search=${search}`;
    }
    return this.webApiService.get(urlString);
  }

  getPaginated(sort: string, order: SortDirection, page: number, pageSize: number, search: string): Observable<PublisherPaginated> {
    return this.webApiService.get(`${this.webApiService.ApiUrl}/${this.servicePrefix}/paginate?sort=${sort}&order=${order}&page=${page + 1
      }&per_page=${pageSize}&search=${search}`);
  }

  add(item: Publisher): Observable<any> {
    return this.webApiService.post(`${this.webApiService.ApiUrl}/${this.servicePrefix}`, item);
  }

  update(id: number, item: Publisher): Observable<any> {
    return this.webApiService.put(`${this.webApiService.ApiUrl}/${this.servicePrefix}/${id}`, item);
  }

  delete(id: number): Observable<any> {
    return this.webApiService.delete(`${this.webApiService.ApiUrl}/${this.servicePrefix}/${id}`);
  }
}
