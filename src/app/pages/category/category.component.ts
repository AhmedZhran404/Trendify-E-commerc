import { Component, HostListener, inject, OnInit, ViewEncapsulation, PLATFORM_ID } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { ProductsService } from '../../core/services/products/products.service';
import { CardComponent } from "../../shared/components/ui/reuseable/card/card.component";
import { AccordionModule } from 'primeng/accordion';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { forkJoin } from 'rxjs';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Slider } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { Skeleton } from 'primeng/skeleton';
import { CustomBreadcrumbComponent } from "../../shared/components/ui/custom-breadcrumb/custom-breadcrumb/custom-breadcrumb.component";
import { LoadingCardComponent } from "../../shared/components/ui/loadingCard/loading-card/loading-card.component";
import { WishListService } from '../../core/services/wishList/wish-list.service';
import { isPlatformBrowser } from '@angular/common';
import { IProductDetails } from '../../core/interfaces/productDetails/product-details';

@Component({
  selector: 'app-category',
  imports: [TabsModule, CardComponent, AccordionModule, PaginatorModule, Menu, ButtonModule, Slider, FormsModule, Skeleton, CustomBreadcrumbComponent, LoadingCardComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
  encapsulation:ViewEncapsulation.None
})
export class CategoryComponent implements OnInit {

  private readonly productsService = inject(ProductsService);
  readonly wishListService = inject(WishListService);
  private readonly id = inject(PLATFORM_ID);

  ActiveTap: number = 0;
  allProducts: any[] = [];
  pagedProducts: any[] = [];
  first: number = 0;
  rows: number = 12;
  categoryName: string = "";
  itemsOfSort: MenuItem[] | undefined;
  productOfSpacificCatigory: any[] = [];
  rangeValues: number[] = [100, 50000];
  filterProductsByPriceRange: any[] = [];
  productsToDisplay:any[] = [];
  isSidebarOpen: boolean = false;
  dataDone:boolean = false;
  breadcrumbItems: MenuItem[] = [];
  loadingArray = Array(12).fill(0);
  private categoryMap: Record<string, IProductDetails[]> = {};
  categoryNameCreated:boolean = false;
  tabs: { title: string; value: number; cards?: any[] }[] = [];
  


  ngOnInit(): void {
    setTimeout(()=>{
      this.categoryNameCreated = false;
    } , 1550)
    this.categoryNameCreated = true;
    this.wishListService.fetchWishListItems();
    this.showProducts();
    this.itemsOfSort = [
      {
        items: [
          {
            label: 'High To Low',
            icon: 'fa-solid fa-arrow-down-wide-short',
            command: () => this.sortProducts('highToLow')
          },
          {
            label: 'Low To High',
            icon: 'fa-solid fa-arrow-up-wide-short',
            command: () => this.sortProducts('lowToHigh')
          }
        ]
      }
    ];

    this.breadcrumbItems = [
      { label: 'home', route: '/home' },
      { label: 'category'},
    ];

  }


  
  sortProducts(sortOrder: string): void {
    if (sortOrder === 'highToLow') {
      this.productsToDisplay.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'lowToHigh') {
      this.productsToDisplay.sort((a, b) => a.price - b.price);
    }
  
    this.updatePagedProducts();
  }

  showProducts() {
   
    forkJoin([
      this.productsService.getProducts(1),
      this.productsService.getProducts(2)
    ]).subscribe({
      next: ([res1, res2]) => {


        this.handleProductsSuccess(res1.data, res2.data);
        
      },
      error: () => {
        this.handleError();
      }
    });
  }



  private handleProductsSuccess(data1: any[], data2: any[]) {
    this.allProducts = [...data1, ...data2];
  
    this.buildCategoryMap();
    this.initializeTabs();
    this.updatePagedProducts();
    this.updateLoadingState(true, 1000);
  }  


  
  private buildCategoryMap() {
    this.categoryMap = this.allProducts.reduce((map, prod) => {
      const cat = prod.category.name;
      if (!map[cat]) map[cat] = [];
      map[cat].push(prod);
      return map;
    }, {} as Record<string, IProductDetails[]>);
  }


  private initializeTabs() {
   
   
    this.tabs = [
      { title: 'All products', value: 0, cards: this.allProducts },
      { title: "Men's", value: 1, cards: this.categoryMap["Men's Fashion"] || []  },
      { title: "Women's", value: 2, cards: this.categoryMap["Women's Fashion"] || [] },
      { title: "Accessories", value: 3, cards: this.categoryMap["Accessories"] || []},
      { title: "Bags", value: 4, cards: this.categoryMap["Bags"] || []},
      { title: "Electronics", value: 5, cards: this.categoryMap["Electronics"] || [] },
      { title: "Watches", value: 6, cards: this.categoryMap["Watches"] || [] },
      { title: "Skirts", value: 7, cards:this.categoryMap["Skirts"] || [] },
      { title: "Full Outfit", value: 8, cards: this.categoryMap["Full Outfit"] || [] },
      { title: "Shoes", value: 9, cards: this.categoryMap["Shoes"] || [] },
    ];
 
  }
  

  private updateLoadingState(done: boolean, delay: number = 0) {
    setTimeout(() => {
      this.dataDone = done;
    }, delay);
  }

  private handleError() {
    this.updateLoadingState(true, 2000);
  }

  filterProductsByCategory(categoryName: string) {
    return this.allProducts.filter((prod: any) => prod.category.name === categoryName);
  }
  

  updatePagedProducts(): void {
    const activeTab = this.tabs.find(tab => tab.value === this.ActiveTap);
  
    if (activeTab && activeTab.cards) {
      const start = this.first;
      const end = this.first + this.rows;
  
       this.productsToDisplay = this.filterProductsByPriceRange.length > 0 ? this.filterProductsByPriceRange : activeTab.cards;
  
      this.pagedProducts = this.productsToDisplay.slice(start, end);
      this.categoryName = activeTab.title;
    } else {
      this.pagedProducts = [];
    }
  }
  

  onPageChange(event: any) {
 
  this.dataDone = false;


  this.first = event.first;
  this.rows = event.rows;
  this.updatePagedProducts();


  setTimeout(() => {
    this.dataDone = true;
  }, 1000); 
  }
  

  onTabChange() {
    this.dataDone = false;
    this.first = 0;
    this.filterProductsByPriceRange = [];
    this.updatePagedProducts();

    setTimeout(() => {
      this.dataDone = true;
    }, 1000); 
  }
  

  getTotalRecords() {

    const activeTab = this.tabs.find(tab => tab.value === this.ActiveTap);
    return this.filterProductsByPriceRange.length > 0 ? this.filterProductsByPriceRange.length: activeTab?.cards?.length || 0;

  }
  

  filterProductsByRange(): void {

    this.dataDone = false;
    this.filterProductsByPriceRange = this.allProducts.filter(product =>
      product.price >= this.rangeValues[0] && product.price <= this.rangeValues[1]
    );
    
    this.updatePagedProducts();
    
    setTimeout(() => {
      this.dataDone = true;
    }, 1000); 
  }


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @HostListener('window:resize', [])
  onResize() {
    if (this.screenIsLarge()) {
      this.isSidebarOpen = true;
    }
  }


  screenIsLarge(): boolean {
    if (isPlatformBrowser(this.id)) {
      return window.innerWidth >= 768;
    }
    return false;
  }
}