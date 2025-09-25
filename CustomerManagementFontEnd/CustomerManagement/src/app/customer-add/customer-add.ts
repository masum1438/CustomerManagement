import { Component } from '@angular/core';
import { Customer } from '../customer.model';
import { CustomerService } from '../customer.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-add',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './customer-add.html',
  styleUrl: './customer-add.css'
})
export class CustomerAdd {
 customer:Customer = {  name: '', email: '', phone: '', address: '', balance: 0, status: 'Active'};

 constructor(private service:CustomerService,private router:Router)
 {}
 save(){
  this.service.add(this.customer).subscribe(()=>
  this.router.navigate(['customer-list']));
 }
 reset(){
    this.customer = { name: '', email: '', phone: '', address: '', balance: 0, status: 'Active' };

 }

}
