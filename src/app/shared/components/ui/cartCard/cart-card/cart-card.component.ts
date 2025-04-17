import { Component, inject, input, output, Output, signal, WritableSignal } from '@angular/core';
import { CartService } from '../../../../../core/services/cart/cart.service';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-cart-card',
  imports: [],
  templateUrl: './cart-card.component.html',
  styleUrl: './cart-card.component.scss'
})
export class CartCardComponent {

  private readonly cartService = inject(CartService);



  cartProduct:WritableSignal<any> = signal(''); 

  title = input<string>('');
  image = input<string>('');
  id    = input<string>('');
  count = input<number>(0);
  price = input<number>(0);
  loadingOfIconsTruch:WritableSignal<boolean> = signal(false);
  loadingOfIconsCountplus:WritableSignal<boolean> = signal(false);
  loadingOfIconsCountminus:WritableSignal<boolean> = signal(false);



  itemRemoved = output<string>();
  countUpdated = output<{ id: string; count: number }>();


  removeItem(id:string):void {
    this.loadingOfIconsTruch.set(true);
    this.cartService.removeSpicificCartItem(id).subscribe({
      next: (res) => {

        this.cartService.cartNumber.set(res.numOfCartItems);
        this.cartProduct = res;
        this.loadingOfIconsTruch.set(false);
        this.itemRemoved.emit(id);
        
      },
      error: () => {
        this.loadingOfIconsTruch.set(false);
      }
    });
  }

  
  updataCountOfProduct(id:string , count:number , flage:string):void {
    if (count < 1) return;
    if(flage === 'plus'){
      this.loadingOfIconsCountplus.set(true);
    }else{
      this.loadingOfIconsCountminus.set(true);
    }
    this.cartService.updataCartProductQuntity(id, count).subscribe({
      
      next: (res) => {
        this.cartProduct = res;
        if(flage === 'plus'){
          this.loadingOfIconsCountplus.set(false);
        }else{
          this.loadingOfIconsCountminus.set(false);
        }
        this.countUpdated.emit({ id, count }); // Emit signal output
      },
      error: (err) => {
        if(flage === 'plus'){
          this.loadingOfIconsCountplus.set(false);
        }else{
          this.loadingOfIconsCountminus.set(false);
        }
        console.log(err);
      }
    });
  }


}
