import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  checkoutStatus:boolean = false

  checkoutForm = this.fb.group({
    username:['',[Validators.pattern('[a-zA-Z ]*'),Validators.required]],
    address:['',[Validators.pattern('[a-zA-Z0-9 ]*'),Validators.required]],
    pincode:['',[Validators.pattern('[0-9]*'),Validators.required]],
  })
  public payPalConfig ? : IPayPalConfig;
  totalAmount:string = ""

  constructor(private fb:FormBuilder, private toastr:ToastrService, private api:ApiService, private router:Router){}

  proceedToBuy(){
    if(this.checkoutForm.valid){
      this.checkoutStatus = true
      if(sessionStorage.getItem("cartTotalPrice")){
        this.totalAmount = sessionStorage.getItem("cartTotalPrice") || ""
        this.initConfig()
      }
    }
    else{
      this.toastr.info("invalid form")
    }
  }

  cancel(){
    this.checkoutForm.reset()
  }

  initConfig(): void {
    this.payPalConfig = {
        currency: 'USD',
        clientId: 'sb',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: this.totalAmount,
                    breakdown: {
                        item_total: {
                            currency_code: 'USD',
                            value: this.totalAmount
                        }
                    }
                },
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then((details:any) => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: (data) => {
            this.api.emptyCartAPI().subscribe((res:any)=>{
              this.api.getCartCount()
              this.toastr.success("Successfully completed the payment thank you for purchasing...")
              this.checkoutStatus = false
              this.checkoutForm.reset()
              this.router.navigateByUrl("/")
            })
        },
        onCancel: (data, actions) => {
            this.toastr.warning("Transcation has been cancelled!!!")
            this.checkoutStatus = false

        },
        onError: err => {
            this.toastr.warning("Transcation Failed...Please try after some time...!!!")
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
        }
    };
}


}
