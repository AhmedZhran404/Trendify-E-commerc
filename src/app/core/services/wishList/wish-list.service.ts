import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environmentRout } from '../../environment/environment';
import { IProductDetails } from '../../interfaces/productDetails/product-details';

@Injectable({
  providedIn: 'root'
})
export class WishListService {

  constructor(private httpClient:HttpClient) {
   }

  wishList:any[] = [];

  whisListCount:WritableSignal<number> = signal(0);

  addProductToWishList(id:string):Observable<any> 
  {
      return this.httpClient.post(`${environmentRout.baseUrl}/api/v1/wishlist` , 
        {
          "productId" : id
        }
      );
  }


  getLoggedUserWishList():Observable<any> {
    return this.httpClient.get(`${environmentRout.baseUrl}/api/v1/wishlist`);
  }

  fetchWishListItems():void
  {
    this.getLoggedUserWishList().subscribe({
      next:(res)=>{
        this.wishList = res.data;
        console.log(this.wishList);
      }
    })
  }

  isInWishlist(productId: string): boolean {    
    return this.wishList.some(product => product.id === productId);
  }


  removeProductFromWishList(id:string):Observable<any> {
    return this.httpClient.delete(`${environmentRout.baseUrl}/api/v1/wishlist/${id}`);
  }


}
