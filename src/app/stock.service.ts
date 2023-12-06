import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map, take } from 'rxjs';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class stock {

  constructor(private http: HttpClient) {}

  api_url: string = 'http://192.168.1.13:8000/'

  greeting1(): string{
    return 'greeting1 from stock.server'
  }

  greeting3(symbol:string): string{
    return `greeting2 from stock.server msg: ${symbol}`
  }



  async getEvents() {
    try {
      const data = await this.http.get('http://192.168.1.13:8000/total_revenue/CPALL').toPromise();
      return data;

    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error so the caller can handle it
    }
  }

  async get_fs(symbol:string, fs:string) {

    try {
      const data = await this.http.get(`${this.api_url}${fs}/${symbol}`).toPromise();
      return data;

    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error so the caller can handle it
    }
  }




}
