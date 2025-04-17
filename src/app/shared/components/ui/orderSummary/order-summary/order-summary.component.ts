import { Component, Input, input, Output, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-order-summary',
  imports: [RouterLink],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {


   @Input() totalCartPrice:number = 0;


   InCart  = input<boolean>(true);

   @Input() id:string = "";

   valueOfMoneyMethod = input<string>('Free');




   @Output() buttonClicked = new EventEmitter<any>();


   emitEvent() {
     this.buttonClicked.emit('');
   }


}
