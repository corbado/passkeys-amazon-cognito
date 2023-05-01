import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface CompanyCategory{
  id:number|string;
  name:string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyCategoryService {

  constructor(private http:HttpClient) {}

  getCompanyCategories(): Observable<CompanyCategory[]>{
    return this.http.get<CompanyCategory[]>(`${environment.apiUrl}companyCategories`)
  }

  getCompanyCategoriesById(id:number|string): Observable<CompanyCategory[]>{
    return this.http.get<CompanyCategory[]>(`${environment.apiUrl}companyCategories/${id}`)
  }

  updateCompanyCategoriesById(id:number|string,data:any): Observable<CompanyCategory>{
    return this.http.post<CompanyCategory>(`${environment.apiUrl}companyCategories/${id}`,data)
  }

  createCompanyCategories(data:any): Observable<CompanyCategory>{
    return this.http.put<CompanyCategory>(`${environment.apiUrl}companyCategories`,data)
  }

  deleteCompanyCategoriesById(id:number|string): Observable<CompanyCategory>{
    return this.http.delete<CompanyCategory>(`${environment.apiUrl}companyCategories/${id}`)
  }
}

