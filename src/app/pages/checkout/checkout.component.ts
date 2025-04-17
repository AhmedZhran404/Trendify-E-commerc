import { WishlistComponent } from './../wishlist/wishlist.component';
import { error } from 'node:console';
import { Data } from './../../core/interfaces/ICart/icart';
import { Component, inject, OnInit, Self } from '@angular/core';
import { CustomBreadcrumbComponent } from "../../shared/components/ui/custom-breadcrumb/custom-breadcrumb/custom-breadcrumb.component";
import { MenuItem } from 'primeng/api';
import { OrderSummaryComponent } from "../../shared/components/ui/orderSummary/order-summary/order-summary.component";
import { CheckoutService } from '../../core/services/checkout/checkout.service';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InfoAddress } from '../../core/interfaces/InfoAddress/info-address';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { WishListService } from '../../core/services/wishList/wish-list.service';
import { LoadingCardComponent } from "../../shared/components/ui/loadingCard/loading-card/loading-card.component";


@Component({
  selector: 'app-checkout',
  imports: [CustomBreadcrumbComponent, OrderSummaryComponent, Dialog, ButtonModule, InputTextModule, FormsModule, AutoCompleteModule, ReactiveFormsModule, LoadingCardComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {

  private readonly checkoutService = inject(CheckoutService);

  private readonly toastrService = inject(ToastrService);

  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly wishListService = inject(WishListService);

  breadcrumbItems: MenuItem[] = [];
  visible: boolean = false;
  cartId:string = "";
  cartPrice:number = this.cartService.CartPrice;
  items: any[] = [];
  value: any;
  setObjectToSendCheckOut:any;
  addInfoDone:boolean = false;


  InfoAdd:InfoAddress[] = [];
  editInfoFromApi:InfoAddress[] = [];
  editAddressId:string = '';

  valueOfMoney:string = 'Free';


  
  allCountries: string[] = [
    'Cairo',
    'Giza',
    'Alexandria',
    'Tanta',
    'Mansoura',
    'Faiyum',
    'Aswan',
    'Luxor',
    'Sohag',
    'Qena',
    'Minya',
    'Beni Suef',
    'Zagazig',
    'Damanhur',
    'Damietta',
    'Port Said',
    'Suez',
    'Arish',
    'Marsa Matruh',
    'New Valley'
 
  ];


  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.items = this.allCountries.filter(country =>
      country.toLowerCase().includes(query)
    );
  }


  ngOnInit(): void {
    this.wishListService.fetchWishListItems();
    this.breadcrumbItems = [
      { label: 'home', route: '/home' },
      { label: 'category' , route:'/products/category'},
      { label: 'cart' , route:'/products/cart'},
      { label: 'checkout'},
    ];

    // this.cartPrice =  this.cartService.CartPrice

    this.getUserAddress();

    this.getCartId();


  }

  getCartId(){
    this.activatedRoute.paramMap.subscribe({
      next:(res:any)=>{
       this.cartId = res.params.id;
      }
    })
  }

  addressInfo: FormGroup = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(3), 
      Validators.maxLength(50)
    ]),
    details: new FormControl(null, [
      Validators.maxLength(200) 
    ]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/) 
    ]),
    city: new FormControl(null, [
      Validators.required
    ])
  })



  formSelectAddress: FormGroup = new FormGroup({
    selectedOption: new FormControl(null, Validators.required)
  });

  formPaymentMethod: FormGroup = new FormGroup({
    paymentMethod: new FormControl('online', Validators.required)
  });





  showDialog() {
      this.visible = true;
  }



  addAddress():void 
  {
    
    if (this.editAddressId) {
        
        this.checkoutService.removeAddress(this.editAddressId).subscribe({
          next: () => {
          
            this.checkoutService.addAddress(this.addressInfo.value).subscribe({
              next: (res) => {
                console.log(res);
                  this.InfoAdd = res.data;
                  this.editAddressId = ''; 
                  this.addressInfo.reset();
                  this.visible = false;
              }

            });
          }
        });
  
      } else {
   
        this.checkoutService.addAddress(this.addressInfo.value).subscribe({
          next: (res) => {
            console.log(res);
          this.visible = false;
           this.InfoAdd = res.data;
           this.addressInfo.reset(); 
          }
        });
      }
  
    
  }

  getUserAddress():void 
  {
    this.addInfoDone = false;
    this.checkoutService.getLoggedUserAddress().subscribe({
      next: (res) => {
        this.addInfoDone = true;
        this.InfoAdd = res.data.map((address: InfoAddress) => ({
          ...address,
          isDeleting: false,
          isEditing: false
        }));
      },error:(err)=>{
        this.addInfoDone = true;
      }
    });
  }

  removeAddress(id:string):void {
    const address = this.InfoAdd.find(a => a._id === id);
    if (address) {
    address.isDeleting = true; 

    this.checkoutService.removeAddress(id).subscribe({
      next: () => {
        this.InfoAdd = this.InfoAdd.filter(item => item._id !== id);
      },
      error: () => {
        address.isDeleting = false; 
      }
    });
  }
    
  }

  editOfSpacificAddress(id:string):void {
    const address = this.InfoAdd.find(a => a._id === id);
    if (address) {
      address.isEditing = true;
  
      this.checkoutService.getSpacificAddress(id).subscribe({
        next: (res) => {
          address.isEditing = false;
          this.showDialog();
          this.addressInfo.patchValue(res.data);
          this.editAddressId = id;
         
        },
        error: () => {
          address.isEditing = false;
        }
      });

      
     
    }
    
  }



  orderCheckOut() {
      const valueOfFormGroup  = this.formSelectAddress.get('selectedOption')?.value
      if(valueOfFormGroup !== null){
            this.setObjectToSendCheckOut =  {
            details:  valueOfFormGroup.details,
            phone :  valueOfFormGroup.phone,
            city: valueOfFormGroup.city
          }
        if(this.formPaymentMethod.get('paymentMethod')?.value === "online") {
          this.checkoutService.checkOutSession(this.setObjectToSendCheckOut , this.cartId).subscribe({
            next:(res)=>{
              console.log(res);
              if(res.status == "success"){
                open(res.session.url , '_self');
              }
              this.cartService.cartNumber.set(res.numOfCartItems);
            },
            error:(err)=>{
              console.log(err);
            }
          })
          
        } 
        else if(this.formPaymentMethod.get('paymentMethod')?.value === "cash") {
          this.checkoutService.cashOrder(this.setObjectToSendCheckOut , this.cartId).subscribe({
            next:(res)=>{
              console.log(res);
              if( res.status == "success") {
                setTimeout(()=>{
                  this.router.navigate(['/allorders']);
                } , 300);
                this.cartService.cartNumber.set(res.numOfCartItems);
                this.toastrService.info("Successfully Payment" , "Trendify");
              }
            }
            , error:(err)=>{
              if(this.cartId == '') {
                this.toastrService.error("Faild Payment No Product In Cart" , "Trendify");
              }
            }
          })
        }
        else {
          this.toastrService.info("Trendify" , "Payment method is required. Select Online or Cach to continue.");
        }
  }
  else {
    this.toastrService.info("Trendify" , "Please select a shipping address before proceeding");
  }
  }



  cancelFunction():void {
    this.visible = false;
    this.addressInfo.reset();
  }




}
