import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Author, AuthorPaginated } from './../models/Author';

import { SortDirection } from '@angular/material/sort';
import { WebApiService } from './web-api.service';

@Injectable({
  providedIn: 'root'
})

export class AuthorService {

  public servicePrefix: string = "authors";

  constructor(private webApiService: WebApiService) { }

  get(search?: string): Observable<Author[]> {
    let urlString: string = `${this.webApiService.ApiUrl}/${this.servicePrefix}`;
    if (search) {
      urlString += `?search=${search}`;
    }
    return this.webApiService.get(urlString);
  }

  getPaginated(sort: string, order: SortDirection, page: number, pageSize: number, search: string): Observable<AuthorPaginated> {
    return this.webApiService.get(`${this.webApiService.ApiUrl}/${this.servicePrefix}/paginate?sort=${sort}&order=${order}&page=${page + 1
      }&per_page=${pageSize}&search=${search}`);
  }

  add(item: Author): Observable<any> {
    return this.webApiService.post(`${this.webApiService.ApiUrl}/${this.servicePrefix}`, item);
  }

  update(id: number, item: Author): Observable<any> {
    return this.webApiService.put(`${this.webApiService.ApiUrl}/${this.servicePrefix}/${id}`, item);
  }

  delete(id: number): Observable<any> {
    return this.webApiService.delete(`${this.webApiService.ApiUrl}/${this.servicePrefix}/${id}`);
  }
}
