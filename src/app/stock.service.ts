import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class stock {

  private api_url: string = 'http://192.168.1.13:8000/'

  constructor(private http: HttpClient) {}

  // get financial statement from fast api
  getFs(symbol: string, fs: string): Observable<any> {
    return this.http.get(`${this.api_url}${fs}/${symbol}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching data:', error);
        return throwError(error); // Re-throw the error so the caller can handle it
      })
    );
  }




}
