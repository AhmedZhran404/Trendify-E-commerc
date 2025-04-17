import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const pLATFORM_ID = inject(PLATFORM_ID);
  const toastrService = inject(ToastrService);
  
  if(isPlatformBrowser(pLATFORM_ID)) {

    if(localStorage.getItem("userToken") !== null) {
      return true;
    }else {

      router.navigate(['/landing']);
      return false;
    }

  }else{ 
    return false
  }

};
