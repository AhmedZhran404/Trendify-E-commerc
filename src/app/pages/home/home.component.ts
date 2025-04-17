import { ToastrService } from 'ngx-toastr';
import { Component, HostListener, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CarouselComponent, CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { title } from 'process';
import { TabsModule } from 'primeng/tabs';
import { CardComponent } from "../../shared/components/ui/reuseable/card/card.component";
import { ProductsService } from '../../core/services/products/products.service';
import { CategoreyService } from '../../category/categorey.service';
import { WishListService } from '../../core/services/wishList/wish-list.service';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TabsModule, CarouselModule, CardComponent , Skeleton],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation:ViewEncapsulation.None 
})
export class HomeComponent implements OnInit {

  private readonly toastrService = inject(ToastrService)
  private readonly productsService = inject(ProductsService);
  private readonly categoreyService = inject(CategoreyService);
  readonly wishListService = inject(WishListService);

  @ViewChild('owlCarousel1') owlElement1!: CarouselComponent;
  @ViewChild('owlCarousel2') owlElement2!: CarouselComponent;

  products = [];
  randomProducts:any;
  randomProductsTop:any;
  categorys:any;
  productMens = [];
  productWomens = [];
  productElectronics = [];
  loading:boolean = true;


  tabs: { title: string; value: number; cards:any}[] = [];
  ActiveTap:number = 0;
    ngOnInit() {
      this.showAllCategory();
      this.showProducts();
      this.wishListService.fetchWishListItems();
    }



    getRandomProducts(products: any[], count: number, exclude: any[] = []): any[] {

      const filteredProducts = products.filter(prod => !exclude.includes(prod));
      const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }

  showProducts()
  {
    this.productsService.getProducts(1).subscribe({
      next:(res)=>{
        this.products = res.data;

        this.productMens = this.products.filter((prod:any)=>prod.category.name === 'Men\'s Fashion')
        this.productWomens = this.products.filter((prod:any)=>prod.category.name === 'Women\'s Fashion')
        this.productElectronics = this.products.filter((prod:any)=>prod.category.name === 'Electronics')


        this.tabs = [
          { title: 'All', value: 0, cards: this.getRandomProducts(this.products, 4)},
          { title: "men's", value: 1, cards:  this.getRandomProducts(this.productMens, 4)},
          { title: "women's", value: 3, cards: this.getRandomProducts(this.productWomens, 4)},
          { title: "Electronics", value: 4, cards: this.getRandomProducts(this.productElectronics, 4)}
        ];


        const allTabProducts = this.tabs.flatMap(tab => tab.cards); 
        this.randomProducts = this.getRandomProducts(this.products, 4, allTabProducts);
        this.randomProductsTop = this.getRandomProducts(this.products , 8 , allTabProducts);
      }
    })
  }

 
 
  showAlert() {
  
        this.toastrService.info(
          "Please log in to continue to this page.",
          "Login Required",{
            timeOut:3000
          }
        );
  
  }


  showAllCategory() {

    this.loading = true;

        this.categoreyService.getAllCategory().subscribe({
          next:(res)=>{
            setTimeout(()=>{
              this.loading = false;
            } , 1300);
            this.categorys = res.data;
          },
          error:(err)=>{
            this.loading = false;
          }
        })

  }




  imgs = [
    './images/image02.jpg',
    './images/unsplash_vHVfpi3h5xk.png',
    './images/unsplash_vHVfpi3h5xk-3.png',
    './images/unsplash_vHVfpi3h5xk-4.png'
  ]

  customOptions1 = {
    loop: true, 
    margin: 10, 
    nav: false, 
    dots: true, 
    autoplay: false, 
    autoplayTimeout: 3000, 
    responsive: {
      0: { items: 2 },
      768: { items: 4 }, 
      1024: { items: 8 } 
    },
  };

  customOptions2 = {
    loop: true, 
    margin: 20, 
    nav: false, 
    dots: true, 
    autoplay: false, 
    autoplayTimeout: 3000, 
    responsive: {
      0: { items: 1 }
    },
  };



  prevSlide() {
    this.owlElement1.prev();
  }

  nextSlide() {
    this.owlElement1.next();
  }
  prevSlide1() {
    this.owlElement2.prev();
  }

  nextSlide1() {
    this.owlElement2.next();
  }


}
