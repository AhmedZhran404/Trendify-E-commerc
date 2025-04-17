import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-custom-breadcrumb',
  imports: [Breadcrumb, RouterModule],
  templateUrl: './custom-breadcrumb.component.html',
  styleUrl: './custom-breadcrumb.component.scss',
  encapsulation:ViewEncapsulation.None
})
export class CustomBreadcrumbComponent {

  @Input() items: MenuItem[] = [];
}
