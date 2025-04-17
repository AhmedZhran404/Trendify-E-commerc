import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environmentRout } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private httpClient:HttpClient) { }



  // getAllOrders():Observable<any> 
  // {
  //   return this.httpClient.get(`${environmentRout.baseUrl}/api/v1/orders/`);
  // }


  getSpacificOrder(userId:string):Observable<any> 
  {
    return this.httpClient.get(`${environmentRout.baseUrl}/api/v1/orders/user/${userId}`)
  }



}
