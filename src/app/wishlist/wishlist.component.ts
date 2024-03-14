import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  allProducts:any = []

  constructor(private api:ApiService, private toastr:ToastrService){}

  ngOnInit(): void {
    this.getWishlist()
  }

  getWishlist(){
    this.api.getWishlistAPI().subscribe((res:any)=>{
      this.allProducts = res
      console.log(this.allProducts);
      this.api.getWishlistCount()
    })
  }

  removeItem(id:any){
    this.api.removeWishlistItemAPI(id).subscribe((res:any)=>{
      this.getWishlist()
    })
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
          this.removeItem(product._id)
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
