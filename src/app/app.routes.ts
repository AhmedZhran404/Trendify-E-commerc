import { Routes } from '@angular/router';
import { MainComponent } from './layouts/main/main.component';
import { authGuard } from './core/guards/auth.guard';
import { loggedGuard } from './core/guards/logged.guard';
import { LandingLayoutComponent } from './layouts/landing-layout/landing-layout.component';
import { AuthComponent } from './layouts/auth/auth.component';



export const routes: Routes = [
  {
      path: '', redirectTo: 'landing', pathMatch: 'full'
  },
  

  {
    path: '', 
    component:LandingLayoutComponent,
    canActivate:[loggedGuard],
    children: [
      {
        path: 'landing',
        loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
        title: 'Landing'
      }
    ]
  },


  {
    path: '',
    component: MainComponent, 
    title: 'Main',
    canActivate:[authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        title: 'Home'
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
        title: 'products',
        children: [
          {
            path: '', redirectTo: 'category', pathMatch: 'full'
          },
          {
            path: 'details/:id',
            loadComponent: () => import('./pages/details/details.component').then(m => m.DetailsComponent),
            title: 'Details',
          
          },
          {
            path: 'cart',
            loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
            title: 'Cart'
          },
          {
            path: 'checkout/:id',
            loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
            title: 'Checkout'
          },
          {
            path: 'category',
            loadComponent: () => import('./pages/category/category.component').then(m => m.CategoryComponent),
            title: 'Category'
          }
        ]
      },
      {
        path: 'aboutus',
        loadComponent: () => import('./pages/about-us/about-us.component').then(m => m.AboutUsComponent),
        title: 'About Us'
      },
      {
        path: 'wishlist',
        loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent),
        title: 'wish List'
      },
      {
        path: 'blog',
        loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent),
        title: 'Blog'
      },
      {
        path: 'contactus',
        loadComponent: () => import('./pages/contact-us/contact-us.component').then(m => m.ContactUsComponent),
        title: 'Contact Us',
        
        
      },
      {
        path: 'allorders',
        loadComponent: () => import('./pages/allorders/allorders/allorders.component').then(m => m.AllordersComponent),
        title: 'All Orders'
      }
    ]
  },

  
  {
    path: '',
    component:AuthComponent,
    title: 'Auth',
    canActivate:[loggedGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
        title: 'Login'
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
        title: 'Sign Up'
      },
      {
        path: "forgot",
        loadComponent: () => import('./pages/forgotpassword/forgotpassword.component').then(m => m.ForgotpasswordComponent),
        title:"forgot password"
      }
    ]
  },


  {
    path: '**',
    loadComponent: () => import('./pages/notfound/notfound.component').then(m => m.NotfoundComponent),
    title: 'Not Found'
  }
];
