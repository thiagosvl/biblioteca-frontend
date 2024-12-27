import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject, SubjectPaginated } from './../models/Subject';

import { SortDirection } from '@angular/material/sort';
import { WebApiService } from './web-api.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  public servicePrefix: string = "subjects";

  constructor(private webApiService: WebApiService) { }

  get(search?: string): Observable<Subject[]> {
    let urlString: string = `${this.webApiService.ApiUrl}/${this.servicePrefix}`;
    if (search) {
      urlString += `?search=${search}`;
    }
    return this.webApiService.get(urlString);
  }

  getPaginated(sort: string, order: SortDirection, page: number, pageSize: number, search: string): Observable<SubjectPaginated> {
    return this.webApiService.get(`${this.webApiService.ApiUrl}/${this.servicePrefix}/paginate?sort=${sort}&order=${order}&page=${page + 1
      }&per_page=${pageSize}&search=${search}`);
  }

  add(item: Subject): Observable<any> {
    return this.webApiService.post(`${this.webApiService.ApiUrl}/${this.servicePrefix}`, item);
  }

  update(id: number, item: Subject): Observable<any> {
    return this.webApiService.put(`${this.webApiService.ApiUrl}/${this.servicePrefix}/${id}`, item);
  }

  delete(id: number): Observable<any> {
    return this.webApiService.delete(`${this.webApiService.ApiUrl}/${this.servicePrefix}/${id}`);
  }
}
