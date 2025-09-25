import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Customer } from "./customer.model";
import { environment } from "../environment";
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: 'root'   
})
export class CustomerService{
    private apiUrl=`${environment.apiUrl}/customers`;

    constructor(private http:HttpClient){}

    getAll():Observable<Customer[]>{
        return this.http.get<Customer[]>(this.apiUrl);
    }
    getById(id:number):Observable<Customer>{
        return this.http.get<Customer>(`${this.apiUrl}/${id}`);
    }
    add(customer:Customer):Observable<Customer>{
        return this.http.post<Customer>(this.apiUrl,customer);
    }
    update(id:number,customer:Customer):Observable<void>{
        return this.http.put<void>(`${this.apiUrl}/${id}`,customer);
    }
    delete(id:number):Observable<void>{
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}