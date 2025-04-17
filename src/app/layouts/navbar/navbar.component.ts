import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WishListService } from './../../core/services/wishList/wish-list.service';
import { Component, computed, HostListener, inject, input, OnInit, ViewEncapsulation, signal, Signal, WritableSignal, viewChild, viewChildren, ElementRef, QueryList, ViewChildren, AfterViewInit, Renderer2, ViewChild, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../core/services/auth/auth.service';
import { ProductsService } from '../../core/services/products/products.service';
import { CartService } from '../../core/services/cart/cart.service';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, Validators } from '@angular/forms';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink , RouterLinkActive , Menu, ToastModule , Dialog, ButtonModule, InputTextModule , ReactiveFormsModule , NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  encapsulation:ViewEncapsulation.None
})
export class NavbarComponent implements OnInit , AfterViewInit{
  @ViewChildren('navLink', { read: ElementRef }) linkEl!: QueryList<ElementRef>;
  @ViewChild('menuContainer') menuContainer!: ElementRef;  
  isLogin = input<boolean>(true);
  isScrolled:WritableSignal<boolean> = signal(false);
  countCart:Signal<number> = computed(()=> this.cartService.cartNumber())
  wishListCount:Signal<number> = computed(()=> this.wishListService.whisListCount())
  itemsHome: MenuItem[] | undefined;
  itemsLanding: MenuItem[] | undefined;
  visible: boolean = false;
  isPasswordVisibleOld:boolean = false;
  isPasswordVisibleNew:boolean = false;
  isPasswordVisiblecomfirm:boolean = false;

  isMenuVisible = false;
  isScreenWide = window.innerWidth >= 768; // true
  disableTransition = false;

  private readonly authService = inject(AuthService);
  readonly productsService =  inject(ProductsService);
  private readonly cartService =  inject(CartService);
  private readonly wishListService =  inject(WishListService);
  private readonly router =  inject(Router);
  private readonly id =  inject(PLATFORM_ID);
  private destroy$ = new Subject<void>();

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenWidth();
  }
  ngOnInit() {
    
    if (!this.isScreenWide) {
      this.disableTransition = true;
      setTimeout(() => {
        this.disableTransition = false;
      }, 100);
    }

    this.itemsHome = [
          {
              label: `${localStorage.getItem("InfoUser")}`,
              items: [
                  {
                      label: `Orders`,
                      icon: 'fa-solid fa-box text-2nd-color',
                      command: ()=> this.goToAllOrders()

                  },
                  {
                      label: `change Password`,
                      icon: 'fa-solid fa-key text-2nd-color',
                      command:() => this.showDialog()
                  },
                  {
                      label: 'Logout',
                      icon: 'fa-solid fa-right-from-bracket', 
                      command: () => this.logOut()
                  }
              ]
          }
      ];


      this.itemsLanding = [
        {
            label: 'Auth',
            items: [
                {
                    label: 'Login',
                    icon:'fa-solid fa-right-from-bracket',
                    routerLink:'/login'
                  },
                  {
                    label: 'SignUp',
                    icon:'fa-solid fa-right-from-bracket',
                    routerLink:'register'
                }
            ]
        }
    ];

      if(localStorage.getItem("userToken")) {
        this.cartService.getLoggedUserCart().subscribe({
          next:(res)=>{
            this.cartService.cartNumber.set(res.numOfCartItems);
          }
        })
  
        this.wishListService.getLoggedUserWishList().subscribe({
          next:(res)=>{
            console.log(res.count);
            this.wishListService.whisListCount.set(res.count);
          }
        })
      }

      this.router.events
      .pipe(takeUntil(this.destroy$)) 
      .subscribe(() => {
        this.changeHomeColor(this.router.url);
      });

    }


    ngAfterViewInit(): void {
        this.changeHomeColor(this.router.url);
    }


    ngOnDestroy() {
      this.destroy$.next();    
      this.destroy$.complete();  
    }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }
 
  
  showDialog() {
    this.visible = true;
  }


    
    changeHomeColor(currentPath:string):void {
      if(!this.linkEl || this.linkEl.length === 0) return;
      
      this.linkEl.forEach((link)=>{
      console.log(link)
      if(currentPath === '/home') {
        link.nativeElement.style.color = "#fff";
      }else{
        link.nativeElement.style.color = "#9D9DAA";
      }
    })
  }

  ///======================= 

  togglePasswordVisibility(pass:string){

    if(pass === "currentPassword") 
    {
      this.isPasswordVisibleOld = !this.isPasswordVisibleOld;
    }
    else if(pass === "newPassword"){
      this.isPasswordVisibleNew = !this.isPasswordVisibleNew;
    } else  {
      this.isPasswordVisiblecomfirm = !this.isPasswordVisiblecomfirm;
    }
 
}


  logOut():void {
    this.authService.logOut();
  }

  goToAllOrders():void {
    this.router.navigate(['/allorders'])
  }

 
 
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.id)) {
      this.isScrolled.set(window.scrollY > 80);
      this.updateNavColor();
    }
  }


  
  
  updateNavColor(): void {
    this.linkEl.forEach((link) => {
      if (this.router.url === '/home') {
        link.nativeElement.style.color = this.isScrolled() ? "#9D9DAA" : "white";

      }
    });
  }
 



    navCondition()
    {

      return  localStorage.getItem('userToken') ? '/home' : '/landing';
    }


  changePassword: FormGroup = new FormGroup({
    currentPassword: new FormControl(null , [Validators.required]),
    password: new FormControl(null , [Validators.required , Validators.pattern(/^[A-Z]\w{7,}$/)]),
    rePassword: new FormControl(null , [Validators.required , Validators.pattern(/^[A-Z]\w{7,}$/)]),

  }, {validators: [this.comfirmPassword]})

  
  ResetPassword():void {
    this.authService.changePassword(this.changePassword.value).subscribe({
      next:(res)=>{
       
        localStorage.setItem("userToken" , res.token);
        this.visible = false;
        console.log(res);
      }
    })
  }


    comfirmPassword(group:AbstractControl) {
  
      const password = group.get('password')?.value;
      const repassword = group.get('rePassword')?.value;
  
      if(password === repassword) {
        return null
      }
      else {
        return {mismatch:true}
      }
  
    }
   

    checkScreenWidth() {
      const isNowWide = window.innerWidth >= 768;
      
      if (isNowWide !== this.isScreenWide) {
        this.isScreenWide = isNowWide;
        if (!isNowWide) {

          this.disableTransition = true;
          this.isMenuVisible = false;
          setTimeout(() => {
            this.disableTransition = false;
          }, 100);

        }
      }
}    
}
