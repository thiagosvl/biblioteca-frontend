import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book, BookPaginated } from './../models/Book';

import { SortDirection } from '@angular/material/sort';
import { WebApiService } from './web-api.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  public servicePrefix: string = "books";

  constructor(private webApiService: WebApiService) { }

  get(sort: string, order: SortDirection, page: number, pageSize: number, search: string): Observable<BookPaginated> {
    return this.webApiService.get(`${this.webApiService.ApiUrl}/${this.servicePrefix}?sort=${sort}&order=${order}&page=${page + 1
      }&per_page=${pageSize}&search=${search}`);
  }

  add(item: Book): Observable<any> {
    return this.webApiService.post(`${this.webApiService.ApiUrl}/${this.servicePrefix}`, item);
  }

  update(id: number, item: Book): Observable<any> {
    return this.webApiService.put(`${this.webApiService.ApiUrl}/${this.servicePrefix}/${id}`, item);
  }

  delete(id: number): Observable<any> {
    return this.webApiService.delete(`${this.webApiService.ApiUrl}/${this.servicePrefix}/${id}`);
  }
}
