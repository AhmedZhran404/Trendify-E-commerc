import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';

@Component({
  selector: 'app-products',
  imports: [RouterOutlet , RouterLink , RouterLinkActive],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

 

}
