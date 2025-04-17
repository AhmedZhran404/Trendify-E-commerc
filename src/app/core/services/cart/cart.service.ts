import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable} from 'rxjs';
import { environmentRout } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private httpClient:HttpClient) {}

  cartNumber:WritableSignal<number> = signal(0);

  CartPrice:number = 1000;

  addProductToCart(id:string):Observable<any> 
  {

  return  this.httpClient.post(`${environmentRout.baseUrl}/api/v1/cart` , 

    {
      "productId":id
    }
  )

  }


 
  removeSpicificCartItem(id:string):Observable<any> {
    return this.httpClient.delete(`${environmentRout.baseUrl}/api/v1/cart/${id}`)
  }


  updataCartProductQuntity(id:string , newCount:number):Observable<any> {
    return this.httpClient.put(`${environmentRout.baseUrl}/api/v1/cart/${id}` , 
      {
        count: newCount
      }
    )
  }


  clearCart():Observable<any> {
   return this.httpClient.delete(`${environmentRout.baseUrl}/api/v1/cart`)
  }


  getLoggedUserCart():Observable<any> {
    return this.httpClient.get(`${environmentRout.baseUrl}/api/v1/cart`);
  }



}
