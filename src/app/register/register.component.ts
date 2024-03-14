import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm = this.fb.group({
    username:['',[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]],
  })

  constructor(private fb:FormBuilder, private api:ApiService, private router:Router, private toastr:ToastrService){}


  register(){
    if(this.registerForm.valid){
      const username = this.registerForm.value.username
      const email = this.registerForm.value.email
      const password = this.registerForm.value.password
      const user = {username,email,password}
      this.api.registerAPI(user).subscribe({
        next:(res:any)=>{
          this.toastr.success(`${res.username} has successfully registered`)
          // console.log(res);
          this.registerForm.reset()
          this.router.navigateByUrl('/login')
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
