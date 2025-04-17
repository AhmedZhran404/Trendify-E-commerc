import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { CustomBreadcrumbComponent } from "../../shared/components/ui/custom-breadcrumb/custom-breadcrumb/custom-breadcrumb.component";
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-contact-us',
  imports: [CustomBreadcrumbComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {


 
   breadcrumbItems: MenuItem[] = [];
 
   ngOnInit(): void {
     this.breadcrumbItems = [
       { label: 'home', route: '/home' },
       { label: 'About Us'},
     ];
   }
}
