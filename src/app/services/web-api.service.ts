import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

 export class WebApiService {
    public ApiUrl: string = 'http://localhost:8000/api';
    
    constructor(private httpClient: HttpClient) { }

    get(url: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }),
            observe: "response" as 'body'
        };
        return this.httpClient.get(
            url,
            httpOptions
        )
            .pipe(
                map((response: any) => this.ReturnResponseData(response)),
                catchError(this.handleError)
            );
    }

    post(url: string, model: any): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            observe: "response" as 'body'
        };
        return this.httpClient.post(
            url,
            model,
            httpOptions)
            .pipe(
                map((response: any) => this.ReturnResponseData(response)),
                catchError(this.handleError)

            );
    }

    put(url: string, model: any): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            observe: "response" as 'body'
        };
        return this.httpClient.put(
            url,
            model,
            httpOptions)
            .pipe(
                map((response: any) => this.ReturnResponseData(response)),
                catchError(this.handleError)

            );
    }

    delete(url: string): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            observe: "response" as 'body'
        };
        return this.httpClient.delete(
            url)
            .pipe(
                map((response: any) => this.ReturnResponseData(response)),
                catchError(this.handleError)

            );
    }

    private ReturnResponseData(response: any) {
        return response;
    }

    private handleError(error: any) {
        return throwError(error);
    }
}