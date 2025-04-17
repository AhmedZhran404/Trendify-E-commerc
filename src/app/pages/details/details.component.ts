
import { Product2, Data } from './../../core/interfaces/ICart/icart';
import { IProductDetails } from './../../core/interfaces/productDetails/product-details';
import { AfterViewInit, Component, ElementRef, HostListener, inject, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { CustomBreadcrumbComponent } from "../../shared/components/ui/custom-breadcrumb/custom-breadcrumb/custom-breadcrumb.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { MenuItem } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CardComponent } from "../../shared/components/ui/reuseable/card/card.component";
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingCardComponent } from "../../shared/components/ui/loadingCard/loading-card/loading-card.component";
import { WishListService } from '../../core/services/wishList/wish-list.service';
import { NgClass } from '@angular/common';
import { Skeleton } from 'primeng/skeleton';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

interface ColorOption {
  label: string;
  class: string;
  active: boolean;
}
interface SizeOption {
  sizeType:string;
  content:string;
  active: boolean;
}


@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-details',
  imports: [ Skeleton  , CustomBreadcrumbComponent, AccordionModule, AvatarModule, BadgeModule, RatingModule, FormsModule, CardComponent, LoadingCardComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  encapsulation:ViewEncapsulation.None
})
export class DetailsComponent implements OnInit  {

private readonly activatedRoute = inject(ActivatedRoute);
private readonly productsService = inject(ProductsService);
private readonly cartService = inject(CartService);
private readonly toastrService = inject(ToastrService);
private readonly router = inject(Router);
readonly wishListService = inject(WishListService);
@ViewChild('verticalSwiper') verticalSwiper!: ElementRef;
@ViewChild('horizontalSwiper') horizontalSwiper!: ElementRef;

breadcrumbItems: MenuItem[] = [];
productId:string = ''; 
productDetails:IProductDetails = {} as IProductDetails;
theSameProductsCategory:[] = [];
similarProducts:any[] = [];
selectedColor: string = '';
selectedSize: string = '';
loading:boolean = false;
AddToCartSuccess:boolean = false;
dataDone:boolean = false;
itemsMenuDetils: MenuItem[] = [];
quantity: number = 1;
inWishList:any;
productPrice:any;
basePrice: number = 0;

isMobile = window.innerWidth < 768;

@HostListener('window:resize', ['$event'])
onResize() {
  this.isMobile = window.innerWidth < 768;
}



colors: ColorOption[] = [
  { label: "Blue", class: 'bg-[#507CCD]', active: true },
  { label: "White", class: 'bg-[#fff]', active: false },
  { label: "Caramel", class: 'bg-[#C88242]', active: false },
  { label: "Navy", class: 'bg-[#212F39]', active: false },
  { label: "Peach", class: 'bg-[#DCB9A8]', active: false },
  { label: "Sage Green", class: 'bg-[#A7B2A3]', active: false }
];


sizes:SizeOption[] = [
  {content:"XSmall"   ,  sizeType:'XS'   ,  active: false},
  {content:"Small"    ,  sizeType:'S'    ,  active: false},
  {content:"Mediam"   ,  sizeType:'M'    ,  active: true },
  {content:"Large"    ,  sizeType:'L'    ,  active: false},
  {content:"XLarge"   ,  sizeType:'XL'   ,  active: false},
  {content:"XXLarge"  ,  sizeType:'XXL'  ,  active: false},
  {content:"XXXLarge" ,  sizeType:'XXXL' ,  active: false},
]



ngOnInit(): void {

  this.selectedColor = this.colors.find((c: ColorOption) => c.active)?.label || '';
  this.selectedSize = this.sizes.find((c:SizeOption) => c.active)?.content || ''; 
 this.getProductIdFromUrl();

}





getProductIdFromUrl() {
  this.activatedRoute.paramMap.subscribe({
    next: (res: any) => {
      this.productId = res.params.id;
      this.loadProductDetails(this.productId);
    }
  });
}


loadProductDetails(id: string) {
  this.dataDone = false;
  this.productsService.getDetailsOfProduct(id).subscribe({
    next: (res) => {
      this.dataDone = true;
      this.productDetails = res.data;
      this.basePrice = this.productDetails.price;
      this.productPrice = this.basePrice;

      this.loadSimilarProducts();
      this.buildBreadcrumb();
      this.loadWishlist();
    },
    error: () => {
      this.dataDone = true;
    }
  });
}


loadWishlist() {
  this.wishListService.getLoggedUserWishList().subscribe({
    next: (res) => {
      this.wishListService.wishList = res.data;
      this.inWishList = this.wishListService.isInWishlist(this.productDetails.id);
      console.log(this.inWishList);
    }
  });
}


buildBreadcrumb() {
  this.breadcrumbItems = [
    { label: 'home', route: '/home' },
    { label: 'category', route: '/products/category' },
    { label: this.productDetails.category.name },
  ];
}


loadSimilarProducts() {
  this.getSimilarProduct();
}

getRandomProducts(products: any[], count: number, exclude: any[] = []): any[] {
  const filteredProducts = products.filter(prod => !exclude.includes(prod));
  const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);

}

getSimilarProduct() {

  this.productsService.getProducts(1).subscribe({
    next: (res) => {
      this.theSameProductsCategory = res.data.filter(
        (prod: any) => (prod.category.name === this.productDetails.category.name) && (prod.id !== this.productDetails.id)
      );
      
      this.similarProducts = this.getRandomProducts(this.theSameProductsCategory, 4);
      this.dataDone = true;
    }
  });
}

setActiveColor(index: number) {
  this.colors.forEach((color:ColorOption, i:number) => color.active = i === index);
  this.selectedColor = this.colors[index].label;
}

setActiveSize(index: number) {
  this.sizes.forEach((size:SizeOption, i:number) => size.active = i === index);
  this.selectedSize = this.sizes[index].content;
}




changeCoverImage(smallImage:string):void {
  this.productDetails.imageCover = smallImage;
}


addToCart(id:string):void {
  
  this.loading = true;
  this.cartService.addProductToCart(id).subscribe({
    next:(res)=>{
      this.loading = false;
      console.log(res);
      if(res.status === 'success'){        
        this.toastrService.success(res.message , "Trendify");
      }
    },
    error:(err)=>{
      this.loading = false;
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

removeItemFromWishList(id:string):void {
  this.wishListService.removeProductFromWishList(id).subscribe({
    next:(res)=>{
      this.inWishList = !this.inWishList;
      this.toastrService.success(res.message, "Trendify");
      this.wishListService.whisListCount.set(res.data.length);
     
    }
  })
}

increaseQuantity() {
  this.quantity++;
  this.productPrice = this.quantity * this.basePrice;
}

decreaseQuantity() {
  if (this.quantity > 1) {
    this.quantity--;
    this.productPrice = this.quantity * this.basePrice;
  }
}




categorySlider(direction: 'prev' | 'next') {
  const swiper = window.innerWidth < 768 ? 
    this.horizontalSwiper.nativeElement.swiper : 
    this.verticalSwiper.nativeElement.swiper;
  
  if (direction === 'prev') {
    swiper.slidePrev();
  } else {
    swiper.slideNext();
  }
}

}



