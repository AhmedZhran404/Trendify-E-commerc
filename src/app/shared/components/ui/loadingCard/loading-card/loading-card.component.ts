import { Component } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-loading-card',
  imports: [Skeleton],
  templateUrl: './loading-card.component.html',
  styleUrl: './loading-card.component.scss'
})
export class LoadingCardComponent {

}
