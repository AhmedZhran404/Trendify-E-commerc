import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environmentRout } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private httpClient:HttpClient) { }


  addAddress(data:any):Observable<any> {
    return this.httpClient.post(`${environmentRout.baseUrl}/api/v1/addresses` , data);
  }

  getLoggedUserAddress():Observable<any> {
    return this.httpClient.get(`${environmentRout.baseUrl}/api/v1/addresses`);
  }


  removeAddress(id:string):Observable<any> {
    return this.httpClient.delete(`${environmentRout.baseUrl}/api/v1/addresses/${id}`);
  }

  getSpacificAddress(id:string):Observable<any> {
    return this.httpClient.get(`${environmentRout.baseUrl}/api/v1/addresses/${id}`);
  }

  checkOutSession(data:any , id:string):Observable<any>{
    return this.httpClient.post(`${environmentRout.baseUrl}/api/v1/orders/checkout-session/${id}?url=http://localhost:4200` , 
      {
        "shippingAddress": data
      }
    );
  }

  cashOrder(data:any , id:string):Observable<any>{
    return this.httpClient.post(`${environmentRout.baseUrl}/api/v1/orders/${id}` , 

      {
        "shippingAddress": data
      }
    );
  }





}
