import { ToastrService } from 'ngx-toastr';
import { Component, inject, Input, input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../../../core/services/cart/cart.service';
import { EventEmitter } from '@angular/core';
import { ICart } from '../../../../../core/interfaces/ICart/icart';
import { WishListService } from '../../../../../core/services/wishList/wish-list.service';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly wishListService = inject(WishListService);

  @Input() title: string = '';
  @Input() image: string = '';
  @Input() id: string = '';
  @Input() price: number = 0;
  @Input() rating: number = 0;
  @Input() inWishList:boolean = false;
  
  loading:boolean = false;

  @Output() ShowData = new EventEmitter<ICart>(); 
  

  addToCart(id: string): void {
    this.loading = true;
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        this.cartService.cartNumber.set(res.numOfCartItems)
        this.loading = false;
        this.ShowData.emit();
        if (res.status === 'success') {
          this.toastrService.success(res.message, "Trendify");
        }

      },
      error: (err) => {
        this.loading = false;
      }
    });
  }



  removeItemFromWishList(id:string):void {
    this.wishListService.removeProductFromWishList(id).subscribe({
      next:(res)=>{
        this.inWishList = !this.inWishList;
        this.toastrService.success(res.message, "Trendify");
        this.wishListService.whisListCount.set(res.data.length);
       
      }
    })
  }


  addToWishList(id: string):void {
    if(!this.inWishList){
      this.wishListService.addProductToWishList(id).subscribe({
        next:(res)=>{
          console.log(res.data.length);
          this.inWishList = !this.inWishList;
          this.toastrService.success(res.message, "Trendify");
          this.wishListService.whisListCount.set(res.data.length);
         
        }
      })
    }
    else{ 
      this.removeItemFromWishList(id);
    }
  
  }


 

}



  


