import { Product } from './../../core/interfaces/orders/Iorders';
import { Component, inject, OnInit } from '@angular/core';
import { CustomBreadcrumbComponent } from "../../shared/components/ui/custom-breadcrumb/custom-breadcrumb/custom-breadcrumb.component";
import { WishListService } from '../../core/services/wishList/wish-list.service';
import { IProductDetails } from '../../core/interfaces/productDetails/product-details';
import { Iwishlist } from '../../core/interfaces/Iwishlist/iwishlist';
import { LoadingCardComponent } from "../../shared/components/ui/loadingCard/loading-card/loading-card.component";
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [CustomBreadcrumbComponent, LoadingCardComponent , RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {

  private readonly wishListService = inject(WishListService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  breadcrumbItems:{}[] = [];

  product:Iwishlist = {} as Iwishlist;

  loadingId: string | null = null;
  loadingremoveId: string | null = null;
  isloading:boolean = true;



  ngOnInit(): void {
    this.fetchData();
    this.breadcrumbItems = [
      { label: 'home', route: '/home' },
      {label:'wish List'}
    ];
  }
  
  fetchData():void {
    this.wishListService.getLoggedUserWishList().subscribe({
      next:(res)=>{
        this.isloading = false;
        this.product = res;
        console.log(this.product);
      }
    })
  }



  addToCartFromWishList(id:string):void {
    this.loadingId = id;
    this.cartService.addProductToCart(id).subscribe({

      next:(res)=>{
       
        this.loadingId = null;
        this.toastrService.success(res.message , "Trendify");
      },
      error:(err)=>{
        this.loadingId = null;
      }
    })
  }

  removeItemFromWishList(id:string):void {
    this.loadingremoveId = id;
    this.wishListService.removeProductFromWishList(id).subscribe({

      next:(res)=>{
        console.log(res.count);
        this.wishListService.whisListCount.set(res.data.length);
        this.loadingremoveId = null;

        const remainingIds = res.data as string[];

        this.product.data = this.product.data.filter((prod: any) =>
          remainingIds.includes(prod.id)
        );

        this.toastrService.success(res.message , "Trendify");
      },
      error:(err)=>{
        this.loadingremoveId = null;
      }
    })
  }





}
