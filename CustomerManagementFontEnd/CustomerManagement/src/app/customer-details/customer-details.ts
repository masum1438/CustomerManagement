import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Customer } from '../customer.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-details',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './customer-details.html',
  styleUrl: './customer-details.css'
})
export class CustomerDetails implements OnInit{
customer!:Customer;
constructor(private service:CustomerService,private route:ActivatedRoute,private router: Router){}
 ngOnInit(){
  const id = Number(this.route.snapshot.paramMap.get('id'));
  this.service.getById(id).subscribe(data=>this.customer = data);
 }
 back(){
  this.router.navigate(['customer-list']);
 }
 printSingle(){
  window.print();
 }
}
