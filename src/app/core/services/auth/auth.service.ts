import { environmentRout } from './../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private httpClient:HttpClient) { }


  userToken:any;

  private readonly router = inject(Router);

  private readonly toastrService = inject(ToastrService);



  sendResgisterForm(data:object):Observable<any>
  {
    return this.httpClient.post(`${environmentRout.baseUrl}/api/v1/auth/signup` , data);
  }


  sendLoginForm(data:object):Observable<any>
  {
    return this.httpClient.post(`${environmentRout.baseUrl}/api/v1/auth/signin` , data);  
  }


  forgotPassword(data:object):Observable<any> {
    return this.httpClient.post(`${environmentRout.baseUrl}/api/v1/auth/forgotPasswords` , data);
  }

  virfiyResetCode(data:object):Observable<any> {
    return this.httpClient.post(`${environmentRout.baseUrl}/api/v1/auth/verifyResetCode` , data);
  }

  resetNewPassword(data:object):Observable<any> {
    return this.httpClient.put(`${environmentRout.baseUrl}/api/v1/auth/resetPassword` , data);
  }


  saveUserData():void {
    this.userToken = jwtDecode(localStorage.getItem("userToken")!);
    console.log(this.userToken.name);
    localStorage.setItem("InfoUser" , this.userToken.name);
  }


  logOut():void {

    // 1) remove token and name
    localStorage.removeItem("userToken");

    localStorage.removeItem("InfoUser");
    // 2) clear property
    this.userToken = null;
    // 3) navigate to landing
    setTimeout(()=>{
      this.router.navigate(['/landing']);
    } , 1000);

    this.toastrService.info('You have been successfully logged out.', 'Logout', {
      timeOut: 1000,
    });
  }


  // Change Password api
  changePassword(data:Object):Observable<any> {
    return this.httpClient.put(`${environmentRout.baseUrl}/api/v1/users/changeMyPassword` , data);
  }
  

}
