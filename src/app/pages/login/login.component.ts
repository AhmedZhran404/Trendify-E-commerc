import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [RouterLink , ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  // inject Services

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastrService = inject(ToastrService);

  // properties
  isPasswordVisible:boolean = false;

  isloading:boolean = false;



  // Create Login Form

  LoginForm: FormGroup = new FormGroup({
    email: new FormControl(null , [Validators.required , Validators.email]),
    password: new FormControl(null , [Validators.required , Validators.pattern(/^[A-Z]\w{7,}$/)]),

  })
 

  // Methods

  submitForm():void {

    if(this.LoginForm.valid){

      this.isloading = true;
   
 
        this.authService.sendLoginForm(this.LoginForm.value).subscribe({
          next:(res)=>{
            this.isloading = false;
            console.log(res);
            if(res.message === "success") {
              
              setTimeout(() => {
                localStorage.setItem("userToken" , res.token);

                this.authService.saveUserData();
                
                
                this.router.navigate(['/home']);
                
                }, 1000);
                
                this.toastrService.success( "Login Successful!" , "You have successfully logged in. Welcome back! 😊" , {
                  timeOut:1000
                }
                 );

            }
          }, error:(err) => {
          this.isloading = false;
          }
         
        })
      
      }
      
      else {
        this.LoginForm.markAllAsTouched()
      }


  }





  togglePasswordVisibility(){

      this.isPasswordVisible = !this.isPasswordVisible;
   
  }


}
