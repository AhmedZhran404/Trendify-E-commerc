import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environmentRout } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private httpClient:HttpClient) { }

  navbarColor:boolean = true;


 

  getProducts(page:number):Observable<any>
  {
    return this.httpClient.get(`${environmentRout.baseUrl}/api/v1/products?page=${page}`);
  }


  getDetailsOfProduct(id:string):Observable<any> 
  {
    return this.httpClient.get(`${environmentRout.baseUrl}/api/v1/products/${id}`)
 }
  



}
