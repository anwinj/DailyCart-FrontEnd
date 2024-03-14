import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(allProducts:any [], searchkey:string): any [] {
    const result:any = []
    if(!allProducts||searchkey==""){
      return allProducts
    }
    allProducts.forEach((item:any)=>{
      if(item["title"].trim().toLowerCase().includes(searchkey.toLowerCase().trim())){
        result.push(item)
      }
    })
  return result
  }

}
