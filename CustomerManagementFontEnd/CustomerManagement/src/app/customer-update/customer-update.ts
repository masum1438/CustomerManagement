import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Customer } from '../customer.model';
import { CustomerService } from '../customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-update',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './customer-update.html',
  styleUrl: './customer-update.css'
})
export class CustomerUpdate implements OnInit {
  customer!: Customer;

    constructor(private service: CustomerService, private route: ActivatedRoute, private router: Router) {}
 ngOnInit(){
  const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getById(id).subscribe(data => this.customer = data);
 }
 update(){
  if (!this.customer.id) return;
  this.service.update(this.customer.id,this.customer).subscribe(()=>
  this.router.navigate(['customer-list']));
 }
 cancel(){
  this.router.navigate(['customer-list']);
 }
}
