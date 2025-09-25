import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { Router, RouterModule } from '@angular/router';
import { Customer } from '../customer.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-list',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerList implements OnInit {
customers: Customer[] = [];
query = '';
constructor(private service:CustomerService,private router:Router)
{}
ngOnInit(){
  this.load();
}
load(){
  this.service.getAll().subscribe(data => this.customers=data);
}
view(id:number | undefined){
  this.router.navigate(['customer-details',id]);

}
edit(id:number | undefined){
  this.router.navigate(['customer-update',id]);
}
 delete(id:number | undefined){
  if (!id) return;
  if(confirm('Are you sure?')){
    this.service.delete(id).subscribe(()=>this.load());
  }
 }
 printList() {
    this.router.navigate(['customer-print']);
  }
  printSingle(id: number | undefined) {
  if (!id) return;
  this.router.navigate(['customer-singleprint', id]);
}


  filtered() {
    if (!this.query) return this.customers;
    const q = this.query.toLowerCase();
    return this.customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q)
    );
  }
}
