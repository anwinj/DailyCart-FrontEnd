import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm = this.fb.group({
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]],
  })

  constructor(private fb:FormBuilder, private api:ApiService, private router:Router, private toastr:ToastrService){}

  login(){
    if(this.loginForm.valid){
      const email = this.loginForm.value.email
      const password = this.loginForm.value.password
      const user = {email,password}
      this.api.loginAPI(user).subscribe({
        next:(res:any)=>{
          // console.log(res);
          this.loginForm.reset()
          sessionStorage.setItem("UserDetails",JSON.stringify(res.existingUser))
          sessionStorage.setItem("token",res.token)
          this.toastr.success(`${res.existingUser.username} logged in successfully`)
          this.router.navigateByUrl('/')
          this.api.getWishlistCount()
          this.api.getCartCount()
        },
        error:(reason:any)=>{
          this.toastr.warning(reason.error)
          console.log(reason.error);
          
        }
      })
    }
    else{
      this.toastr.info("Invalid Form");
    }
  }

}
