import { Data } from './../../../core/interfaces/ICart/icart';
import { Component, inject, OnInit } from '@angular/core';
import { CustomBreadcrumbComponent } from "../../../shared/components/ui/custom-breadcrumb/custom-breadcrumb/custom-breadcrumb.component";
import { OrdersService } from '../../../core/services/orders/orders.service';
import { jwtDecode } from 'jwt-decode';
import { Orders } from '../../../core/interfaces/orders/Iorders';
import { FormsModule } from '@angular/forms';
import { LoadingCardComponent } from "../../../shared/components/ui/loadingCard/loading-card/loading-card.component";
@Component({
  selector: 'app-allorders',
  imports: [CustomBreadcrumbComponent, FormsModule, LoadingCardComponent],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss'
})
export class AllordersComponent implements OnInit {

  private readonly ordersService = inject(OrdersService);

  breadcrumbItems:{}[] = [];

  isloading:boolean = true;

  allOrders:Orders[] = [] as Orders[];
  userToken:any;

  value: string = 'off';

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'home', route: '/home' },
      {label:'orders'}
    ];

    this.getAllOrders();
  }


  getAllOrders():void {
    this.userToken = jwtDecode(localStorage.getItem("userToken")!);
    this.ordersService.getSpacificOrder(this.userToken.id).subscribe({
      next:(res)=>{
        this.isloading = false;
        this.allOrders = res;
        console.log(this.allOrders);
      }
    })
  }


}
