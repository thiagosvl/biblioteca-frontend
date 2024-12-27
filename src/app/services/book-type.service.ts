import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SortDirection } from '@angular/material/sort';
import { BookType, BookTypePaginated } from '../models/BookType';
import { WebApiService } from './web-api.service';

@Injectable({
  providedIn: 'root'
})
export class BookTypeService {

  public servicePrefix: string = "book-types";

  constructor(private webApiService: WebApiService) { }

  get(search?: string): Observable<BookType[]> {
    let urlString: string = `${this.webApiService.ApiUrl}/${this.servicePrefix}`;
    if (search) {
      urlString += `?search=${search}`;
    }
    return this.webApiService.get(urlString);
  }

  getPaginated(sort: string, order: SortDirection, page: number, pageSize: number, search: string): Observable<BookTypePaginated> {
    return this.webApiService.get(`${this.webApiService.ApiUrl}/${this.servicePrefix}/paginate?sort=${sort}&order=${order}&page=${page + 1
      }&per_page=${pageSize}&search=${search}`);
  }

  add(item: BookType): Observable<any> {
    return this.webApiService.post(`${this.webApiService.ApiUrl}/${this.servicePrefix}`, item);
  }

  update(id: number, item: BookType): Observable<any> {
    return this.webApiService.put(`${this.webApiService.ApiUrl}/${this.servicePrefix}/${id}`, item);
  }

  delete(id: number): Observable<any> {
    return this.webApiService.delete(`${this.webApiService.ApiUrl}/${this.servicePrefix}/${id}`);
  }
}
