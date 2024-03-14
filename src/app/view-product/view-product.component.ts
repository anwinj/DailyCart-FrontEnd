import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {

  product:any={}

  constructor(private route:ActivatedRoute, private api:ApiService, private toastr:ToastrService){}

  ngOnInit(): void {
    this.route.params.subscribe((res:any)=>{
      console.log(res);
      const {id} = res
      this.getAProduct(id)
    })
  }

  getAProduct(id:any){
    this.api.viewAProductAPI(id).subscribe((res:any)=>{
      this.product = res
      console.log(this.product);
      
    })
  }

  addToWishlist(product:any){
    if(sessionStorage.getItem("token")){
      // proceed to wishlist
      this.api.addToWishlistAPI(product).subscribe({
        next:(res:any)=>{
          console.log(res);
          this.api.getWishlistCount()
          this.toastr.success(`'${res.title}' added to wishlist`)
        },
        error:(reason:any)=>{
          console.log(reason);
          this.toastr.warning(reason.error)
        } 
      })
    }
    else{
      this.toastr.warning("Please Login..")
    }
  }

  addToCart(product:any){
    if(sessionStorage.getItem("token")){
      // proceed to cart
      product.quantity = 1
      this.api.addToCartAPI(product).subscribe({
        next:(res:any)=>{
          console.log(res);
          this.api.getCartCount()
          this.toastr.success(res)
        },
        error:(reason:any)=>{
          console.log(reason);
          
          this.toastr.success(reason.error)
        }
      })
    }
    else{
      this.toastr.warning("Please Login...")
    }
  }

}
