import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Customer } from '../customer.model';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer-singleprint',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './customer-singleprint.html',
  styleUrl: './customer-singleprint.css'
})
export class CustomerSingleprint implements OnInit{
customer!:Customer;
constructor(private service:CustomerService,private route:ActivatedRoute,private router: Router){}
 ngOnInit(){
  const id = Number(this.route.snapshot.paramMap.get('id'));
      this.service.getById(id).subscribe(c => { this.customer = c; setTimeout(()=>window.print(), 300); });
  
}
 back(){
  this.router.navigate(['customer-list']);
 }
 printSingle(){
  window.print();
 }
}
