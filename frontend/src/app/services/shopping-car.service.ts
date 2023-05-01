import { CompanyModel } from './../models/company.model';
import { InquirieModel } from '@corbado/models/inquirie.model';
import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCarService {
  private isOpen = new Subject<boolean>();
  private currentInquiry = new Subject<InquirieModel|null>();
  private currentCompanySeller = new Subject<CompanyModel>();

  public updateCurrentInquiry( inquiry:InquirieModel|null){
    this.currentInquiry.next(inquiry);
  }

  public getCurrentInquiry(): Observable<InquirieModel|null>{
    return this.currentInquiry.asObservable();
  }

  public updateCurrentCompanySeller(company:CompanyModel){
    this.currentCompanySeller.next(company)
  }

  public getCurrentCompanySeller():Observable<CompanyModel>{
    return this.currentCompanySeller.asObservable();
  }

  public getIsOpen():Observable<boolean>{
    return this.isOpen.asObservable();
  }
  
  public updateIsOpen(isOpen:boolean){
    this.isOpen.next(isOpen);
  }
}
