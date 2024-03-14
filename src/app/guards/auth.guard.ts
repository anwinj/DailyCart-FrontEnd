import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  
  const authStatus = inject(ApiService)
  const toastr = inject(ToastrService)
  const router = inject(Router)

  if(authStatus.isLoggedin()){
    return true;
  }
  else{
    toastr.warning("Operation denied..please Login..")
    router.navigateByUrl("/")
    return false
  }

};
