import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { CustomBreadcrumbComponent } from "../../shared/components/ui/custom-breadcrumb/custom-breadcrumb/custom-breadcrumb.component";
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-blog',
  imports: [CustomBreadcrumbComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit{

  breadcrumbItems: MenuItem[] = [];

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'home', route: '/home' },
      { label: 'About Us'},
    ];
  }
  

}
