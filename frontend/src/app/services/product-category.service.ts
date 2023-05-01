import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ProductCategory{
  id:number|string;
  name:string;
  color:string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  constructor(private http:HttpClient) {}

  getProductCategories(): Observable<ProductCategory[]>{
    return this.http.get<ProductCategory[]>(`${environment.apiUrl}productsCategories`)
  }

  getProductCategoriesById(id:number|string): Observable<ProductCategory[]>{
    return this.http.get<ProductCategory[]>(`${environment.apiUrl}productsCategories/${id}`)
  }

  updateProductCategoriesById(id:number|string,data:any): Observable<ProductCategory>{
    return this.http.post<ProductCategory>(`${environment.apiUrl}productsCategories/${id}`,data)
  }

  createProductCategories(data:any): Observable<ProductCategory>{
    return this.http.put<ProductCategory>(`${environment.apiUrl}productsCategories`,data)
  }

  deleteProductCategoriesById(id:number|string): Observable<ProductCategory>{
    return this.http.delete<ProductCategory>(`${environment.apiUrl}productsCategories/${id}`)
  }
}
