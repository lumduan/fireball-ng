import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, Subject, throwError,BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class StockService {
  static GetLastQuarterList(arg0: string, arg1: number): any {
    throw new Error('Method not implemented.');
  }

  private api_url: string = '/api'
  private defaultSymbol:string = 'CPALL'

  private _symbolSubject = new BehaviorSubject<string>(this.defaultSymbol);
  symbol$ = this._symbolSubject.asObservable();

  set symbol(value: string) {
    this._symbolSubject.next(value.toUpperCase());
  }


  constructor(private http: HttpClient) {}

  // get financial statement from fast api
  GetFs(symbol: string, fs: string): Observable<any> {
    const url = `${this.api_url}/${fs}/${symbol}`; // Ensure correct path construction
    return this.http.get(url).pipe(
      catchError((error: any) => {
        console.error('Error fetching data:', error);
        return throwError(error); // Re-throw the error so the caller can handle it
      })
    );
  }

}
