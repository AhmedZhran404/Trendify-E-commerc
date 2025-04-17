import { Component, OnInit } from '@angular/core';
import { CustomBreadcrumbComponent } from "../../shared/components/ui/custom-breadcrumb/custom-breadcrumb/custom-breadcrumb.component";
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-about-us',
  imports: [CustomBreadcrumbComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit {

  breadcrumbItems: MenuItem[] = [];


  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'home', route: '/home' },
      { label: 'About Us'},
    ];

  }


}
