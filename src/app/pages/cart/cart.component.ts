import { Component, inject, OnInit } from '@angular/core';
import { CustomBreadcrumbComponent } from "../../shared/components/ui/custom-breadcrumb/custom-breadcrumb/custom-breadcrumb.component";
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../core/interfaces/ICart/icart';
import { LoadingCardComponent } from "../../shared/components/ui/loadingCard/loading-card/loading-card.component";
import { OrderSummaryComponent } from "../../shared/components/ui/orderSummary/order-summary/order-summary.component";
import { error } from 'console';
import { ProductsService } from '../../core/services/products/products.service';
import { IProductDetails } from '../../core/interfaces/productDetails/product-details';
import { CardComponent } from "../../shared/components/ui/reuseable/card/card.component";
import { RouterLink } from '@angular/router';
import { CartCardComponent } from "../../shared/components/ui/cartCard/cart-card/cart-card.component";
import { ToastrService } from 'ngx-toastr';
import { WishListService } from '../../core/services/wishList/wish-list.service';

@Component({
  selector: 'app-cart',
  imports: [CustomBreadcrumbComponent, LoadingCardComponent, OrderSummaryComponent, CardComponent, RouterLink, CartCardComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  private readonly cartService = inject(CartService);
  private readonly productsService = inject(ProductsService);
  private readonly toastrService = inject(ToastrService);
  readonly wishListService = inject(WishListService);

  similarProduct:IProductDetails[] = [];

  

  isloading:boolean = true;


  

  cartProduct:ICart = {} as ICart;

  dataDone:boolean = false;

  NoItemInCart:boolean = false;

  loadingOfIcons:boolean = false;


  breadcrumbItems:{}[] = [];
  
  ngOnInit(): void {
    this.wishListService.fetchWishListItems()
    this.breadcrumbItems = [
      { label: 'home', route: '/home' },
      { label: 'category' , route:'/products/category'},
      { label: 'details'},
      { label: 'cart'},
    ];
    this.getLoggedUserCart();
    this.getSimilarProduct();
 
  }





  getLoggedUserCart(): void {
  
  
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
          this.cartProduct = res; 
          this.isloading = false;
          this.cartService.CartPrice = this.cartProduct.data.totalCartPrice
      }
    });
  }

  getRandomProducts(products: any[], count: number, exclude: any[] = []): any[] {


    const filteredProducts = products.filter(prod => !exclude.includes(prod));
    
    const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  
  }

  getSimilarProduct() {

    this.productsService.getProducts(1).subscribe({
      next: (res) => {
        this.similarProduct = res.data;
        
        this.similarProduct = this.getRandomProducts(this.similarProduct, 4);
        console.log(this.similarProduct);
        this.dataDone = true;
      },
      error:()=>{
        this.dataDone = true;
      }
    });
  }


  onItemRemoved(id: string) {
    this.cartProduct.data.products = this.cartProduct.data.products.filter(prod => prod.product.id !== id);
  }
  
  onCountUpdated(event: { id: string, count: number }) {
    const product = this.cartProduct.data.products.find(prod => prod.product.id === event.id);
      if (product) {
        product.count = event.count;
      }
       console.log('Count updated locally:', event);
  }
 

  clearCart() {
    this.cartService.clearCart().subscribe({
      next:(res)=>{
        if(res.message == 'success') {
        this.cartService.cartNumber.set(0);
        this.cartProduct = {} as ICart;
        this.NoItemInCart = true;
      
        }
       
      }
    })
  }

  productWhenAddProductInCart(){
    this.getLoggedUserCart();
  }
 

}
