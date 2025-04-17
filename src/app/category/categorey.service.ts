import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environmentRout } from '../core/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoreyService {

  constructor(private httpClient:HttpClient) { }



  getAllCategory():Observable<any> {
    return this.httpClient.get(`${environmentRout.baseUrl}/api/v1/categories`);
  }



}
