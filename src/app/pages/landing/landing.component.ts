
import { Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../layouts/navbar/navbar.component";
import { FooterComponent } from "../../layouts/footer/footer.component";
import { TabsModule } from 'primeng/tabs';
import { CommonModule } from '@angular/common';
import { CardComponent } from "../../shared/components/ui/reuseable/card/card.component";
import { ToastrService } from 'ngx-toastr';
import { CarouselComponent, CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-landing',
  imports: [RouterOutlet, NavbarComponent, TabsModule, CommonModule, CardComponent  , CarouselModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  encapsulation:ViewEncapsulation.None
})
export class LandingComponent implements OnInit {

  private readonly toastrService = inject(ToastrService);

  @ViewChild(CarouselComponent) owlElement!: CarouselComponent;

  tabs: { title: string; value: number; cards: { title: string; image: string }[] }[] = [];
  ActiveTap:number = 0;
    ngOnInit() {
      
      this.tabs = [
           {  
            title: 'All', value:0, cards:
             [

            { title: 'Full Outfit', image: './images/unsplash_Q-72wa9-7Dg.png' },
            { title: 'Skirt', image: './images/unsplash_BqoyzXdINdg.png' },
            { title: 'Bags', image: './images/unsplash_g-9b4W7N67U.png' },
            { title: 'Accessories', image: './images/unsplash_Dli2lIXQiJc.png' }

           ]},
           { title: 'Skirts', value: 1, cards: [
            { title: 'Skirt', image: './images/unsplash_BqoyzXdINdg.png' },
          ]},
          { title: 'Bags', value: 2, cards: [
            { title: 'Bag', image: './images/unsplash_g-9b4W7N67U.png' }
          ]},
          { title: 'Full Outfit', value: 3, cards: [
            { title: 'Full Outfit', image: './images/unsplash_Q-72wa9-7Dg.png' }
          ]},
        { title: 'Watchs', value: 4, cards: [
          { title: 'Watches', image: './images/unsplash_12V36G17IbQ.png' },
        ]}
      ];
    }


    showAlert() {

      this.toastrService.show(
        "Please log in to continue to this page.",
        "Login Required",{
          timeOut:2000
        }
      );

    }

  
    /* ========== Slider Customize ==============*/
    testimonials = [
      {
        text: 'Lorem ipsum dolor sit amet consectetur.<br/> Est vel risus hendrerit laoreet purus<br/> malesuada dignissim.',
        image: './images/image22.png',
        name: 'Berry Gunawan',
        rating: 3.5
      },
      {
        text: 'Lorem ipsum dolor sit amet consectetur.<br/> Est vel risus hendrerit laoreet purus<br/> malesuada dignissim.',
        image: './images/image22.png',
        name: 'John Doe',
        rating: 4
      },
      {
        text: 'Lorem ipsum dolor sit amet consectetur.<br/> Est vel risus hendrerit laoreet purus<br/> malesuada dignissim.',
        image: './images/image22.png',
        name: 'Jane Smith',
        rating: 4.5
      },
      {
        text: 'Lorem ipsum dolor sit amet consectetur.<br/> Est vel risus hendrerit laoreet purus<br/> malesuada dignissim.',
        image: './images/image22.png',
        name: 'Jane Smith',
        rating: 4.5
      },
    ];

    customOptions = {
      loop: true, 
      margin: 20, 
      nav: false, 
      dots: false, 
      autoplay: false, 
      autoplayTimeout: 3000, 
      responsive: {
        0: { 
          items: 1,
      
          dots: true   
        },
        768: { 
          items: 2,
          dots: true
        }, 
        1024: { 
          items: 3,
          dots: true
        }, 
        1285: { 
          items: 3, 
          dots: true,
        
        }
      },
      
      navText:['<i class="fa-solid fa-chevron-right"></i>' , '<i class="fa-solid fa-chevron-left"></i>']

    };



    prevSlide() {
      this.owlElement.prev();
    }
  
    nextSlide() {
      this.owlElement.next();
    }


    /* ========= Slider ===========*/




}
