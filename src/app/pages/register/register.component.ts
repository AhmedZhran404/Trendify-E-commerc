import { CommonModule } from '@angular/common';
import {AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild} from '@angular/core';
import { Component, inject } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms"
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [CommonModule , ReactiveFormsModule , RouterLink , FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent  {
  // inject services
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastrService = inject(ToastrService);
 
 // properties
  isPasswordVisible: boolean = false;  
  isComfirmPasswordVisible: boolean = false;  
  isChecked:boolean = false;
  isLoading:boolean = false;

 
  @ViewChild('el')  Element!:ElementRef;


  // create register Form
  registerForm: FormGroup = new FormGroup({
    name: new FormControl(null , [Validators.required , Validators.minLength(3) , Validators.maxLength(20)]),
    email: new FormControl(null , [Validators.required , Validators.email]),
    password: new FormControl(null , [Validators.required , Validators.pattern(/^[A-Z]\w{7,}$/)]),
    rePassword: new FormControl(null , [Validators.required]),
    phone: new FormControl(null , [Validators.required , Validators.pattern(/^01[0125][0-9]{8}$/)]),
  } , {validators: [this.comfirmPassword]})
 

// ------------ Methods
 // Submit Form and send to Acount To Api 
  submitForm()
  {
    if(this.registerForm.valid){
      if(this.Element.nativeElement.checked) {
        this.isLoading = true;
        this.isChecked = false;
        this.authService.sendResgisterForm(this.registerForm.value).subscribe({
          next:(res)=>{
            console.log(res);
            if(res.message === "success") {
      
              this.isLoading =  false;

              setTimeout(()=>{

                this.router.navigate(['/login']);

              } , 1500);
              this.toastrService.success("You have successfully registered on the website.", "Registration Successful!");

            }
          } , 
          error:(err) => {
            this.isLoading = false;
          }
        })
      }else {
        this.isChecked = true
      }
      }else {
        this.registerForm.markAllAsTouched()
      }
  }
 

  comfirmPassword(group:AbstractControl) {

    const password = group.get('password')?.value;
    const repassword = group.get('rePassword')?.value;

    if(password == repassword) {
      return null
    }
    else {
      return {mismatch:true}
    }

  }

  togglePasswordVisibility(flage:boolean){
    if(flage === true) {
      this.isPasswordVisible = !this.isPasswordVisible;
    }else {
      this.isComfirmPasswordVisible  = !this.isComfirmPasswordVisible;
    }

  }


 


}