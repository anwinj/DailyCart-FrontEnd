import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  searchTerm = new BehaviorSubject("")
  cartCount = new BehaviorSubject(0)
  wishlistCount = new BehaviorSubject(0)
  SERVER_URL = "https://dailycart-server-pych.onrender.com"

  constructor(private http:HttpClient) { 
    if(sessionStorage.getItem("token")){
      this.getWishlistCount()
      this.getCartCount()
    }
   }

  getAllProductsAPI(){
    return this.http.get(`${this.SERVER_URL}/all-products`)
  }

  registerAPI(user:any){
    return this.http.post(`${this.SERVER_URL}/register`,user)
  }

  loginAPI(user:any){
    return this.http.post(`${this.SERVER_URL}/login`,user)
  }

  viewAProductAPI(id:any){
    return this.http.get(`${this.SERVER_URL}/get-a-product/${id}`)
  }

  appendToTokenHeader(){
    const token=sessionStorage.getItem("token")
    let headers = new HttpHeaders()
    if(token){
      headers = headers.append("Authorization",`Bearer ${token}`)
    }
    return {headers}
  }

  addToWishlistAPI(product:any){
    return this.http.post(`${this.SERVER_URL}/add-to-wishlist`,product,this.appendToTokenHeader())
  }

  getWishlistAPI(){
    return this.http.get(`${this.SERVER_URL}/get-wishlist`,this.appendToTokenHeader())
  }

  // behaviour subject - wishlist
  getWishlistCount(){
    this.getWishlistAPI().subscribe((res:any)=>{
      this.wishlistCount.next(res.length)
    })
  }

  removeWishlistItemAPI(id:any){
    return this.http.delete(`${this.SERVER_URL}/wishlist-remove/${id}`,this.appendToTokenHeader())
  }

  addToCartAPI(product:any){
    return this.http.post(`${this.SERVER_URL}/add-to-cart`,product,this.appendToTokenHeader())
  }

  getCartAPI(){
    return this.http.get(`${this.SERVER_URL}/get-cart`,this.appendToTokenHeader())
  }

  // behaviour subject - cart
  getCartCount(){
    this.getCartAPI().subscribe((res:any)=>{
      this.cartCount.next(res.length)
    })
  }

  removeCartItemAPI(id:any){
    return this.http.delete(`${this.SERVER_URL}/remove-cart/${id}`,this.appendToTokenHeader())
  }

  incrementCartAPI(id:any){
    return this.http.get(`${this.SERVER_URL}/cart-increment/${id}`,this.appendToTokenHeader())
  }

  decrementCartAPI(id:any){
    return this.http.get(`${this.SERVER_URL}/cart-decrement/${id}`,this.appendToTokenHeader())
  }

  emptyCartAPI(){
    return this.http.delete(`${this.SERVER_URL}/empty-cart`,this.appendToTokenHeader())
  }

  isLoggedin(){
    return !!sessionStorage.getItem("token")
  }
}
