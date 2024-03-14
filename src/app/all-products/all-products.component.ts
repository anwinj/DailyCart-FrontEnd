import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  allProducts:any = []
  searchKey:string = ""

  constructor(private api:ApiService, private toastr:ToastrService){}

  ngOnInit(): void {
    this.getAllProducts()
    this.api.searchTerm.subscribe((res:any)=>{
      this.searchKey = res
    })
  }

  getAllProducts(){
    this.api.getAllProductsAPI().subscribe({
      next:(res:any)=>{
        // console.log(res);
        this.allProducts = res
      },
      error:(reason:any)=>{
        console.log(reason);
      }
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
